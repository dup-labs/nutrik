"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackHeader, Badge, MeshAura } from "@/components/ui";
import { TextInput } from "@/components/auth/fields";
import { IconCheck } from "@/components/ui/icons";
import { linkProfessional } from "@/lib/actions";
import { PRO_ACCENT, type ProfessionalType } from "@/lib/types";

type Slot = { linked: true; name: string; code: string } | { linked: false };

function SlotCard({
  type,
  slot,
}: {
  type: ProfessionalType;
  slot: Slot;
}) {
  const router = useRouter();
  const acc = PRO_ACCENT[type];
  const [editing, setEditing] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [justLinked, setJustLinked] = useState<string | null>(null);

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
    setJustLinked(result.proName ?? "profissional");
    setBusy(false);
    setEditing(false);
    router.refresh();
  }

  const showForm = !slot.linked || editing;

  return (
    <div
      style={{
        background: "var(--color-surface-elevated)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: 18,
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 3,
            background: acc.accent,
          }}
        />
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>
          {acc.role}
        </span>
        {slot.linked && !justLinked && (
          <Badge variant={type === "nutri" ? "cool" : "warm"} dot>
            vinculado
          </Badge>
        )}
        {justLinked && (
          <Badge variant="success" dot>
            vinculado agora
          </Badge>
        )}
      </div>

      {slot.linked && !editing ? (
        <>
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 12 }}>
            {justLinked ?? slot.name} acompanha sua jornada.
          </div>
          <button
            onClick={() => setEditing(true)}
            style={{
              height: 36,
              padding: "0 16px",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--color-border-strong)",
              background: "var(--color-surface)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-text-secondary)",
              cursor: "pointer",
            }}
          >
            trocar de {acc.role}
          </button>
        </>
      ) : justLinked && !showForm ? null : (
        <>
          <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 10 }}>
            {slot.linked
              ? "colar um código novo substitui o vínculo atual."
              : `cola o código que seu ${acc.role} te passou.`}
          </div>
          {error && (
            <div style={{ fontSize: 13, color: "var(--color-error)", marginBottom: 10 }}>{error}</div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <TextInput
              placeholder="NUTRK-XXXX"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              style={{
                fontFamily: "var(--font-data)",
                letterSpacing: "0.06em",
                height: 46,
              }}
            />
            <button
              onClick={handleLink}
              disabled={codigo.trim().length < 4 || busy}
              style={{
                flexShrink: 0,
                height: 46,
                padding: "0 20px",
                borderRadius: "var(--radius-pill)",
                border: "none",
                background: "var(--color-orange)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                opacity: codigo.trim().length < 4 || busy ? 0.45 : 1,
              }}
            >
              {busy ? "..." : slot.linked ? "trocar" : "vincular"}
            </button>
          </div>
          {slot.linked && (
            <button
              onClick={() => {
                setEditing(false);
                setError("");
              }}
              style={{ marginTop: 10, background: "none", border: "none", fontSize: 12.5, color: "var(--color-text-muted)", cursor: "pointer", padding: 0 }}
            >
              cancelar
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function VincularClient({
  nutri,
  personal,
}: {
  nutri: Slot;
  personal: Slot;
}) {
  const both = nutri.linked && personal.linked;
  return (
    <div style={{ position: "relative", padding: "24px 20px 28px", maxWidth: 640, margin: "0 auto" }}>
      <MeshAura mesh="cool" size={200} blur={30} opacity={0.4} style={{ top: -40, right: -50 }} />
      <div style={{ position: "relative" }}>
        <BackHeader
          href="/perfil"
          title="seus profissionais"
          subtitle="você pode ter um nutri e um personal, juntos."
        />

        {both && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(47,158,107,0.10)",
              border: "1px solid rgba(47,158,107,0.24)",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px",
              marginBottom: 14,
            }}
          >
            <IconCheck size={18} color="#2f9e6b" />
            <span style={{ fontSize: 13.5, color: "#2f9e6b", fontWeight: 500 }}>
              dupla completa. nutri e personal cuidando de você, lado a lado.
            </span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SlotCard type="nutri" slot={nutri} />
          <SlotCard type="personal" slot={personal} />
        </div>
      </div>
    </div>
  );
}
