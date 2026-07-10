"use client";

import { useState } from "react";

// prints reais do app (1290×2796). ordem = ordem no deck do carrossel.
const SHOTS = [
  { src: "/app-shots/hoje.png", alt: "Tela inicial do dia no nūtrk" },
  { src: "/app-shots/treino.png", alt: "Treino do dia com exercícios" },
  { src: "/app-shots/refeicoes.png", alt: "Refeições do dia com macros" },
  { src: "/app-shots/agua.png", alt: "Hidratação do dia" },
  { src: "/app-shots/mente.jpg", alt: "Respiração guiada" },
  { src: "/app-shots/consistencia.png", alt: "Consistência e progresso da semana" },
];

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}

export default function AppCarousel() {
  const [active, setActive] = useState(0);
  const n = SHOTS.length;
  const go = (d: number) => setActive((a) => (a + d + n) % n);

  // deslocamento assinado mais curto do item i em relação ao ativo (deck circular)
  const offsetOf = (i: number) => {
    let o = i - active;
    if (o > n / 2) o -= n;
    else if (o < -n / 2) o += n;
    return o;
  };

  return (
    <div className="carousel">
      <button className="car-arrow" data-side="left" onClick={() => go(-1)} aria-label="tela anterior">
        <Chevron dir="left" />
      </button>

      <div className="car-stage">
        {SHOTS.map((s, i) => {
          const o = offsetOf(i);
          const abs = Math.abs(o);
          const shown = abs <= 1;
          const center = o === 0;
          return (
            <button
              key={s.src}
              className="car-phone"
              aria-hidden={!shown}
              tabIndex={center ? 0 : -1}
              onClick={() => !center && setActive(i)}
              style={{
                transform: `translateX(${o * 60}%) translateY(${center ? -22 : 24}px) scale(${center ? 1 : 0.82}) rotateY(${o * -9}deg)`,
                zIndex: 30 - abs,
                opacity: shown ? 1 : 0,
                pointerEvents: shown ? "auto" : "none",
                cursor: center ? "default" : "pointer",
              }}
            >
              <span className="phone-photo">
                <span className="screen" style={{ backgroundImage: `url(${s.src})` }} />
              </span>
            </button>
          );
        })}
      </div>

      <button className="car-arrow" data-side="right" onClick={() => go(1)} aria-label="próxima tela">
        <Chevron dir="right" />
      </button>

      <div className="car-dots">
        {SHOTS.map((s, i) => (
          <button
            key={s.src}
            className={i === active ? "on" : ""}
            onClick={() => setActive(i)}
            aria-label={`ir para a tela ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
