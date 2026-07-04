"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

const qs = [
  { q: "O Nutrk é pra quem já treina ou pra quem tá começando?",  a: "Pros dois. O plano se ajusta ao seu momento — dá pra começar bem leve e ir evoluindo no seu ritmo, sem pressão de performance." },
  { q: "Preciso ser atleta ou seguir dieta rígida?",               a: "Não. A proposta é justamente o contrário: cuidar da saúde de forma leve e sustentável, com metas realistas que cabem na sua rotina." },
  { q: "Como funciona a lista de espera?",                         a: "Você deixa seu nome e e-mail e entra na fila do acesso antecipado. Assim que abrimos novas vagas, avisamos por e-mail — sem compromisso." },
  { q: "Nutrição, treino e mente ficam tudo no mesmo app?",        a: "Sim. Essa é a ideia central do Nutrk: os três pilares conversam entre si num plano diário único, em vez de você pular entre vários apps." },
  { q: "Sou nutricionista ou personal. Dá pra usar com meus clientes?", a: "Estamos preparando uma porta para profissionais acompanharem quem cuidam dentro do Nutrk. Entre na lista e marque seu interesse — te contamos em primeira mão." },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" style={{ padding: "96px 0" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 44, display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          <span className="pill-label">Dúvidas</span>
          <h2 className="h2">Perguntas frequentes</h2>
        </div>
        <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {qs.map((item, i) => (
            <div key={i} className="faq-item" style={{ borderColor: open === i ? "rgba(254,95,51,0.3)" : "rgba(24,25,29,0.08)" }}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink)", textAlign: "left" }}>{item.q}</span>
                <span style={{ flexShrink: 0, transition: "transform 0.3s ease", transform: open === i ? "rotate(180deg)" : "none", display: "flex" }}>
                  <Icon name="chevron" size={20} color={open === i ? "#FE5F33" : "var(--ink-3)"} />
                </span>
              </button>
              <div style={{ maxHeight: open === i ? 200 : 0, overflow: "hidden", transition: "max-height 0.35s cubic-bezier(0.2,0,0,1)" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.65, color: "var(--ink-2)", margin: 0, padding: "0 24px 22px" }}>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
