import Link from "next/link";
import { MeshAura } from "@/components/ui";
import { IconBolt, IconChevronRight, IconLink } from "@/components/ui/icons";

export default function EntradaPage() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MeshAura mesh="warm" size={280} blur={30} opacity={0.6} style={{ top: -40, right: -60 }} />
      <MeshAura mesh="cool" size={220} blur={34} opacity={0.45} style={{ top: 180, left: -80 }} />

      <div
        style={{
          position: "relative",
          padding: "64px 28px 0",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: 40,
            letterSpacing: "-0.03em",
            color: "var(--color-text)",
          }}
        >
          Nūtrk
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: 26,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "var(--color-text)",
            maxWidth: 280,
          }}
        >
          a jornada, <span className="ntrk-grad-text">todo dia</span>.
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 15,
            lineHeight: 1.5,
            color: "var(--color-text-secondary)",
            maxWidth: 270,
          }}
        >
          nutrição, treino e mente no seu ritmo. o que importa é a consistência.
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            paddingBottom: 40,
          }}
        >
          <Link href="/cadastro?convite=1" style={{ textDecoration: "none" }}>
            <div
              style={{
                cursor: "pointer",
                background: "var(--color-surface-elevated)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: 20,
                boxShadow: "var(--shadow-card)",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "var(--radius-md)",
                  background: "var(--mesh-cool)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconLink size={24} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 17,
                    letterSpacing: "-0.02em",
                    color: "var(--color-text)",
                  }}
                >
                  tenho um código
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
                  seu nutri ou personal te convidou
                </div>
              </div>
              <IconChevronRight size={20} color="var(--color-text-muted)" />
            </div>
          </Link>

          <Link href="/cadastro" style={{ textDecoration: "none" }}>
            <div
              style={{
                cursor: "pointer",
                background: "var(--color-surface-elevated)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: 20,
                boxShadow: "var(--shadow-card)",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "var(--radius-md)",
                  background: "var(--mesh-warm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconBolt size={24} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 17,
                    letterSpacing: "-0.02em",
                    color: "var(--color-text)",
                  }}
                >
                  começar sozinho
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
                  um plano base já pra hoje
                </div>
              </div>
              <IconChevronRight size={20} color="var(--color-text-muted)" />
            </div>
          </Link>

          <div style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-muted)", marginTop: 4 }}>
            dá pra vincular um profissional depois.
          </div>
          <div style={{ textAlign: "center", fontSize: 14, color: "var(--color-text-secondary)" }}>
            já tem conta?{" "}
            <Link href="/login" style={{ color: "var(--color-orange)", fontWeight: 600, textDecoration: "none" }}>
              entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
