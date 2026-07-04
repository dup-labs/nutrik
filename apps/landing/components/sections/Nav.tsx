"use client";

import { useState, useEffect } from "react";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
}

export default function Nav({ onCTA }: { onCTA: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`site-nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <img src="/nutrk-logo-dark.svg" alt="Nūtrk" style={{ height: 22 }} />
        <div className="nav-links">
          <a className="nav-link" onClick={() => scrollTo("pilares")}>Pilares</a>
          <a className="nav-link" onClick={() => scrollTo("app")}>O app</a>
          <a className="nav-link" onClick={() => scrollTo("como-funciona")}>Como funciona</a>
          <a className="nav-link" onClick={() => scrollTo("faq")}>Dúvidas</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn btn-primary btn-sm" onClick={onCTA}>Solicitar acesso</button>

          {/* acesso discreto aos apps (fase de lista de espera) */}
          <div style={{ position: "relative" }}>
            <button
              aria-label="menu"
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                width: 32,
                height: 32,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                padding: 0,
                opacity: 0.55,
              }}
            >
              <span style={{ width: 15, height: 1.5, background: "var(--ink)", borderRadius: 2 }} />
              <span style={{ width: 15, height: 1.5, background: "var(--ink)", borderRadius: 2 }} />
            </button>

            {menuOpen && (
              <>
                <div
                  onClick={() => setMenuOpen(false)}
                  style={{ position: "fixed", inset: 0, zIndex: 90 }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 40,
                    right: 0,
                    zIndex: 91,
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    boxShadow: "0 12px 40px rgba(24,25,29,0.12)",
                    padding: 6,
                    minWidth: 190,
                  }}
                >
                  {[
                    { label: "entrar · paciente", href: "https://app.nutrk.io/entrada" },
                    { label: "entrar · profissional", href: "https://app.nutrk.io/pro/entrada" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      style={{
                        display: "block",
                        padding: "10px 14px",
                        borderRadius: 8,
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: "var(--ink)",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(24,25,29,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
