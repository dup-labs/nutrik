import Icon from "@/components/ui/Icon";
import GradText from "@/components/ui/GradText";

const steps = [
  { icon: "target",   title: "Monte seu plano",    desc: "Nutrição, treino e mente juntos, ajustados ao seu momento e à sua rotina." },
  { icon: "calendar", title: "Siga o seu dia",      desc: "Metas simples e claras. Nada de lista infinita — só o que importa hoje." },
  { icon: "check",    title: "Marque o que fez",   desc: "Cada meta concluída soma na sua ofensiva e mostra o quanto você avançou." },
  { icon: "sparkle",  title: "Evolua sem pressão", desc: "Pequenas vitórias, todo dia. A constância cuida do resto — no seu ritmo." },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" style={{ padding: "96px 0", background: "var(--panel)", borderTop: "1px solid rgba(24,25,29,0.06)", borderBottom: "1px solid rgba(24,25,29,0.06)" }}>
      <div className="container">
        <div className="reveal" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <span className="pill-label">O processo diário</span>
          <h2 className="h2">Um passo de cada vez, <GradText>todo dia.</GradText></h2>
          <p className="lead" style={{ maxWidth: 500 }}>É assim que a sua melhor versão acontece — não num salto, mas num hábito.</p>
        </div>
        <div className="steps-grid">
          <div className="steps-line" />
          {steps.map((s, i) => (
            <div key={s.title} className={`step reveal reveal-d${i}`}>
              <div className="step-num">
                <Icon name={s.icon} size={26} color="#fff" />
                <span className="step-badge">{i + 1}</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink)", margin: "18px 0 8px" }}>{s.title}</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
