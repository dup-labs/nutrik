import AnimatedProductShowcase from "@/components/showcase/AnimatedProductShowcase";

export default function ShowcaseSection() {
  return (
    <section style={{ padding: "32px 0 112px", position: "relative", overflow: "hidden", background: "linear-gradient(180deg, transparent, rgba(11,16,32,0.4) 15%, rgba(11,16,32,0.4) 85%, transparent)" }}>
      <div style={{ position: "absolute", bottom: "5%", left: "50%", transform: "translateX(-50%)", width: "70%", height: 200, background: "radial-gradient(ellipse, rgba(109,164,183,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div className="container">
        <div className="reveal" style={{ textAlign: "center", marginBottom: 44, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <div className="label">O produto</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, letterSpacing: "var(--tracking-tight)", color: "var(--color-text)", lineHeight: 1.1 }}>
            Precisão de laboratório.<br />Clareza de dashboard.
          </h2>
        </div>
        <div className="reveal">
          <AnimatedProductShowcase />
        </div>
      </div>
    </section>
  );
}
