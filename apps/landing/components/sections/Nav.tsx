"use client";

import { useState, useEffect } from "react";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
}

export default function Nav({ onCTA }: { onCTA: () => void }) {
  const [scrolled, setScrolled] = useState(false);

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
        <button className="btn btn-primary btn-sm" onClick={onCTA}>Solicitar acesso</button>
      </div>
    </nav>
  );
}
