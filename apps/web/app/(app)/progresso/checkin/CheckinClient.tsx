"use client";

import Link from "next/link";
import { useState } from "react";
import { BackHeader, PrimaryButton } from "@/components/ui";
import { IconCheck } from "@/components/ui/icons";
import { saveCheckin } from "@/lib/actions";

const ROUPA = [
  { key: "folgada", label: "mais folgada" },
  { key: "igual", label: "na mesma" },
  { key: "justa", label: "mais justa" },
];

export function CheckinClient({
  proNames,
  requestId,
  requesterName,
}: {
  proNames: string[];
  requestId?: string;
  requesterName?: string;
}) {
  const [sensacao, setSensacao] = useState<number | null>(null);
  const [energia, setEnergia] = useState<number | null>(null);
  const [roupa, setRoupa] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    if (!sensacao || !energia || busy) return;
    setBusy(true);
    await saveCheckin({ bodyFeeling: sensacao, energy: energia, clothesFit: roupa, requestId });
    setSaved(true);
    setBusy(false);
  }

  if (saved) {
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
          registrado.
        </div>
        <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.5, color: "var(--color-text-secondary)", maxWidth: 280 }}>
          {proNames.length > 0
            ? `seu check-in vai pra ${proNames.join(" e pra ")}. é assim que a gente acompanha você de perto.`
            : "seu check-in ficou guardado. é assim que você acompanha sua evolução, sem balança."}
        </div>
        <Link
          href="/progresso"
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
          voltar
        </Link>
      </div>
    );
  }

  const scale = (
    val: number | null,
    set: (n: number) => void,
    tint: string,
    left: string,
    right: string,
  ) => (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => set(n)}
            style={{
              flex: 1,
              height: 46,
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              background: val === n ? tint : "var(--color-surface)",
              border: val === n ? "1.5px solid rgba(27,28,29,0.25)" : "1px solid var(--color-border-strong)",
              color: val === n ? "var(--color-text)" : "var(--color-text-muted)",
              fontFamily: "var(--font-data)",
              fontSize: 15,
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--color-text-muted)", marginBottom: 20 }}>
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </>
  );

  return (
    <div style={{ padding: "24px 20px 28px", maxWidth: 640, margin: "0 auto" }}>
      <BackHeader
        href="/"
        title="check-in do mês"
        subtitle={requesterName ? `${requesterName} pediu esse check-in — sem balança.` : "como o corpo tá respondendo — sem balança."}
      />

      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
        como você tá se sentindo no corpo?
      </div>
      {scale(sensacao, setSensacao, "rgba(254,175,76,0.2)", "travado", "leve")}

      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
        sua energia no dia a dia
      </div>
      {scale(energia, setEnergia, "rgba(254,95,51,0.2)", "baixa", "alta")}

      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 10 }}>
        e a roupa, como tá caindo?
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 26 }}>
        {ROUPA.map((o) => {
          const sel = roupa === o.key;
          return (
            <button
              key={o.key}
              onClick={() => setRoupa(o.key)}
              style={{
                flex: 1,
                height: 46,
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 500,
                background: sel ? "var(--color-orange-subtle)" : "var(--color-surface)",
                border: sel ? "1.5px solid var(--color-orange-dim)" : "1px solid var(--color-border-strong)",
                color: sel ? "var(--color-orange)" : "var(--color-text-secondary)",
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>

      <PrimaryButton disabled={!sensacao || !energia || busy} onClick={handleSave}>
        {busy ? "salvando..." : "salvar check-in"}
      </PrimaryButton>
    </div>
  );
}
