import type { ReactNode } from "react";
import { BackButton } from "@/components/ui/BackButton";

/**
 * Casca das páginas legais públicas (/privacidade e /termos).
 * Server component; só a seta de voltar é client. Tokens vêm de globals.css.
 */
export function LegalPage({
  title,
  version,
  children,
}: {
  title: string;
  version: string;
  children: ReactNode;
}) {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--gradient-canvas)",
        padding:
          "max(32px, env(safe-area-inset-top)) 20px max(48px, env(safe-area-inset-bottom))",
      }}
    >
      <article
        style={{
          maxWidth: 680,
          margin: "0 auto",
          fontSize: 15,
          lineHeight: 1.65,
          color: "var(--color-text-secondary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BackButton />
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: "-0.03em",
              color: "var(--color-text)",
            }}
          >
            nūtrk
          </div>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: 32,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "var(--color-text)",
            margin: "20px 0 8px",
          }}
        >
          {title}
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-muted)" }}>
          versão de {version}
        </p>
        <div
          style={{
            marginTop: 20,
            padding: "12px 14px",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-orange-subtle)",
            border: "1px solid var(--color-orange-dim)",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          minuta em revisão jurídica. os trechos entre colchetes [ASSIM] ainda
          serão preenchidos com os dados da empresa.
        </div>
        <div
          style={{
            marginTop: 24,
            padding: "8px 22px 24px",
            borderRadius: "var(--radius-xl)",
            background: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {children}
        </div>
        <p
          style={{
            marginTop: 24,
            fontSize: 13,
            color: "var(--color-text-muted)",
            textAlign: "center",
          }}
        >
          dúvidas? app@nutrk.io
        </p>
      </article>
    </main>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 19,
        letterSpacing: "-0.02em",
        color: "var(--color-text)",
        margin: "28px 0 8px",
      }}
    >
      {children}
    </h2>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p style={{ margin: "0 0 12px" }}>{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return <li style={{ marginBottom: 6 }}>{children}</li>;
}

export function B({ children }: { children: ReactNode }) {
  return <strong style={{ color: "var(--color-text)", fontWeight: 600 }}>{children}</strong>;
}
