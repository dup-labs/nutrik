"use client";

// Seção "excluir conta" — 2 passos, inline (sem modal): 1) o que será apagado,
// 2) digitar "excluir". Usada nas configurações do paciente e no perfil do pro.

import { useState } from "react";
import { Card } from "@/components/ui";
import { TextInput } from "@/components/auth/fields";
import { deleteAccount } from "./actions";
import { CONFIRM_WORD, normalizeConfirm } from "./shared";

const DANGER = "#ef4444";

const COPY = {
  patient: {
    intro: "apaga sua conta e tudo o que você registrou no nūtrk.",
    items: [
      "seu perfil, objetivos e configurações",
      "refeições, treinos, água, sono, humor e respiração registrados",
      "fotos de refeição que você enviou",
      "mensagens com seu profissional e vínculos com ele",
      "suas conquistas, pontos e participação nas turmas (se você é dona ou dono de uma turma, ela passa pro membro mais antigo)",
    ],
    note: "seu profissional deixa de ver você no painel dele.",
  },
  pro: {
    intro: "apaga sua conta de profissional e o que está ligado a ela.",
    items: [
      "seu perfil profissional, código de convite e vídeos de exercício",
      "vínculos com seus pacientes, mensagens, consultas e notas internas",
      "sua assinatura é cancelada no Asaas, sem novas cobranças",
    ],
    note: "seus pacientes mantêm os próprios dados e os planos que você montou pra eles, só que sem seu nome. cobranças já pagas ficam guardadas pelo Asaas pelo prazo fiscal.",
  },
} as const;

export function DeleteAccount({ role }: { role: "patient" | "pro" }) {
  const copy = COPY[role];
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const ready = normalizeConfirm(typed) === CONFIRM_WORD;

  async function handleDelete() {
    if (!ready || busy) return;
    setBusy(true);
    setError("");
    try {
      // em caso de sucesso a action faz redirect (a promise não resolve aqui)
      const res = await deleteAccount({ confirmation: typed });
      if (res && !res.ok) setError(res.error);
    } catch (err) {
      // redirect() lança NEXT_REDIRECT; o Next trata. Outros erros caem aqui.
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) throw err;
      setError("não conseguimos excluir agora. tenta de novo em instantes?");
    }
    setBusy(false);
  }

  const outlineBtn: React.CSSProperties = {
    height: 44,
    padding: "0 18px",
    borderRadius: "var(--radius-pill)",
    border: "1px solid var(--color-border-strong)",
    background: "var(--color-surface)",
    color: "var(--color-text-secondary)",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  };

  return (
    <Card style={{ marginTop: 24, padding: "14px 16px" }}>
      <div style={{ fontWeight: 600, fontSize: 14 }}>excluir conta</div>

      {step === 0 && (
        <>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2, lineHeight: 1.5 }}>
            se for a hora de ir, tudo bem. a gente apaga seus dados.
          </div>
          <button
            onClick={() => setStep(1)}
            style={{
              marginTop: 12,
              height: 40,
              padding: "0 16px",
              borderRadius: "var(--radius-pill)",
              border: "1px solid rgba(239,68,68,0.25)",
              background: "rgba(239,68,68,0.06)",
              color: DANGER,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            excluir minha conta
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <div style={{ fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>{copy.intro}</div>
          <ul style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 13, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
            {copy.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
          <div style={{ fontSize: 13, marginTop: 10, lineHeight: 1.5, color: "var(--color-text-muted)" }}>
            {copy.note}
          </div>
          <div style={{ fontSize: 13, marginTop: 10, lineHeight: 1.5, fontWeight: 600 }}>
            não dá pra desfazer depois.
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={() => setStep(0)} style={outlineBtn}>
              voltar
            </button>
            <button
              onClick={() => setStep(2)}
              style={{ ...outlineBtn, color: DANGER, border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)" }}
            >
              continuar
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>
            pra confirmar, digite <strong>{CONFIRM_WORD}</strong> abaixo.
          </div>
          <TextInput
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={CONFIRM_WORD}
            autoCapitalize="none"
            autoCorrect="off"
            style={{ marginTop: 10 }}
          />
          {error && (
            <div style={{ fontSize: 13, color: "var(--color-error)", marginTop: 10, lineHeight: 1.5 }}>
              {error}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button
              onClick={() => {
                setStep(0);
                setTyped("");
                setError("");
              }}
              disabled={busy}
              style={outlineBtn}
            >
              cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={!ready || busy}
              style={{
                ...outlineBtn,
                flex: 1,
                border: "none",
                background: DANGER,
                color: "#fff",
                opacity: !ready || busy ? 0.45 : 1,
                cursor: !ready || busy ? "default" : "pointer",
              }}
            >
              {busy ? "excluindo..." : "excluir pra sempre"}
            </button>
          </div>
        </>
      )}
    </Card>
  );
}
