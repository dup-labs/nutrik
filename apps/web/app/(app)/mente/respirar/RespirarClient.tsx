"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconCheck, IconClose } from "@/components/ui/icons";
import { logBreath } from "@/lib/actions";

type Phase = { name: string; dur: number; scale: number };

function phasesFor(kind: string): { total: number; phases: Phase[] } {
  if (kind === "box")
    return {
      total: 120,
      phases: [
        { name: "inspira", dur: 4, scale: 1 },
        { name: "segura", dur: 4, scale: 1 },
        { name: "expira", dur: 4, scale: 0.62 },
        { name: "segura", dur: 4, scale: 0.62 },
      ],
    };
  return {
    total: 60,
    phases: [
      { name: "inspira", dur: 4, scale: 1 },
      { name: "expira", dur: 6, scale: 0.62 },
    ],
  };
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return `${m}:${r < 10 ? "0" : ""}${r}`;
}

export function RespirarClient() {
  const router = useRouter();
  const params = useSearchParams();
  const kind = params.get("tipo") === "box" ? "box" : "pausa";
  const cfg = useRef(phasesFor(kind)).current;

  const [remaining, setRemaining] = useState(cfg.total);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseRemaining, setPhaseRemaining] = useState(cfg.phases[0].dur);
  const [done, setDone] = useState(false);
  const logged = useRef(false);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          setDone(true);
          if (!logged.current) {
            logged.current = true;
            logBreath({ kind, durationS: cfg.total });
          }
          return 0;
        }
        return r - 1;
      });
      setPhaseRemaining((pr) => {
        if (pr <= 1) {
          setPhaseIdx((i) => (i + 1) % cfg.phases.length);
          return 0; // corrigido no efeito abaixo
        }
        return pr - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  useEffect(() => {
    if (phaseRemaining === 0 && !done) {
      setPhaseRemaining(cfg.phases[phaseIdx].dur);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIdx]);

  const phase = cfg.phases[phaseIdx];
  const hint =
    phase.name === "segura"
      ? "segure com leveza"
      : phase.name === "expira"
        ? "solte devagar"
        : "acompanhe o círculo";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "var(--mesh-fresh)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 22px 0",
          zIndex: 3,
        }}
      >
        <button
          onClick={() => router.push("/mente")}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.35)",
            background: "var(--glass-bg-tint)",
            backdropFilter: "var(--glass-blur)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <IconClose size={18} />
        </button>
        <div
          style={{
            fontFamily: "var(--font-data)",
            fontWeight: 700,
            fontSize: 15,
            color: "#fff",
            background: "var(--glass-bg-tint)",
            backdropFilter: "var(--glass-blur)",
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: "var(--radius-pill)",
            padding: "8px 16px",
          }}
        >
          {fmt(remaining)}
        </div>
      </div>

      {!done ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 280,
              height: 280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 280,
                height: 280,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.35)",
              }}
            />
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "var(--glass-bg-strong)",
                backdropFilter: "var(--glass-blur-strong)",
                boxShadow: "var(--glass-shadow-lift)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${phase.scale})`,
                transition: `transform ${phase.dur}s var(--ease-out)`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 24,
                  letterSpacing: "-0.02em",
                  color: "var(--color-text)",
                }}
              >
                {phase.name}
              </span>
            </div>
          </div>
          <div
            style={{
              marginTop: 44,
              fontSize: 15,
              color: "#fff",
              fontWeight: 500,
              textShadow: "0 1px 4px rgba(27,28,29,0.15)",
            }}
          >
            {hint}
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 30px",
          }}
        >
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              background: "var(--glass-bg-strong)",
              backdropFilter: "var(--glass-blur-strong)",
              boxShadow: "var(--glass-shadow-lift)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "ntrkPop .5s var(--ease-spring) both",
            }}
          >
            <IconCheck size={52} color="#fe5f33" />
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: 26,
              letterSpacing: "-0.03em",
              color: "#fff",
              textAlign: "center",
              textShadow: "0 1px 6px rgba(27,28,29,0.18)",
            }}
          >
            respiração concluída.
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 15,
              lineHeight: 1.5,
              color: "#fff",
              textAlign: "center",
              opacity: 0.95,
            }}
          >
            você cuidou da sua mente hoje. isso conta pra sua ofensiva.
          </div>
          <button
            onClick={() => {
              router.push("/mente");
              router.refresh();
            }}
            style={{
              marginTop: 32,
              height: 52,
              padding: "0 40px",
              borderRadius: "var(--radius-pill)",
              border: "none",
              background: "#fff",
              color: "var(--color-orange)",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "var(--shadow-elevated)",
            }}
          >
            voltar
          </button>
        </div>
      )}
    </div>
  );
}
