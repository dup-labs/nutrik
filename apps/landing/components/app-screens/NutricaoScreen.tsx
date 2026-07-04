import GradientRing from "@/components/ui/GradientRing";
import TabBar from "./TabBar";

const PAD: React.CSSProperties = { padding: "14px 18px 74px", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" };

const macros = [
  { l: "Proteínas", v: 130, max: 150, c: "#FE5F33" },
  { l: "Carbos",    v: 220, max: 260, c: "#ADB7F7" },
  { l: "Gorduras",  v: 60,  max: 70,  c: "#FEAF4C" },
];

export default function NutricaoScreen() {
  return (
    <div style={PAD}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-2)" }}>Nutrição · hoje</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink)" }}>Seu equilíbrio</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 16px" }}>
        <GradientRing value={1870} max={2200} size={172} stroke={15}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 34, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1 }}>1.870</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-2)", marginTop: 2 }}>de 2.200 kcal</span>
        </GradientRing>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px", borderRadius: 18, background: "#fff", border: "1px solid rgba(24,25,29,0.07)", boxShadow: "0 1px 3px rgba(24,25,29,0.04)" }}>
        {macros.map(m => (
          <div key={m.l}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, fontWeight: 500, color: "var(--ink)" }}>{m.l}</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12.5, color: "var(--ink-2)" }}>{m.v}g</span>
            </div>
            <div style={{ height: 6, borderRadius: 9999, background: "rgba(24,25,29,0.07)", overflow: "hidden" }}>
              <div style={{ width: `${(m.v / m.max) * 100}%`, height: "100%", borderRadius: 9999, background: m.c }} />
            </div>
          </div>
        ))}
      </div>
      <TabBar active="nutri" />
    </div>
  );
}
