"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, InitialAvatar, PrimaryButton, Switch } from "@/components/ui";
import { TextInput } from "@/components/auth/fields";
import { deleteGroup, removeMember, updateGroup } from "@/lib/social/actions";
import { FEATURE_KEYS, groupMetrics, type FeatureKey, type FriendGroup, type FriendProfile } from "@/lib/types";

const METRICS: { key: FeatureKey; label: string; desc: string }[] = [
  { key: "dieta", label: "dieta", desc: "refeições do plano batidas" },
  { key: "treino", label: "treino", desc: "treino do dia concluído" },
  { key: "agua", label: "água", desc: "meta diária de hidratação" },
  { key: "meditacao", label: "meditação", desc: "pausa pra respirar" },
  { key: "sono", label: "sono", desc: "noite registrada" },
];

export function GerenciarClient({
  group,
  members,
  ownerId,
}: {
  group: FriendGroup;
  members: FriendProfile[];
  ownerId: string;
}) {
  const router = useRouter();
  const [nome, setNome] = useState(group.name);
  const [aberta, setAberta] = useState(group.join_policy === "open");
  const initialMetrics = groupMetrics(group);
  const [metrics, setMetrics] = useState<Record<FeatureKey, boolean>>(
    () =>
      Object.fromEntries(
        FEATURE_KEYS.map((k) => [k, initialMetrics.includes(k)]),
      ) as Record<FeatureKey, boolean>,
  );
  const [busy, setBusy] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const selectedMetrics = FEATURE_KEYS.filter((k) => metrics[k]);

  async function handleSave() {
    if (busy || nome.trim().length < 2) return;
    if (selectedMetrics.length === 0) {
      setError("escolhe pelo menos uma métrica pra pontuar.");
      return;
    }
    setBusy(true);
    setSavedMsg("");
    setError("");
    const result = await updateGroup(group.id, {
      name: nome,
      joinPolicy: aberta ? "open" : "approval",
      scoredMetrics: selectedMetrics,
    });
    if (!result.ok) {
      setError(result.error ?? "não conseguimos salvar agora.");
      setBusy(false);
      return;
    }
    setSavedMsg("salvo. tudo certo por aqui.");
    setBusy(false);
    router.refresh();
  }

  async function handleRemove(patientId: string) {
    setRemoved((s) => new Set(s).add(patientId));
    await removeMember(group.id, patientId);
    router.refresh();
  }

  const label = (t: string) => (
    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
      {t}
    </div>
  );

  return (
    <>
      {label("nome da turma")}
      <TextInput value={nome} onChange={(e) => setNome(e.target.value)} style={{ marginBottom: 20 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>turma aberta</div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
            {aberta
              ? "quem tiver o código ou o link entra direto."
              : "quem pedir pra entrar espera sua aprovação."}
          </div>
        </div>
        <Switch checked={aberta} onChange={setAberta} label="turma aberta" />
      </div>

      {label("o que pontua nesta turma")}
      <Card style={{ padding: "4px 16px", marginBottom: 8 }}>
        {METRICS.map((m, i) => (
          <div
            key={m.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "13px 0",
              borderTop: i > 0 ? "1px solid var(--color-border)" : "none",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 1 }}>
                {m.desc}
              </div>
            </div>
            <Switch
              checked={metrics[m.key]}
              onChange={(v) => {
                setMetrics((s) => ({ ...s, [m.key]: v }));
                setError("");
              }}
              label={m.label}
            />
          </div>
        ))}
      </Card>
      <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 20, lineHeight: 1.5 }}>
        cada pilar ligado vale 1 ponto por dia pra quem bater. o ranking da turma
        conta só {selectedMetrics.length} de 5.
      </div>

      {error && (
        <div style={{ fontSize: 13, color: "var(--color-error)", marginBottom: 12 }}>{error}</div>
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

      <div style={{ marginTop: 24 }}>
        {label("membros")}
        <Card style={{ padding: "4px 16px" }}>
          {members
            .filter((m) => !removed.has(m.id))
            .map((m, i) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 0",
                  borderTop: i > 0 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <InitialAvatar
                  initial={(m.name || "?")[0].toUpperCase()}
                  mesh="var(--mesh-cool)"
                  size={36}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {m.name}
                    {m.id === ownerId && (
                      <span style={{ fontWeight: 500, color: "var(--color-text-muted)" }}>
                        {" "}
                        · você
                      </span>
                    )}
                  </div>
                  {m.username && (
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                      @{m.username}
                    </div>
                  )}
                </div>
                {m.id !== ownerId && (
                  <button
                    onClick={() => handleRemove(m.id)}
                    style={{
                      height: 32,
                      padding: "0 14px",
                      borderRadius: "var(--radius-pill)",
                      border: "1px solid var(--color-border-strong)",
                      background: "var(--color-surface)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--color-text-secondary)",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    remover
                  </button>
                )}
              </div>
            ))}
        </Card>
      </div>

      <Card style={{ marginTop: 24, padding: "14px 16px", border: "1px solid rgba(239,68,68,0.24)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>excluir turma</div>
            <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
              apaga ranking, chat e membros. não tem volta.
            </div>
          </div>
          {confirmingDelete ? (
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button
                onClick={async () => {
                  setDeleting(true);
                  await deleteGroup(group.id);
                }}
                disabled={deleting}
                style={{
                  height: 34,
                  padding: "0 14px",
                  borderRadius: "var(--radius-pill)",
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {deleting ? "excluindo..." : "confirmar"}
              </button>
              <button
                onClick={() => setConfirmingDelete(false)}
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
                }}
              >
                cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmingDelete(true)}
              style={{
                height: 34,
                padding: "0 14px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid rgba(239,68,68,0.4)",
                background: "var(--color-surface)",
                fontSize: 13,
                fontWeight: 600,
                color: "#ef4444",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              excluir
            </button>
          )}
        </div>
      </Card>
    </>
  );
}
