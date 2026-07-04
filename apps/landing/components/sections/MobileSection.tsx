import Icon from "@/components/ui/Icon";

const features = [
  { icon: "bell",      text: "Alertas em tempo real" },
  { icon: "users",     text: "Lista de pacientes"    },
  { icon: "msgCircle", text: "Feedback e dúvidas"    },
];

export default function MobileSection() {
  return (
    <section style={{ padding: "0 0 80px" }}>
      <div className="container">
        <div className="glass reveal mobile-banner" style={{ padding: "36px 40px", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
          <div style={{ width: 56, height: 56, borderRadius: "var(--radius-lg)", background: "var(--color-blue-subtle)", border: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="smartphone" size={26} color="var(--color-blue-glow)" />
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontFamily: "var(--font-interface)", fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: 8 }}>App mobile — nutricionista</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, letterSpacing: "var(--tracking-tight)", color: "var(--color-text)", margin: "0 0 8px" }}>
              Acompanhe seus pacientes de qualquer lugar.
            </h3>
            <p style={{ fontFamily: "var(--font-interface)", fontSize: 14, lineHeight: 1.6, color: "var(--color-text-muted)", margin: 0, maxWidth: 500 }}>
              Dashboard completo no celular — alertas de aderência, atualizações de protocolo e mensagens de pacientes onde você estiver.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
            {features.map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name={icon} size={14} color="var(--color-blue-glow)" />
                <span style={{ fontFamily: "var(--font-interface)", fontSize: 13, color: "var(--color-text-muted)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
