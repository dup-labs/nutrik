"use client";

import Link from "next/link";
import { useState } from "react";
import { BackHeader, PrimaryButton } from "@/components/ui";
import { TextInput } from "@/components/auth/fields";
import { IconCheck } from "@/components/ui/icons";
import { requestSubstitution } from "@/lib/actions";

export function SubstituirClient({
  meal,
  nutriName,
}: {
  meal: { id: string; name: string; time: string | null; description: string };
  nutriName: string;
}) {
  const [reason, setReason] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSend() {
    if (!reason.trim() || busy) return;
    setBusy(true);
    await requestSubstitution({
      protocolMealId: meal.id,
      reason,
      suggestion,
    });
    setSent(true);
    setBusy(false);
  }

  if (sent) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: "calc(100dvh - 160px)",
          padding: "0 30px",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: "var(--mesh-cool)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "ntrkPop .5s var(--ease-spring) both",
          }}
        >
          <IconCheck size={34} color="#fff" />
        </div>
        <div style={{ marginTop: 20, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 23, letterSpacing: "-0.03em" }}>
          pedido enviado.
        </div>
        <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.5, color: "var(--color-text-secondary)", maxWidth: 280 }}>
          {nutriName} avalia sua sugestão e te responde. enquanto isso, o convite
          atual segue valendo.
        </div>
        <Link
          href="/refeicoes"
          style={{
            marginTop: 30,
            height: 52,
            padding: "0 36px",
            borderRadius: "var(--radius-pill)",
            background: "var(--color-orange)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          voltar às refeições
        </Link>
      </div>
    );
  }

  const label = (t: React.ReactNode) => (
    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
      {t}
    </div>
  );

  return (
    <div style={{ padding: "24px 20px 28px" }}>
      <BackHeader
        href={`/refeicoes/${meal.id}`}
        title="pedir substituição"
        subtitle={`o pedido vai direto pra ${nutriName}.`}
      />

      {label("refeição")}
      <div
        style={{
          padding: "13px 16px",
          borderRadius: "var(--radius-md)",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-strong)",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600 }}>
          {meal.name}
          {meal.time && (
            <span style={{ fontFamily: "var(--font-data)", fontWeight: 500, fontSize: 13, color: "var(--color-text-muted)" }}>
              {" "}
              · {meal.time}
            </span>
          )}
        </div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4, lineHeight: 1.5 }}>
          {meal.description}
        </div>
      </div>

      {label("o que não tá funcionando?")}
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="não gosto, difícil de preparar, ingrediente caro..."
        style={{
          width: "100%",
          boxSizing: "border-box",
          minHeight: 88,
          padding: "14px 16px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border-strong)",
          background: "var(--color-surface-elevated)",
          fontSize: 14,
          lineHeight: 1.5,
          color: "var(--color-text)",
          outline: "none",
          resize: "none",
          marginBottom: 20,
        }}
      />

      {label(
        <>
          tem algo em mente no lugar?{" "}
          <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>opcional</span>
        </>,
      )}
      <TextInput
        placeholder="ex.: trocar salmão por sardinha"
        value={suggestion}
        onChange={(e) => setSuggestion(e.target.value)}
        style={{ marginBottom: 24 }}
      />

      <PrimaryButton disabled={!reason.trim() || busy} onClick={handleSend}>
        {busy ? "enviando..." : "enviar pedido"}
      </PrimaryButton>
    </div>
  );
}
