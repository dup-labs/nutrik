"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, PrimaryButton } from "@/components/ui";
import {
  cancelSubscription,
  refreshSubscriptionStatus,
  startSubscription,
} from "@/lib/billing/actions";
import { formatBRL } from "@/lib/billing/config";
import type { BillingPlan } from "@/lib/billing/config";
import type { EntitlementState } from "@/lib/billing/entitlement";

const HEADLINE: Record<EntitlementState, { title: string; sub: string }> = {
  exempt: { title: "conta liberada", sub: "sua conta tem acesso livre, sem cobrança. aproveita 💚" },
  active: { title: "assinatura ativa", sub: "seu painel está liberado. obrigado por fazer parte!" },
  trial: { title: "período de teste", sub: "teste tudo à vontade. assine quando quiser pra não perder o acesso." },
  past_due: { title: "pagamento pendente", sub: "sua última cobrança venceu. regulariza pra manter o acesso." },
  canceled: { title: "assinatura cancelada", sub: "seu acesso segue até o fim do período já pago." },
  blocked: { title: "seu teste acabou", sub: "assina pra continuar cuidando dos seus pacientes." },
};

export function AssinaturaClient({
  state,
  trialDaysLeft,
  periodEnd,
  currentPlan,
  prices,
  savingsPct,
}: {
  state: EntitlementState;
  trialDaysLeft: number;
  periodEnd: string | null;
  currentPlan: BillingPlan | null;
  prices: { monthly: number; yearly: number };
  savingsPct: number;
}) {
  const router = useRouter();
  const [plan, setPlan] = useState<BillingPlan>(currentPlan ?? "monthly");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [busy, setBusy] = useState<"start" | "cancel" | "refresh" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const hasSubscription = currentPlan !== null;
  const showPlans = state !== "exempt";
  const showSubscribe = state === "trial" || state === "blocked" || state === "canceled";
  const showPending = hasSubscription && (state === "trial" || state === "blocked");

  const periodEndLabel = periodEnd ? new Date(periodEnd).toLocaleDateString("pt-BR") : null;

  async function handleSubscribe() {
    if (busy) return;
    setError(null);
    setNotice(null);
    setBusy("start");
    const res = await startSubscription({ plan, cpfCnpj });
    setBusy(null);
    if (!res.ok) {
      setError(res.error ?? "algo deu errado. tenta de novo?");
      return;
    }
    if (res.invoiceUrl) {
      window.location.href = res.invoiceUrl;
    } else {
      setNotice("assinatura criada! a fatura está sendo gerada — clica em “verificar pagamento” em instantes.");
      router.refresh();
    }
  }

  async function handleRefresh() {
    if (busy) return;
    setError(null);
    setNotice(null);
    setBusy("refresh");
    const res = await refreshSubscriptionStatus();
    setBusy(null);
    if (!res.ok) {
      setError(res.error ?? "algo deu errado. tenta de novo?");
      return;
    }
    if (res.status === "active") {
      setNotice("pagamento confirmado! seu painel está liberado 🎉");
      router.refresh();
    } else if (res.openInvoiceUrl) {
      setNotice("ainda não identificamos o pagamento. a fatura segue aberta:");
      window.open(res.openInvoiceUrl, "_blank");
    } else {
      setNotice("ainda não identificamos o pagamento. se você acabou de pagar, espera uns minutos e verifica de novo.");
    }
  }

  async function handleCancel() {
    if (busy) return;
    setError(null);
    setBusy("cancel");
    const res = await cancelSubscription();
    setBusy(null);
    setConfirmCancel(false);
    if (!res.ok) {
      setError(res.error ?? "algo deu errado. tenta de novo?");
      return;
    }
    setNotice("assinatura cancelada. seu acesso segue até o fim do período pago.");
    router.refresh();
  }

  const h = HEADLINE[state];

  const planCard = (p: BillingPlan) => {
    const selected = plan === p;
    const price = p === "monthly" ? prices.monthly : prices.yearly;
    return (
      <button
        key={p}
        onClick={() => setPlan(p)}
        style={{
          flex: 1,
          textAlign: "left",
          padding: "16px 18px",
          borderRadius: 14,
          cursor: "pointer",
          border: selected
            ? "2px solid var(--color-orange)"
            : "1px solid var(--color-border-strong)",
          background: selected ? "var(--color-orange-subtle)" : "var(--color-surface-elevated)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: selected ? "var(--color-orange)" : "var(--color-text-secondary)" }}>
            {p === "monthly" ? "mensal" : "anual"}
          </span>
          {p === "yearly" && savingsPct > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "var(--color-orange)", color: "#fff" }}>
              -{savingsPct}%
            </span>
          )}
          {currentPlan === p && hasSubscription && state !== "canceled" && (
            <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>plano atual</span>
          )}
        </div>
        <div style={{ marginTop: 6, fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 24 }}>
          {formatBRL(price)}
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-muted)" }}>
            {p === "monthly" ? "/mês" : "/ano"}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div style={{ padding: "28px 24px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 26, letterSpacing: "-0.03em" }}>
        {h.title}
      </div>
      <div style={{ marginTop: 6, fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 24 }}>
        {state === "trial" && trialDaysLeft > 0
          ? `${h.sub} faltam ${trialDaysLeft} ${trialDaysLeft === 1 ? "dia" : "dias"} de teste.`
          : h.sub}
        {state === "canceled" && periodEndLabel ? ` acesso até ${periodEndLabel}.` : ""}
      </div>

      {state === "active" && (
        <Card style={{ padding: "18px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            plano <b>{currentPlan === "yearly" ? "anual" : "mensal"}</b>
            {periodEndLabel ? ` · próximo período até ${periodEndLabel}` : ""}
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={handleRefresh}
              disabled={busy !== null}
              style={{ height: 38, padding: "0 16px", borderRadius: "var(--radius-pill)", border: "1px solid var(--color-border-strong)", background: "transparent", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "var(--color-text-secondary)" }}
            >
              {busy === "refresh" ? "verificando…" : "verificar pagamento"}
            </button>
            {confirmCancel ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={busy !== null}
                  style={{ height: 38, padding: "0 16px", borderRadius: "var(--radius-pill)", border: "none", background: "#c03418", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  {busy === "cancel" ? "cancelando…" : "confirmar cancelamento"}
                </button>
                <button
                  onClick={() => setConfirmCancel(false)}
                  style={{ height: 38, padding: "0 16px", borderRadius: "var(--radius-pill)", border: "none", background: "transparent", fontSize: 13, cursor: "pointer", color: "var(--color-text-muted)" }}
                >
                  voltar
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmCancel(true)}
                style={{ height: 38, padding: "0 16px", borderRadius: "var(--radius-pill)", border: "none", background: "transparent", fontSize: 13, cursor: "pointer", color: "var(--color-text-muted)", textDecoration: "underline", textUnderlineOffset: 3 }}
              >
                cancelar assinatura
              </button>
            )}
          </div>
        </Card>
      )}

      {(state === "past_due" || showPending) && (
        <Card style={{ padding: "18px 20px", marginBottom: 20, border: "1px solid var(--color-orange)" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {state === "past_due" ? "cobrança em aberto" : "aguardando confirmação do pagamento"}
          </div>
          <div style={{ marginTop: 4, fontSize: 13, color: "var(--color-text-secondary)" }}>
            {state === "past_due"
              ? "paga a fatura pra manter seu acesso — cartão ou Pix."
              : "se você já pagou, a confirmação chega em instantes."}
          </div>
          <div style={{ marginTop: 14 }}>
            <button
              onClick={handleRefresh}
              disabled={busy !== null}
              style={{ height: 40, padding: "0 18px", borderRadius: "var(--radius-pill)", border: "none", background: "var(--color-orange)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              {busy === "refresh" ? "verificando…" : "abrir fatura / verificar pagamento"}
            </button>
          </div>
        </Card>
      )}

      {showPlans && state !== "active" && (
        <>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            {planCard("monthly")}
            {planCard("yearly")}
          </div>

          {showSubscribe && (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                  CPF ou CNPJ (pra emissão da cobrança)
                </div>
                <input
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  style={{ width: "100%", boxSizing: "border-box", height: 46, padding: "0 14px", borderRadius: 10, border: "1px solid var(--color-border-strong)", background: "var(--color-surface-elevated)", fontSize: 14, outline: "none" }}
                />
              </div>

              <PrimaryButton onClick={handleSubscribe} disabled={busy !== null}>
                {busy === "start"
                  ? "criando assinatura…"
                  : state === "canceled"
                    ? "reativar assinatura"
                    : `assinar plano ${plan === "monthly" ? "mensal" : "anual"}`}
              </PrimaryButton>
              <div style={{ marginTop: 10, fontSize: 12, color: "var(--color-text-muted)", textAlign: "center" }}>
                você paga na página segura do Asaas — cartão de crédito ou Pix. cancela quando quiser.
              </div>
            </>
          )}
        </>
      )}

      {error && (
        <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 10, background: "rgba(192,52,24,0.08)", border: "1px solid rgba(192,52,24,0.3)", fontSize: 13, color: "#c03418" }}>
          {error}
        </div>
      )}
      {notice && (
        <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 10, background: "var(--color-orange-subtle)", border: "1px solid var(--color-border)", fontSize: 13, color: "var(--color-text-secondary)" }}>
          {notice}
        </div>
      )}
    </div>
  );
}
