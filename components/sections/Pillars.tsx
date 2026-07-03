import Icon from "@/components/ui/Icon";
import GradText from "@/components/ui/GradText";

const cards = [
  { icon: "leaf",     tint: "#52D48A", photo: "/photos/mente.png",    kicker: "Nutrição", title: "que te move.",      desc: "Refeições equilibradas e do seu jeito. Sem dieta punitiva — comida que te dá energia pro dia." },
  { icon: "dumbbell", tint: "#FE5F33", photo: "/photos/treino.png",   kicker: "Treino",   title: "que te fortalece.", desc: "Treinos personalizados pro seu momento. Comece leve, evolua no seu tempo, sinta a diferença." },
  { icon: "mind",     tint: "#ADB7F7", photo: "/photos/nutricao.png", kicker: "Mente",    title: "que te equilibra.", desc: "Respiração e pausas guiadas pra desacelerar. Cuidar da cabeça também faz parte do processo." },
];

export default function Pillars() {
  return (
    <section id="pilares" style={{ padding: "40px 0 96px" }}>
      <div className="container">
        <div className="reveal" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <span className="pill-label">Três pilares, um só app</span>
          <h2 className="h2">Saúde não é uma coisa só. <GradText>É o conjunto.</GradText></h2>
        </div>
        <div className="pillar-grid">
          {cards.map((c, i) => (
            <div key={c.kicker} className={`pillar-card reveal reveal-d${i}`}>
              <div className="pillar-photo" style={{ backgroundImage: `url('${c.photo}')` }}>
                <div className="pillar-chip">
                  <Icon name={c.icon} size={20} color={c.tint} />
                </div>
              </div>
              <div style={{ padding: "22px 24px 26px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 10 }}>
                  <span style={{ color: "var(--ink)" }}>{c.kicker} </span>
                  <span style={{ color: c.tint }}>{c.title}</span>
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)", margin: 0 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
