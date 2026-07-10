import { cache } from "react";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { featureOn, type FeatureKey } from "@/lib/types";
import type {
  Appointment,
  MealLog,
  MealProtocol,
  MoodLog,
  Professional,
  ProfessionalLink,
  Profile,
  ProtocolMeal,
  SetLog,
  SleepLog,
  TrainingProtocol,
  WorkoutDay,
  WorkoutExercise,
  WorkoutSession,
} from "@/lib/types";

export const getSession = cache(async () => {
  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect("/entrada");
  return { supabase, user };
});

/** perfil + vínculos — o "contexto" de todas as telas logadas (1x por request) */
export const getPatientContext = cache(async () => {
  const { supabase, user } = await getSession();
  const [{ data: profile }, { data: links }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("patient_professional_links")
      .select("*, professional:professionals(*)")
      .eq("patient_id", user.id)
      .eq("status", "active"),
  ]);
  return {
    supabase,
    user,
    profile: profile as Profile | null,
    links: (links ?? []) as (ProfessionalLink & { professional: Professional })[],
  };
});

/** guard de rota: pilar desligado nos toggles → volta pra home */
export async function requireFeature(key: FeatureKey) {
  const { profile } = await getPatientContext();
  if (!featureOn(profile, key)) redirect("/");
}

export async function getActiveMealProtocol(supabase: Awaited<ReturnType<typeof createClient>>, patientId: string) {
  const { data: protocol } = await supabase
    .from("meal_protocols")
    .select("*")
    .eq("patient_id", patientId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!protocol) return { protocol: null, meals: [] as ProtocolMeal[] };

  const { data: meals } = await supabase
    .from("protocol_meals")
    .select("*")
    .eq("protocol_id", protocol.id)
    .order("sort_order");
  return { protocol: protocol as MealProtocol, meals: (meals ?? []) as ProtocolMeal[] };
}

export async function getMealLogs(
  supabase: Awaited<ReturnType<typeof createClient>>,
  patientId: string,
  from: string,
  to: string,
) {
  const { data } = await supabase
    .from("meal_logs")
    .select("*")
    .eq("patient_id", patientId)
    .gte("date", from)
    .lte("date", to);
  return (data ?? []) as MealLog[];
}

export async function getActiveTrainingProtocol(
  supabase: Awaited<ReturnType<typeof createClient>>,
  patientId: string,
) {
  const { data: protocol } = await supabase
    .from("training_protocols")
    .select("*")
    .eq("patient_id", patientId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!protocol)
    return {
      protocol: null,
      days: [] as WorkoutDay[],
      exercises: [] as WorkoutExercise[],
    };

  const { data: days } = await supabase
    .from("workout_days")
    .select("*")
    .eq("protocol_id", protocol.id)
    .order("day_of_week");
  const dayIds = (days ?? []).map((d) => d.id);
  const { data: exercises } = dayIds.length
    ? await supabase
        .from("workout_exercises")
        .select("*")
        .in("workout_day_id", dayIds)
        .order("sort_order")
    : { data: [] };
  return {
    protocol: protocol as TrainingProtocol,
    days: (days ?? []) as WorkoutDay[],
    exercises: (exercises ?? []) as WorkoutExercise[],
  };
}

export async function getSetLogs(
  supabase: Awaited<ReturnType<typeof createClient>>,
  patientId: string,
  date: string,
) {
  const { data } = await supabase
    .from("set_logs")
    .select("*")
    .eq("patient_id", patientId)
    .eq("date", date);
  return (data ?? []) as SetLog[];
}

export async function getWorkoutSessions(
  supabase: Awaited<ReturnType<typeof createClient>>,
  patientId: string,
  from: string,
  to: string,
) {
  const { data } = await supabase
    .from("workout_sessions")
    .select("*")
    .eq("patient_id", patientId)
    .gte("date", from)
    .lte("date", to);
  return (data ?? []) as WorkoutSession[];
}

export async function getWaterToday(
  supabase: Awaited<ReturnType<typeof createClient>>,
  patientId: string,
  date: string,
) {
  const [{ data: setting }, { data: logs }] = await Promise.all([
    supabase
      .from("water_settings")
      .select("daily_goal_ml")
      .eq("patient_id", patientId)
      .maybeSingle(),
    supabase
      .from("water_logs")
      .select("amount_ml")
      .eq("patient_id", patientId)
      .eq("date", date),
  ]);
  return {
    goal: setting?.daily_goal_ml ?? 2000,
    total: (logs ?? []).reduce((s, l) => s + l.amount_ml, 0),
  };
}

export async function getMoodOn(
  supabase: Awaited<ReturnType<typeof createClient>>,
  patientId: string,
  date: string,
) {
  const { data } = await supabase
    .from("mood_logs")
    .select("*")
    .eq("patient_id", patientId)
    .eq("date", date)
    .maybeSingle();
  return data as MoodLog | null;
}

export async function getSleepOn(
  supabase: Awaited<ReturnType<typeof createClient>>,
  patientId: string,
  date: string,
) {
  const { data } = await supabase
    .from("sleep_logs")
    .select("*")
    .eq("patient_id", patientId)
    .eq("date", date)
    .maybeSingle();
  return data as SleepLog | null;
}

export async function getBreathOn(
  supabase: Awaited<ReturnType<typeof createClient>>,
  patientId: string,
  date: string,
) {
  const { count } = await supabase
    .from("breath_sessions")
    .select("id", { count: "exact", head: true })
    .eq("patient_id", patientId)
    .gte("completed_at", `${date}T00:00:00`)
    .lte("completed_at", `${date}T23:59:59`);
  return (count ?? 0) > 0;
}

export async function getActivityDates(
  supabase: Awaited<ReturnType<typeof createClient>>,
  patientId: string,
) {
  const { data } = await supabase
    .from("daily_activity")
    .select("date, entries")
    .eq("patient_id", patientId);
  return (data ?? []) as { date: string; entries: number }[];
}

export async function getAppointments(
  supabase: Awaited<ReturnType<typeof createClient>>,
  patientId: string,
) {
  const { data } = await supabase
    .from("appointments")
    .select("*, professional:professionals(*)")
    .eq("patient_id", patientId)
    .in("status", ["requested", "confirmed"])
    .order("scheduled_at");
  return (data ?? []) as (Appointment & { professional: Professional })[];
}

export async function getUnreadNotificationCount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  patientId: string,
) {
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("patient_id", patientId)
    .is("read_at", null);
  return count ?? 0;
}
