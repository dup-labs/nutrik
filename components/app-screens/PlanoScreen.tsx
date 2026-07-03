import Icon from "@/components/ui/Icon";
import TabBar from "./TabBar";

const GRAD = "var(--grad)";
const PAD: React.CSSProperties = { padding: "14px 18px 74px", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" };

const items = [
  { icon: "dumbbell", tint: "#FE5F33", title: "Força superior",    sub: "Treino · 45 min",    done: false },
  { icon: "leaf",     tint: "#52D48A", title: "Almoço equilibrado", sub: "Nutrição · 620 kcal", done: true  },
  { icon: "mind",     tint: "#ADB7F7", title: "Respiração guiada",  sub: "Mente · 5 min",       done: false },
  { icon: "drop",     tint: "#2CD4FF", title: "Hidratação",         sub: "1,4 / 2 L",           done: false },
];

export default function PlanoScreen() {
  return (
    <div style={PAD}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-2)" }}>Olá, Amélie</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.1 }}>Seu dia de hoje</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 9999, background: "rgba(254,95,51,0.10)", border: "1px solid rgba(254,95,51,0.20)" }}>
          <Icon name="flame" size={14} color="#FE5F33" />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "#FE5F33" }}>9</span>
        </div>
      </div>

      <div style={{ borderRadius: 20, padding: "16px 18px", background: GRAD, color: "#fff", marginBottom: 14, position: "relative", overflow: "hidden" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.9 }}>Progresso de hoje</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "4px 0 10px" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 30, letterSpacing: "-0.03em" }}>2</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, opacity: 0.92 }}>de 4 metas</span>
        </div>
        <div style={{ height: 7, borderRadius: 9999, background: "rgba(255,255,255,0.32)", overflow: "hidden" }}>
          <div style={{ width: "50%", height: "100%", borderRadius: 9999, background: "#fff" }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map(it => (
          <div key={it.title} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 16, background: "#fff", border: "1px solid rgba(24,25,29,0.07)", boxShadow: "0 1px 3px rgba(24,25,29,0.04)" }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: `${it.tint}1f`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={it.icon} size={19} color={it.tint} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink)", letterSpacing: "-0.01em" }}>{it.title}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11.5, color: "var(--ink-2)" }}>{it.sub}</div>
            </div>
            <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: it.done ? "#52D48A" : "transparent", border: it.done ? "none" : "2px solid rgba(24,25,29,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {it.done && <Icon name="check" size={13} color="#fff" strokeWidth={2.6} />}
            </div>
          </div>
        ))}
      </div>
      <TabBar active="home" />
    </div>
  );
}
