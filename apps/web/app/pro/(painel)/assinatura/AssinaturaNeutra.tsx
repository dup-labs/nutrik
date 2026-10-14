import type { EntitlementState } from "@/lib/billing/entitlement";

// Versão da tela de assinatura para o app iOS (Apple 3.1.1): só mostra o status.
// Sem preço, sem botão de assinar/pagar, sem link e sem texto chamando pra compra.
const STATUS: Record<EntitlementState, { title: string; sub: string }> = {
  exempt: { title: "conta liberada", sub: "sua conta tem acesso livre." },
  active: { title: "assinatura ativa", sub: "seu painel está liberado." },
  trial: { title: "período de teste", sub: "seu painel está liberado durante o teste." },
  past_due: { title: "pagamento pendente", sub: "há uma pendência na sua assinatura." },
  canceled: { title: "assinatura cancelada", sub: "seu acesso segue até o fim do período." },
  blocked: { title: "acesso indisponível", sub: "sua conta não tem assinatura vigente." },
};

export function AssinaturaNeutra({
  state,
  trialDaysLeft,
  periodEnd,
}: {
  state: EntitlementState;
  trialDaysLeft: number;
  periodEnd: string | null;
}) {
  const s = STATUS[state];
  const until = periodEnd ? new Date(periodEnd).toLocaleDateString("pt-BR") : null;
  const detail =
    state === "trial" && trialDaysLeft > 0
      ? `faltam ${trialDaysLeft} ${trialDaysLeft === 1 ? "dia" : "dias"} de teste.`
      : state === "canceled" && until
        ? `acesso até ${until}.`
        : state === "active" && until
          ? `período atual até ${until}.`
          : null;

  return (
    <div style={{ padding: "28px 24px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 26, letterSpacing: "-0.03em" }}>
        {s.title}
      </div>
      <div style={{ marginTop: 6, fontSize: 14, color: "var(--color-text-secondary)" }}>
        {s.sub}
        {detail ? ` ${detail}` : ""}
      </div>
      <div style={{ marginTop: 20, fontSize: 13, color: "var(--color-text-muted)" }}>
        a gestão da assinatura é feita pelo navegador.
      </div>
    </div>
  );
}
