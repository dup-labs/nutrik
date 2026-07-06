"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Card, MacroRow } from "@/components/ui";
import { IconChevronRight } from "@/components/ui/icons";
import { addDays, dayNumber, dayOfWeek, monthShort, weekdayShort } from "@/lib/dates";
import { IconChevronLeft } from "@/components/ui/icons";
import type { MealLog, ProtocolMeal } from "@/lib/types";

export function RefeicoesClient({
  meals,
  logs,
  today,
  days: baseDays,
}: {
  meals: ProtocolMeal[];
  logs: MealLog[];
  today: string;
  days: string[];
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const days = baseDays.map((d) => addDays(d, weekOffset * 7));
  const [selected, setSelected] = useState(today);

  function shiftWeek(delta: number) {
    const next = Math.max(-4, Math.min(2, weekOffset + delta));
    if (next === weekOffset) return;
    setWeekOffset(next);
    setSelected(addDays(baseDays[0], next * 7));
    if (next === 0) setSelected(today);
  }

  const weekLabel = `${dayNumber(days[0])}–${dayNumber(days[6])} ${monthShort(days[6])}`;
  const isFuture = selected > today;
  const isPast = selected < today;

  const dayMeals = meals.filter(
    (m) => m.day_of_week === null || m.day_of_week === dayOfWeek(selected),
  );

  const logFor = (mealId: string, date: string) =>
    logs.find((l) => l.protocol_meal_id === mealId && l.date === date);

  return (
    <>
      {/* navegação entre semanas */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button
          onClick={() => shiftWeek(-1)}
          disabled={weekOffset <= -4}
          aria-label="semana anterior"
          style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--color-border)", background: "var(--color-surface-elevated)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--color-text-secondary)", opacity: weekOffset <= -4 ? 0.35 : 1 }}
        >
          <IconChevronLeft size={16} />
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 14 }}>
            semana de {weekLabel}
          </div>
          {weekOffset !== 0 && (
            <button onClick={() => shiftWeek(-weekOffset)} style={{ background: "none", border: "none", padding: 0, fontSize: 11.5, fontWeight: 600, color: "var(--color-orange)", cursor: "pointer" }}>
              voltar pra semana atual
            </button>
          )}
        </div>
        <button
          onClick={() => shiftWeek(1)}
          disabled={weekOffset >= 2}
          aria-label="próxima semana"
          style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--color-border)", background: "var(--color-surface-elevated)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--color-text-secondary)", opacity: weekOffset >= 2 ? 0.35 : 1, transform: "rotate(180deg)" }}
        >
          <IconChevronLeft size={16} />
        </button>
      </div>

      {/* seletor da semana */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {days.map((d) => {
          const sel = d === selected;
          const isToday = d === today;
          const fut = d > today;
          const past = d < today;
          const hasLog = logs.some((l) => l.date === d);
          return (
            <button
              key={d}
              onClick={() => setSelected(d)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: 0,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: sel ? "var(--color-orange)" : "var(--color-text-muted)",
                }}
              >
                {weekdayShort(d)}
              </span>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-data)",
                  fontWeight: 700,
                  fontSize: 14,
                  background: sel
                    ? "var(--color-orange)"
                    : isToday
                      ? "var(--color-orange-subtle)"
                      : "var(--color-surface)",
                  color: sel
                    ? "#fff"
                    : fut
                      ? "var(--color-text-disabled)"
                      : "var(--color-text)",
                  border: sel
                    ? "none"
                    : isToday
                      ? "1px solid var(--color-orange-dim)"
                      : "1px solid var(--color-border)",
                }}
              >
                {dayNumber(d)}
              </div>
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: fut
                    ? "transparent"
                    : past && hasLog
                      ? "#2f9e6b"
                      : sel
                        ? "#fe5f33"
                        : "var(--color-border-strong)",
                }}
              />
            </button>
          );
        })}
      </div>

      <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 12 }}>
        {isFuture
          ? "esse dia ainda não chegou"
          : isPast
            ? "histórico do dia"
            : "refeições de hoje"}
      </div>

      {isFuture ? (
        <Card style={{ padding: "28px 22px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>
            esse dia ainda não chegou.
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 6 }}>
            seu cardápio aparece quando o dia começar.
          </div>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
          {dayMeals.map((meal) => {
            const log = logFor(meal.id, selected);
            const done = log?.status === "done";
            const skipped = log?.status === "skipped";
            return (
              <Link
                key={meal.id}
                href={`/refeicoes/${meal.id}?d=${selected}`}
                style={{ textDecoration: "none" }}
              >
                <Card style={{ cursor: "pointer", opacity: done || skipped ? 0.72 : 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          fontFamily: "var(--font-data)",
                          fontWeight: 700,
                          fontSize: 13,
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {meal.time}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 16,
                          letterSpacing: "-0.02em",
                          color: "var(--color-text)",
                        }}
                      >
                        {meal.name}
                      </span>
                    </div>
                    <Badge
                      variant={done ? "success" : skipped ? "neutral" : "warm"}
                      dot
                    >
                      {done ? "feito" : skipped ? "pulei" : "pendente"}
                    </Badge>
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {meal.description}
                  </div>
                  {meal.kcal != null && (
                    <div style={{ marginTop: 10 }}>
                      <MacroRow
                        kcal={meal.kcal}
                        p={meal.protein_g}
                        c={meal.carbs_g}
                        g={meal.fat_g}
                      />
                    </div>
                  )}
                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-orange)" }}>
                      {done || skipped ? "ver registro" : "registrar"}
                    </span>
                    <IconChevronRight size={18} color="var(--color-orange)" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
