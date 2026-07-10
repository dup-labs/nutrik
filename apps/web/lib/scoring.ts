// Pontuação diária do ranking de turmas: 1 ponto por pilar macro batido no
// dia (dieta completa, treino feito, meta de água, meditação, sono). Pilar
// desligado nos toggles do paciente não pontua. Amigos só enxergam esta
// tabela agregada (daily_scores) — nunca os logs crus.

import { dayOfWeek } from "@/lib/dates";
import type { createClient } from "@/lib/supabase/server";
import { featureOn, type Profile } from "@/lib/types";

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** recalcula e grava o placar do dia do paciente */
export async function syncDailyScore(supabase: Supabase, patientId: string, date: string) {
  try {
    const [
      { data: profile },
      { data: protocol },
      { data: sessions },
      { data: waterSetting },
      { data: waterLogs },
      { count: breaths },
      { data: sleep },
    ] = await Promise.all([
      supabase.from("profiles").select("features").eq("id", patientId).maybeSingle(),
      supabase
        .from("meal_protocols")
        .select("id")
        .eq("patient_id", patientId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("workout_sessions")
        .select("completed_at")
        .eq("patient_id", patientId)
        .eq("date", date),
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
      supabase
        .from("breath_sessions")
        .select("id", { count: "exact", head: true })
        .eq("patient_id", patientId)
        .gte("completed_at", `${date}T00:00:00`)
        .lte("completed_at", `${date}T23:59:59`),
      supabase
        .from("sleep_logs")
        .select("id")
        .eq("patient_id", patientId)
        .eq("date", date)
        .maybeSingle(),
    ]);

    const p = (profile ?? null) as Pick<Profile, "features"> | null;

    // dieta batida = todas as refeições do protocolo do dia com log "done"
    let dieta = false;
    if (protocol) {
      const { data: meals } = await supabase
        .from("protocol_meals")
        .select("id, day_of_week")
        .eq("protocol_id", protocol.id);
      const todayMeals = (meals ?? []).filter(
        (m) => m.day_of_week === null || m.day_of_week === dayOfWeek(date),
      );
      if (todayMeals.length > 0) {
        const { data: logs } = await supabase
          .from("meal_logs")
          .select("protocol_meal_id")
          .eq("patient_id", patientId)
          .eq("date", date)
          .eq("status", "done");
        const done = new Set((logs ?? []).map((l) => l.protocol_meal_id));
        dieta = todayMeals.every((m) => done.has(m.id));
      }
    }

    const waterTotal = (waterLogs ?? []).reduce((s, l) => s + l.amount_ml, 0);

    const score = {
      dieta: featureOn(p, "dieta") && dieta,
      treino: featureOn(p, "treino") && (sessions ?? []).some((s) => s.completed_at),
      agua: featureOn(p, "agua") && waterTotal >= (waterSetting?.daily_goal_ml ?? 2000),
      meditacao: featureOn(p, "meditacao") && (breaths ?? 0) > 0,
      sono: featureOn(p, "sono") && !!sleep,
    };
    const total = Object.values(score).filter(Boolean).length;

    await supabase.from("daily_scores").upsert(
      { patient_id: patientId, date, ...score, total, updated_at: new Date().toISOString() },
      { onConflict: "patient_id,date" },
    );
  } catch {
    // pontuação nunca pode derrubar a ação principal (ex.: tabela ainda não migrada)
  }
}
