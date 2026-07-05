"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PrimaryButton } from "@/components/ui";
import { IconCheck, IconPlayOutline } from "@/components/ui/icons";
import { concludeWorkout } from "@/lib/actions";
import type { SetLog, WorkoutExercise } from "@/lib/types";

export function TreinoClient({
  workoutDayId,
  exercises,
  setLogs,
  date,
  concluded,
}: {
  workoutDayId: string;
  exercises: WorkoutExercise[];
  setLogs: SetLog[];
  date: string;
  concluded: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [isDone, setIsDone] = useState(concluded);

  const exerciseDone = (ex: WorkoutExercise) => {
    const logs = setLogs.filter((l) => l.exercise_id === ex.id && l.done);
    return isDone || logs.length >= ex.sets;
  };
  const doneCount = exercises.filter(exerciseDone).length;

  async function handleConclude() {
    if (busy || isDone) return;
    setBusy(true);
    await concludeWorkout({ workoutDayId, date });
    setIsDone(true);
    setBusy(false);
    router.refresh();
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          fontFamily: "var(--font-data)",
          fontWeight: 700,
          fontSize: 15,
          color: "var(--color-orange)",
          marginBottom: 10,
        }}
      >
        {doneCount}/{exercises.length}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 }}>
        {exercises.map((ex) => {
          const done = exerciseDone(ex);
          return (
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
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: done ? "var(--color-orange)" : "transparent",
                    border: done ? "none" : "2px solid var(--color-border-strong)",
                  }}
                >
                  {done && <IconCheck size={15} color="#fff" />}
                </div>
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
                    {ex.suggested_load ? ` · ${ex.suggested_load}` : ""}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    color: "var(--color-text-muted)",
                  }}
                >
                  <IconPlayOutline size={16} />
                  <span style={{ fontSize: 12, fontWeight: 500 }}>vídeo</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <PrimaryButton
        disabled={busy || isDone}
        onClick={handleConclude}
        style={{ marginTop: 16, opacity: isDone ? 0.7 : 1 }}
      >
        {isDone ? "treino concluído" : busy ? "salvando..." : "concluir treino"}
      </PrimaryButton>
    </>
  );
}
