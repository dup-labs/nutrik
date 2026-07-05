"use client";

import { useState } from "react";
import { BackHeader, MeshAura } from "@/components/ui";
import { IconGear } from "@/components/ui/icons";
import { addWater, setWaterGoal } from "@/lib/actions";

const CUP = "M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8zM6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2";
const BOTTLE = "M10 2h4M9 6h6l1 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10z";

const OPTIONS = [
  { label: "copo 200 ml", ml: 200, icon: CUP },
  { label: "copo 300 ml", ml: 300, icon: CUP },
  { label: "copo 400 ml", ml: 400, icon: CUP },
  { label: "garrafa 500 ml", ml: 500, icon: BOTTLE },
  { label: "garrafa 1 l", ml: 1000, icon: BOTTLE },
];
const GOALS = [1500, 2000, 2500, 3000];

function waterL(n: number) {
  return (n / 1000)
    .toFixed(n % 1000 === 0 ? 0 : n % 100 === 0 ? 1 : 2)
    .replace(".", ",");
}

export function AguaClient({
  initialTotal,
  initialGoal,
  date,
}: {
  initialTotal: number;
  initialGoal: number;
  date: string;
}) {
  const [total, setTotal] = useState(initialTotal);
  const [goal, setGoal] = useState(initialGoal);
  const [cfgOpen, setCfgOpen] = useState(false);

  const C = 2 * Math.PI * 86;
  const pct = Math.min(total / goal, 1);
  const met = total >= goal;

  function handleAdd(ml: number) {
    setTotal((t) => Math.min(t + ml, 6000));
    addWater({ date, amountMl: ml });
  }

  function handleGoal(g: number) {
    setGoal(g);
    setWaterGoal(g);
  }

  return (
    <div
      style={{
        padding: "24px 20px 28px",
        maxWidth: 640,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100dvh - 96px)",
      }}
    >
      <BackHeader
        href="/"
        title="hidratação"
        subtitle="um gole de cada vez."
        right={
          <button
            onClick={() => setCfgOpen((o) => !o)}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "1px solid var(--color-border)",
              background: cfgOpen ? "var(--color-orange-subtle)" : "var(--color-surface-elevated)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              color: cfgOpen ? "var(--color-orange)" : "var(--color-text-secondary)",
            }}
          >
            <IconGear size={18} />
          </button>
        }
      />

      {cfgOpen && (
        <div
          style={{
            background: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: 16,
            boxShadow: "var(--shadow-card)",
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 10 }}>
            quanto você quer beber por dia?
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {GOALS.map((g) => (
              <button
                key={g}
                onClick={() => handleGoal(g)}
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: "var(--radius-pill)",
                  cursor: "pointer",
                  fontFamily: "var(--font-data)",
                  fontWeight: 700,
                  fontSize: 14,
                  border: goal === g ? "none" : "1px solid var(--color-border-strong)",
                  background: goal === g ? "var(--color-orange)" : "var(--color-surface)",
                  color: goal === g ? "#fff" : "var(--color-text-secondary)",
                }}
              >
                {waterL(g)} l
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          minHeight: 300,
        }}
      >
        <div style={{ position: "relative", width: 200, height: 200 }}>
          <MeshAura mesh="mist" size={240} blur={30} opacity={0.4} style={{ inset: -20 }} />
          <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: "relative", transform: "rotate(-90deg)" }}>
            <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(43,147,168,0.14)" strokeWidth="16" />
            <circle
              cx="100"
              cy="100"
              r="86"
              fill="none"
              stroke="url(#aguaGrad)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              style={{ transition: "stroke-dashoffset .5s var(--ease-out)" }}
            />
            <defs>
              <linearGradient id="aguaGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#adf3f3" />
                <stop offset="100%" stopColor="#2b93a8" />
              </linearGradient>
            </defs>
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontWeight: 900,
                fontSize: 44,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {waterL(total)} l
            </span>
            <span style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 4 }}>
              de {waterL(goal)} l
            </span>
          </div>
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: met ? "#2f9e6b" : "var(--color-text-muted)",
            marginTop: 8,
          }}
        >
          {met ? "meta batida. mandou bem." : "siga hidratando ao longo do dia."}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
        {OPTIONS.map((o) => (
          <button
            key={o.label}
            onClick={() => handleAdd(o.ml)}
            style={{
              height: 66,
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-strong)",
              background: "var(--color-surface-elevated)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              cursor: "pointer",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2b93a8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d={o.icon} />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)" }}>
              {o.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
