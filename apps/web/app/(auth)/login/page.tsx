"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MeshAura, PrimaryButton, BackHeader } from "@/components/ui";
import {
  ErrorNote,
  FieldLabel,
  GoogleButton,
  OrDivider,
  TextInput,
} from "@/components/auth/fields";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    if (!email || !password) return;
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("email ou senha não conferem. tenta de novo?");
      setBusy(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="auth-screen" style={{ position: "relative", padding: "56px 24px 32px", minHeight: "100dvh" }}>
      <MeshAura mesh="warm" size={220} blur={30} opacity={0.5} style={{ top: -30, right: -50 }} />
      <div style={{ position: "relative" }}>
        <BackHeader href="/entrada" title="bom te ver de novo." subtitle="entra pra continuar sua jornada." />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <ErrorNote>{error}</ErrorNote>

          <FieldLabel>seu email</FieldLabel>
          <TextInput
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: 18 }}
          />

          <FieldLabel>sua senha</FieldLabel>
          <TextInput
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <div style={{ textAlign: "right", marginBottom: 24 }}>
            <Link
              href="/recuperar"
              style={{ fontSize: 13, color: "var(--color-text-muted)", textDecoration: "none" }}
            >
              esqueci minha senha
            </Link>
          </div>

          <PrimaryButton type="submit" disabled={busy || !email || !password}>
            {busy ? "entrando..." : "entrar"}
          </PrimaryButton>
        </form>

        <OrDivider />
        <GoogleButton label="entrar com Google" />

        <div style={{ textAlign: "center", fontSize: 14, color: "var(--color-text-secondary)", marginTop: 24 }}>
          ainda não tem conta?{" "}
          <Link href="/cadastro" style={{ color: "var(--color-orange)", fontWeight: 600, textDecoration: "none" }}>
            criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}
