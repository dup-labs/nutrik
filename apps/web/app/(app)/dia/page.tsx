import Link from "next/link";
import { BackHeader } from "@/components/ui";
import {
  IconBrain,
  IconCircle,
  IconCircleCheck,
  IconDrop,
  IconDumbbell,
  IconFork,
} from "@/components/ui/icons";
import { dayOfWeek, localDateISO } from "@/lib/dates";
import {
  getActiveMealProtocol,
  getActiveTrainingProtocol,
  getBreathOn,
  getMealLogs,
  getMoodOn,
  getPatientContext,
  getWaterToday,
  getWorkoutSessions,
} from "@/lib/queries";
import { featureOn } from "@/lib/types";

export const dynamic = "force-dynamic";

function waterL(n: number) {
  return (n / 1000)
    .toFixed(n % 1000 === 0 ? 0 : n % 100 === 0 ? 1 : 2)
    .replace(".", ",");
}

export default async function DiaPage() {
  const { supabase, user, profile } = await getPatientContext();
  const today = localDateISO();

  const [{ meals }, mealLogs, training, sessions, water, mood, breathDone] =
    await Promise.all([
      getActiveMealProtocol(supabase, user.id),
      getMealLogs(supabase, user.id, today, today),
      getActiveTrainingProtocol(supabase, user.id),
      getWorkoutSessions(supabase, user.id, today, today),
      getWaterToday(supabase, user.id, today),
      getMoodOn(supabase, user.id, today),
      getBreathOn(supabase, user.id, today),
    ]);

  const todayMeals = meals.filter(
    (m) => m.day_of_week === null || m.day_of_week === dayOfWeek(today),
  );
  const mealsDone = mealLogs.filter((l) => l.status === "done").length;
  const todayWorkout = training.days.find((d) => d.day_of_week === dayOfWeek(today));
  const isRest = todayWorkout?.is_rest ?? false;
  const workoutDone = sessions.some((s) => s.completed_at) || isRest;
  const waterMet = water.total >= water.goal;
  const mindDone = !!mood || (featureOn(profile, "meditacao") && breathDone);

  const items = [
    {
      key: "ref",
      on: featureOn(profile, "dieta"),
      label: "refeições",
      icon: <IconFork size={18} color="#c67518" />,
      iconBg: "rgba(254,175,76,0.16)",
      complete: todayMeals.length > 0 && mealsDone >= Math.max(1, todayMeals.length - 1),
      status: `${mealsDone} de ${todayMeals.length || 4} registradas`,
    },
    {
      key: "tre",
      on: featureOn(profile, "treino"),
      label: "treino",
      icon: <IconDumbbell size={18} color="#fe5f33" />,
      iconBg: "var(--color-orange-subtle)",
      complete: workoutDone,
      status: isRest ? "dia de descanso" : workoutDone ? "concluído" : "em aberto",
    },
    {
      key: "agu",
      on: featureOn(profile, "agua"),
      label: "água",
      icon: <IconDrop size={18} color="#2b93a8" />,
      iconBg: "rgba(173,243,243,0.28)",
      complete: waterMet,
      status: `${waterL(water.total)} de ${waterL(water.goal)} l`,
    },
    {
      key: "men",
      on: true, // humor não é toggle — mente sempre conta
      label: "mente",
      icon: <IconBrain size={18} color="#5a63c4" />,
      iconBg: "rgba(173,183,247,0.24)",
      complete: mindDone,
      status: mindDone ? "registrado" : "em aberto",
    },
  ].filter((i) => i.on);

  const completeCount = items.filter((i) => i.complete).length;
  const allDone = completeCount === items.length;

  return (
    <div style={{ padding: "24px 20px 28px", maxWidth: 680, margin: "0 auto" }}>
      <BackHeader href="/" title="seu dia" />

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {items.map((d) => (
          <div
            key={d.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: 15,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: d.iconBg,
              }}
            >
              {d.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{d.label}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{d.status}</div>
            </div>
            {d.complete ? (
              <IconCircleCheck size={22} color="#2f9e6b" />
            ) : (
              <IconCircle size={22} color="var(--color-text-disabled)" />
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "var(--radius-lg)",
          padding: 22,
          background: "var(--mesh-warm)",
          boxShadow: "var(--shadow-card)",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 20, letterSpacing: "-0.02em" }}>
          {allDone ? "dia redondo." : `${completeCount} de ${items.length} fechados.`}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5, marginTop: 8, opacity: 0.95 }}>
          {allDone
            ? "consistência é isso: aparecer todo dia. amanhã tem mais."
            : "não precisa ser perfeito. o que você fez já conta."}
        </div>
      </div>

      <Link href="/progresso" style={{ textDecoration: "none" }}>
        <div
          style={{
            marginTop: 16,
            width: "100%",
            height: 52,
            borderRadius: "var(--radius-pill)",
            background: "var(--color-orange)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(254,95,51,0.24)",
          }}
        >
          ver meu progresso
        </div>
      </Link>
    </div>
  );
}
