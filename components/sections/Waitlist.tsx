"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

type Who = "pessoa" | "profissional";

export default function Waitlist() {
  const [form, setForm]   = useState({ name: "", email: "", who: "pessoa" as Who });
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, role: form.who }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao enviar solicitação.");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar solicitação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="acesso" style={{ padding: "40px 0 96px" }}>
      <div className="container">
        <div className="cta-band reveal">
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14 }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>
              Acesso antecipado
            </span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.6vw, 46px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.08, maxWidth: 560, textShadow: "0 2px 20px rgba(24,25,29,0.2)" }}>
              Comece sua melhor versão antes de todo mundo.
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 16.5, color: "rgba(255,255,255,0.94)", maxWidth: 440, lineHeight: 1.55, marginBottom: 12 }}>
              Entre na lista de espera. Assim que abrirmos novas vagas, você é avisado em primeira mão.
            </p>

            {sent ? (
              <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", maxWidth: 440, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(82,212,138,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="check" size={26} color="#52D48A" strokeWidth={2.4} />
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--ink)" }}>Você está na lista!</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--ink-2)", margin: 0 }}>A gente avisa assim que sua vaga abrir. Até já.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 20, padding: 22, maxWidth: 460, width: "100%", display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 20px 50px rgba(24,25,29,0.22)" }}>
                <div className="seg">
                  {([["pessoa", "Quero pra mim"], ["profissional", "Sou profissional"]] as [Who, string][]).map(([v, l]) => (
                    <button key={v} type="button" className={`seg-btn ${form.who === v ? "on" : "off"}`} onClick={() => setForm(f => ({ ...f, who: v }))}>
                      {l}
                    </button>
                  ))}
                </div>
                <input className="field" placeholder="Seu nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                <input className="field" type="email" placeholder="seu@email.com.br" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                {error && <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#FF5A5A" }}>{error}</span>}
                <button type="submit" className="btn btn-primary btn-md" style={{ width: "100%" }} disabled={loading}>
                  {loading ? "Enviando..." : "Entrar na lista de espera"}
                </button>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-3)" }}>Sem spam. Só o aviso quando sua vaga abrir.</span>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
