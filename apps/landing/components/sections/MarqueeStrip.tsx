export default function MarqueeStrip() {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "14px 0", overflow: "hidden", background: "rgba(109,164,183,0.03)" }}>
      <div className="marquee-track">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", padding: "0 48px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 48 }}>
            Feito de consistência.
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--color-blue-glow)", flexShrink: 0 }} />
          </span>
        ))}
      </div>
    </div>
  );
}
