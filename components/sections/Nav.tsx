"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";

interface NavProps {
  onCTA: () => void;
}

export default function Nav({ onCTA }: NavProps) {
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <Image src="/nutrk-logo.svg" alt="Nūtrk" width={80} height={20} style={{ height: 20, width: "auto" }} priority />
        <div className="nav-links">
          <a href="#funcionalidades" className="nav-link">Funcionalidades</a>
          <a href="#para-quem" className="nav-link">Para quem</a>
          <a href="#acesso" className="nav-link">Acesso antecipado</a>
        </div>
        <Button variant="primary" size="sm" onClick={onCTA}>Solicitar acesso</Button>
      </div>
    </nav>
  );
}
