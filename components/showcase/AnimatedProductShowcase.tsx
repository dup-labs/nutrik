"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";

/* ── Section label helper ──────────────────────────────── */
function SL({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontFamily: "var(--font-interface)", fontSize: 9, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)", ...style }}>
      {children}
    </div>
  );
}

/* ── App Top Bar ───────────────────────────────────────── */
function AppTopBar({ title }: { title: string }) {
  return (
    <div style={{ height: 48, flexShrink: 0, background: "rgba(5,7,11,0.55)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--color-text)", letterSpacing: "var(--tracking-tight)" }}>{title}</span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "var(--glass-border)", borderRadius: "var(--radius-md)", padding: "5px 10px", display: "flex", gap: 6, alignItems: "center", width: 148 }}>
          <Icon name="search" size={11} color="var(--color-text-disabled)" />
          <span style={{ fontFamily: "var(--font-interface)", fontSize: 11, color: "var(--color-text-disabled)" }}>Buscar...</span>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-blue-subtle)", border: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-interface)", fontSize: 9, fontWeight: 700, color: "var(--color-blue-glow)" }}>BS</div>
      </div>
    </div>
  );
}

/* ── Screen: Dashboard ─────────────────────────────────── */
function ShowDashboard() {
  const pts = [
    { i: "JF", n: "João Ferreira", s: "ativo",   p: 87, d: false },
    { i: "AC", n: "Ana Costa",     s: "ativo",   p: 72, d: true  },
    { i: "PL", n: "Pedro Lima",    s: "ativo",   p: 91, d: false },
    { i: "CS", n: "Carla Souza",   s: "pausado", p: 45, d: false },
    { i: "LM", n: "Lucas Mendes",  s: "ativo",   p: 68, d: true  },
    { i: "SR", n: "Sofia Rocha",   s: "ativo",   p: 95, d: false },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AppTopBar title="Dashboard" />
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: "14px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 12 }}>
          {[["48","Pacientes Ativos"],["7","Agendamentos Hoje"],["3","Alertas"],["2","Inadimplentes"]].map(([n, l]) => (
            <div key={l} style={{ background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)", border: "var(--glass-border)", padding: "10px 12px" }}>
              <SL style={{ marginBottom: 5 }}>{l}</SL>
              <div style={{ fontFamily: "var(--font-data)", fontSize: 26, color: "var(--color-text)", lineHeight: 1 }}>{n}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)", border: "var(--glass-border)", overflow: "hidden" }}>
          <div style={{ padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <SL>Pacientes</SL>
            <div style={{ display: "flex", gap: 4 }}>
              {["Todos","Ativos","Pausados"].map((f, j) => (
                <span key={f} style={{ padding: "2px 7px", fontSize: 9, fontFamily: "var(--font-interface)", fontWeight: j === 0 ? 500 : 400, borderRadius: "var(--radius-full)", border: j === 0 ? "var(--glass-border)" : "1px solid rgba(255,255,255,0.06)", background: j === 0 ? "var(--color-blue-subtle)" : "transparent", color: j === 0 ? "var(--color-blue-glow)" : "var(--color-text-muted)" }}>{f}</span>
              ))}
            </div>
          </div>
          {pts.map(p => (
            <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-blue-subtle)", border: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontFamily: "var(--font-interface)", fontWeight: 600, color: "var(--color-blue-glow)", flexShrink: 0 }}>{p.i}</div>
              <span style={{ fontFamily: "var(--font-interface)", fontSize: 12, fontWeight: 500, color: "var(--color-text)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.n}</span>
              <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 4, fontFamily: "var(--font-interface)", fontWeight: 500, background: p.s === "ativo" ? "rgba(109,164,183,0.12)" : "rgba(255,255,255,0.06)", border: p.s === "ativo" ? "var(--glass-border)" : "1px solid rgba(255,255,255,0.06)", color: p.s === "ativo" ? "var(--color-blue-glow)" : "var(--color-text-muted)", flexShrink: 0 }}>{p.s.toUpperCase()}</span>
              <div style={{ width: 48, flexShrink: 0 }}><div style={{ height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 9999 }}><div style={{ width: `${p.p}%`, height: "100%", background: p.p >= 85 ? "var(--color-blue-glow)" : p.p >= 65 ? "#4a8fa0" : "var(--color-error)", borderRadius: 9999 }}/></div></div>
              <span style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--color-text-muted)", minWidth: 24, textAlign: "right", flexShrink: 0 }}>{p.p}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Screen: Paciente ──────────────────────────────────── */
function ShowPaciente() {
  const scores = [
    { l: "Aderência Dieta", v: 84, c: "#0DB9D7",                icon: "utensils" },
    { l: "Treino",          v: 91, c: "var(--color-blue-glow)", icon: "activity" },
    { l: "Sono",            v: 72, c: "#9B59B6",                icon: "moon"     },
    { l: "Engajamento",     v: 88, c: "#FFB23A",                icon: "zap"      },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AppTopBar title="Pacientes" />
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: "12px 20px" }}>
        <div style={{ fontFamily: "var(--font-interface)", fontSize: 12, color: "var(--color-text-muted)", marginBottom: 10 }}>Pacientes <span style={{ color: "var(--color-text)" }}>› João Ferreira</span></div>
        <div style={{ background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)", border: "var(--glass-border)", padding: "12px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--color-blue-subtle)", border: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-interface)", fontWeight: 700, fontSize: 14, color: "var(--color-blue-glow)", flexShrink: 0 }}>JF</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--color-text)", letterSpacing: "var(--tracking-tight)" }}>João Ferreira</span>
              <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 4, fontFamily: "var(--font-interface)", fontWeight: 500, background: "rgba(109,164,183,0.12)", border: "var(--glass-border)", color: "var(--color-blue-glow)", flexShrink: 0 }}>ATIVO</span>
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {["Musculação","Emagrecimento","26 anos","84 kg"].map(t => (
                <span key={t} style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontFamily: "var(--font-interface)", color: "var(--color-text-muted)" }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
            <svg width="52" height="52" viewBox="0 0 52 52" style={{ position: "absolute", inset: 0 }}>
              <defs>
                <linearGradient id="ag-p" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF8A00"/><stop offset="100%" stopColor="#FFD080"/></linearGradient>
              </defs>
              <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,178,58,0.10)" strokeWidth="2" />
              <circle cx="26" cy="26" r="22" fill="none" stroke="url(#ag-p)" strokeWidth="2" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 22 * 0.4} ${2 * Math.PI * 22}`} strokeDashoffset={2 * Math.PI * 22 * 0.25} transform="rotate(-90 26 26)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 12, fontFamily: "var(--font-data)", color: "var(--color-amber)", lineHeight: 1 }}>12</span>
              <span style={{ fontSize: 7, fontFamily: "var(--font-interface)", color: "var(--color-text-muted)" }}>dias</span>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
          {scores.map(({ l, v, c, icon }) => (
            <div key={l} style={{ background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)", border: "var(--glass-border)", padding: "9px 10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><SL>{l}</SL><Icon name={icon} size={11} color={c} /></div>
              <div style={{ fontFamily: "var(--font-data)", fontSize: 18, color: c, lineHeight: 1, marginBottom: 5 }}>{v}%</div>
              <div style={{ height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 9999 }}><div style={{ width: `${v}%`, height: "100%", background: c, borderRadius: 9999 }}/></div>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)", border: "var(--glass-border)", overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {["Protocolo","Histórico","Resultados","Dúvidas"].map((t, j) => (
              <div key={t} style={{ padding: "8px 14px", fontSize: 11, fontFamily: "var(--font-interface)", fontWeight: j === 0 ? 500 : 400, color: j === 0 ? "var(--color-text)" : "var(--color-text-muted)", borderBottom: j === 0 ? "2px solid var(--color-blue-glow)" : "2px solid transparent", marginBottom: -1 }}>{t}</div>
            ))}
          </div>
          <div style={{ padding: "12px 14px", display: "flex", gap: 8 }}>
            {[{type:"Protocolo Alimentar",proto:"Cutting Q2 2026",icon:"utensils"},{type:"Protocolo de Treino",proto:"Hipertrofia — Fase 2",icon:"activity"}].map(({ type, proto, icon }) => (
              <div key={type} style={{ flex: 1, background: "rgba(109,164,183,0.05)", borderRadius: "var(--radius-md)", border: "var(--glass-border)", padding: "10px 12px" }}>
                <SL style={{ marginBottom: 4 }}>{type}</SL>
                <div style={{ fontFamily: "var(--font-interface)", fontSize: 12, fontWeight: 500, color: "var(--color-text)", marginBottom: 6 }}>{proto}</div>
                <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 4, fontFamily: "var(--font-interface)", fontWeight: 500, background: "var(--color-blue-subtle)", border: "var(--glass-border)", color: "var(--color-blue-glow)" }}>ATIVO</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Screen: Agenda ────────────────────────────────────── */
function ShowAgenda() {
  const wk = [{d:"Seg",n:9},{d:"Ter",n:10},{d:"Qua",n:11,a:true as boolean},{d:"Qui",n:12},{d:"Sex",n:13},{d:"Sáb",n:14}];
  const appts = [
    {t:"09:00",n:"Sofia Rocha",   tp:"Retorno",    i:"SR"},
    {t:"10:30",n:"Pedro Lima",    tp:"Avaliação",  i:"PL"},
    {t:"13:30",n:"João Ferreira", tp:"Consulta",   i:"JF"},
    {t:"15:00",n:"Ana Costa",     tp:"Retorno",    i:"AC"},
    {t:"16:30",n:"Lucas Mendes",  tp:"1ª Consulta",i:"LM"},
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AppTopBar title="Agenda" />
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: "14px 20px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 12, background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)", border: "var(--glass-border)", padding: "8px 10px" }}>
          {wk.map(({ d, n, a }) => (
            <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "5px 4px", borderRadius: "var(--radius-sm)", background: a ? "var(--color-blue-subtle)" : "transparent", border: a ? "var(--glass-border)" : "1px solid transparent" }}>
              <span style={{ fontFamily: "var(--font-interface)", fontSize: 8, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: a ? "var(--color-blue-glow)" : "var(--color-text-muted)" }}>{d}</span>
              <span style={{ fontFamily: "var(--font-data)", fontSize: 13, color: a ? "var(--color-text)" : "var(--color-text-muted)" }}>{n}</span>
              {a && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--color-blue-glow)" }}/>}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {appts.map(({ t, n, tp, i }) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 14px", background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)", border: "var(--glass-border)" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: 12, color: "var(--color-text-muted)", minWidth: 38, flexShrink: 0 }}>{t}</span>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--color-blue-subtle)", border: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontFamily: "var(--font-interface)", fontWeight: 700, color: "var(--color-blue-glow)", flexShrink: 0 }}>{i}</div>
              <span style={{ fontFamily: "var(--font-interface)", fontSize: 13, fontWeight: 500, color: "var(--color-text)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n}</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, fontFamily: "var(--font-interface)", color: "var(--color-text-muted)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>{tp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Screen: Protocolos ────────────────────────────────── */
function ShowProtocolo() {
  const [day, setDay] = useState(0);
  const days = ["SEG","TER","QUA","QUI","SEX","SÁB"];
  const names = ["Peito + Tríceps","Costas + Bíceps","Descanso","Pernas","Ombros","Cardio"];
  const exs = [
    {n:"Supino Reto",      s:"4",r:"10–12",l:"80 kg"},
    {n:"Supino Inclinado", s:"3",r:"12",   l:"60 kg"},
    {n:"Crucifixo",        s:"3",r:"15",   l:"20 kg"},
    {n:"Tríceps Pulley",   s:"4",r:"12",   l:"35 kg"},
    {n:"Tríceps Testa",    s:"3",r:"12",   l:"25 kg"},
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AppTopBar title="Protocolos" />
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: "12px 20px" }}>
        <div style={{ fontFamily: "var(--font-interface)", fontSize: 12, color: "var(--color-text-muted)", marginBottom: 10 }}>Protocolos <span style={{ color: "var(--color-text)" }}>› João Ferreira</span></div>
        <div style={{ background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)", border: "var(--glass-border)", padding: "10px 14px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--color-text)", letterSpacing: "var(--tracking-tight)" }}>Hipertrofia — Fase 2</div>
            <div style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--color-text-muted)", marginTop: 2 }}>01 Jun — 01 Jul 2026 · {names[day]}</div>
          </div>
          <span style={{ fontSize: 8, padding: "2px 7px", borderRadius: 4, fontFamily: "var(--font-interface)", fontWeight: 500, background: "var(--color-blue-subtle)", border: "var(--glass-border)", color: "var(--color-blue-glow)", flexShrink: 0 }}>ATIVO</span>
        </div>
        <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
          {days.map((d, i) => (
            <button key={d} onClick={() => setDay(i)} style={{ padding: "5px 10px", borderRadius: "var(--radius-md)", border: day === i ? "var(--glass-border-elevated)" : "1px solid rgba(255,255,255,0.07)", background: day === i ? "var(--color-blue-subtle)" : "var(--color-surface)", color: day === i ? "var(--color-blue-glow)" : "var(--color-text-muted)", fontSize: 11, fontFamily: "var(--font-data)", cursor: "pointer" }}>{d}</button>
          ))}
        </div>
        <div style={{ background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)", border: "var(--glass-border)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 36px 52px 60px", gap: 8, padding: "7px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            {["EXERCÍCIO","SÉR","REPS","CARGA"].map(h => <SL key={h}>{h}</SL>)}
          </div>
          {day === 2
            ? <div style={{ padding: "20px 14px", fontFamily: "var(--font-interface)", fontSize: 13, color: "var(--color-text-muted)", textAlign: "center" }}>Dia de descanso.</div>
            : exs.map(({ n, s, r, l }) => (
              <div key={n} style={{ display: "grid", gridTemplateColumns: "1fr 36px 52px 60px", gap: 8, padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <span style={{ fontFamily: "var(--font-interface)", fontSize: 12, fontWeight: 500, color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n}</span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--color-text-muted)" }}>{s}</span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--color-text-muted)" }}>{r}</span>
                <span style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--color-blue-glow)" }}>{l}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

/* ── Nav items ─────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",    icon: "layout"   },
  { id: "pacientes",    label: "Pacientes",    icon: "users"    },
  { id: "agenda",       label: "Agenda",       icon: "calendar" },
  { id: "protocolos",   label: "Protocolos",   icon: "list"     },
  { id: "resultados",   label: "Resultados",   icon: "chart"    },
  { id: "notificacoes", label: "Notificações", icon: "bell"     },
];

const SCREENS = [ShowDashboard, ShowPaciente, ShowAgenda, ShowProtocolo];

/* ── Animated Product Showcase ─────────────────────────── */
export default function AnimatedProductShowcase() {
  const [screenIdx, setScreenIdx] = useState(0);
  const [fading,    setFading   ] = useState(false);
  const [clicking,  setClicking ] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isMobile,  setIsMobile ] = useState(false);
  const navRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 700);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const getPos = (idx: number) => {
    const el = navRefs.current[idx];
    const cEl = containerRef.current;
    if (!el || !cEl) return null;
    const eR = el.getBoundingClientRect();
    const cR = cEl.getBoundingClientRect();
    return { x: eR.left - cR.left + eR.width / 2, y: eR.top - cR.top + eR.height / 2 };
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t0 = setTimeout(() => { const p = getPos(0); if (p) setCursorPos(p); }, 500);
    timers.push(t0);
    let step = 0;

    const advance = () => {
      step = (step + 1) % 4;
      const p = getPos(step);
      if (p) setCursorPos(p);
      const t1 = setTimeout(() => {
        setClicking(true);
        const t2 = setTimeout(() => {
          setClicking(false);
          setFading(true);
          const t3 = setTimeout(() => { setScreenIdx(step); setFading(false); }, 200);
          timers.push(t3);
        }, 230);
        timers.push(t2);
      }, 540);
      timers.push(t1);
    };

    const interval = setInterval(advance, 3600);
    return () => { timers.forEach(clearTimeout); clearInterval(interval); };
  }, []);

  const ActiveScreen = SCREENS[screenIdx];

  return (
    <div ref={containerRef} className="app-frame" style={{ display: "flex", flexDirection: "column", height: isMobile ? 480 : 530, position: "relative", overflow: "hidden" }}>
      {/* Browser chrome */}
      <div className="frame-chrome">
        <div className="frame-dots">
          {["#FF5F57","#FFBD2E","#28CA41"].map(c => <div key={c} className="frame-dot" style={{ background: c }}/>)}
        </div>
        <div className="frame-url">app.nutrk.com/{NAV_ITEMS[screenIdx].id}</div>
      </div>

      {/* Mobile nav — replaces sidebar on small screens */}
      {isMobile && (
        <div style={{ display: "flex", background: "var(--color-surface)", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          {SCREENS.map((_, i) => {
            const item = NAV_ITEMS[i];
            const active = screenIdx === i;
            return (
              <div
                key={item.id}
                ref={el => { navRefs.current[i] = el; }}
                style={{ flex: 1, padding: "8px 0 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, borderBottom: `2px solid ${active ? "var(--color-blue-glow)" : "transparent"}` }}
              >
                <Icon name={item.icon} size={14} color={active ? "var(--color-blue-glow)" : "var(--color-text-muted)"} />
                <span style={{ fontFamily: "var(--font-interface)", fontSize: 9, color: active ? "var(--color-blue-glow)" : "var(--color-text-muted)" }}>{item.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* App body */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* Sidebar — desktop only */}
        {!isMobile && (
          <div style={{ width: 196, flexShrink: 0, background: "var(--color-surface)", borderRight: "1px solid rgba(255,255,255,0.05)", padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
            <Image src="/nutrk-logo.svg" alt="Nūtrk" width={80} height={14} style={{ height: 14, width: "auto", marginBottom: 18, marginLeft: 8, opacity: 0.9 }} />
            <div style={{ fontFamily: "var(--font-interface)", fontSize: 9, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: 3, marginLeft: 8 }}>Menu</div>
            {NAV_ITEMS.map((item, i) => (
              <div
                key={item.id}
                ref={el => { navRefs.current[i] = el; }}
                style={{ padding: "6px 9px", borderRadius: "var(--radius-md)", background: screenIdx === i ? "var(--color-blue-subtle)" : "transparent", color: screenIdx === i ? "var(--color-text)" : "var(--color-text-muted)", fontFamily: "var(--font-interface)", fontSize: 12, fontWeight: screenIdx === i ? 500 : 400, display: "flex", alignItems: "center", gap: 7, transition: "all var(--transition-fast)", borderLeft: screenIdx === i ? "2px solid var(--color-blue-glow)" : "2px solid transparent" }}
              >
                <Icon name={item.icon} size={13} color={screenIdx === i ? "var(--color-blue-glow)" : "var(--color-text-muted)"} />
                {item.label}
              </div>
            ))}
            <div style={{ marginTop: "auto", padding: "8px 9px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--color-blue-subtle)", border: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontFamily: "var(--font-interface)", fontWeight: 700, color: "var(--color-blue-glow)", flexShrink: 0 }}>BS</div>
              <div>
                <div style={{ fontFamily: "var(--font-interface)", fontSize: 11, fontWeight: 500, color: "var(--color-text)" }}>Dr. Bruno Silva</div>
                <div style={{ fontFamily: "var(--font-interface)", fontSize: 9, color: "var(--color-text-muted)" }}>Nutricionista</div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden", opacity: fading ? 0 : 1, transition: "opacity 0.2s ease" }}>
          <ActiveScreen />
        </div>
      </div>

      {/* Animated cursor — desktop only */}
      {!isMobile && (
        <div style={{
          position: "absolute",
          left: cursorPos.x,
          top: cursorPos.y,
          transform: `translate(-3px,-2px) scale(${clicking ? 0.7 : 1})`,
          transition: `left 0.52s cubic-bezier(0.2,0,0,1), top 0.52s cubic-bezier(0.2,0,0,1), transform ${clicking ? "0.1s" : "0.18s"}`,
          pointerEvents: "none",
          zIndex: 30,
          filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.7))",
        }}>
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
            <path d="M1.5 1.5 13 10.5 8 12 5.5 17.5Z" fill="white" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          {clicking && (
            <div style={{ position: "absolute", top: 2, left: 2, width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.22)", animation: "ripple 0.35s ease-out forwards" }} />
          )}
        </div>
      )}
    </div>
  );
}
