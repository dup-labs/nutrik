interface PhoneFrameProps {
  children: React.ReactNode;
  width?: number;
  style?: React.CSSProperties;
}

// canvas lógico em que as telas são desenhadas (área útil abaixo da status bar).
// o conteúdo é escalado por transform pra preencher o frame em qualquer largura —
// aumentar `width` amplia tudo junto (fonte, espaçamento) sem distorcer.
const CANVAS_W = 232;
const CANVAS_H = 480.5;

export default function PhoneFrame({ children, width = 300, style = {} }: PhoneFrameProps) {
  const scale = width / 300;
  const contentW = width - 20 * scale; // largura interna real (frame - padding)
  const childScale = contentW / CANVAS_W;
  return (
    <div style={{
      width,
      borderRadius: 46 * scale,
      background: "#FFFFFF",
      padding: 10 * scale,
      boxShadow: "0 40px 90px rgba(24,25,29,0.20), 0 8px 24px rgba(24,25,29,0.10), 0 0 0 1px rgba(24,25,29,0.06)",
      position: "relative",
      ...style,
    }}>
      <div style={{ borderRadius: 37 * scale, overflow: "hidden", background: "var(--page-bg)", position: "relative", height: 620 * scale }}>
        {/* status bar */}
        <div style={{ height: 40 * scale, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${22 * scale}px`, flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13 * scale, color: "var(--ink)" }}>9:41</span>
          <div style={{ display: "flex", gap: 5 * scale, alignItems: "center" }}>
            <svg width={15 * scale} height={11 * scale} viewBox="0 0 16 12" fill="#18191D">
              <rect x="0" y="4" width="2.6" height="8" rx="1"/>
              <rect x="4" y="2.5" width="2.6" height="9.5" rx="1"/>
              <rect x="8" y="1" width="2.6" height="11" rx="1"/>
              <rect x="12" y="0" width="2.6" height="12" rx="1"/>
            </svg>
            <div style={{ width: 20 * scale, height: 10 * scale, borderRadius: 3 * scale, border: "1.5px solid rgba(24,25,29,0.5)", padding: 1.4 * scale, display: "flex", alignItems: "center" }}>
              <div style={{ width: "80%", height: "100%", background: "#18191D", borderRadius: 1 }} />
            </div>
          </div>
        </div>
        {/* dynamic island */}
        <div style={{ position: "absolute", top: 9 * scale, left: "50%", transform: "translateX(-50%)", width: 92 * scale, height: 26 * scale, background: "#18191D", borderRadius: 9999, zIndex: 5 }} />
        {/* área de conteúdo — canvas lógico fixo escalado pra preencher o frame */}
        <div style={{ height: `calc(100% - ${40 * scale}px)`, overflow: "hidden", position: "relative" }}>
          <div style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${childScale})`, transformOrigin: "top left" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
