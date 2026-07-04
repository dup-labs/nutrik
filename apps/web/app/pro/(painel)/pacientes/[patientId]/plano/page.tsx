import { notFound } from "next/navigation";
import { getProContext, getProPatients } from "@/lib/pro/queries";
import { PlanoAlimentarClient, type DraftPlan } from "./PlanoAlimentarClient";
import { PlanoTreinoClient, type DraftWeek } from "./PlanoTreinoClient";

export const dynamic = "force-dynamic";

export default async function ProPlanoPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const { supabase, pro } = await getProContext();

  const patients = await getProPatients(supabase, pro.id);
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) notFound();
  const firstName = patient.name.split(" ")[0];

  if (pro.type === "nutri") {
    const [{ data: foods }, { data: protocol }] = await Promise.all([
      supabase.from("foods").select("*").order("name"),
      supabase
        .from("meal_protocols")
        .select("*, meals:protocol_meals(*, items:protocol_meal_items(*))")
        .eq("patient_id", patientId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    // pré-carrega o rascunho a partir do protocolo ativo
    const draft: DraftPlan = {};
    const meals = (protocol?.meals ?? []) as {
      day_of_week: number | null;
      name: string;
      time: string | null;
      sort_order: number;
      items: { food_id: string | null; name: string; qty: number | null; unit: string | null }[];
    }[];
    for (let dow = 0; dow < 7; dow++) {
      const dayMeals = meals
        .filter((m) => m.day_of_week === dow || m.day_of_week === null)
        .sort((a, b) => a.sort_order - b.sort_order);
      draft[dow] = dayMeals.map((m) => ({
        name: m.name,
        time: m.time ?? "",
        foods: m.items
          .filter((i) => i.food_id)
          .map((i) => ({ foodId: i.food_id!, qty: Number(i.qty ?? 1) })),
      }));
    }

    return (
      <PlanoAlimentarClient
        patientId={patientId}
        patientName={firstName}
        foods={(foods ?? []).map((f) => ({
          id: f.id,
          name: f.name,
          unit: f.unit,
          base: Number(f.base_qty),
          p: Number(f.protein_g ?? 0),
          c: Number(f.carbs_g ?? 0),
          g: Number(f.fat_g ?? 0),
          kcal: Number(f.kcal ?? 0),
        }))}
        initialDraft={draft}
        hadProtocol={!!protocol}
      />
    );
  }

  // personal → montador de treino
  const [{ data: protocol }, { data: videos }] = await Promise.all([
    supabase
      .from("training_protocols")
      .select("*, days:workout_days(*, exercises:workout_exercises(*))")
      .eq("patient_id", patientId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("exercise_videos").select("*").order("name"),
  ]);

  const week: DraftWeek = {};
  const days = (protocol?.days ?? []) as {
    day_of_week: number;
    name: string;
    is_rest: boolean;
    exercises: {
      name: string;
      sets: number;
      reps_label: string;
      video_url: string | null;
      set_targets: unknown;
      sort_order: number;
    }[];
  }[];
  for (let dow = 0; dow < 7; dow++) {
    const day = days.find((d) => d.day_of_week === dow);
    week[dow] = day
      ? {
          name: day.is_rest ? "" : day.name,
          rest: day.is_rest,
          exercises: (day.exercises ?? [])
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((e) => ({
              name: e.name,
              reps: e.reps_label,
              videoUrl: e.video_url ?? "",
              series: Array.isArray(e.set_targets)
                ? (e.set_targets as (string | number)[]).map(String)
                : Array.from({ length: e.sets }, () => ""),
            })),
        }
      : { name: "", rest: dow === 0 || dow === 6, exercises: [] };
  }

  return (
    <PlanoTreinoClient
      patientId={patientId}
      patientName={firstName}
      initialWeek={week}
      hadProtocol={!!protocol}
      videos={(videos ?? []).map((v) => ({ id: v.id, name: v.name, url: v.url }))}
    />
  );
}
