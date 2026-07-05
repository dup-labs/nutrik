import { MeshAura } from "@/components/ui";

// Shell de auth em tela cheia: no mobile é a coluna única (o filho manda);
// no desktop vira split — painel de marca à esquerda, conteúdo à direita.
export function AuthSplit({
  variant = "paciente",
  children,
}: {
  variant?: "paciente" | "pro";
  children: React.ReactNode;
}) {
  const headline =
    variant === "pro" ? (
      <>
        o painel de quem <span className="ntrk-grad-text">cuida</span>.
      </>
    ) : (
      <>
        a jornada, <span className="ntrk-grad-text">todo dia</span>.
      </>
    );
  const sub =
    variant === "pro"
      ? "nutri e personal acompanhando o mesmo paciente, lado a lado. planos, evolução e conversa num lugar só."
      : "nutrição, treino e mente no seu ritmo. o que importa é a consistência.";

  return (
    <div className="auth-split">
      <div className="auth-brand">
        <MeshAura
          mesh={variant === "pro" ? "cool" : "warm"}
          size={520}
          blur={60}
          opacity={0.55}
          style={{ top: -120, right: -140 }}
        />
        <MeshAura
          mesh={variant === "pro" ? "mist" : "cool"}
          size={420}
          blur={70}
          opacity={0.4}
          style={{ bottom: -120, left: -140 }}
        />
        <div style={{ position: "relative", maxWidth: 440 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: 52,
              letterSpacing: "-0.03em",
              color: "var(--color-text)",
            }}
          >
            Nūtrk
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: 36,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "var(--color-text)",
            }}
          >
            {headline}
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 17,
              lineHeight: 1.55,
              color: "var(--color-text-secondary)",
              maxWidth: 380,
            }}
          >
            {sub}
          </div>
        </div>
      </div>
      <div className="auth-content">
        <div className="auth-content-inner">{children}</div>
      </div>
    </div>
  );
}
