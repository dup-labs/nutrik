import Icon from "@/components/ui/Icon";
import GradText from "@/components/ui/GradText";
import GradientRing from "@/components/ui/GradientRing";

const GRAD = "linear-gradient(115deg,#FE5F33 0%,#FEAF4C 30%,#ADB7F7 66%,#ADF3F3 100%)";

const week = [
  { d: "S", done: true  },
  { d: "T", done: true  },
  { d: "Q", done: true  },
  { d: "Q", done: true  },
  { d: "S", done: true  },
  { d: "S", done: false, today: true },
  { d: "D", done: false },
];

const bullets = [
  "Ofensiva por metas cumpridas, não por número na balança",
  "Lembretes gentis nos horários que fazem sentido pra você",
  "Conquistas que celebram a volta, não só a sequência perfeita",
];

export default function GamificacaoSection() {
  return (
    <section id="ofensiva" style={{ padding: "104px 0" }}>
      <div className="container">
        <div className="gami-grid">
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <span className="pill-label" style={{ alignSelf: "flex-start" }}>Sua ofensiva</span>
            <h2 className="h2" style={{ textAlign: "left" }}>Consistência, <GradText>não perfeição.</GradText></h2>
            <p className="lead" style={{ textAlign: "left", maxWidth: 460 }}>
              A ofensiva marca os dias em que você apareceu pra si mesmo. Perdeu um dia? Sem culpa — é só recomeçar amanhã. O que conta é voltar, não ser perfeito.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
              {bullets.map(t => (
                <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(254,95,51,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Icon name="check" size={12} color="#FE5F33" strokeWidth={2.6} />
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.5, color: "var(--ink)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal reveal-d1 gami-card">
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
              <GradientRing value={9} max={14} size={116} stroke={11}>
                <Icon name="flame" size={26} color="#FE5F33" />
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 30, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1 }}>9</span>
              </GradientRing>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--ink)" }}>9 dias seguidos</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-2)", marginTop: 2 }}>Seu recorde: 14 dias</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
              {week.map((w, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, flex: 1 }}>
                  <div style={{ width: "100%", aspectRatio: "1", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: w.done ? GRAD : w.today ? "rgba(254,95,51,0.10)" : "rgba(24,25,29,0.05)", border: w.today ? "2px dashed rgba(254,95,51,0.5)" : "none" }}>
                    {w.done  && <Icon name="check" size={16} color="#fff" strokeWidth={2.6} />}
                    {w.today && <Icon name="flame" size={15} color="#FE5F33" />}
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: "var(--ink-3)" }}>{w.d}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: "13px 16px", borderRadius: 14, background: "rgba(173,183,247,0.14)", display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="sparkle" size={17} color="#7B84C4" />
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--ink)", lineHeight: 1.4 }}>
                Faltam 5 dias pro seu recorde. Um de cada vez.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
