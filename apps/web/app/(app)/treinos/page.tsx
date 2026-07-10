import { BackHeader, Card } from "@/components/ui";
import { IconDumbbell } from "@/components/ui/icons";
import { addDays, dayOfWeek, localDateISO, weekDays } from "@/lib/dates";
import { getActiveTrainingProtocol, getPatientContext, getWorkoutSessions, requireFeature } from "@/lib/queries";
import { TreinosClient } from "./TreinosClient";

export const dynamic = "force-dynamic";

export default async function TreinosPage() {
  await requireFeature("treino");
  const { supabase, user, links } = await getPatientContext();
  const today = localDateISO();
  const week = weekDays(today);
  const [training, sessions] = await Promise.all([
    getActiveTrainingProtocol(supabase, user.id),
    getWorkoutSessions(supabase, user.id, addDays(week[0], -28), addDays(week[6], 14)),
  ]);
  const personalName = links.find((l) => l.professional_type === "personal")
    ?.professional.short_name;

  return (
    <div style={{ padding: "24px 20px 28px", maxWidth: 960, margin: "0 auto" }}>
      <BackHeader
        href="/treino"
        title="sua semana de treino"
        subtitle={personalName ? `montada pelo ${personalName}, no seu ritmo.` : "montada pra você, no seu ritmo."}
      />
      {training.days.length === 0 ? (
        <Card style={{ padding: "32px 22px", textAlign: "center" }}>
          <div
            style={{
              width: 60,
              height: 60,
              margin: "0 auto",
              borderRadius: "50%",
              background: "var(--mesh-warm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconDumbbell size={26} color="#fff" strokeWidth={1.6} />
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginTop: 14 }}>
            sem treino montado ainda.
          </div>
        </Card>
      ) : (
        <TreinosClient
          days={training.days}
          exercises={training.exercises}
          today={today}
          week={week}
          sessions={sessions.map((s) => ({ date: s.date, dayId: s.workout_day_id, done: !!s.completed_at }))}
        />
      )}
    </div>
  );
}
