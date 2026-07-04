"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, MeshAura, Tag } from "@/components/ui";
import { IconPlayOutline } from "@/components/ui/icons";
import type { WorkoutDay, WorkoutExercise } from "@/lib/types";

const DOW_LABEL = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
// exibição seg→dom
const ORDER = [1, 2, 3, 4, 5, 6, 0];

export function TreinosClient({
  days,
  exercises,
  todayDow,
}: {
  days: WorkoutDay[];
  exercises: WorkoutExercise[];
  todayDow: number;
}) {
  const [selDow, setSelDow] = useState(todayDow);
  const selDay = days.find((d) => d.day_of_week === selDow);
  const selExercises = selDay
    ? exercises.filter((e) => e.workout_day_id === selDay.id)
    : [];

  return (
    <>
      <div
        className="ntrk-scroll"
        style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 2 }}
      >
        {ORDER.map((dow) => {
          const day = days.find((d) => d.day_of_week === dow);
          const sel = selDow === dow;
          const isToday = todayDow === dow;
          return (
            <button
              key={dow}
              onClick={() => setSelDow(dow)}
              style={{
                flexShrink: 0,
                minWidth: 48,
                padding: "10px 6px",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                textAlign: "center",
                background: sel ? "var(--color-orange-subtle)" : "var(--color-surface)",
                border: sel
                  ? "1.5px solid var(--color-orange-dim)"
                  : isToday
                    ? "1px solid var(--color-orange-dim)"
                    : "1px solid var(--color-border)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: 13,
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
              </span>
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
                </div>
              </div>
              {selDow === todayDow && (
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

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
