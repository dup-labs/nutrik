"use client";

import { useState } from "react";
import { IconCheck } from "@/components/ui/icons";
import { weekdayShort } from "@/lib/dates";

type Pct = { nut: number; tre: number; agu: number; men: number };

const METRICS = [
  { key: "nut" as const, label: "nutrição", accent: "#c67518" },
  { key: "tre" as const, label: "treino", accent: "#fe5f33" },
  { key: "agu" as const, label: "água", accent: "#2b93a8" },
  { key: "men" as const, label: "mente", accent: "#5a63c4" },
];

export function ProgressoClient({
  perPct,
  weekCells,
}: {
  perPct: { dia: Pct; semana: Pct; mes: Pct };
  weekCells: {
    date: string;
    future: boolean;
    isToday: boolean;
    active: boolean;
    stats: { nut: number; tre: number | null; agu: number; men: number } | null;
  }[];
}) {
  const [period, setPeriod] = useState<"dia" | "semana" | "mes">("semana");
  const pct = perPct[period];

  const tab = (p: typeof period, label: string) => (
    <button
      key={p}
      onClick={() => setPeriod(p)}
      style={{
        flex: 1,
        height: 34,
        borderRadius: "var(--radius-pill)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
        border: period === p ? "none" : "1px solid var(--color-border-strong)",
        background: period === p ? "var(--color-orange)" : "var(--color-surface-elevated)",
        color: period === p ? "#fff" : "var(--color-text-secondary)",
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {tab("dia", "dia")}
        {tab("semana", "semana")}
        {tab("mes", "mês")}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)" }}>
            {period === "dia" ? "hoje" : period === "mes" ? "este mês" : "sua semana"}
          </span>
          <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
            {period === "dia" ? "como você tá indo agora" : "consistência, não perfeição"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {weekCells.map((c) => (
            <div
              key={c.date}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  maxWidth: 34,
                  borderRadius: 10,
                  background: c.active ? "rgba(254,175,76,0.2)" : "var(--color-surface)",
                  border: c.isToday
                    ? "1.5px solid var(--color-orange)"
                    : c.active
                      ? "1px solid rgba(254,175,76,0.4)"
                      : "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {c.active && <IconCheck size={14} color="#c67518" />}
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                }}
              >
                {weekdayShort(c.date)[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {METRICS.map((m) => (
          <div
            key={m.key}
            style={{
              background: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: 14,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: m.accent }} />
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{m.label}</span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-data)",
                fontWeight: 700,
                fontSize: 26,
                color: m.accent,
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {pct[m.key]}%
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {weekCells.map((c) => {
                const v = c.stats
                  ? m.key === "tre"
                    ? c.stats.tre
                    : c.stats[m.key]
                  : null;
                const on = v !== null && v !== undefined && v >= 0.99;
                return (
                  <div
                    key={c.date}
                    style={{
                      flex: 1,
                      height: 6,
                      borderRadius: 2,
                      background: on ? m.accent : "var(--color-border)",
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
