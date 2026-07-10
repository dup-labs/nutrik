-- Sistema social "turma" (estilo GymRats): grupos com código, ranking por
-- pontos de atividades macro do dia e chat em grupo.
-- Privacidade: amigos só leem a tabela agregada daily_scores — nunca logs crus.

-- ── username no perfil (busca/convite + exibição no ranking) ─────────────
alter table nutrk.profiles add column if not exists username text;
alter table nutrk.profiles drop constraint if exists profiles_username_format;
alter table nutrk.profiles add constraint profiles_username_format
  check (username is null or username ~ '^[a-z0-9_.]{3,20}$');
create unique index if not exists profiles_username_key on nutrk.profiles (username);

-- ── tabelas ──────────────────────────────────────────────────────────────
create table if not exists nutrk.friend_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  owner_id uuid not null references nutrk.profiles(id) on delete cascade,
  join_policy text not null default 'open' check (join_policy in ('open', 'approval')),
  created_at timestamptz not null default now()
);

create table if not exists nutrk.friend_group_members (
  group_id uuid not null references nutrk.friend_groups(id) on delete cascade,
  patient_id uuid not null references nutrk.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, patient_id)
);

-- kind='invite': membro convidou alguém (invitee aceita)
-- kind='request': alguém pediu pra entrar em turma com join_policy='approval' (owner aprova)
create table if not exists nutrk.group_invites (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references nutrk.friend_groups(id) on delete cascade,
  kind text not null default 'invite' check (kind in ('invite', 'request')),
  inviter_id uuid references nutrk.profiles(id) on delete cascade,
  invitee_id uuid not null references nutrk.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now()
);
create unique index if not exists group_invites_pending_unique
  on nutrk.group_invites (group_id, invitee_id) where status = 'pending';

create table if not exists nutrk.group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references nutrk.friend_groups(id) on delete cascade,
  sender_id uuid not null references nutrk.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists group_messages_group_created
  on nutrk.group_messages (group_id, created_at desc);

-- agregado diário: 1 ponto por pilar batido (máx. 5/dia) — é SÓ isso que amigos veem
create table if not exists nutrk.daily_scores (
  patient_id uuid not null references nutrk.profiles(id) on delete cascade,
  date date not null,
  dieta boolean not null default false,
  treino boolean not null default false,
  agua boolean not null default false,
  meditacao boolean not null default false,
  sono boolean not null default false,
  total smallint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (patient_id, date)
);

-- ── notifications: novo type 'turma' + deep-link pro grupo ───────────────
do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'nutrk.notifications'::regclass and contype = 'c'
      and pg_get_constraintdef(oid) like '%type = ANY%'
  loop
    execute format('alter table nutrk.notifications drop constraint %I', c.conname);
  end loop;
end $$;
alter table nutrk.notifications add constraint notifications_type_check
  check (type = any (array['protocolo', 'mensagem', 'resultado', 'consulta', 'turma']));
alter table nutrk.notifications add column if not exists group_id uuid
  references nutrk.friend_groups(id) on delete cascade;

-- ── helpers (security definer evita recursão de RLS em members) ─────────
create or replace function nutrk.is_group_member(p_group uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from nutrk.friend_group_members
    where group_id = p_group and patient_id = auth.uid()
  );
$$;

create or replace function nutrk.is_group_owner(p_group uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from nutrk.friend_groups
    where id = p_group and owner_id = auth.uid()
  );
$$;

create or replace function nutrk.shares_group_with(p_other uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from nutrk.friend_group_members a
    join nutrk.friend_group_members b on b.group_id = a.group_id
    where a.patient_id = auth.uid() and b.patient_id = p_other
  );
$$;

-- ── RLS ──────────────────────────────────────────────────────────────────
alter table nutrk.friend_groups enable row level security;
alter table nutrk.friend_group_members enable row level security;
alter table nutrk.group_invites enable row level security;
alter table nutrk.group_messages enable row level security;
alter table nutrk.daily_scores enable row level security;

create policy "member reads group" on nutrk.friend_groups
  for select using (nutrk.is_group_member(id) or owner_id = auth.uid());
create policy "owner creates group" on nutrk.friend_groups
  for insert with check (owner_id = auth.uid());
create policy "owner updates group" on nutrk.friend_groups
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owner deletes group" on nutrk.friend_groups
  for delete using (owner_id = auth.uid());

