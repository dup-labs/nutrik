-- Billing de profissionais: trial de 14 dias + assinatura (mensal/anual) via Asaas.
-- O pro lê o próprio status; toda escrita acontece via service role
-- (server actions de billing, webhook do Asaas e cron de reconciliação).

-- ── professionals: trial + isenção manual ────────────────────────────────
-- billing_exempt: flag que o admin liga no dashboard pra liberar de graça.
alter table nutrk.professionals
  add column if not exists billing_exempt boolean not null default false;
alter table nutrk.professionals
  add column if not exists trial_ends_at timestamptz;
-- contas existentes ganham o trial completo a partir do deploy
update nutrk.professionals
  set trial_ends_at = now() + interval '14 days'
  where trial_ends_at is null;
alter table nutrk.professionals
  alter column trial_ends_at set default (now() + interval '14 days');
alter table nutrk.professionals
  alter column trial_ends_at set not null;

-- ── assinatura (1:1 com professionals) ───────────────────────────────────
create table if not exists nutrk.professional_subscriptions (
  professional_id uuid primary key
    references nutrk.professionals(id) on delete cascade,
  asaas_customer_id text,
  asaas_subscription_id text,
  asaas_last_payment_id text,
  plan text not null check (plan in ('monthly', 'yearly')),
  status text not null default 'pending'
    check (status in ('pending', 'active', 'past_due', 'canceled')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- webhook localiza a linha pelo id da assinatura no Asaas
create index if not exists professional_subscriptions_asaas_sub
  on nutrk.professional_subscriptions (asaas_subscription_id);

-- ── RLS: pro lê a própria linha; nenhuma escrita pra authenticated ───────
alter table nutrk.professional_subscriptions enable row level security;

create policy "pro reads own subscription" on nutrk.professional_subscriptions
  for select using (
    professional_id in (
      select id from nutrk.professionals where user_id = auth.uid()
    )
  );
