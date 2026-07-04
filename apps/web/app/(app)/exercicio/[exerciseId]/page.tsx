import { notFound } from "next/navigation";
import { localDateISO } from "@/lib/dates";
import { getPatientContext, getSetLogs } from "@/lib/queries";
import type { WorkoutExercise } from "@/lib/types";
import { ExercicioClient } from "./ExercicioClient";

export const dynamic = "force-dynamic";

export default async function ExercicioPage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const { supabase, user } = await getPatientContext();
  const today = localDateISO();

  const { data: exercise } = await supabase
    .from("workout_exercises")
    .select("*")
    .eq("id", exerciseId)
    .maybeSingle();
  if (!exercise) notFound();

  const setLogs = (await getSetLogs(supabase, user.id, today)).filter(
    (l) => l.exercise_id === exerciseId,
  );

  return (
    <ExercicioClient
      exercise={exercise as WorkoutExercise}
      initialLogs={setLogs}
      date={today}
    />
  );
}
