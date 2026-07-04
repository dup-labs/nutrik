"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BackHeader, MeshAura, PrimaryButton } from "@/components/ui";
import {
  ErrorNote,
  FieldLabel,
  GoogleButton,
  OrDivider,
  TextInput,
} from "@/components/auth/fields";
import { createClient } from "@/lib/supabase/client";
import { createProfessionalProfile } from "@/lib/pro/actions";

export default function ProCadastroPage() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"nutri" | "personal">("nutri");
  const [reg, setReg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setHasSession(!!data.user));
  }, []);

  const canSubmit =
    nome.trim().length >= 2 &&
    (hasSession || (email.includes("@") && password.length >= 6));

  async function handleSubmit() {
    if (!canSubmit || busy) return;
    setBusy(true);
    setError("");
    const supabase = createClient();

    if (!hasSession) {
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: nome.trim() } },
      });
      if (signUpErr) {
        setError(
          signUpErr.message.includes("already registered")
            ? "esse email já tem conta. entra primeiro e volta aqui."
            : "não conseguimos criar sua conta agora. tenta de novo?",
        );
        setBusy(false);
        return;
      }
      if (!data.session) {
        setError("confirma seu email primeiro (te enviamos um link) e volta aqui pra concluir.");
        setBusy(false);
        return;
      }
    }

    const result = await createProfessionalProfile({
      name: nome.trim(),
      type: tipo,
      regCode: reg || undefined,
    });
    if (!result.ok) {
      setError(result.error ?? "algo deu errado.");
      setBusy(false);
      return;
    }
    setInviteCode(result.inviteCode ?? null);
    setBusy(false);
  }

  if (inviteCode) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "var(--gradient-canvas)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 30px",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: tipo === "nutri" ? "var(--mesh-cool)" : "var(--mesh-warm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "ntrkPop .5s var(--ease-spring) both",
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: 30,
            color: "#fff",
          }}
        >
          {nome.replace(/^Dra?\. /i, "")[0]?.toUpperCase()}
        </div>
        <div style={{ marginTop: 20, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 24, letterSpacing: "-0.03em" }}>
          seu painel está pronto.
        </div>
        <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.5, color: "var(--color-text-secondary)", maxWidth: 300 }}>
          esse é o seu código de convite — manda pros seus {tipo === "nutri" ? "pacientes" : "alunos"} entrarem junto com você:
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: "var(--font-data)",
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: "0.08em",
            padding: "12px 28px",
            borderRadius: "var(--radius-md)",
            background: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border-strong)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {inviteCode}
        </div>
        <button
          onClick={() => {
            router.push("/pro");
            router.refresh();
          }}
          style={{
            marginTop: 32,
            height: 54,
            padding: "0 40px",
            borderRadius: "var(--radius-pill)",
            border: "none",
            background: "var(--color-orange)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          entrar no painel
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--gradient-canvas)",
        maxWidth: 560,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", padding: "56px 24px 32px" }}>
        <MeshAura mesh="cool" size={220} blur={30} opacity={0.45} style={{ top: -30, right: -50 }} />
        <div style={{ position: "relative" }}>
          <BackHeader
            href="/entrada"
            title="painel profissional."
            subtitle="acompanhe seus pacientes de perto, junto com o par."
          />

          <ErrorNote>{error}</ErrorNote>

          <FieldLabel>você é...</FieldLabel>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {(
              [
                ["nutri", "nutricionista"],
                ["personal", "personal trainer"],
              ] as const
            ).map(([key, label]) => {
              const active = tipo === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTipo(key)}
                  style={{
                    flex: 1,
                    height: 46,
                    borderRadius: "var(--radius-md)",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: active ? "var(--color-orange-subtle)" : "var(--color-surface)",
                    border: active
                      ? "1.5px solid var(--color-orange-dim)"
                      : "1px solid var(--color-border-strong)",
                    color: active ? "var(--color-orange)" : "var(--color-text-secondary)",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <FieldLabel>seu nome profissional</FieldLabel>
          <TextInput
            placeholder={tipo === "nutri" ? "Dra. Camila Reis" : "Rafa Nunes"}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ marginBottom: 20 }}
          />

          <FieldLabel optional>{tipo === "nutri" ? "CRN" : "CREF"}</FieldLabel>
          <TextInput
            placeholder={tipo === "nutri" ? "CRN-3 · 45.892" : "CREF · 082451-G/SP"}
            value={reg}
            onChange={(e) => setReg(e.target.value)}
            style={{ marginBottom: 20 }}
          />

          {hasSession === false && (
            <>
              <FieldLabel>seu email</FieldLabel>
              <TextInput
                type="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: 20 }}
              />
              <FieldLabel>crie uma senha</FieldLabel>
              <TextInput
                type="password"
                placeholder="pelo menos 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: 20 }}
              />
            </>
          )}

          <PrimaryButton disabled={!canSubmit || busy} onClick={handleSubmit} style={{ marginTop: 6 }}>
            {busy ? "criando..." : "criar meu painel"}
          </PrimaryButton>

          {hasSession === false && (
            <>
              <OrDivider />
              <GoogleButton label="continuar com Google" />
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
    </div>
  );
}
