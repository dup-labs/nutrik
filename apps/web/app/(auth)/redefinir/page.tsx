"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackHeader, MeshAura, PrimaryButton } from "@/components/ui";
import { ErrorNote, FieldLabel, TextInput } from "@/components/auth/fields";
import { createClient } from "@/lib/supabase/client";

export default function RedefinirPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    if (password.length < 6 || busy) return;
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError("não conseguimos salvar. o link pode ter expirado — pede outro.");
      setBusy(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="auth-screen" style={{ position: "relative", padding: "56px 24px 32px", minHeight: "100dvh" }}>
      <MeshAura mesh="cool" size={220} blur={30} opacity={0.45} style={{ top: -30, right: -50 }} />
      <div style={{ position: "relative" }}>
        <BackHeader href="/login" title="senha nova." subtitle="escolhe uma que você não esqueça." />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <ErrorNote>{error}</ErrorNote>
          <FieldLabel>nova senha</FieldLabel>
          <TextInput
            type="password"
            autoComplete="new-password"
            placeholder="pelo menos 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: 24 }}
          />
          <PrimaryButton type="submit" disabled={password.length < 6 || busy}>
            {busy ? "salvando..." : "salvar e entrar"}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
