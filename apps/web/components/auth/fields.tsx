"use client";

import { createClient } from "@/lib/supabase/client";

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

export function GoogleButton({
  label = "continuar com Google",
  flow,
}: {
  label?: string;
  flow?: "pro";
}) {
  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback${flow ? `?flow=${flow}` : ""}`,
      },
    });
  }
  return (
    <button
      type="button"
      onClick={signInWithGoogle}
      style={{
        width: "100%",
        height: 52,
        borderRadius: "var(--radius-pill)",
        border: "1px solid var(--color-border-strong)",
        background: "var(--color-surface-elevated)",
        color: "var(--color-text)",
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
      </svg>
      {label}
    </button>
  );
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
