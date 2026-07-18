// Configuração do billing de profissionais. Preços em reais (BRL).
// Placeholder até o preço real ser definido — mudar aqui muda checkout e UI.

export type BillingPlan = "monthly" | "yearly";

export const BILLING = {
  trialDays: 14,
  /** dias de carência após vencer antes de bloquear o painel */
  graceDays: 5,
  plans: {
    monthly: { value: 97, cycle: "MONTHLY", label: "mensal", per: "/mês" },
    yearly: { value: 970, cycle: "YEARLY", label: "anual", per: "/ano" },
  },
} as const;

export function planValue(plan: BillingPlan): number {
  return BILLING.plans[plan].value;
}

/** "R$ 97" */
export function formatBRL(value: number): string {
  return `R$ ${value.toLocaleString("pt-BR")}`;
}

/** economia do anual vs 12x mensal, em % inteiro (0 se não compensa) */
export function yearlySavingsPct(): number {
  const full = BILLING.plans.monthly.value * 12;
  return Math.max(0, Math.round((1 - BILLING.plans.yearly.value / full) * 100));
}
