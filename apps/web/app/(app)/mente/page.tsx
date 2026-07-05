import Link from "next/link";
import { BackHeader, Card, MeshAura } from "@/components/ui";
import { IconChevronRight, IconMoon, IconPlay } from "@/components/ui/icons";
import { MOOD_DEFS, IconFace } from "@/components/ui/icons";
import { localDateISO } from "@/lib/dates";
import { getMoodOn, getPatientContext } from "@/lib/queries";

export const dynamic = "force-dynamic";

const PRESETS = [
  { key: "box", name: "box breathing", duration: "2 min", goal: "foco e calma", mesh: "var(--mesh-cool)" },
  { key: "pausa", name: "pausa de 1 min", duration: "1 min", goal: "respiro rápido", mesh: "var(--mesh-fresh)" },
];

export default async function MentePage() {
  const { supabase, user } = await getPatientContext();
  const mood = await getMoodOn(supabase, user.id, localDateISO());
  const moodDef = mood ? MOOD_DEFS.find((m) => m.key === mood.mood) : null;

  return (
    <div style={{ padding: "24px 20px 28px", maxWidth: 960, margin: "0 auto" }}>
      <BackHeader href="/" title="mente" subtitle="uma pausa também é treino." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12, marginBottom: 22 }}>
        <Link href="/mente/humor" style={{ textDecoration: "none" }}>
          <Card
            style={{
              position: "relative",
              overflow: "hidden",
              padding: 18,
              display: "flex",
              alignItems: "center",
              gap: 14,
              cursor: "pointer",
            }}
          >
            <MeshAura mesh="fresh" size={100} blur={22} opacity={0.45} style={{ top: -30, left: -20 }} />
            <div
              style={{
                position: "relative",
                width: 48,
                height: 48,
                borderRadius: "var(--radius-md)",
                background: "rgba(173,183,247,0.24)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "#5a63c4",
              }}
            >
              <IconFace mouth="M8 14s1.5 2 4 2 4-2 4-2" size={24} color="#5a63c4" />
            </div>
            <div style={{ position: "relative", flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 17,
                  letterSpacing: "-0.02em",
                  color: "var(--color-text)",
                }}
              >
                registrar humor
              </div>
              <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
                {moodDef ? `hoje: ${moodDef.label}` : "como você tá agora?"}
              </div>
            </div>
            <IconChevronRight size={20} color="var(--color-text-muted)" />
          </Card>
        </Link>

        <Link href="/mente/sono" style={{ textDecoration: "none" }}>
          <Card
            style={{
              position: "relative",
              overflow: "hidden",
              padding: 18,
              display: "flex",
              alignItems: "center",
              gap: 14,
              cursor: "pointer",
            }}
          >
            <MeshAura mesh="cool" size={100} blur={22} opacity={0.4} style={{ top: -30, left: -20 }} />
            <div
              style={{
                position: "relative",
                width: 48,
                height: 48,
                borderRadius: "var(--radius-md)",
                background: "rgba(173,183,247,0.24)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "#5a63c4",
              }}
            >
              <IconMoon size={24} color="#5a63c4" strokeWidth={1.6} />
            </div>
            <div style={{ position: "relative", flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 17,
                  letterSpacing: "-0.02em",
                  color: "var(--color-text)",
                }}
              >
                registrar sono
              </div>
              <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
                como foi sua noite?
              </div>
            </div>
            <IconChevronRight size={20} color="var(--color-text-muted)" />
          </Card>
        </Link>
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 12 }}>
        respirar
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
        {PRESETS.map((p) => (
          <Link key={p.key} href={`/mente/respirar?tipo=${p.key}`} style={{ textDecoration: "none" }}>
            <div
              style={{
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                borderRadius: "var(--radius-lg)",
                padding: 20,
                boxShadow: "var(--shadow-card)",
                background: p.mesh,
                minHeight: 96,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: "-0.02em",
                    color: "#fff",
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "var(--glass-bg-tint)",
                    backdropFilter: "var(--glass-blur)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconPlay size={18} color="#fff" />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "rgba(255,255,255,0.92)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <span>{p.duration}</span>
                <span style={{ opacity: 0.6 }}>·</span>
                <span>{p.goal}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
