import Link from "next/link";
import { BackHeader, Card, MeshAura, Tag } from "@/components/ui";
import { IconCalendar, IconDumbbell, IconSwap } from "@/components/ui/icons";
import { dayOfWeek, localDateISO } from "@/lib/dates";
import {
  getActiveTrainingProtocol,
  getPatientContext,
  getSetLogs,
  getWorkoutSessions,
} from "@/lib/queries";
import { TreinoClient } from "./TreinoClient";

export const dynamic = "force-dynamic";

export default async function TreinoPage() {
  const { supabase, user, links } = await getPatientContext();
  const today = localDateISO();

  const [training, setLogs, sessions] = await Promise.all([
    getActiveTrainingProtocol(supabase, user.id),
    getSetLogs(supabase, user.id, today),
    getWorkoutSessions(supabase, user.id, today, today),
  ]);

  const linked = links.length > 0;
  const personalName =
    links.find((l) => l.professional_type === "personal")?.professional
      .short_name;

  const todayDay = training.days.find((d) => d.day_of_week === dayOfWeek(today));
  const exercises = todayDay
    ? training.exercises.filter((e) => e.workout_day_id === todayDay.id)
    : [];
  const concluded = sessions.some(
    (s) => s.workout_day_id === todayDay?.id && s.completed_at,
  );

  return (
    <div style={{ padding: "24px 20px 28px" }}>
      <BackHeader
        href="/"
        title="treino de hoje"
        subtitle="movimento como prazer, não obrigação."
      />

      {!todayDay ? (
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
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 6, lineHeight: 1.5 }}>
            {linked
              ? `${personalName ?? "seu personal"} ainda não publicou seu treino.`
              : "seu treino base solo está sendo gerado."}
          </div>
        </Card>
      ) : todayDay.is_rest ? (
        <>
          <Card style={{ padding: "36px 22px", textAlign: "center" }}>
            <div
              style={{
                width: 60,
                height: 60,
                margin: "0 auto",
                borderRadius: "50%",
                background: "var(--mesh-fresh)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
              </svg>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, marginTop: 16 }}>
              dia de descanso.
            </div>
            <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 6, lineHeight: 1.5 }}>
              descanso também é treino. o corpo se constrói na pausa.
            </div>
          </Card>
          <Link
            href="/treinos"
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-text-secondary)",
              textDecoration: "none",
            }}
          >
            <IconCalendar size={15} /> ver a semana toda
          </Link>
        </>
      ) : (
        <>
          <Card style={{ position: "relative", overflow: "hidden", padding: 18, marginBottom: 14 }}>
            <MeshAura mesh="warm" size={120} blur={24} opacity={0.5} style={{ top: -40, right: -30 }} />
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: 20,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {todayDay.name}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  {todayDay.est_minutes && <Tag variant="warm">~{todayDay.est_minutes} min</Tag>}
                  <Tag>{exercises.length} exercícios</Tag>
                </div>
              </div>
            </div>
          </Card>

          <TreinoClient
            workoutDayId={todayDay.id}
            exercises={exercises}
            setLogs={setLogs}
            date={today}
            concluded={concluded}
          />

          <Link
            href="/treinos"
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-text-secondary)",
              textDecoration: "none",
            }}
          >
            <IconCalendar size={15} /> ver a semana toda
          </Link>

          {linked && (
            <Link
              href={`/treino/trocar?dia=${todayDay.id}`}
              style={{
                marginTop: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-orange)",
                textDecoration: "none",
              }}
            >
              <IconSwap size={15} /> pedir troca de treino pro personal
            </Link>
          )}
        </>
      )}
    </div>
  );
}
