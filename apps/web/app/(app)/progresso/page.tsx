import Link from "next/link";
import { BackHeader, Card, MeshAura, StreakRing } from "@/components/ui";
import {
  IconBrain,
  IconCalendar,
  IconCheck,
  IconClipboardCheck,
  IconDrop,
  IconDumbbell,
  IconFlame,
  IconGrid,
  IconMoon,
} from "@/components/ui/icons";
import { addDays, dayOfWeek, localDateISO, weekDays } from "@/lib/dates";
import {
  getActiveMealProtocol,
  getActiveTrainingProtocol,
  getMealLogs,
  getPatientContext,
  getActivityDates,
  getWorkoutSessions,
} from "@/lib/queries";
import { bestStreak, currentStreak, weeksTracked } from "@/lib/streak";
import { ProgressoClient } from "./ProgressoClient";

export const dynamic = "force-dynamic";

export default async function ProgressoPage() {
  const { supabase, user } = await getPatientContext();
  const today = localDateISO();
  const days = weekDays(today);
  const monthStart = addDays(today, -29);

  const [
    activity,
    { meals },
    mealLogs,
    training,
    sessions,
    { data: waterLogs },
    { data: moodLogs },
    { data: sleepLogs },
    { data: breaths },
    { data: waterSetting },
    { data: allAchievements },
    { data: unlockedRows },
  ] = await Promise.all([
    getActivityDates(supabase, user.id),
    getActiveMealProtocol(supabase, user.id),
    getMealLogs(supabase, user.id, monthStart, today),
    getActiveTrainingProtocol(supabase, user.id),
    getWorkoutSessions(supabase, user.id, monthStart, today),
    supabase.from("water_logs").select("date, amount_ml").eq("patient_id", user.id).gte("date", monthStart),
    supabase.from("mood_logs").select("date").eq("patient_id", user.id).gte("date", monthStart),
    supabase.from("sleep_logs").select("date").eq("patient_id", user.id).gte("date", monthStart),
    supabase.from("breath_sessions").select("completed_at").eq("patient_id", user.id).gte("completed_at", `${monthStart}T00:00:00`),
    supabase.from("water_settings").select("daily_goal_ml").eq("patient_id", user.id).maybeSingle(),
    supabase.from("achievements").select("*"),
    supabase.from("patient_achievements").select("achievement_key").eq("patient_id", user.id),
  ]);

  const activityDates = activity.map((a) => a.date);
  const streak = currentStreak(activityDates, today);
  const best = Math.max(bestStreak(activityDates), streak);
  const weeks = weeksTracked(activityDates);

  // ── métricas por dia (últimos 30 dias) ──
  const goal = waterSetting?.daily_goal_ml ?? 2000;
  const waterByDay = new Map<string, number>();
  for (const w of waterLogs ?? [])
    waterByDay.set(w.date, (waterByDay.get(w.date) ?? 0) + w.amount_ml);
  const mindDays = new Set<string>([
    ...(moodLogs ?? []).map((m) => m.date),
    ...(sleepLogs ?? []).map((s) => s.date),
    ...(breaths ?? []).map((b) => String(b.completed_at).slice(0, 10)),
  ]);
  const workoutDays = new Set(
    sessions.filter((s) => s.completed_at).map((s) => s.date),
  );
  const restDows = new Set(
    training.days.filter((d) => d.is_rest).map((d) => d.day_of_week),
  );
  const mealDoneByDay = new Map<string, number>();
  for (const l of mealLogs.filter((l) => l.status === "done"))
    mealDoneByDay.set(l.date, (mealDoneByDay.get(l.date) ?? 0) + 1);
  const mealsPerDay = meals.filter((m) => m.day_of_week === null).length || 4;

  function dayStats(d: string) {
    const isRest = restDows.has(dayOfWeek(d));
    return {
      nut: Math.min(1, (mealDoneByDay.get(d) ?? 0) / mealsPerDay),
      tre: isRest ? null : workoutDays.has(d) ? 1 : 0,
      agu: Math.min(1, (waterByDay.get(d) ?? 0) / goal),
      men: mindDays.has(d) ? 1 : 0,
    };
  }

  function periodPct(dates: string[]) {
    const stats = dates.map(dayStats);
    const avg = (vals: (number | null)[]) => {
      const v = vals.filter((x): x is number => x !== null);
      return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 100) : 0;
    };
    return {
      nut: avg(stats.map((s) => s.nut)),
      tre: avg(stats.map((s) => s.tre)),
      agu: avg(stats.map((s) => s.agu)),
      men: avg(stats.map((s) => s.men)),
    };
  }

  const pastWeekDays = days.filter((d) => d <= today);
  const monthDates = Array.from({ length: 30 }, (_, i) => addDays(monthStart, i)).filter(
    (d) => d <= today,
  );

  const perPct = {
    dia: periodPct([today]),
    semana: periodPct(pastWeekDays),
    mes: periodPct(monthDates),
  };

  const weekCells = days.map((d) => ({
    date: d,
    future: d > today,
    isToday: d === today,
    stats: d <= today ? dayStats(d) : null,
    active: activityDates.includes(d),
  }));

  // conquistas: união do que está no banco com condições computadas
  const unlocked = new Set((unlockedRows ?? []).map((r) => r.achievement_key));
  if (streak >= 7) unlocked.add("streak_7");
  if (streak >= 30) unlocked.add("streak_30");

  const ICONS: Record<string, React.ReactNode> = {
    flame: <IconFlame size={22} />,
    brain: <IconBrain size={22} />,
    droplet: <IconDrop size={22} />,
    calendar: <IconCalendar size={22} />,
    dumbbell: <IconDumbbell size={22} />,
    check: <IconCheck size={22} />,
  };

  return (
    <div style={{ padding: "24px 20px 28px" }}>
      <BackHeader href="/" title="sua consistência" />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          margin: "12px 0 24px",
        }}
      >
        <div style={{ position: "relative" }}>
          <MeshAura mesh="warm" size={212} blur={28} opacity={0.45} style={{ inset: -16 }} />
          <div style={{ position: "relative" }}>
            <StreakRing days={streak} max={30} size={180} />
          </div>
        </div>
        <div
          style={{
            fontSize: 14,
            color: "var(--color-text-secondary)",
            textAlign: "center",
            maxWidth: 250,
            marginTop: 8,
          }}
        >
          {streak === 0
            ? "hoje é um ótimo dia pra começar. um registro já conta."
            : `${streak} ${streak === 1 ? "dia" : "dias"} cuidando de você. o resultado vem no embalo.`}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <Card style={{ flex: 1, padding: 16, borderRadius: "var(--radius-md)" }}>
          <div style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 26, lineHeight: 1 }}>
            {best}
            <span style={{ fontSize: 14, color: "var(--color-text-muted)", marginLeft: 4 }}>dias</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 6 }}>
            melhor ofensiva
          </div>
        </Card>
        <Card style={{ flex: 1, padding: 16, borderRadius: "var(--radius-md)" }}>
          <div style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 26, lineHeight: 1, color: "#c67518" }}>
            {weeks}
            <span style={{ fontSize: 14, color: "var(--color-text-muted)", marginLeft: 4 }}>sem</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 6 }}>
            registrando
          </div>
        </Card>
      </div>

      <ProgressoClient perPct={perPct} weekCells={weekCells} />

      <div style={{ display: "flex", gap: 10, margin: "0 0 24px" }}>
        <Link href="/progresso/evolucao" style={{ flex: 1, textDecoration: "none" }}>
          <div
            style={{
              height: 48,
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--color-border-strong)",
              background: "var(--color-surface-elevated)",
              color: "var(--color-text)",
              fontWeight: 600,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
          >
            <IconGrid size={16} color="#c67518" /> evolução
          </div>
        </Link>
        <Link href="/progresso/checkin" style={{ flex: 1, textDecoration: "none" }}>
          <div
            style={{
              height: 48,
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--color-border-strong)",
              background: "var(--color-surface-elevated)",
              color: "var(--color-text)",
              fontWeight: 600,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
          >
            <IconClipboardCheck size={16} color="#fe5f33" /> check-in
          </div>
        </Link>
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 12 }}>
        conquistas
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {(allAchievements ?? []).map((a) => {
          const on = unlocked.has(a.key);
          return (
            <div
              key={a.key}
              style={{
                background: "var(--color-surface-elevated)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "14px 8px",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                textAlign: "center",
                opacity: on ? 1 : 0.42,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: on ? "rgba(254,175,76,0.18)" : "var(--color-surface)",
                  color: on ? "#c67518" : "var(--color-text-disabled)",
                }}
              >
                {ICONS[a.icon ?? "check"] ?? ICONS.check}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.25,
                }}
              >
                {a.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
