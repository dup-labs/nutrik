import Link from "next/link";
import { Card, InitialAvatar, StreakRing } from "@/components/ui";
import {
  IconBell,
  IconCalendar,
  IconChat,
  IconChevronRight,
  IconGear,
  IconLink,
} from "@/components/ui/icons";
import { localDateISO, monthShort } from "@/lib/dates";
import {
  getActivityDates,
  getPatientContext,
  getUnreadNotificationCount,
} from "@/lib/queries";
import { currentStreak } from "@/lib/streak";
import { PRO_ACCENT } from "@/lib/types";
import { SignOutButton } from "./SignOutButton";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const { supabase, user, profile, links } = await getPatientContext();
  const [activity, unread] = await Promise.all([
    getActivityDates(supabase, user.id),
    getUnreadNotificationCount(supabase, user.id),
  ]);
  const streak = currentStreak(activity.map((a) => a.date), localDateISO());

  const since = profile
    ? `${monthShort(String(user.created_at).slice(0, 10))} ${String(user.created_at).slice(0, 4)}`
    : "";

  const rows = [
    { href: "/consultas", label: "consultas e agenda", icon: <IconCalendar size={20} color="var(--color-text-secondary)" /> },
    { href: "/notificacoes", label: "notificações", icon: <IconBell size={20} color="var(--color-text-secondary)" />, badge: unread },
    { href: "/perfil/vincular", label: "vincular profissional", icon: <IconLink size={20} color="var(--color-text-secondary)" /> },
    { href: "/perfil/configuracoes", label: "configurações", icon: <IconGear size={20} color="var(--color-text-secondary)" /> },
  ];

  return (
    <div style={{ padding: "24px 20px 28px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "var(--mesh-warm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: 30,
            color: "#fff",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {(profile?.name ?? "?")[0]?.toUpperCase()}
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em" }}>
            {profile?.name}
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
            na Nūtrk desde {since}
          </div>
        </div>
        <StreakRing days={streak} max={30} size={96} label="dias" />
      </div>

      {links.length > 0 && (
        <>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 12 }}>
            quem cuida de você
          </div>
          <Card style={{ padding: 6, marginBottom: 16 }}>
            {links.map((l, i) => {
              const acc = PRO_ACCENT[l.professional_type];
              return (
                <div key={l.id}>
                  {i > 0 && (
                    <div style={{ height: 1, background: "var(--color-border)", margin: "0 12px" }} />
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
                    <Link
                      href={`/perfil/pro/${l.professional_id}`}
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <InitialAvatar
                        initial={l.professional.name.replace(/^Dra?\. /, "")[0]}
                        mesh={acc.mesh}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 15, color: "var(--color-text)" }}>
                          {l.professional.name}
                        </div>
                        <div style={{ fontSize: 12, color: acc.accent }}>{acc.role}</div>
                      </div>
                    </Link>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        height: 24,
                        padding: "0 10px",
                        borderRadius: "var(--radius-pill)",
                        background: acc.soft,
                        fontSize: 11,
                        color: acc.accent,
                      }}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: acc.accent }} />
                      ativo
                    </span>
                    <Link
                      href={`/chat/${l.professional_id}`}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        border: "1px solid var(--color-border-strong)",
                        background: "var(--color-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: acc.accent,
                      }}
                    >
                      <IconChat size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </Card>
        </>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {rows.map((r) => (
          <Link key={r.href} href={r.href} style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "var(--color-surface-elevated)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "14px 16px",
                boxShadow: "var(--shadow-sm)",
                cursor: "pointer",
              }}
            >
              {r.icon}
              <span style={{ flex: 1, fontWeight: 500, fontSize: 15, color: "var(--color-text)" }}>
                {r.label}
              </span>
              {r.badge ? (
                <span
                  style={{
                    minWidth: 20,
                    height: 20,
                    padding: "0 6px",
                    borderRadius: 99,
                    background: "var(--color-orange)",
                    color: "#fff",
                    fontFamily: "var(--font-data)",
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {r.badge}
                </span>
              ) : null}
              <IconChevronRight size={18} color="var(--color-text-muted)" />
            </div>
          </Link>
        ))}
      </div>

      <SignOutButton />
    </div>
  );
}
