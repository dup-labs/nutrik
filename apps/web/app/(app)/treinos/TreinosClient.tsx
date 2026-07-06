"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, MeshAura, Tag } from "@/components/ui";
import { IconCheck, IconChevronLeft, IconPlayOutline } from "@/components/ui/icons";
import { addDays, dayNumber, dayOfWeek, monthShort } from "@/lib/dates";
import type { WorkoutDay, WorkoutExercise } from "@/lib/types";

const DOW_LABEL = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
// exibição seg→dom
const ORDER = [1, 2, 3, 4, 5, 6, 0];

export function TreinosClient({
  days,
  exercises,
  today,
  week: baseWeek,
  sessions,
}: {
  days: WorkoutDay[];
  exercises: WorkoutExercise[];
  today: string;
  week: string[];
  sessions: { date: string; dayId: string; done: boolean }[];
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const week = baseWeek.map((d) => addDays(d, weekOffset * 7));
  const todayDow = dayOfWeek(today);
  const [selDow, setSelDow] = useState(todayDow);

  const selDay = days.find((d) => d.day_of_week === selDow);
  const selExercises = selDay
    ? exercises.filter((e) => e.workout_day_id === selDay.id)
    : [];
  const dateFor = (dow: number) => week[ORDER.indexOf(dow)];
  const selDate = dateFor(selDow);
  const selDone = sessions.some(
    (s) => s.date === selDate && s.dayId === selDay?.id && s.done,
  );

  function shiftWeek(delta: number) {
    setWeekOffset((o) => Math.max(-4, Math.min(2, o + delta)));
  }
  const weekLabel = `${dayNumber(week[0])}–${dayNumber(week[6])} ${monthShort(week[6])}`;

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
            <button
              onClick={() => setWeekOffset(0)}
              style={{ background: "none", border: "none", padding: 0, fontSize: 11.5, fontWeight: 600, color: "var(--color-orange)", cursor: "pointer" }}
            >
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

      <div
        className="ntrk-scroll"
        style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 2 }}
      >
        {ORDER.map((dow) => {
          const day = days.find((d) => d.day_of_week === dow);
          const date = dateFor(dow);
          const sel = selDow === dow;
          const isToday = date === today;
          const done = sessions.some((s) => s.date === date && s.dayId === day?.id && s.done);
          return (
            <button
              key={dow}
              onClick={() => setSelDow(dow)}
              style={{
                flexShrink: 0,
                minWidth: 52,
                padding: "8px 6px",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                textAlign: "center",
                position: "relative",
                background: sel ? "var(--color-orange-subtle)" : "var(--color-surface)",
                border: sel
                  ? "1.5px solid var(--color-orange-dim)"
                  : isToday
                    ? "1px solid var(--color-orange-dim)"
                    : "1px solid var(--color-border)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: 12,
                  textTransform: "uppercase",
                  color: sel
                    ? "var(--color-orange)"
                    : day?.is_rest
                      ? "var(--color-text-disabled)"
                      : isToday
                        ? "var(--color-orange)"
                        : "var(--color-text-secondary)",
                }}
              >
                {DOW_LABEL[dow]}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-data)",
                  fontWeight: 700,
                  fontSize: 14,
                  marginTop: 2,
                  color: sel ? "var(--color-orange)" : "var(--color-text)",
                }}
              >
                {dayNumber(date)}
              </div>
              {done && (
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#2f9e6b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconCheck size={9} color="#fff" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!selDay || selDay.is_rest ? (
        <Card style={{ padding: "36px 22px", textAlign: "center" }}>
          <div
            style={{
              width: 60,
              height: 60,
              margin: "0 auto",
              borderRadius: "50%",
              background: "var(--mesh-fresh)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
            </svg>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, marginTop: 16 }}>
            dia de descanso.
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 6, lineHeight: 1.5 }}>
            descanso também é treino. o corpo se constrói na pausa.
          </div>
        </Card>
      ) : (
        <>
          <Card style={{ position: "relative", overflow: "hidden", padding: 18, marginBottom: 12 }}>
            <MeshAura mesh="warm" size={120} blur={24} opacity={0.5} style={{ top: -40, right: -30 }} />
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: 20,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {selDay.name}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {selDay.tags.map((t) => (
                    <Tag key={t} variant="warm">
                      {t}
                    </Tag>
                  ))}
                  {selDone && <Tag>concluído nesse dia ✓</Tag>}
                </div>
              </div>
              {selDate === today && (
                <div
                  style={{
                    height: 28,
                    padding: "0 12px",
                    borderRadius: "var(--radius-pill)",
                    background: "var(--color-orange)",
                    color: "#fff",
                    fontFamily: "var(--font-data)",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  hoje
                </div>
              )}
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 }}>
            {selExercises.map((ex) => (
              <Link key={ex.id} href={`/exercicio/${ex.id}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "var(--color-surface-elevated)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    padding: 14,
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--color-orange-dim)",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "var(--color-text)" }}>
                      {ex.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-data)",
                        fontSize: 13,
                        color: "var(--color-text-muted)",
                        marginTop: 2,
                      }}
                    >
                      {ex.sets} séries · {ex.reps_label}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--color-text-muted)" }}>
                    <IconPlayOutline size={16} />
                    <span style={{ fontSize: 12, fontWeight: 500 }}>vídeo</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
