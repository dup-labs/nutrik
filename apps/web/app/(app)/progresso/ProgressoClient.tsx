"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IconBrain,
  IconCheck,
  IconChevronRight,
  IconDrop,
  IconDumbbell,
  IconFork,
} from "@/components/ui/icons";
import { weekdayShort } from "@/lib/dates";

type Pct = { nut: number; tre: number; agu: number; men: number };

const METRICS = [
  { key: "nut" as const, label: "nutrição", accent: "#c67518" },
  { key: "tre" as const, label: "treino", accent: "#fe5f33" },
  { key: "agu" as const, label: "água", accent: "#2b93a8" },
  { key: "men" as const, label: "mente", accent: "#5a63c4" },
];

const HEAT = ["rgba(27,28,29,0.05)", "rgba(254,175,76,0.38)", "rgba(254,143,60,0.62)", "rgba(254,95,51,0.92)"];

function waterL(n: number) {
  return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1).replace(".", ",");
}

export function ProgressoClient({
  perPct,
  weekCells,
  todayDetail,
  monthCells,
  monthOffset,
  monthLabel,
}: {
  perPct: { dia: Pct; semana: Pct; mes: Pct };
  weekCells: {
    date: string;
    future: boolean;
    isToday: boolean;
    active: boolean;
    stats: { nut: number; tre: number | null; agu: number; men: number } | null;
  }[];
  todayDetail: {
    mealsDone: number;
    mealsTotal: number;
    workout: "rest" | "done" | "pending";
    waterMl: number;
    waterGoal: number;
    mindDone: boolean;
  };
  monthCells: { date: string; day: number; level: number; isToday: boolean }[];
  monthOffset: number;
  monthLabel: string;
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

  const bar = (value: number, max: number, color: string) => (
    <div style={{ height: 8, borderRadius: 99, background: "var(--color-surface)", overflow: "hidden", flex: 1 }}>
      <div
        style={{
          height: "100%",
          width: `${Math.min(100, (value / Math.max(1, max)) * 100)}%`,
          borderRadius: 99,
          background: color,
          transition: "width .4s var(--ease-out)",
        }}
      />
    </div>
  );

  const activeDays = monthCells.filter((c) => c.level > 0).length;
  const pastDays = monthCells.filter((c) => c.level >= 0).length;

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {tab("dia", "dia")}
        {tab("semana", "semana")}
        {tab("mes", "mês")}
      </div>

      {/* ── DIA: o hoje em detalhe, mundo a mundo ── */}
      {period === "dia" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {[
            {
              href: "/refeicoes",
              icon: <IconFork size={18} color="#c67518" />,
              iconBg: "rgba(254,175,76,0.16)",
              label: "nutrição",
              status: `${todayDetail.mealsDone} de ${todayDetail.mealsTotal} refeições`,
              barEl: bar(todayDetail.mealsDone, todayDetail.mealsTotal, "#c67518"),
              done: todayDetail.mealsDone >= todayDetail.mealsTotal,
            },
            {
              href: "/treino",
              icon: <IconDumbbell size={18} color="#fe5f33" />,
              iconBg: "var(--color-orange-subtle)",
              label: "treino",
              status:
                todayDetail.workout === "rest"
                  ? "dia de descanso"
                  : todayDetail.workout === "done"
                    ? "concluído"
                    : "em aberto",
              barEl: bar(todayDetail.workout === "done" || todayDetail.workout === "rest" ? 1 : 0, 1, "#fe5f33"),
              done: todayDetail.workout !== "pending",
            },
            {
              href: "/agua",
              icon: <IconDrop size={18} color="#2b93a8" />,
              iconBg: "rgba(173,243,243,0.28)",
              label: "água",
              status: `${waterL(todayDetail.waterMl)} de ${waterL(todayDetail.waterGoal)} l`,
              barEl: bar(todayDetail.waterMl, todayDetail.waterGoal, "#2b93a8"),
              done: todayDetail.waterMl >= todayDetail.waterGoal,
            },
            {
              href: "/mente",
              icon: <IconBrain size={18} color="#5a63c4" />,
              iconBg: "rgba(173,183,247,0.24)",
              label: "mente",
              status: todayDetail.mindDone ? "registrado hoje" : "em aberto",
              barEl: bar(todayDetail.mindDone ? 1 : 0, 1, "#5a63c4"),
              done: todayDetail.mindDone,
            },
          ].map((row) => (
            <Link key={row.label} href={row.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "var(--color-surface-elevated)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "14px 16px",
                  boxShadow: "var(--shadow-sm)",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: row.iconBg,
                  }}
                >
                  {row.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: "var(--color-text)" }}>{row.label}</span>
                    <span style={{ fontSize: 12.5, color: row.done ? "#2f9e6b" : "var(--color-text-muted)", fontWeight: 500 }}>
                      {row.status}
                    </span>
                  </div>
                  <div style={{ display: "flex" }}>{row.barEl}</div>
                </div>
                <IconChevronRight size={16} color="var(--color-text-muted)" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── SEMANA: dias + métricas com células ── */}
      {period === "semana" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)" }}>sua semana</span>
              <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>consistência, não perfeição</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {weekCells.map((c) => (
                <div key={c.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
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
                  <span style={{ fontSize: 10, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                    {weekdayShort(c.date)[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10, marginBottom: 16 }}>
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
                <div style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 26, color: m.accent, lineHeight: 1, marginBottom: 8 }}>
                  {pct[m.key]}%
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {weekCells.map((c) => {
                    const v = c.stats ? (m.key === "tre" ? c.stats.tre : c.stats[m.key]) : null;
                    const on = v !== null && v !== undefined && v >= 0.99;
                    return (
                      <div key={c.date} style={{ flex: 1, height: 6, borderRadius: 2, background: on ? m.accent : "var(--color-border)" }} />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── MÊS: calendário de intensidade + métricas ── */}
      {period === "mes" && (
        <>
          <div
            style={{
              background: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: 16,
              boxShadow: "var(--shadow-card)",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{monthLabel}</span>
              <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                <b style={{ color: "var(--color-orange)", fontFamily: "var(--font-data)" }}>{activeDays}</b> de {pastDays} dias com registro
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
              {["s", "t", "q", "q", "s", "s", "d"].map((l, i) => (
                <div key={i} style={{ textAlign: "center", fontSize: 10, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                  {l}
                </div>
              ))}
              {Array.from({ length: monthOffset }).map((_, i) => (
                <div key={`o${i}`} />
              ))}
              {monthCells.map((c) => (
                <div
                  key={c.date}
                  title={c.date}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 8,
                    background: c.level < 0 ? "transparent" : HEAT[c.level],
                    border: c.isToday
                      ? "1.5px solid var(--color-orange)"
                      : c.level < 0
                        ? "1px dashed var(--color-border)"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-data)",
                    fontSize: 10.5,
                    color: c.level >= 2 ? "#fff" : "var(--color-text-muted)",
                  }}
                >
                  {c.day}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5, marginTop: 10 }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--color-text-muted)" }}>menos</span>
              {HEAT.map((c) => (
                <span key={c} style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
              ))}
              <span style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--color-text-muted)" }}>mais</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
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
                  <span style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>{m.label}</span>
                </div>
                <div style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 24, color: m.accent, lineHeight: 1 }}>
                  {pct[m.key]}%
                </div>
                <div style={{ fontSize: 10.5, color: "var(--color-text-muted)", marginTop: 4 }}>média do mês</div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
