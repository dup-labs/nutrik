"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

type Role = "nutricionista" | "personal trainer" | "ambos";

interface FormState {
  name:  string;
  email: string;
  role:  Role;
}

export default function Waitlist() {
  const [form, setForm]           = useState<FormState>({ name: "", email: "", role: "nutricionista" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao enviar solicitação.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar solicitação.");
    } finally {
      setLoading(false);
    }
  };

  const roles: Role[] = ["nutricionista", "personal trainer", "ambos"];

  return (
    <section id="acesso" style={{ padding: "64px 0 120px", position: "relative", overflow: "hidden" }}>
      {/* Glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(109,164,183,0.13) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="container reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative" }}>
        <div className="label" style={{ marginBottom: 16 }}>Acesso antecipado</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, letterSpacing: "var(--tracking-tight)", color: "var(--color-text)", lineHeight: 1.1, marginBottom: 14, maxWidth: 600 }}>
          Seja dos primeiros a usar o Nūtrk.
        </h2>
        <p style={{ fontFamily: "var(--font-interface)", fontSize: 16, color: "var(--color-text-muted)", marginBottom: 48, maxWidth: 440, lineHeight: 1.65 }}>
          O acesso antecipado é limitado. Deixe seus dados e entraremos em contato assim que uma vaga abrir.
        </p>

        {submitted ? (
          <div className="glass-elevated" style={{ padding: 40, maxWidth: 440, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--color-blue-subtle)", border: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
              <Icon name="check" size={24} color="var(--color-blue-glow)" />
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--color-text)", letterSpacing: "var(--tracking-tight)" }}>Solicitação recebida.</h3>
            <p style={{ fontFamily: "var(--font-interface)", fontSize: 14, color: "var(--color-text-muted)", margin: 0 }}>Entraremos em contato em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="glass-elevated" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7, textAlign: "left" }}>
                <div className="label">Nome</div>
                <input
                  type="text"
                  className="field-input"
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7, textAlign: "left" }}>
                <div className="label">E-mail</div>
                <input
                  type="email"
                  className="field-input"
                  placeholder="seu@email.com.br"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>

              {/* Role */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7, textAlign: "left" }}>
                <div className="label">Perfil</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {roles.map(r => (
                    <button
                      key={r}
                      type="button"
                      className={`role-btn ${form.role === r ? "active" : "inactive"}`}
                      onClick={() => setForm(f => ({ ...f, role: r }))}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <p style={{ fontFamily: "var(--font-interface)", fontSize: 13, color: "var(--color-error)", textAlign: "center" }}>{error}</p>
            )}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Enviando..." : "Solicitar acesso antecipado"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
