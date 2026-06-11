"use client";

import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

interface HeroProps {
  onCTA: () => void;
}

const stats = [
  { n: "48",  l: "pacientes monitorados" },
  { n: "87%", l: "aderência média"       },
  { n: "12",  l: "dias de streak"        },
];

export default function Hero({ onCTA }: HeroProps) {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 64, overflow: "hidden", position: "relative" }}>
      {/* Atmospheric glow */}
      <div style={{ position: "absolute", top: "20%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,164,183,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div className="container hero-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1.15fr", gap: 40, alignItems: "center", padding: "88px 48px" }}>

        {/* Copy */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <Badge variant="blue" dot>Acesso antecipado — vagas limitadas</Badge>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 4.5vw, 62px)", fontWeight: 800, letterSpacing: "var(--tracking-tight)", lineHeight: 1.05, color: "var(--color-text)" }}>
              O protocolo que mantém o paciente consistente.
            </h1>
            <p style={{ fontFamily: "var(--font-interface)", fontSize: 17, lineHeight: 1.65, color: "var(--color-text-muted)", maxWidth: 440 }}>
              Nūtrk conecta nutricionistas e personal trainers em uma plataforma única — do registro ao resultado, sem lacunas no protocolo.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <Button variant="primary" size="lg" pulse onClick={onCTA}>Solicitar acesso antecipado</Button>
            <a
              href="#funcionalidades"
              style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-interface)", fontSize: 14, fontWeight: 500, color: "var(--color-text-muted)", textDecoration: "none", transition: "color var(--transition-fast)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              Ver funcionalidades <Icon name="arrowR" size={14} color="currentColor" />
            </a>
          </div>

          {/* Stats */}
          {/* <div style={{ display: "flex", gap: 32, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {stats.map(({ n, l }) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: 26, color: "var(--color-blue-glow)", lineHeight: 1 }}>{n}</span>
                <span style={{ fontFamily: "var(--font-interface)", fontSize: 12, color: "var(--color-text-muted)" }}>{l}</span>
              </div>
            ))}
          </div> */}
        </div>

        {/* App frame */}
        <div className="hero-visual" style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -60, background: "radial-gradient(ellipse, rgba(109,164,183,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div className="app-frame" style={{ transform: "perspective(1400px) rotateX(2.5deg) rotateY(-5deg)", position: "relative" }}>
            <div className="frame-chrome">
              <div className="frame-dots">
                {["#FF5F57", "#FFBD2E", "#28CA41"].map(c => <div key={c} className="frame-dot" style={{ background: c }} />)}
              </div>
              <div className="frame-url">app.nutrk.com</div>
            </div>
            <Image src="/dashboard-new.png" alt="Dashboard Nūtrk" width={2612} height={1804} style={{ width: "100%", display: "block" }} priority />
          </div>
        </div>
      </div>
    </section>
  );
}
