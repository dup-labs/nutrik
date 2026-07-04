import Icon from "@/components/ui/Icon";

const cards = [
  {
    role: "Nutricionista",
    icon: "utensils",
    iconColor: "#0DB9D7",
    headline: "Prescreva. Monitore. Ajuste.",
    desc: "Protocolos alimentares estruturados, rastreamento diário de aderência e histórico completo de composição corporal — integrados ao protocolo de treino.",
    items: [
      "Protocolos alimentares por fase",
      "Monitoramento de aderência por refeição",
      "Histórico de composição corporal",
      "Canal direto com o personal do paciente",
      "Alertas de inadimplência e pausas",
    ],
  },
  {
    role: "Personal Trainer",
    icon: "activity",
    iconColor: "var(--color-blue-glow)",
    headline: "Programe. Acompanhe. Evolua.",
    desc: "Planejamento semanal de cargas, controle de progressão e acompanhamento de desempenho — com visão do protocolo nutricional para decisões mais precisas.",
    items: [
      "Planejamento semanal de treinos",
      "Controle de cargas e progressão",
      "Acompanhamento de performance",
      "Acesso ao protocolo nutricional",
      "Feedback do paciente entre sessões",
    ],
  },
];

export default function ForWhom() {
  return (
    <section id="para-quem" style={{ padding: "64px 0 112px" }}>
      <div className="container">
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56, display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          <div className="label">Para quem</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 700, letterSpacing: "var(--tracking-tight)", color: "var(--color-text)", maxWidth: 500, lineHeight: 1.1 }}>
            Feito para profissionais que entendem que a constância do paciente é a principal receita para o sucesso.
          </h2>
        </div>

        <div className="whom-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {cards.map(({ role, icon, iconColor, headline, desc, items }, i) => (
            <div key={role} className={`glass reveal reveal-delay-${i + 1}`} style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: "var(--radius-md)", background: "var(--color-blue-subtle)", border: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={icon} size={20} color={iconColor} />
                </div>
                <div>
                  <div className="label" style={{ marginBottom: 4 }}>{role}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--color-text)", letterSpacing: "var(--tracking-tight)" }}>{headline}</h3>
                </div>
              </div>

              <p style={{ fontFamily: "var(--font-interface)", fontSize: 14, lineHeight: 1.65, color: "var(--color-text-muted)", margin: 0 }}>{desc}</p>

              <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--color-blue-subtle)", border: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name="check" size={10} color="var(--color-blue-glow)" />
                    </div>
                    <span style={{ fontFamily: "var(--font-interface)", fontSize: 13, color: "var(--color-text)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
