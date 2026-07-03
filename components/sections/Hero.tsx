"use client";

import Icon from "@/components/ui/Icon";
import GradText from "@/components/ui/GradText";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
}

export default function Hero({ onCTA }: { onCTA: () => void }) {
  const chips = [
    { icon: "leaf",     label: "Nutrição", c: "#52D48A" },
    { icon: "dumbbell", label: "Treino",   c: "#FE5F33" },
    { icon: "mind",     label: "Mente",    c: "#ADB7F7" },
  ];

  return (
    <header className="hero">
      <div className="container hero-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <span className="pill-label" style={{ alignSelf: "flex-start" }}>
            Acesso antecipado · vagas limitadas
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5.4vw, 72px)", fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.02, color: "var(--ink)" }}>
            Sua melhor versão é um{" "}
            <GradText>processo diário.</GradText>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 18.5, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 480 }}>
            Nutrição inteligente, treino personalizado e equilíbrio mental — tudo em um app só. Feito pra quem cuida da saúde no seu ritmo, sem neurose.
          </p>
          <div className="hero-chips">
            {chips.map(c => (
              <span key={c.label} className="hero-chip">
                <Icon name={c.icon} size={17} color={c.c} /> {c.label}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 4 }}>
            <button className="btn btn-primary btn-lg" onClick={onCTA}>
              Solicitar acesso antecipado
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => scrollTo("como-funciona")}>
              Como funciona
            </button>
          </div>
        </div>

        <div className="hero-photo-wrap">
          <div className="hero-photo" style={{ backgroundImage: "url('/photos/hero.png')" }} />
          <div className="float-card" style={{ top: 28, right: -14, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(254,95,51,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="flame" size={22} color="#FE5F33" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "var(--ink)", lineHeight: 1 }}>9 dias</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11.5, color: "var(--ink-2)" }}>de ofensiva</div>
            </div>
          </div>
          <div className="float-card" style={{ bottom: 24, left: -18, width: 190 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                Metas de hoje
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 12, color: "#FE5F33" }}>3/4</span>
            </div>
            <div style={{ height: 7, borderRadius: 9999, background: "rgba(24,25,29,0.08)", overflow: "hidden" }}>
              <div style={{ width: "75%", height: "100%", borderRadius: 9999, background: "linear-gradient(90deg,#FE5F33,#FEAF4C)" }} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
