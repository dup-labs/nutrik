-- Tokens de push dos dispositivos (app nativo iOS/Android).
-- O token é único por instalação: se outra conta logar no mesmo aparelho, a
-- linha muda de dono. Por isso o upsert roda via service role na server action
-- registerDevice (que valida a sessão antes); o usuário lê/apaga os seus.

create table if not exists nutrk.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  platform text not null check (platform in ('ios', 'android')),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists device_tokens_user_id on nutrk.device_tokens (user_id);

alter table nutrk.device_tokens enable row level security;

create policy "user reads own device tokens" on nutrk.device_tokens
  for select using (user_id = auth.uid());

create policy "user inserts own device tokens" on nutrk.device_tokens
  for insert with check (user_id = auth.uid());

create policy "user updates own device tokens" on nutrk.device_tokens
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "user deletes own device tokens" on nutrk.device_tokens
  for delete using (user_id = auth.uid());

grant select, insert, update, delete on nutrk.device_tokens to authenticated;
grant all on nutrk.device_tokens to service_role;
