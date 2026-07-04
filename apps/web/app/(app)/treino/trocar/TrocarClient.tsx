"use client";

import Link from "next/link";
import { useState } from "react";
import { BackHeader, PrimaryButton } from "@/components/ui";
import { TextInput } from "@/components/auth/fields";
import { IconCheck } from "@/components/ui/icons";
import { requestWorkoutChange } from "@/lib/actions";

export function TrocarClient({
  day,
  personalName,
}: {
  day: { id: string; name: string };
  personalName: string;
}) {
  const [toLabel, setToLabel] = useState("");
  const [justification, setJustification] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSend() {
    if (!justification.trim() || busy) return;
    setBusy(true);
    await requestWorkoutChange({
      workoutDayId: day.id,
      fromLabel: day.name,
      toLabel,
      justification,
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
            background: "var(--mesh-warm)",
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
          {personalName} recebe seu pedido e te responde por aqui. enquanto isso,
          o treino atual segue valendo.
        </div>
        <Link
          href="/treino"
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
          voltar ao treino
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
        href="/treino"
        title="pedir troca de treino"
        subtitle={`o pedido vai direto pro ${personalName}.`}
      />

      {label("treino de hoje")}
      <div
        style={{
          padding: "13px 16px",
          borderRadius: "var(--radius-md)",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-strong)",
          fontSize: 15,
          fontWeight: 600,
          color: "var(--color-text-muted)",
          marginBottom: 20,
        }}
      >
        {day.name}
      </div>

      {label(
        <>
          o que você prefere?{" "}
          <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>opcional</span>
        </>,
      )}
      <TextInput
        placeholder="ex.: treino mais curto, foco em superiores..."
        value={toLabel}
        onChange={(e) => setToLabel(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      {label("por quê?")}
      <textarea
        value={justification}
        onChange={(e) => setJustification(e.target.value)}
        placeholder="sem tempo hoje, dor no joelho, academia lotada..."
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
          marginBottom: 24,
        }}
      />

      <PrimaryButton disabled={!justification.trim() || busy} onClick={handleSend}>
        {busy ? "enviando..." : "enviar pedido"}
      </PrimaryButton>
    </div>
  );
}
