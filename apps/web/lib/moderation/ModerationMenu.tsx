"use client";

// Denunciar / bloquear. Dois jeitos de abrir: long-press (ou botão direito)
// na mensagem e um "⋯" discreto. Tudo no mesmo sheet: menu -> motivo -> pronto.

import { useRef, useState, useTransition, type ReactNode } from "react";
import { blockUser, reportContent } from "./actions";
import { REPORT_REASONS, type ModerationTarget, type ReportReason } from "./types";

type Step = "menu" | "report" | "block" | "done";

interface SheetProps {
  target: ModerationTarget;
  /** como chamar a pessoa na UI: "@fulano", "ana"... */
  label: string;
  /** alvo é o profissional do paciente: aviso próprio no bloqueio */
  isProfessional?: boolean;
  /** só mostra "denunciar a pessoa" / "bloquear" (perfil de membro) */
  memberOnly?: boolean;
  onClose: () => void;
  /** denúncia enviada: quem chama esconde a mensagem na hora */
  onReported?: () => void;
  /** bloqueio feito: quem chama esconde o que for da pessoa */
  onBlocked?: () => void;
}

const pillBase = {
  height: 46,
  borderRadius: "var(--radius-pill)",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  width: "100%",
} as const;

function ModerationSheet({
  target,
  label,
  isProfessional,
  memberOnly,
  onClose,
  onReported,
  onBlocked,
}: SheetProps) {
  const [step, setStep] = useState<Step>("menu");
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [doneMsg, setDoneMsg] = useState("");
  const [pending, startTransition] = useTransition();
  // esconder a mensagem só ao fechar o sheet (senão ele desmonta antes do "pronto")
  const outcome = useRef<"reported" | "blocked" | null>(null);

  function finish() {
    if (outcome.current === "reported") onReported?.();
    if (outcome.current === "blocked") onBlocked?.();
    onClose();
  }

  function submitReport() {
    if (!reason) {
      setError("escolhe um motivo pra continuar.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await reportContent({ target, reason, details });
      if (!res.ok) {
        setError(res.error ?? "não conseguimos enviar agora.");
        return;
      }
      outcome.current = "reported";
      setDoneMsg(
        target.type === "member"
          ? "denúncia enviada. a gente analisa em até 24h. obrigado por cuidar da turma."
          : "denúncia enviada e a mensagem sumiu pra você. a gente analisa em até 24h.",
      );
      setStep("done");
    });
  }

  function confirmBlock() {
    setError(null);
    startTransition(async () => {
      const res = await blockUser(target);
      if (!res.ok) {
        setError(res.error ?? "não conseguimos bloquear agora.");
        return;
      }
      outcome.current = "blocked";
      setDoneMsg(`${label} foi bloqueado. você não vê mais as mensagens dessa pessoa.`);
      setStep("done");
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="denunciar ou bloquear"
      onClick={finish}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background: "rgba(27,28,29,0.42)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 520,
          background: "var(--color-surface-elevated)",
          borderRadius: "22px 22px 0 0",
          padding: "20px 20px calc(20px + env(safe-area-inset-bottom))",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxHeight: "88dvh",
          overflowY: "auto",
        }}
      >
        {step === "menu" && (
          <>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{label}</div>
            <button
              onClick={() => setStep("report")}
              style={{
                ...pillBase,
                border: "1px solid var(--color-border-strong)",
                background: "var(--color-surface)",
                color: "var(--color-text)",
              }}
            >
              {memberOnly ? "denunciar essa pessoa" : "denunciar mensagem"}
            </button>
            <button
              onClick={() => setStep("block")}
              style={{
                ...pillBase,
                border: "1px solid var(--color-border-strong)",
                background: "var(--color-surface)",
                color: "#c2410c",
              }}
            >
              bloquear {label}
            </button>
            <button
              onClick={finish}
              style={{ ...pillBase, border: "none", background: "transparent", color: "var(--color-text-muted)" }}
            >
              cancelar
            </button>
          </>
        )}

        {step === "report" && (
          <>
            <div style={{ fontWeight: 700, fontSize: 16 }}>o que aconteceu?</div>
            <div style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.5 }}>
              sua denúncia é anônima pra {label}. a gente lê tudo e age em até 24h.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {REPORT_REASONS.map((r) => {
                const on = reason === r.key;
                return (
                  <button
                    key={r.key}
                    onClick={() => setReason(r.key)}
                    aria-pressed={on}
                    style={{
                      textAlign: "left",
                      padding: "11px 14px",
                      borderRadius: "var(--radius-lg)",
                      cursor: "pointer",
                      border: on
                        ? "1.5px solid var(--color-orange)"
                        : "1px solid var(--color-border-strong)",
                      background: on ? "var(--color-orange-subtle)" : "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
                      {r.hint}
                    </div>
                  </button>
                );
              })}
            </div>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="quer contar mais? (opcional)"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border-strong)",
                background: "var(--color-surface)",
                fontSize: 14,
                color: "var(--color-text)",
                resize: "none",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            {error && <div style={{ fontSize: 13, color: "#c2410c" }}>{error}</div>}
            <button
              onClick={submitReport}
              disabled={pending}
              style={{
                ...pillBase,
                border: "none",
                background: "var(--color-orange)",
                color: "#fff",
                opacity: pending ? 0.6 : 1,
              }}
            >
              {pending ? "enviando..." : "enviar denúncia"}
            </button>
            <button
              onClick={() => setStep("menu")}
              style={{ ...pillBase, border: "none", background: "transparent", color: "var(--color-text-muted)" }}
            >
              voltar
            </button>
          </>
        )}

        {step === "block" && (
          <>
            <div style={{ fontWeight: 700, fontSize: 16 }}>bloquear {label}?</div>
            <div style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
              {isProfessional
                ? "você não vai mais ver nem receber mensagens dessa pessoa, e ela também não consegue te escrever. o chat com ela fica fechado no app. seu plano e seus registros continuam seus; se quiser encerrar o acompanhamento de vez, é só desvincular depois."
                : "você não vai mais ver as mensagens dessa pessoa nas turmas e ela não consegue te escrever. dá pra desbloquear depois."}
            </div>
            {error && <div style={{ fontSize: 13, color: "#c2410c" }}>{error}</div>}
            <button
              onClick={confirmBlock}
              disabled={pending}
              style={{
                ...pillBase,
                border: "none",
                background: "#c2410c",
                color: "#fff",
                opacity: pending ? 0.6 : 1,
              }}
            >
              {pending ? "bloqueando..." : "sim, bloquear"}
            </button>
            <button
              onClick={() => setStep("menu")}
              style={{ ...pillBase, border: "none", background: "transparent", color: "var(--color-text-muted)" }}
            >
              voltar
            </button>
          </>
        )}

        {step === "done" && (
          <>
            <div style={{ fontWeight: 700, fontSize: 16 }}>pronto.</div>
            <div style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
              {doneMsg}
            </div>
            <button
              onClick={finish}
              style={{ ...pillBase, border: "none", background: "var(--color-orange)", color: "#fff" }}
            >
              fechar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const dotsBtn = {
  width: 26,
  height: 26,
  borderRadius: "50%",
  border: "none",
  background: "transparent",
  color: "var(--color-text-muted)",
  cursor: "pointer",
  fontSize: 16,
  lineHeight: 1,
  flexShrink: 0,
  padding: 0,
} as const;

/** "⋯" avulso, pra linha de membro da turma */
export function MemberMenuButton(props: Omit<SheetProps, "onClose" | "memberOnly">) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`denunciar ou bloquear ${props.label}`}
        style={dotsBtn}
      >
        ⋯
      </button>
      {open && <ModerationSheet {...props} memberOnly onClose={() => setOpen(false)} />}
    </>
  );
}

/**
 * Envolve o balão de uma mensagem de OUTRA pessoa: long-press / botão direito
 * abre o sheet, e um "⋯" discreto ao lado faz o mesmo (mouse, acessibilidade).
 */
export function MessageActions({
  children,
  disabled,
  ...props
}: Omit<SheetProps, "onClose" | "memberOnly"> & {
  children: ReactNode;
  /** mensagem própria / ainda otimista: sem menu */
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (disabled) return <>{children}</>;

  function startPress() {
    cancelPress();
    timer.current = setTimeout(() => setOpen(true), 450);
  }
  function cancelPress() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }

  return (
    <>
      <div
        onTouchStart={startPress}
        onTouchMove={cancelPress}
        onTouchEnd={cancelPress}
        onTouchCancel={cancelPress}
        onContextMenu={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          WebkitTouchCallout: "none",
        }}
      >
        {children}
        <button
          onClick={() => setOpen(true)}
          aria-label="denunciar ou bloquear"
          style={dotsBtn}
        >
          ⋯
        </button>
      </div>
      {open && <ModerationSheet {...props} onClose={() => setOpen(false)} />}
    </>
  );
}
