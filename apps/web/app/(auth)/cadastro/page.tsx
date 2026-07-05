"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { BackHeader, MeshAura, PrimaryButton } from "@/components/ui";
import {
  ErrorNote,
  FieldLabel,
  GoogleButton,
  OrDivider,
  TextInput,
} from "@/components/auth/fields";
import { createClient } from "@/lib/supabase/client";
import { completeCadastro } from "@/lib/actions";

const OBJETIVOS = [
  "me sentir melhor",
  "mais energia",
  "movimento e força",
  "rotina mais leve",
];

function CadastroForm() {
  const router = useRouter();
  const params = useSearchParams();
  const showCodeFirst = params.get("convite") === "1";
  // fluxo Google: usuário já autenticado, falta perfil
  const completing = params.get("completar") === "1";

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [objetivo, setObjetivo] = useState("me sentir melhor");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const canSubmit = completing
    ? nome.trim().length >= 2
    : nome.trim().length >= 2 && email.includes("@") && password.length >= 6;

  async function handleSubmit() {
    if (!canSubmit || busy) return;
    setBusy(true);
    setError("");
    const supabase = createClient();

    if (!completing) {
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // o papel viaja nos metadados e sobrevive ao email de confirmação
          data: {
            role: "patient",
            name: nome.trim(),
            objective: objetivo,
            invite_code: codigo || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (signUpErr) {
        setError(
          signUpErr.message.includes("already registered")
            ? "esse email já tem conta. tenta entrar?"
            : "não conseguimos criar sua conta agora. tenta de novo?",
        );
        setBusy(false);
        return;
      }
      if (!data.session) {
        // confirmação de email ativada — o callback completa o perfil pelos metadados
        router.push("/confirmar");
        return;
      }
    }

    const result = await completeCadastro({
      name: nome.trim(),
      objective: objetivo,
      inviteCode: codigo || undefined,
    });
    if (!result.ok) {
      setError(result.error ?? "algo deu errado. tenta de novo?");
      setBusy(false);
      return;
    }
    router.push("/anamnese");
  }

  return (
    <div className="auth-screen" style={{ position: "relative", padding: "56px 24px 32px", minHeight: "100dvh" }}>
      <MeshAura mesh="warm" size={220} blur={30} opacity={0.5} style={{ top: -30, right: -50 }} />
      <div style={{ position: "relative" }}>
        <BackHeader
          href="/entrada"
          title="vamos começar."
          subtitle="só o essencial pra te conhecer."
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <ErrorNote>{error}</ErrorNote>

          <FieldLabel>como a gente te chama?</FieldLabel>
          <TextInput
            placeholder="seu nome"
            value={nome}
            autoComplete="name"
            onChange={(e) => setNome(e.target.value)}
            style={{ marginBottom: 20 }}
          />

          {!completing && (
            <>
              <FieldLabel>seu email</FieldLabel>
              <TextInput
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: 20 }}
              />

              <FieldLabel>crie uma senha</FieldLabel>
              <TextInput
                type="password"
                autoComplete="new-password"
                placeholder="pelo menos 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: 20 }}
              />
            </>
          )}

          <FieldLabel>o que te move agora?</FieldLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {OBJETIVOS.map((o) => {
              const active = objetivo === o;
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => setObjetivo(o)}
                  style={{
                    height: 40,
                    padding: "0 16px",
                    borderRadius: "var(--radius-pill)",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    background: active ? "var(--color-orange-subtle)" : "var(--color-surface)",
                    border: active
                      ? "1.5px solid var(--color-orange-dim)"
                      : "1px solid var(--color-border-strong)",
                    color: active ? "var(--color-orange)" : "var(--color-text-secondary)",
                  }}
                >
                  {o}
                </button>
              );
            })}
          </div>

          <FieldLabel optional>tem um código de convite?</FieldLabel>
          <TextInput
            placeholder="NUTRK-XXXX"
            value={codigo}
            autoFocus={showCodeFirst}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            style={{
              marginBottom: 8,
              fontFamily: "var(--font-data)",
              letterSpacing: "0.06em",
            }}
          />
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 26 }}>
            com um código, seu nutri ou personal já entra junto. sem código, você começa sozinho.
          </div>

          <PrimaryButton type="submit" disabled={!canSubmit || busy}>
            {busy ? "criando..." : "continuar"}
          </PrimaryButton>
        </form>

        {!completing && (
          <>
            <OrDivider />
            <GoogleButton />
            <div style={{ textAlign: "center", fontSize: 14, color: "var(--color-text-secondary)", marginTop: 24 }}>
              já tem conta?{" "}
              <Link href="/login" style={{ color: "var(--color-orange)", fontWeight: 600, textDecoration: "none" }}>
                entrar
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CadastroPage() {
  return (
    <Suspense>
      <CadastroForm />
    </Suspense>
  );
}
