import Link from "next/link";
import { MeshAura } from "@/components/ui";
import { IconChevronRight, IconGrid, IconUser } from "@/components/ui/icons";

export default function ProEntradaPage() {
  return (
    <div className="auth-outer">
      <div className="auth-inner auth-screen" style={{ minHeight: "100dvh" }}>
      <MeshAura mesh="cool" size={280} blur={30} opacity={0.55} style={{ top: -40, right: -60 }} />
      <MeshAura mesh="mist" size={220} blur={34} opacity={0.4} style={{ top: 200, left: -80 }} />

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
            maxWidth: 300,
          }}
        >
          o painel de quem <span className="ntrk-grad-text">cuida</span>.
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 15,
            lineHeight: 1.5,
            color: "var(--color-text-secondary)",
            maxWidth: 290,
          }}
        >
          nutri e personal acompanhando o mesmo paciente, lado a lado. planos,
          evolução e conversa num lugar só.
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
          <Link href="/login" style={{ textDecoration: "none" }}>
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
                <IconGrid size={24} color="#fff" />
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
                  já tenho painel
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
                  entrar com minha conta
                </div>
              </div>
              <IconChevronRight size={20} color="var(--color-text-muted)" />
            </div>
          </Link>

          <Link href="/pro/cadastro" style={{ textDecoration: "none" }}>
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
                <IconUser size={24} color="#fff" />
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
                  criar meu painel
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
                  sou nutricionista ou personal
                </div>
              </div>
              <IconChevronRight size={20} color="var(--color-text-muted)" />
            </div>
          </Link>

          <div style={{ textAlign: "center", fontSize: 14, color: "var(--color-text-secondary)", marginTop: 4 }}>
            é paciente?{" "}
            <Link href="/entrada" style={{ color: "var(--color-orange)", fontWeight: 600, textDecoration: "none" }}>
              entrar no app
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}