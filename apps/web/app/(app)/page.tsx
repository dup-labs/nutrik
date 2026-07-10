import Link from "next/link";
import { Card, InitialAvatar, MeshAura } from "@/components/ui";
import {
  IconBell,
  IconBrain,
  IconChevronRight,
  IconDrop,
  IconDumbbell,
  IconFlame,
  IconFork,
} from "@/components/ui/icons";
import { dayOfWeek, localDateISO, todayLabel } from "@/lib/dates";
import {
  getActiveMealProtocol,
  getActiveTrainingProtocol,
  getActivityDates,
  getBreathOn,
  getMealLogs,
  getMoodOn,
  getPatientContext,
  getSetLogs as _getSetLogs,
  getUnreadNotificationCount,
  getWaterToday,
  getWorkoutSessions,
} from "@/lib/queries";
import { currentStreak } from "@/lib/streak";
import { featureOn, PRO_ACCENT } from "@/lib/types";

export const dynamic = "force-dynamic";

function waterL(n: number) {
  return (n / 1000)
    .toFixed(n % 1000 === 0 ? 0 : n % 100 === 0 ? 1 : 2)
    .replace(".", ",");
}

export default async function HomePage() {
  const { supabase, user, profile, links } = await getPatientContext();
  const today = localDateISO();
  const linked = links.length > 0;

  const [
    { meals },
    mealLogs,
    training,
    sessions,
    water,
    mood,
    breathDone,
    activity,
    unread,
    { data: pendingCheckin },
  ] = await Promise.all([
    getActiveMealProtocol(supabase, user.id),
    getMealLogs(supabase, user.id, today, today),
    getActiveTrainingProtocol(supabase, user.id),
    getWorkoutSessions(supabase, user.id, today, today),
    getWaterToday(supabase, user.id, today),
    getMoodOn(supabase, user.id, today),
    getBreathOn(supabase, user.id, today),
    getActivityDates(supabase, user.id),
    getUnreadNotificationCount(supabase, user.id),
    supabase
      .from("checkin_requests")
      .select("id, professional:professionals(name, short_name, type)")
      .eq("patient_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const streak = currentStreak(activity.map((a) => a.date), today);
  const firstName = (profile?.name ?? "").split(" ")[0];

  // toggles: pilares que o paciente acompanha
  const dietaOn = featureOn(profile, "dieta");
  const treinoOn = featureOn(profile, "treino");
  const aguaOn = featureOn(profile, "agua");
  const meditacaoOn = featureOn(profile, "meditacao");

  // estado do dia
  const todayMeals = meals.filter(
    (m) => m.day_of_week === null || m.day_of_week === dayOfWeek(today),
  );
  const mealsDone = mealLogs.filter((l) => l.status === "done").length;
  const todayWorkout = training.days.find((d) => d.day_of_week === dayOfWeek(today));
  const workoutDone = sessions.some((s) => s.completed_at);
  const waterMet = water.total >= water.goal;
  const mindDone = !!mood || (meditacaoOn && breathDone);

  const waiting = linked && todayMeals.length === 0 && training.days.length === 0;

  const dayMax =
    (dietaOn ? todayMeals.length || 4 : 0) + (treinoOn ? 1 : 0) + (aguaOn ? 1 : 0) + 1;
  const dayScore =
    (dietaOn ? mealsDone : 0) +
    (treinoOn && workoutDone ? 1 : 0) +
    (aguaOn && waterMet ? 1 : 0) +
    (mindDone ? 1 : 0);
  const dayPct = Math.min(100, Math.round((dayScore / dayMax) * 100));

  const nutri = links.find((l) => l.professional_type === "nutri");
  const personal = links.find((l) => l.professional_type === "personal");

  const worlds = [
    {
      on: dietaOn,
      href: "/refeicoes",
      title: "nutrição",
      sub: todayMeals.length === 0 ? "a montar" : `${mealsDone}/${todayMeals.length} hoje`,
      mesh: "warm" as const,
      iconBg: "rgba(254,175,76,0.16)",
      icon: <IconFork size={22} color="#c67518" />,
    },
    {
      on: treinoOn,
      href: "/treino",
      title: "treino",
      sub:
        training.days.length === 0
          ? "a montar"
          : workoutDone
            ? "concluído"
            : todayWorkout?.is_rest
              ? "descanso"
              : (todayWorkout?.name.split("·")[0].trim() ?? "hoje"),
      mesh: "warm" as const,
      iconBg: "var(--color-orange-subtle)",
      icon: <IconDumbbell size={22} color="#fe5f33" />,
    },
    {
      on: aguaOn,
      href: "/agua",
      title: "água",
      sub: `${waterL(water.total)}/${waterL(water.goal)} l`,
      mesh: "mist" as const,
      iconBg: "rgba(173,243,243,0.28)",
      icon: <IconDrop size={22} color="#2b93a8" />,
    },
    {
      on: true, // mente fica: humor não é toggle
      href: "/mente",
      title: "mente",
      sub: mindDone ? "feito hoje" : meditacaoOn ? "respirar · humor" : "humor",
      mesh: "fresh" as const,
      iconBg: "rgba(173,183,247,0.24)",
      icon: <IconBrain size={22} color="#5a63c4" />,
    },
  ].filter((w) => w.on);

  return (
    <div style={{ padding: "24px 20px 28px", maxWidth: 1024, margin: "0 auto" }}>
      {/* saudação */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div>
          <div style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
            {todayLabel(today)}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: 28,
              letterSpacing: "-0.03em",
              marginTop: 2,
            }}
          >
            oi, {firstName}.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {(
            <Link
              href="/notificacoes"
              style={{
                position: "relative",
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface-elevated)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-secondary)",
              }}
            >
              <IconBell size={18} />
              {unread > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 7,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--color-orange)",
                    border: "1.5px solid var(--color-surface-elevated)",
                  }}
                />
              )}
            </Link>
          )}
          <Link
            href="/progresso"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(254,175,76,0.16)",
              border: "1px solid rgba(254,175,76,0.32)",
              borderRadius: "var(--radius-pill)",
              height: 36,
              padding: "0 14px",
              textDecoration: "none",
            }}
          >
            <IconFlame size={16} color="#fe5f33" />
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontWeight: 700,
                fontSize: 15,
                color: "#c67518",
              }}
            >
              {streak}
            </span>
          </Link>
        </div>
      </div>

      {/* check-in solicitado pelo profissional */}
      {pendingCheckin && (
        <Link href={`/progresso/checkin?req=${pendingCheckin.id}`} style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "var(--mesh-warm)",
              borderRadius: "var(--radius-lg)",
              padding: "14px 16px",
              boxShadow: "var(--shadow-card)",
              marginBottom: 16,
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>
                check-in solicitado
              </div>
              <div style={{ fontSize: 13, opacity: 0.95, marginTop: 2 }}>
                {((pendingCheckin.professional as { name?: string } | null)?.name ?? "seu profissional")}{" "}
                quer saber como o corpo tá respondendo. leva 1 minuto.
              </div>
            </div>
            <span
              style={{
                flexShrink: 0,
                height: 34,
                padding: "0 16px",
                borderRadius: "var(--radius-pill)",
                background: "#fff",
                color: "#c67518",
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
              }}
            >
              responder
            </span>
          </div>
        </Link>
      )}

      {/* aguardando protocolo (vinculado + vazio) */}
      {waiting ? (
        <Card style={{ padding: "28px 22px", textAlign: "center", marginBottom: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto",
              borderRadius: "50%",
              background: "var(--mesh-cool)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </svg>
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 19,
              letterSpacing: "-0.02em",
              marginTop: 16,
            }}
          >
            seu plano está a caminho.
          </div>
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.5,
              color: "var(--color-text-secondary)",
              marginTop: 8,
              maxWidth: 250,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {nutri?.professional.name ?? "seu profissional"} está montando seu
            protocolo. a gente te avisa assim que estiver pronto.
          </div>
        </Card>
      ) : (
        <Link href="/dia" style={{ textDecoration: "none" }}>
          <Card style={{ padding: 20, marginBottom: 16, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)" }}>
                seu dia
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontFamily: "var(--font-data)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--color-orange)",
                  }}
                >
                  {dayPct}%
                </span>
                <IconChevronRight size={16} color="var(--color-text-muted)" />
              </div>
            </div>
            <div
              style={{
                marginTop: 12,
                height: 10,
                borderRadius: 99,
                background: "var(--color-orange-subtle)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 99,
                  background: "linear-gradient(90deg,#fe5f33,#feaf4c)",
                  width: `${dayPct}%`,
                  transition: "width .5s var(--ease-out)",
                }}
              />
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: "var(--color-text-muted)" }}>
              {dayPct >= 100 ? "dia completo. que ritmo." : "você tá indo bem. falta pouco."}
            </div>
          </Card>
        </Link>
      )}

      {/* os 4 mundos */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 12 }}>
        {worlds.map((w) => (
          <Link key={w.href} href={w.href} style={{ textDecoration: "none" }}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                background: "var(--color-surface-elevated)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: 16,
                boxShadow: "var(--shadow-card)",
                minHeight: 132,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <MeshAura mesh={w.mesh} size={90} blur={18} opacity={0.5} style={{ top: -30, right: -30 }} />
              <div
                style={{
                  position: "relative",
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  background: w.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {w.icon}
              </div>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 16,
                    letterSpacing: "-0.02em",
                    color: "var(--color-text)",
                  }}
                >
                  {w.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
                  {w.sub}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* avisos dos profissionais */}
      {linked && (nutri || personal) && (
        <Card style={{ marginTop: 16 }}>
          {nutri && (
            <Link
              href={`/chat/${nutri.professional_id}`}
              style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}
            >
              <InitialAvatar
                initial={nutri.professional.name.replace("Dra. ", "").replace("Dr. ", "")[0]}
                mesh={PRO_ACCENT.nutri.mesh}
                size={40}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)" }}>
                  {nutri.professional.name}{" "}
                  <span style={{ fontWeight: 500, color: "var(--color-text-muted)" }}>· nutri</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 1 }}>
                  qualquer dúvida do plano, chama aqui.
                </div>
              </div>
              <IconChevronRight size={18} color="var(--color-text-muted)" />
            </Link>
          )}
          {nutri && personal && (
            <div style={{ height: 1, background: "var(--color-border)", margin: "14px 0" }} />
          )}
          {nutri && !personal && (
            <>
              <div style={{ height: 1, background: "var(--color-border)", margin: "14px 0" }} />
              <Link href="/perfil/vincular" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px dashed var(--color-border-strong)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", fontSize: 20 }}>+</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)" }}>adicionar seu personal</div>
                  <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 1 }}>tem um código? treino e nutrição juntos.</div>
                </div>
                <IconChevronRight size={18} color="var(--color-text-muted)" />
              </Link>
            </>
          )}
          {personal && !nutri && (
            <>
              {personal && <div style={{ height: 1, background: "var(--color-border)", margin: "14px 0" }} />}
              <Link href="/perfil/vincular" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px dashed var(--color-border-strong)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", fontSize: 20 }}>+</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)" }}>adicionar seu nutri</div>
                  <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 1 }}>tem um código? nutrição e treino juntos.</div>
                </div>
                <IconChevronRight size={18} color="var(--color-text-muted)" />
              </Link>
            </>
          )}
          {personal && (
            <Link
              href={`/chat/${personal.professional_id}`}
              style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}
            >
              <InitialAvatar
                initial={personal.professional.name[0]}
                mesh={PRO_ACCENT.personal.mesh}
                size={40}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)" }}>
                  {personal.professional.name}{" "}
                  <span style={{ fontWeight: 500, color: "var(--color-text-muted)" }}>· personal</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 1 }}>
                  fala com ele sobre o treino de hoje.
                </div>
              </div>
              <IconChevronRight size={18} color="var(--color-text-muted)" />
            </Link>
          )}
        </Card>
      )}
    </div>
  );
}
