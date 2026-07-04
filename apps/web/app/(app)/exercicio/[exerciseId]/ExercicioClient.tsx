"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackHeader, PrimaryButton } from "@/components/ui";
import { IconCheck, IconPlay } from "@/components/ui/icons";
import { saveSet } from "@/lib/actions";
import type { SetLog, WorkoutExercise } from "@/lib/types";

type SetState = { done: boolean; load: string; noLoad: boolean };

export function ExercicioClient({
  exercise,
  initialLogs,
  date,
}: {
  exercise: WorkoutExercise;
  initialLogs: SetLog[];
  date: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [series, setSeries] = useState<SetState[]>(() =>
    Array.from({ length: exercise.sets }, (_, i) => {
      const log = initialLogs.find((l) => l.set_number === i + 1);
      return {
        done: log?.done ?? false,
        load: log?.load_kg != null ? String(log.load_kg) : "",
        noLoad: log?.no_load ?? false,
      };
    }),
  );

  function patchSet(i: number, patch: Partial<SetState>) {
    setSeries((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));
    const next = { ...series[i], ...patch };
    // persiste a cada interação — sem botão de salvar por série
    saveSet({
      exerciseId: exercise.id,
      date,
      setNumber: i + 1,
      done: next.done,
      loadKg: next.load ? Number(next.load.replace(",", ".")) : null,
      noLoad: next.noLoad,
    });
  }

  async function handleConclude() {
    if (busy) return;
    setBusy(true);
    await Promise.all(
      series.map((se, i) =>
        saveSet({
          exerciseId: exercise.id,
          date,
          setNumber: i + 1,
          done: true,
          loadKg: se.load ? Number(se.load.replace(",", ".")) : null,
          noLoad: se.noLoad,
        }),
      ),
    );
    router.back();
    router.refresh();
  }

  return (
    <div style={{ padding: "24px 20px 40px" }}>
      <BackHeader
        href="/treino"
        title={exercise.name}
        subtitle={exercise.target_muscles ?? undefined}
      />

      {/* vídeo (placeholder até termos biblioteca de vídeos) */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          background: "#15161a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 22,
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "var(--mesh-warm)", opacity: 0.55 }} />
        <div
          style={{
            position: "relative",
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "var(--glass-bg-strong)",
            backdropFilter: "var(--glass-blur)",
            border: "1px solid rgba(255,255,255,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--glass-shadow-lift)",
          }}
        >
          <IconPlay size={22} color="#fe5f33" />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 14,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            textShadow: "0 1px 4px rgba(27,28,29,0.3)",
          }}
        >
          ver como fazer · em breve
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)" }}>
          marque cada série
        </span>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 12, color: "var(--color-text-muted)" }}>
          sugestão: {exercise.reps_label}
          {exercise.suggested_load ? ` · ${exercise.suggested_load}` : ""}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
        {series.map((se, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "10px 12px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <button
              onClick={() => patchSet(i, { done: !se.done })}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: se.done ? "var(--color-orange)" : "transparent",
                border: se.done ? "none" : "2px solid var(--color-border-strong)",
                padding: 0,
              }}
            >
              {se.done && <IconCheck size={15} color="#fff" />}
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, width: 58, flexShrink: 0 }}>
              série {i + 1}
            </span>
            {se.noLoad ? (
              <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "var(--color-text-muted)" }}>
                sem carga
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  value={se.load}
                  onChange={(e) => patchSet(i, { load: e.target.value })}
                  inputMode="decimal"
                  placeholder="carga"
                  style={{
                    width: "100%",
                    minWidth: 0,
                    height: 38,
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border-strong)",
                    background: "var(--color-surface)",
                    padding: "0 12px",
                    fontFamily: "var(--font-data)",
                    fontSize: 14,
                    color: "var(--color-text)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <span style={{ fontFamily: "var(--font-data)", fontSize: 13, color: "var(--color-text-muted)" }}>
                  kg
                </span>
              </div>
            )}
            <button
              onClick={() => patchSet(i, { noLoad: !se.noLoad, load: "" })}
              style={{
                flexShrink: 0,
                height: 38,
                padding: "0 12px",
                borderRadius: "var(--radius-pill)",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid var(--color-border-strong)",
                background: se.noLoad ? "var(--color-orange-subtle)" : "var(--color-surface)",
                color: se.noLoad ? "var(--color-orange)" : "var(--color-text-secondary)",
              }}
            >
              {se.noLoad ? "usar carga" : "sem carga"}
            </button>
          </div>
        ))}
      </div>

      <PrimaryButton disabled={busy} onClick={handleConclude}>
        {busy ? "salvando..." : "concluir exercício"}
      </PrimaryButton>
    </div>
  );
}
