import GradientRing from "@/components/ui/GradientRing";
import Icon from "@/components/ui/Icon";
import TabBar from "./TabBar";

const GRAD = "var(--grad)";
const PAD: React.CSSProperties = { padding: "14px 18px 74px", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "radial-gradient(120% 90% at 50% 0%, rgba(173,183,247,0.28), rgba(173,243,243,0.14) 55%, transparent 80%)" };

export default function RespiracaoScreen() {
  return (
    <div style={PAD}>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-2)", marginBottom: 6 }}>Mente</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.15, maxWidth: 220, marginBottom: 26 }}>
        Respire fundo e foque no agora.
      </div>
      <GradientRing value={62} max={100} size={186} stroke={5} trackColor="rgba(24,25,29,0.06)">
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 40, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1 }}>04:15</span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-2)", marginTop: 4 }}>tempo restante</span>
      </GradientRing>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 30 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(24,25,29,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="moon" size={19} color="var(--ink-2)" />
        </div>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px rgba(254,95,51,0.32)" }}>
          <Icon name="pause" size={24} color="#fff" strokeWidth={0} style={{ fill: "#fff" }} />
        </div>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(24,25,29,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="heart" size={19} color="var(--ink-2)" />
        </div>
      </div>
      <TabBar active="mente" />
    </div>
  );
}