-- própria linha sempre visível (is_group_member é STABLE e não vê a linha
-- recém-inserida no mesmo statement — RETURNING falharia no self-insert)
create policy "member reads members" on nutrk.friend_group_members
  for select using (patient_id = auth.uid() or nutrk.is_group_member(group_id));
create policy "owner self-joins" on nutrk.friend_group_members
  for insert with check (patient_id = auth.uid() and nutrk.is_group_owner(group_id));
create policy "member leaves or owner removes" on nutrk.friend_group_members
  for delete using (patient_id = auth.uid() or nutrk.is_group_owner(group_id));

create policy "involved reads invites" on nutrk.group_invites
  for select using (
    inviter_id = auth.uid() or invitee_id = auth.uid() or nutrk.is_group_owner(group_id)
  );
-- inserts/updates de convites acontecem só pelas RPCs security definer

create policy "member reads messages" on nutrk.group_messages
  for select using (nutrk.is_group_member(group_id));
-- envio só pela RPC send_group_message (que também notifica os membros)

create policy "own scores" on nutrk.daily_scores
  for all using (patient_id = auth.uid()) with check (patient_id = auth.uid());
create policy "friends read scores" on nutrk.daily_scores
  for select using (nutrk.shares_group_with(patient_id));

-- perfis dos colegas de turma: só colunas públicas, via view (owner bypassa
-- RLS de profiles; a própria view filtra as linhas)
create or replace view nutrk.friend_profiles as
  select id, name, username, avatar_url
  from nutrk.profiles
  where id = auth.uid() or nutrk.shares_group_with(id);

-- ── RPCs ─────────────────────────────────────────────────────────────────

