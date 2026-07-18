// Regra pura de acesso do profissional ao painel (sem I/O — testável).
// Ordem: isenção manual > assinatura > trial. Na dúvida (dados faltando,
// migration parcial), libera — gate de billing nunca pode derrubar o app.

import { BILLING } from "@/lib/billing/config";
import type { ProfessionalSubscription } from "@/lib/types";

export type EntitlementState =
  | "exempt" // billing_exempt ligado pelo admin
  | "active" // assinatura em dia
  | "trial" // dentro do período de teste
  | "past_due" // pagamento vencido, dentro da carência
  | "canceled" // cancelada mas período pago ainda corre
  | "blocked"; // sem acesso — cai na página de assinatura

export interface Entitlement {
  state: EntitlementState;
  ok: boolean;
  trialDaysLeft: number;
  /** fim do período pago (ISO) quando houver assinatura */
  periodEnd: string | null;
}

const DAY_MS = 86400000;

/** fim do período coberto por um pagamento com vencimento `dueDateISO` (YYYY-MM-DD) */
export function periodEndFor(dueDateISO: string, plan: "monthly" | "yearly"): string {
  const [y, m, d] = dueDateISO.split("-").map(Number);
  const months = plan === "monthly" ? 1 : 12;
  return new Date(Date.UTC(y, m - 1 + months, d)).toISOString();
}

export function resolveEntitlement(input: {
  billingExempt: boolean | null | undefined;
  trialEndsAt: string | null | undefined;
  subscription: Pick<
    ProfessionalSubscription,
    "status" | "current_period_end"
  > | null;
  now?: Date;
}): Entitlement {
  const now = input.now ?? new Date();
  const sub = input.subscription;
  const periodEnd = sub?.current_period_end ?? null;
  const periodEndMs = periodEnd ? new Date(periodEnd).getTime() : null;

  const trialMs = input.trialEndsAt ? new Date(input.trialEndsAt).getTime() : null;
  const trialDaysLeft =
    trialMs === null ? 0 : Math.max(0, Math.ceil((trialMs - now.getTime()) / DAY_MS));

  const base = { trialDaysLeft, periodEnd };

  if (input.billingExempt) return { state: "exempt", ok: true, ...base };

  if (sub?.status === "active") {
    // sem current_period_end (webhook ainda não rodou) → confia no status
    if (periodEndMs === null || now.getTime() <= periodEndMs + BILLING.graceDays * DAY_MS) {
      return { state: "active", ok: true, ...base };
    }
    return { state: "past_due", ok: false, ...base };
  }

  if (sub?.status === "past_due") {
    const graceBase = periodEndMs ?? now.getTime();
    const inGrace = now.getTime() <= graceBase + BILLING.graceDays * DAY_MS;
    return { state: "past_due", ok: inGrace, ...base };
  }

  if (sub?.status === "canceled" && periodEndMs !== null && now.getTime() <= periodEndMs) {
    return { state: "canceled", ok: true, ...base };
  }

  // pending (aguardando 1º pagamento) ou sem assinatura → vale o trial.
  // trial_ends_at ausente (conta pré-migration) → libera.
  if (trialMs === null || now.getTime() < trialMs) {
    return { state: "trial", ok: true, ...base };
  }

  return { state: "blocked", ok: false, ...base };
}
