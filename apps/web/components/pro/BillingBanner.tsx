"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { EntitlementState } from "@/lib/billing/entitlement";

/** faixa de status de assinatura no topo do painel (some na própria página) */
export function BillingBanner({
  state,
  trialDaysLeft,
  periodEnd,
}: {
  state: EntitlementState;
  trialDaysLeft: number;
  periodEnd: string | null;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/pro/assinatura")) return null;

  let text: string;
  let cta: string;
  let warn = false;

  if (state === "trial") {
    text =
      trialDaysLeft === 1
        ? "último dia do período de teste"
        : `período de teste — ${trialDaysLeft} dias restantes`;
    cta = "assinar agora";
  } else if (state === "past_due") {
    text = "pagamento pendente — seu acesso será bloqueado em breve";
    cta = "regularizar";
    warn = true;
  } else if (state === "canceled") {
    const until = periodEnd
      ? ` até ${new Date(periodEnd).toLocaleDateString("pt-BR")}`
      : "";
    text = `assinatura cancelada — acesso${until}`;
    cta = "reativar";
  } else {
    return null; // active / exempt: sem faixa
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        flexWrap: "wrap",
        padding: "10px 16px",
        fontSize: 13,
        color: warn ? "#fff" : "var(--color-text-secondary)",
        background: warn ? "var(--color-orange)" : "var(--color-orange-subtle)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <span>{text}</span>
      <Link
        href="/pro/assinatura"
        style={{
          fontWeight: 700,
          color: warn ? "#fff" : "var(--color-orange)",
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        {cta}
      </Link>
    </div>
  );
}
