"use client";

import { useState } from "react";
import { BackHeader, MeshAura, PrimaryButton } from "@/components/ui";
import { ErrorNote, FieldLabel, TextInput } from "@/components/auth/fields";
import { createClient } from "@/lib/supabase/client";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSend() {
    if (!email.includes("@") || busy) return;
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/redefinir`,
    });
    if (error) {
      setError("não conseguimos enviar o email agora. tenta de novo?");
      setBusy(false);
      return;
    }
    setSent(true);
  }

  return (
    <div style={{ position: "relative", padding: "56px 24px 32px", minHeight: "100dvh" }}>
      <MeshAura mesh="cool" size={220} blur={30} opacity={0.45} style={{ top: -30, right: -50 }} />
      <div style={{ position: "relative" }}>
        <BackHeader
          href="/login"
          title="esqueceu a senha?"
          subtitle="acontece. a gente te manda um link."
        />

        {sent ? (
          <div
            style={{
              background: "rgba(47,158,107,0.10)",
              border: "1px solid rgba(47,158,107,0.24)",
              borderRadius: "var(--radius-md)",
              padding: 16,
              fontSize: 14,
              color: "#2f9e6b",
              fontWeight: 500,
            }}
          >
            enviado. dá uma olhada no seu email e siga o link pra criar uma senha nova.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <ErrorNote>{error}</ErrorNote>
            <FieldLabel>seu email</FieldLabel>
            <TextInput
              type="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginBottom: 24 }}
            />
            <PrimaryButton type="submit" disabled={!email.includes("@") || busy}>
              {busy ? "enviando..." : "enviar link"}
            </PrimaryButton>
          </form>
        )}
      </div>
    </div>
  );
}
