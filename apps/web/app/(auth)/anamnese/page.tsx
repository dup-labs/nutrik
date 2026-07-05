"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackHeader, PrimaryButton } from "@/components/ui";
import { IconCheck, IconFace } from "@/components/ui/icons";
import { submitAnamnese } from "@/lib/actions";

const FACES = [
  { n: 1, mouth: "M8 16.5 Q12 13.5 16 16.5", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  { n: 2, mouth: "M8.5 16 Q12 14 15.5 16", color: "#5a63c4", bg: "rgba(173,183,247,0.18)" },
  { n: 3, mouth: "M9 15.5 L15 15.5", color: "#6b6f78", bg: "var(--color-surface)" },
  { n: 4, mouth: "M8.5 14.5 Q12 17 15.5 14.5", color: "#2f9e6b", bg: "rgba(47,158,107,0.14)" },
  { n: 5, mouth: "M8 14.5 Q12 18.5 16 14.5", color: "#c67518", bg: "rgba(254,175,76,0.18)" },
];

const SINTOMAS = [
  "cansaço", "dor muscular", "ansiedade", "sono ruim",
  "sem apetite", "inchaço", "dor de cabeça", "irritação",
];

export default function AnamnesePage() {
  const router = useRouter();
  const [bem, setBem] = useState<number | null>(null);
  const [energia, setEnergia] = useState<number | null>(null);
  const [sintomas, setSintomas] = useState<string[]>([]);
  const [sonoQ, setSonoQ] = useState<number | null>(null);
  const [obs, setObs] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSend() {
    if (!bem || !energia || busy) return;
    setBusy(true);
    await submitAnamnese({
      wellbeing: bem,
      energy: energia,
      symptoms: sintomas,
      sleepQuality: sonoQ,
      notes: obs,
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
          minHeight: "70vh",
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
        <div
          style={{
            marginTop: 20,
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: 24,
            letterSpacing: "-0.03em",
          }}
        >
          tudo pronto.
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 15,
            lineHeight: 1.5,
            color: "var(--color-text-secondary)",
            maxWidth: 280,
          }}
        >
          a gente já sabe por onde começar com você. bem-vinda à Nūtrk.
        </div>
        <button
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
          style={{
            marginTop: 32,
            height: 54,
            padding: "0 40px",
            borderRadius: "var(--radius-pill)",
            border: "none",
            background: "var(--color-orange)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          entrar no meu dia
        </button>
      </div>
    );
  }

  const label = (t: string, extra?: string) => (
    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
      {t}{" "}
      {extra && <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>{extra}</span>}
    </div>
  );

  const scaleRow = (val: number | null, set: (n: number) => void, tint: string) => (
    <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
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
  );

  return (
    <div style={{ padding: "56px 24px 32px" }}>
      <BackHeader
        href="/cadastro"
        title="como você chega."
        subtitle="sem certo ou errado. só pra entender seu momento."
      />

      {label("como você tá se sentindo hoje?")}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        {FACES.map((f) => {
          const sel = bem === f.n;
          return (
            <button
              key={f.n}
              type="button"
              onClick={() => setBem(f.n)}
              style={{
                flex: 1,
                aspectRatio: "1",
                maxWidth: 56,
                borderRadius: "50%",
                cursor: "pointer",
                background: sel ? f.bg : "var(--color-surface)",
                border: sel ? `2px solid ${f.color}` : "2px solid var(--color-border-strong)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: sel ? "scale(1.1)" : "scale(1)",
                transition: "all .2s var(--ease-spring)",
                padding: 0,
              }}
            >
              <IconFace mouth={f.mouth} size={28} color={sel ? f.color : "var(--color-text-muted)"} />
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--color-text-muted)", marginBottom: 20 }}>
        <span>difícil</span>
        <span>ótimo</span>
      </div>

      {label("seu nível de energia essa semana")}
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setEnergia(i)}
            style={{
              flex: 1,
              height: 22,
              borderRadius: 7,
              cursor: "pointer",
              border: "1px solid var(--color-border-strong)",
              background:
                (energia ?? 0) >= i
                  ? "linear-gradient(90deg,#fe5f33,#feaf4c)"
                  : "var(--color-surface)",
              transition: "background .25s var(--ease-out)",
              padding: 0,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--color-text-muted)", marginBottom: 20 }}>
        <span>sem energia</span>
        <span>cheia</span>
      </div>

      {label("tem algo pesando?", "o que quiser marcar")}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
        {SINTOMAS.map((t) => {
          const on = sintomas.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() =>
                setSintomas((s) => (on ? s.filter((x) => x !== t) : [...s, t]))
              }
              style={{
                height: 36,
                padding: "0 14px",
                borderRadius: "var(--radius-pill)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                background: on ? "var(--color-orange-subtle)" : "var(--color-surface)",
                border: on ? "1px solid var(--color-orange-dim)" : "1px solid var(--color-border-strong)",
                color: on ? "var(--color-orange)" : "var(--color-text-secondary)",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {label("como anda seu sono?")}
      {scaleRow(sonoQ, setSonoQ, "rgba(173,183,247,0.24)")}

      {label("quer contar mais alguma coisa?", "opcional")}
      <textarea
        value={obs}
        onChange={(e) => setObs(e.target.value)}
        placeholder="qualquer coisa que ajude a gente a te acompanhar melhor..."
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

      <PrimaryButton disabled={!bem || !energia || busy} onClick={handleSend}>
        {busy ? "enviando..." : "enviar e continuar"}
      </PrimaryButton>
    </div>
  );
}
