-- Moderação de conteúdo gerado por usuário (Apple 1.2 / Google UGC):
-- denúncia, bloqueio e ocultação. NÃO aplicado — rodar na integração.
-- Premissas: nutrk.professionals(id, user_id); usuários referenciados por
-- auth.users(id) — profissional NÃO tem linha em nutrk.profiles;
-- nutrk.messages(patient_id, professional_id, sender, ...) com RLS já ligado
-- (as policies abaixo são RESTRICTIVE: somam por AND com as existentes).

-- ── denúncias ───────────────────────────────────────────────────────────
create table if not exists nutrk.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  target_user_id uuid not null references auth.users(id) on delete cascade,
  context text not null check (context in ('turma_mensagem', 'chat_mensagem', 'turma_membro')),
  group_id uuid references nutrk.friend_groups(id) on delete set null,
  group_message_id uuid references nutrk.group_messages(id) on delete set null,
  -- nutrk.messages.id como text: não depende do tipo da coluna (uuid/bigint)
  message_id text,
  -- cópia do texto na hora da denúncia: a prova sobrevive se a mensagem for apagada
  message_excerpt text,
  reason text not null check (reason in ('assedio', 'ofensivo', 'spam', 'outro')),
  details text check (details is null or length(details) <= 1000),
  status text not null default 'open' check (status in ('open', 'reviewing', 'actioned', 'dismissed')),
  resolution_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  check (reporter_id <> target_user_id)
);
create index if not exists reports_status_created on nutrk.reports (status, created_at);
create index if not exists reports_reporter on nutrk.reports (reporter_id, created_at);
create index if not exists reports_target on nutrk.reports (target_user_id);
create index if not exists reports_group_message on nutrk.reports (reporter_id, group_message_id)
  where group_message_id is not null;
create index if not exists reports_message on nutrk.reports (reporter_id, message_id)
  where message_id is not null;

alter table nutrk.reports enable row level security;
create policy "reporter creates report" on nutrk.reports
  for insert with check (reporter_id = auth.uid() and status = 'open');
create policy "reporter reads own reports" on nutrk.reports
  for select using (reporter_id = auth.uid());
-- sem update/delete pelo usuário: triagem é feita pelo service role / dashboard

-- ── bloqueios ───────────────────────────────────────────────────────────
create table if not exists nutrk.user_blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
create index if not exists user_blocks_blocked on nutrk.user_blocks (blocked_id);

alter table nutrk.user_blocks enable row level security;
create policy "owner manages blocks" on nutrk.user_blocks
  for all using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

-- ── helpers (security definer: user_blocks/reports só o dono lê) ────────
-- eu bloqueei esse usuário?
create or replace function nutrk.i_blocked(p_other uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from nutrk.user_blocks
    where blocker_id = auth.uid() and blocked_id = p_other
  );
$$;

-- existe bloqueio em qualquer direção entre dois usuários?
create or replace function nutrk.blocked_between(p_a uuid, p_b uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from nutrk.user_blocks
    where (blocker_id = p_a and blocked_id = p_b)
       or (blocker_id = p_b and blocked_id = p_a)
  );
$$;

-- user_id (auth) do profissional de uma conversa
create or replace function nutrk.pro_user_id(p_pro uuid)
returns uuid language sql stable security definer set search_path = '' as $$
  select user_id from nutrk.professionals where id = p_pro;
$$;

-- eu denunciei essa mensagem? (some da minha tela na hora)
create or replace function nutrk.i_reported_group_message(p_msg uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from nutrk.reports
    where reporter_id = auth.uid() and group_message_id = p_msg
  );
$$;

create or replace function nutrk.i_reported_message(p_msg text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from nutrk.reports
    where reporter_id = auth.uid() and message_id = p_msg
  );
$$;

grant execute on function
  nutrk.i_blocked(uuid),
  nutrk.blocked_between(uuid, uuid),
  nutrk.pro_user_id(uuid),
  nutrk.i_reported_group_message(uuid),
  nutrk.i_reported_message(text)
to authenticated;

-- ── mensagens de turma: quem bloqueou não vê; quem denunciou não vê ─────
create policy "hide blocked and reported group messages" on nutrk.group_messages
  as restrictive for select using (
    not nutrk.i_blocked(sender_id)
    and not nutrk.i_reported_group_message(id)
  );

-- ── chat paciente<->profissional ─────────────────────────────────────────
-- leitura: quem bloqueou a outra ponta não vê a conversa; denunciada some
create policy "hide blocked and reported chat messages" on nutrk.messages
  as restrictive for select using (
    not nutrk.i_blocked(
      case when auth.uid() = patient_id then nutrk.pro_user_id(professional_id) else patient_id end
    )
    and not nutrk.i_reported_message(id::text)
  );
-- envio: bloqueio em qualquer direção impede a mensagem
create policy "no chat insert between blocked users" on nutrk.messages
  as restrictive for insert with check (
    not nutrk.blocked_between(patient_id, nutrk.pro_user_id(professional_id))
  );

-- ── send_group_message: não notifica quem bloqueou o remetente ──────────
-- (mesma função da 20260710_02, com o filtro de bloqueio no loop)
create or replace function nutrk.send_group_message(p_group uuid, p_body text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  msg nutrk.group_messages;
  sender text;
  preview text;
  m record;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if not exists (select 1 from nutrk.friend_group_members where group_id = p_group and patient_id = uid) then
    raise exception 'not a member';
  end if;
  if length(trim(p_body)) = 0 then raise exception 'empty body'; end if;

  insert into nutrk.group_messages (group_id, sender_id, body)
    values (p_group, uid, trim(p_body)) returning * into msg;

  select coalesce(username, split_part(name, ' ', 1)) into sender
    from nutrk.profiles where id = uid;
  preview := sender || ': ' || left(trim(p_body), 90);

  for m in
    select fgm.patient_id from nutrk.friend_group_members fgm
    where fgm.group_id = p_group and fgm.patient_id <> uid
      and not exists (
        select 1 from nutrk.user_blocks b
        where b.blocker_id = fgm.patient_id and b.blocked_id = uid
      )
  loop
    update nutrk.notifications
      set body = preview, created_at = now()
      where patient_id = m.patient_id and group_id = p_group and type = 'turma'
        and title = 'mensagens na turma' and read_at is null;
    if not found then
      insert into nutrk.notifications (patient_id, type, title, body, group_id)
        values (m.patient_id, 'turma', 'mensagens na turma', preview, p_group);
    end if;
  end loop;

  return to_jsonb(msg);
end;
$$;
