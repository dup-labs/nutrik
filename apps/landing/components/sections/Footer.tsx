function scrollTo(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
}

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "40px 0" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <img src="/nutrk-logo-dark.svg" alt="Nūtrk" style={{ height: 20 }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--ink-2)" }}>Sua melhor versão é um processo diário.</span>
        </div>
        <div style={{ display: "flex", gap: 28, fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-2)" }}>
          <a className="nav-link" onClick={() => scrollTo("pilares")}>Pilares</a>
          <a className="nav-link" onClick={() => scrollTo("app")}>O app</a>
          <a className="nav-link" onClick={() => scrollTo("faq")}>Dúvidas</a>
        </div>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-3)" }}>© 2026 Nūtrk</span>
      </div>
    </footer>
  );
}
