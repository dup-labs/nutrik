"use client";

import { useState } from "react";
import { startOAuth, type OAuthProvider } from "@/lib/auth/oauth";

export function FieldLabel({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div
      style={{
        fontSize: 14,
        fontWeight: 600,
        color: "var(--color-text-secondary)",
        marginBottom: 8,
      }}
    >
      {children}{" "}
      {optional && (
        <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>
          opcional
        </span>
      )}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        boxSizing: "border-box",
        height: 52,
        padding: "0 16px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border-strong)",
        background: "var(--color-surface-elevated)",
        fontSize: 16,
        color: "var(--color-text)",
        outline: "none",
        ...props.style,
      }}
    />
  );
}

export function ErrorNote({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div
      style={{
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.22)",
        borderRadius: "var(--radius-md)",
        padding: "12px 14px",
        fontSize: 14,
        color: "#ef4444",
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

type SocialProps = {
  /** "pro": o callback manda pra /pro/cadastro quando a conta não tem papel */
  flow?: "pro";
  /** verbo do botão do Google ("continuar com Google", "entrar com Google") */
  googleLabel?: string;
};

const socialButtonBase: React.CSSProperties = {
  width: "100%",
  height: 52,
  borderRadius: "var(--radius-pill)",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
};

/**
 * Botões de login social — Apple + Google, sempre juntos.
 * A Apple exige paridade no iOS (guideline 4.8): onde há Google, há Apple,
 * com o mesmo tamanho e destaque. Por isso não existe um sem o outro.
 */
export function SocialButtons({ flow, googleLabel = "continuar com Google" }: SocialProps) {
  const [busy, setBusy] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState("");

  async function go(provider: OAuthProvider) {
    if (busy) return;
    setBusy(provider);
    setError("");
    const res = await startOAuth(provider, { flow });
    if (res.error) setError(res.error);
    // web: a página já está saindo. nativo: o Browser abriu por cima; se a
    // pessoa fechar sem logar, o botão precisa voltar a funcionar.
    setBusy(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <ErrorNote>{error}</ErrorNote>
      {APPLE_SIGNIN_ENABLED && (
        <AppleSignInButton onClick={() => go("apple")} disabled={busy !== null} />
      )}
      <button
        type="button"
        onClick={() => go("google")}
        disabled={busy !== null}
        style={{
          ...socialButtonBase,
          border: "1px solid var(--color-border-strong)",
          background: "var(--color-surface-elevated)",
          color: "var(--color-text)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
        </svg>
        {googleLabel}
      </button>
    </div>
  );
}

/**
 * Botão "Continuar com a Apple" no estilo preto das Human Interface
 * Guidelines: fundo preto, logo e texto brancos, logo à esquerda do texto,
 * mesma altura e largura do botão do Google. O título segue a localização
 * oficial da Apple em pt-BR ("Continuar com a Apple") — por isso não está em
 * minúsculas como o resto da UI.
 */
// Sign in with Apple só aparece depois de configurado no Supabase (precisa da
// conta Apple Developer — ver docs/mobile/auth-setup.md). Ligar na Vercel com
// NEXT_PUBLIC_APPLE_SIGNIN=1. Obrigatório antes de publicar na App Store,
// porque o app oferece login com Google (guideline 4.8).
const APPLE_SIGNIN_ENABLED = process.env.NEXT_PUBLIC_APPLE_SIGNIN === "1";

export function AppleSignInButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        ...socialButtonBase,
        border: "1px solid #000",
        background: "#000",
        color: "#fff",
        // SF no iOS/macOS; o resto cai na fonte do sistema
        fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        fontSize: 17,
      }}
    >
      <svg width="16" height="19" viewBox="0 0 814 1000" aria-hidden="true" fill="#fff">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
      </svg>
      Continuar com a Apple
    </button>
  );
}

/**
 * @deprecated use <SocialButtons />. Mantido porque /pro/cadastro ainda
 * importa este nome — e ele já renderiza Apple + Google, pra que a paridade
 * exigida pela Apple valha em todas as telas sem depender de cada página.
 */
export function GoogleButton({
  label = "continuar com Google",
  flow,
}: {
  label?: string;
  flow?: "pro";
}) {
  return <SocialButtons googleLabel={label} flow={flow} />;
}

export function OrDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
      <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
      <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>ou</span>
      <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
    </div>
  );
}
