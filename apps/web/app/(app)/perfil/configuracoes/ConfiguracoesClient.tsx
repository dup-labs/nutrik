"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, PrimaryButton, Switch } from "@/components/ui";
import { TextInput } from "@/components/auth/fields";
import { changeMealPlan, setUsername, updateFeatures, updateProfileName } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import type { FeatureKey } from "@/lib/types";

const PLANS: { key: "secar" | "crescer" | "manter"; label: string; desc: string }[] = [
  { key: "secar", label: "secar", desc: "refeições leves, sem passar fome" },
  { key: "crescer", label: "crescer", desc: "mais volume e energia" },
  { key: "manter", label: "manter", desc: "equilíbrio no dia a dia" },
];

const FEATURES: { key: FeatureKey; label: string; desc: string }[] = [
  { key: "dieta", label: "dieta", desc: "refeições do seu plano alimentar" },
  { key: "treino", label: "treino", desc: "seu treino da semana" },
  { key: "agua", label: "água", desc: "meta diária de hidratação" },
  { key: "meditacao", label: "meditação", desc: "pausas pra respirar" },
  { key: "sono", label: "sono", desc: "registro das suas noites" },
];

export function ConfiguracoesClient({
  name,
  email,
  soloPlanKey,
  hasLinks,
  features,
  username,
}: {
  name: string;
  email: string;
  soloPlanKey: string | null;
  hasLinks: boolean;
  features: Record<FeatureKey, boolean>;
  username: string;
}) {
  const router = useRouter();
  const [nome, setNome] = useState(name);
  const [user, setUser] = useState(username);
  const [userError, setUserError] = useState("");
  const [plan, setPlan] = useState(soloPlanKey);
  const [feats, setFeats] = useState(features);
  const [savedMsg, setSavedMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [pwSent, setPwSent] = useState(false);

  async function handleSave() {
    if (busy) return;
    setBusy(true);
    setUserError("");
    if (nome.trim().length >= 2 && nome.trim() !== name) {
      await updateProfileName(nome);
    }
    if (user.trim().toLowerCase() !== username) {
      const result = await setUsername(user);
      if (!result.ok) {
        setUserError(result.error ?? "não conseguimos salvar o username.");
        setBusy(false);
        return;
      }
    }
    if (plan && plan !== soloPlanKey) {
      await changeMealPlan(plan as "secar" | "crescer" | "manter");
    }
    setSavedMsg("salvo. tudo certo por aqui.");
    setBusy(false);
    router.refresh();
  }

  function toggleFeature(key: FeatureKey) {
    const next = { ...feats, [key]: !feats[key] };
    setFeats(next);
    updateFeatures(next); // salva na hora, otimista
  }

  async function handlePasswordReset() {
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/redefinir`,
    });
    setPwSent(true);
  }

  const label = (t: string) => (
    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
      {t}
    </div>
  );

  return (
    <>
      {label("seu nome")}
      <TextInput value={nome} onChange={(e) => setNome(e.target.value)} style={{ marginBottom: 20 }} />

      {label("seu email")}
      <TextInput value={email} disabled style={{ marginBottom: 20, opacity: 0.6 }} />

      {label("seu username")}
      <TextInput
        value={user}
        placeholder="ex: brunodup"
        onChange={(e) => setUser(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""))}
        style={{ marginBottom: userError ? 8 : 6 }}
      />
      {userError && (
        <div style={{ fontSize: 13, color: "var(--color-error)", marginBottom: 12 }}>
          {userError}
        </div>
      )}
      <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 20, lineHeight: 1.5 }}>
        é como seus amigos te encontram nas turmas.
      </div>

      {label("o que você acompanha")}
      <Card style={{ padding: "4px 16px", marginBottom: 8 }}>
        {FEATURES.map((f, i) => (
          <div
            key={f.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "13px 0",
              borderTop: i > 0 ? "1px solid var(--color-border)" : "none",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{f.label}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 1 }}>
                {f.desc}
              </div>
            </div>
            <Switch
              checked={feats[f.key] !== false}
              onChange={() => toggleFeature(f.key)}
              label={f.label}
            />
          </div>
        ))}
      </Card>
      <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 20, lineHeight: 1.5 }}>
        o que você desligar some do app e não pontua no ranking das turmas.
        seus registros ficam guardados.
      </div>

      {soloPlanKey && !hasLinks && (
        <>
          {label("seu plano alimentar solo")}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {PLANS.map((p) => {
              const sel = plan === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => setPlan(p.key)}
                  style={{
                    textAlign: "left",
                    padding: "13px 16px",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    background: sel ? "var(--color-orange-subtle)" : "var(--color-surface-elevated)",
                    border: sel ? "1.5px solid var(--color-orange-dim)" : "1px solid var(--color-border-strong)",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 15, color: sel ? "var(--color-orange)" : "var(--color-text)" }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
                    {p.desc}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 20, lineHeight: 1.5 }}>
            trocar de plano recria suas refeições a partir de amanhã. seus
            registros ficam guardados.
          </div>
        </>
      )}

      <PrimaryButton disabled={busy || nome.trim().length < 2} onClick={handleSave}>
        {busy ? "salvando..." : "salvar"}
      </PrimaryButton>

      {savedMsg && (
        <div
          style={{
            marginTop: 14,
            background: "rgba(47,158,107,0.10)",
            border: "1px solid rgba(47,158,107,0.24)",
            borderRadius: "var(--radius-md)",
            padding: 14,
            fontSize: 14,
            color: "#2f9e6b",
            fontWeight: 500,
          }}
        >
          {savedMsg}
        </div>
      )}

      <Card style={{ marginTop: 24, padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>trocar senha</div>
            <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
              {pwSent ? "link enviado pro seu email." : "a gente manda um link pro seu email."}
            </div>
          </div>
          {!pwSent && (
            <button
              onClick={handlePasswordReset}
              style={{
                height: 34,
                padding: "0 14px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--color-border-strong)",
                background: "var(--color-surface)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-text-secondary)",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              enviar
            </button>
          )}
        </div>
      </Card>
    </>
  );
}
