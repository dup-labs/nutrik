"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackHeader, MeshAura, PrimaryButton } from "@/components/ui";
import { ErrorNote, TextInput } from "@/components/auth/fields";
import { IconCheck } from "@/components/ui/icons";
import { linkProfessional } from "@/lib/actions";

export default function VincularPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [linkedName, setLinkedName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLink() {
    if (codigo.trim().length < 4 || busy) return;
    setBusy(true);
    setError("");
    const result = await linkProfessional(codigo);
    if (!result.ok) {
      setError(result.error ?? "algo deu errado.");
      setBusy(false);
      return;
    }
    setLinkedName(result.proName ?? "profissional");
    setBusy(false);
  }

  if (linkedName) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: "calc(100dvh - 160px)",
          padding: "0 30px",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: "var(--mesh-cool)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "ntrkPop .5s var(--ease-spring) both",
          }}
        >
          <IconCheck size={34} color="#fff" />
        </div>
        <div style={{ marginTop: 20, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 23, letterSpacing: "-0.03em" }}>
          vínculo criado.
        </div>
        <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.5, color: "var(--color-text-secondary)", maxWidth: 280 }}>
          {linkedName} agora acompanha sua jornada. seu plano pode ganhar uma
          repaginada em breve.
        </div>
        <button
          onClick={() => {
            router.push("/perfil");
            router.refresh();
          }}
          style={{
            marginTop: 30,
            height: 52,
            padding: "0 36px",
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
          voltar ao perfil
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", padding: "24px 20px 28px", maxWidth: 640, margin: "0 auto" }}>
      <MeshAura mesh="cool" size={200} blur={30} opacity={0.4} style={{ top: -40, right: -50 }} />
      <div style={{ position: "relative" }}>
        <BackHeader
          href="/perfil"
          title="vincular profissional"
          subtitle="seu nutri ou personal entra junto na jornada."
        />

        <ErrorNote>{error}</ErrorNote>

        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
          código de convite
        </div>
        <TextInput
          placeholder="NUTRK-XXXX"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          style={{ marginBottom: 8, fontFamily: "var(--font-data)", letterSpacing: "0.06em" }}
        />
        <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 26, lineHeight: 1.5 }}>
          peça o código pro seu profissional. se você já tem um profissional do
          mesmo tipo vinculado, o novo código substitui o vínculo antigo.
        </div>

        <PrimaryButton disabled={codigo.trim().length < 4 || busy} onClick={handleLink}>
          {busy ? "vinculando..." : "vincular"}
        </PrimaryButton>
      </div>
    </div>
  );
}
