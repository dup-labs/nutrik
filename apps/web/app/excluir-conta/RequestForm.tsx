"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui";
import { ErrorNote, FieldLabel, TextInput } from "@/components/auth/fields";
import { requestAccountDeletion } from "./actions";

export function RequestForm() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await requestAccountDeletion({ email, note, website });
      if (res.ok) setSent(true);
      else setError(res.error ?? "não conseguimos enviar agora. tenta de novo?");
    } catch {
      setError("não conseguimos enviar agora. tenta de novo?");
    }
    setBusy(false);
  }

  if (sent) {
    return (
      <div style={{ background: "rgba(47,158,107,0.10)", border: "1px solid rgba(47,158,107,0.24)", borderRadius: "var(--radius-md)", padding: 16, fontSize: 14, lineHeight: 1.6, color: "#2f9e6b" }}>
        pedido recebido. a gente responde nesse email pra confirmar que é você
        e conclui a exclusão em até 30 dias.
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <FieldLabel>email da conta</FieldLabel>
      <TextInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" style={{ marginBottom: 16 }} />
      <FieldLabel optional>algo que a gente deva saber</FieldLabel>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={1000}
        style={{ width: "100%", boxSizing: "border-box", minHeight: 88, padding: "12px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-strong)", background: "var(--color-surface-elevated)", fontSize: 16, lineHeight: 1.5, outline: "none", resize: "none", marginBottom: 16 }}
      />
      {/* honeypot */}
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      {error && <div style={{ marginBottom: 12 }}><ErrorNote>{error}</ErrorNote></div>}
      <PrimaryButton type="submit" disabled={busy || !email.trim()}>
        {busy ? "enviando..." : "pedir exclusão"}
      </PrimaryButton>
    </form>
  );
}
