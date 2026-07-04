import { notFound } from "next/navigation";
import { addDays, dayOfWeek, localDateISO } from "@/lib/dates";
import { PRO_COPY } from "@/lib/pro/copy";
import { getProContext, getProPatients } from "@/lib/pro/queries";
import { PacienteDetailClient } from "./PacienteDetailClient";

export const dynamic = "force-dynamic";

export default async function ProPacientePage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const { supabase, pro } = await getProContext();

  const patients = await getProPatients(supabase, pro.id);
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) notFound();

  const today = localDateISO();
  const from28 = addDays(today, -27);
  const from14 = addDays(today, -13);
  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));

  const [
    { data: details },
    { data: anamnese },
    { data: partnerLinks },
    { data: notes },
    { data: mealProtocol },
    { data: mealLogs },
    { data: waterLogs },
    { data: waterSetting },
    { data: sleepLogs },
    { data: breaths },
    { data: moodLogs },
    { data: checkins },
    { data: sessions },
    { data: setLogs },
  ] = await Promise.all([
    supabase.from("patient_details").select("*").eq("patient_id", patientId).maybeSingle(),
    supabase.from("anamneses").select("*").eq("patient_id", patientId).order("submitted_at", { ascending: false }).limit(1).maybeSingle(),
    supabase
      .from("patient_professional_links")
      .select("professional:professionals(id, name, short_name, type)")
      .eq("patient_id", patientId)
      .eq("status", "active")
      .neq("professional_id", pro.id),
    supabase
      .from("internal_notes")
      .select("*, author:professionals(id, name, short_name, type)")
      .eq("patient_id", patientId)
      .order("created_at"),
    supabase
      .from("meal_protocols")
      .select("*, meals:protocol_meals(*)")
      .eq("patient_id", patientId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("meal_logs").select("*").eq("patient_id", patientId).gte("date", from28),
    supabase.from("water_logs").select("date, amount_ml").eq("patient_id", patientId).gte("date", week[0]),
    supabase.from("water_settings").select("daily_goal_ml").eq("patient_id", patientId).maybeSingle(),
    supabase.from("sleep_logs").select("*").eq("patient_id", patientId).gte("date", from14).order("date"),
    supabase
      .from("breath_sessions")
      .select("completed_at, kind, duration_s")
      .eq("patient_id", patientId)
      .gte("completed_at", `${addDays(today, -29)}T00:00:00`),
    supabase.from("mood_logs").select("*").eq("patient_id", patientId).gte("date", from14).order("date"),
    supabase
      .from("wellbeing_checkins")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase.from("workout_sessions").select("date, completed_at").eq("patient_id", patientId).gte("date", from28),
    supabase
      .from("set_logs")
      .select("date, load_kg, exercise:workout_exercises(id, name)")
      .eq("patient_id", patientId)
      .not("load_kg", "is", null)
      .gte("date", addDays(today, -55))
      .order("date"),
  ]);

  // aderência por refeição (últimos 28 dias)
  const meals = (mealProtocol?.meals ?? []) as {
    id: string;
    name: string;
    time: string | null;
    day_of_week: number | null;
    sort_order: number;
  }[];
  const everyDayMeals = meals
    .filter((m) => m.day_of_week === null)
    .sort((a, b) => a.sort_order - b.sort_order);
  const mealAdherence = everyDayMeals.map((m) => {
    const done = (mealLogs ?? []).filter(
      (l) => l.protocol_meal_id === m.id && l.status === "done",
    ).length;
    return { name: m.name, time: m.time, done, total: 28, pct: Math.round((done / 28) * 100) };
  });

  // água na semana
  const goal = waterSetting?.daily_goal_ml ?? 2000;
  const waterWeek = week.map((d) => {
    const total = (waterLogs ?? [])
      .filter((w) => w.date === d)
      .reduce((s, w) => s + w.amount_ml, 0);
    return { date: d, ml: total, met: total >= goal };
  });

  // treino: sessões por semana (4 semanas) + carga por exercício
  const trainWeeks = [3, 2, 1, 0].map((back) => {
    const start = addDays(today, -(back * 7 + dayOfWeek(today) === 0 ? 6 : dayOfWeek(today) - 1) - back * 0);
    return start;
  });
  const sessionsByWeek = [3, 2, 1, 0].map((back) => {
    const end = addDays(today, -7 * back);
    const start = addDays(end, -6);
    const count = (sessions ?? []).filter(
      (s) => s.completed_at && s.date >= start && s.date <= end,
    ).length;
    return { label: back === 0 ? "essa sem" : `sem -${back}`, count };
  });
  void trainWeeks;

  const loadByExercise = new Map<string, { name: string; points: { date: string; load: number }[] }>();
  for (const s of setLogs ?? []) {
    const ex = s.exercise as unknown as { id: string; name: string } | null;
    if (!ex || s.load_kg == null) continue;
    const entry = loadByExercise.get(ex.id) ?? { name: ex.name, points: [] };
    entry.points.push({ date: s.date, load: Number(s.load_kg) });
    loadByExercise.set(ex.id, entry);
  }
  const loadSeries = [...loadByExercise.values()]
    .map((e) => {
      // maior carga por dia
      const byDay = new Map<string, number>();
      for (const p of e.points) byDay.set(p.date, Math.max(byDay.get(p.date) ?? 0, p.load));
      const pts = [...byDay.entries()].sort().map(([date, load]) => ({ date, load }));
      return { name: e.name, points: pts, first: pts[0]?.load ?? 0, last: pts[pts.length - 1]?.load ?? 0 };
    })
    .filter((e) => e.points.length >= 2)
    .sort((a, b) => b.last - a.last)
    .slice(0, 4);

  const partner = (partnerLinks ?? [])[0]?.professional as unknown as {
    id: string;
    name: string;
    short_name: string | null;
    type: "nutri" | "personal";
  } | null;

  return (
    <PacienteDetailClient
      proType={pro.type}
      copy={PRO_COPY[pro.type]}
      patient={patient}
      details={details ?? null}
      anamnese={anamnese ?? null}
      partner={partner ?? null}
      notes={(notes ?? []).map((n) => ({
        id: n.id,
        body: n.body,
        createdAt: n.created_at,
        mine: (n.author as { id?: string } | null)?.id === pro.id,
        author:
          (n.author as { short_name?: string; name?: string } | null)?.short_name ??
          (n.author as { name?: string } | null)?.name ??
          "profissional",
        authorType: ((n.author as { type?: string } | null)?.type ?? "nutri") as "nutri" | "personal",
      }))}
      evolution={{
        mealAdherence,
        waterWeek,
        goal,
        sleep: (sleepLogs ?? []).map((s) => ({ date: s.date, hours: Number(s.hours), quality: s.quality })),
        breathCount: (breaths ?? []).length,
        moods: (moodLogs ?? []).map((m) => ({ date: m.date, mood: m.mood })),
        checkins: (checkins ?? []).map((c) => ({
          at: c.created_at,
          body: c.body_feeling,
          energy: c.energy,
          clothes: c.clothes_fit,
        })),
        sessionsByWeek,
        loadSeries,
      }}
    />
  );
}