create or replace function nutrk.join_group_with_code(p_code text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  g record;
  req_id uuid;
  requester text;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  select id, name, join_policy, owner_id into g
    from nutrk.friend_groups where code = upper(trim(p_code));
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  if exists (select 1 from nutrk.friend_group_members where group_id = g.id and patient_id = uid) then
    return jsonb_build_object('ok', true, 'status', 'member', 'group_id', g.id, 'name', g.name);
  end if;
  if g.join_policy = 'open' then
    insert into nutrk.friend_group_members (group_id, patient_id)
      values (g.id, uid) on conflict do nothing;
    return jsonb_build_object('ok', true, 'status', 'joined', 'group_id', g.id, 'name', g.name);
  end if;
  -- approval: vira pedido pendente + notifica o owner
  insert into nutrk.group_invites (group_id, kind, invitee_id)
    values (g.id, 'request', uid)
    on conflict (group_id, invitee_id) where status = 'pending' do nothing
    returning id into req_id;
  if req_id is not null then
    select coalesce(username, split_part(name, ' ', 1)) into requester
      from nutrk.profiles where id = uid;
    insert into nutrk.notifications (patient_id, type, title, body, group_id)
      values (g.owner_id, 'turma', 'pedido pra entrar',
              requester || ' quer entrar na turma "' || g.name || '".', g.id);
  end if;
  return jsonb_build_object('ok', true, 'status', 'requested', 'group_id', g.id, 'name', g.name);
end;
$$;

create or replace function nutrk.invite_to_group(p_group uuid, p_invitee uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  g record;
  inviter text;
  inv_id uuid;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if not exists (select 1 from nutrk.friend_group_members where group_id = p_group and patient_id = uid) then
    raise exception 'not a member';
  end if;
  select id, name into g from nutrk.friend_groups where id = p_group;
  if exists (select 1 from nutrk.friend_group_members where group_id = p_group and patient_id = p_invitee) then
    return jsonb_build_object('ok', false, 'error', 'already_member');
  end if;
  insert into nutrk.group_invites (group_id, kind, inviter_id, invitee_id)
    values (p_group, 'invite', uid, p_invitee)
    on conflict (group_id, invitee_id) where status = 'pending' do nothing
    returning id into inv_id;
  if inv_id is null then
    return jsonb_build_object('ok', true, 'status', 'already_invited');
  end if;
  select coalesce(username, split_part(name, ' ', 1)) into inviter
    from nutrk.profiles where id = uid;
  insert into nutrk.notifications (patient_id, type, title, body, group_id)
    values (p_invitee, 'turma', 'convite de turma',
            inviter || ' te chamou pra turma "' || g.name || '".', p_group);
  return jsonb_build_object('ok', true, 'status', 'invited');
end;
$$;

create or replace function nutrk.respond_group_invite(p_invite uuid, p_accept boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  inv record;
  g record;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  select * into inv from nutrk.group_invites where id = p_invite and status = 'pending';
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  select id, name, owner_id into g from nutrk.friend_groups where id = inv.group_id;
  if inv.kind = 'invite' and inv.invitee_id <> uid then raise exception 'not allowed'; end if;
  if inv.kind = 'request' and g.owner_id <> uid then raise exception 'not allowed'; end if;

  update nutrk.group_invites
    set status = case when p_accept then 'accepted' else 'declined' end
    where id = p_invite;

  if p_accept then
    insert into nutrk.friend_group_members (group_id, patient_id)
      values (inv.group_id, inv.invitee_id) on conflict do nothing;
    if inv.kind = 'request' then
      insert into nutrk.notifications (patient_id, type, title, body, group_id)
        values (inv.invitee_id, 'turma', 'você entrou na turma',
                '"' || g.name || '" aprovou sua entrada. bora pontuar.', g.id);
    end if;
  end if;
  return jsonb_build_object('ok', true, 'accepted', p_accept, 'group_id', inv.group_id, 'name', g.name);
end;
$$;

-- envia mensagem + notificação coalescida (1 não-lida de chat por turma/membro)
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
    select patient_id from nutrk.friend_group_members
    where group_id = p_group and patient_id <> uid
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

-- convites pendentes pra mim (nome da turma/inviter mesmo sem ser membro ainda)
create or replace function nutrk.my_pending_invites()
returns table (id uuid, group_id uuid, group_name text, inviter_name text, created_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select gi.id, gi.group_id, fg.name,
         coalesce(p.username, split_part(p.name, ' ', 1)), gi.created_at
  from nutrk.group_invites gi
  join nutrk.friend_groups fg on fg.id = gi.group_id
  left join nutrk.profiles p on p.id = gi.inviter_id
  where gi.invitee_id = auth.uid() and gi.status = 'pending' and gi.kind = 'invite';
$$;

-- solicitações pendentes da turma (só o owner enxerga)
create or replace function nutrk.group_pending_requests(p_group uuid)
returns table (id uuid, requester_id uuid, requester_name text, requester_username text, created_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select gi.id, gi.invitee_id, p.name, p.username, gi.created_at
  from nutrk.group_invites gi
  join nutrk.profiles p on p.id = gi.invitee_id
  where gi.group_id = p_group and gi.status = 'pending' and gi.kind = 'request'
    and nutrk.is_group_owner(p_group);
$$;

create or replace function nutrk.search_profiles(p_query text)
returns table (id uuid, name text, username text, avatar_url text)
language sql stable security definer set search_path = '' as $$
  select p.id, p.name, p.username, p.avatar_url
  from nutrk.profiles p
  where auth.uid() is not null
    and p.id <> auth.uid()
    and length(trim(p_query)) >= 3
    and (
      p.username = lower(trim(p_query))
      or p.name ilike '%' || trim(p_query) || '%'
    )
  order by (p.username = lower(trim(p_query))) desc nulls last, p.name
  limit 8;
$$;

-- ── grants ───────────────────────────────────────────────────────────────
grant select, insert, update, delete
  on nutrk.friend_groups, nutrk.friend_group_members, nutrk.group_invites,
     nutrk.group_messages, nutrk.daily_scores
  to authenticated;
grant select on nutrk.friend_profiles to authenticated;

revoke all on function nutrk.join_group_with_code(text) from public, anon;
revoke all on function nutrk.invite_to_group(uuid, uuid) from public, anon;
revoke all on function nutrk.respond_group_invite(uuid, boolean) from public, anon;
revoke all on function nutrk.send_group_message(uuid, text) from public, anon;
revoke all on function nutrk.search_profiles(text) from public, anon;
revoke all on function nutrk.my_pending_invites() from public, anon;
revoke all on function nutrk.group_pending_requests(uuid) from public, anon;
grant execute on function
  nutrk.join_group_with_code(text), nutrk.invite_to_group(uuid, uuid),
  nutrk.respond_group_invite(uuid, boolean), nutrk.send_group_message(uuid, text),
  nutrk.search_profiles(text), nutrk.my_pending_invites(),
  nutrk.group_pending_requests(uuid), nutrk.is_group_member(uuid),
  nutrk.is_group_owner(uuid), nutrk.shares_group_with(uuid)
  to authenticated;
