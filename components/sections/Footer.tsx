import Image from "next/image";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "36px 0" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <Image src="/nutrk-logo.svg" alt="Nūtrk" width={80} height={18} style={{ height: 18, width: "auto", opacity: 0.75 }} />
          <span style={{ fontFamily: "var(--font-interface)", fontSize: 12, color: "var(--color-text-muted)", letterSpacing: "0.02em" }}>Feito de consistência.</span>
        </div>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 12, color: "var(--color-text-disabled)" }}>© 2026 Nūtrk · Dup.Labs</span>
      </div>
    </footer>
  );
}
