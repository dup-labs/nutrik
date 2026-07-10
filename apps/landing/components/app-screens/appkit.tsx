// Kit p/ reconstruir telas REAIS do app (app.nutrk.io) dentro do PhoneFrame da
// landing. Tokens/mesh/ícones espelham o design system do app — dado é fake,
// mas o visual bate 1:1 com o que já roda hoje.

import type { CSSProperties, ReactNode } from "react";

/* ── mesh auras (copiadas do globals do app) ───────────────────────────── */
export const MESH = {
  warm:
    "radial-gradient(80.4% 73.7% at 95.38% 26%, rgba(245,166,35,0.8) 0%, rgba(245,166,35,0) 99%), radial-gradient(76.9% 76.9% at -46% -46%, rgba(192,132,252,0.8) 0%, rgba(192,132,252,0) 60%), radial-gradient(112% 112% at -19% 100%, rgb(239,68,68) 0%, rgba(239,68,68,0) 100%), linear-gradient(#adb4fc, #adb4fc)",
  cool:
    "radial-gradient(90.5% 105.8% at 97.13% 54.37%, rgba(127,225,252,0.8) 0%, rgba(129,225,252,0) 100%), radial-gradient(207% 59.5% at 91.5% 8.38%, rgba(181,187,251,0.9) 0%, rgba(174,181,252,0.09) 100%), radial-gradient(120% 92.5% at 79.75% 100%, rgb(254,99,36) 0%, rgba(255,106,48,0) 100%), linear-gradient(#feda97, #feda97)",
  mist:
    "radial-gradient(58.5% 50.7% at 100% 5.87%, rgba(127,225,252,0.8) 0%, rgba(129,225,252,0) 100%), radial-gradient(51.4% 39.7% at 5.5% 0%, rgba(252,99,47,0.9) 0%, rgba(183,167,240,0.45) 100%), radial-gradient(107.7% 144.7% at 100% 41.25%, rgb(253,173,36) 0%, rgba(253,171,34,0.5) 100%), linear-gradient(#a9b2fd, #a9b2fd)",
  fresh:
    "radial-gradient(98.3% 102.3% at -16.5% -6.75%, rgba(253,171,40,0.8) 0%, rgba(253,170,39,0) 100%), radial-gradient(58.9% 59.2% at 108.13% 13.13%, rgba(181,187,251,0.9) 0%, rgba(174,181,252,0.09) 100%), radial-gradient(96.3% 66% at 52.63% 8%, rgb(184,168,240) 0%, rgba(186,170,241,0.3) 100%), linear-gradient(#83d8e8, #83d8e8)",
} as const;

export type MeshKey = keyof typeof MESH;

/* ── cores do app ──────────────────────────────────────────────────────── */
export const C = {
  ink: "#1b1c1d",
  ink2: "#333333",
  muted: "#6b6f78",
  disabled: "#a6abb5",
  orange: "#fe5f33",
  orangeDeep: "#c67518",
  amber: "#feaf4c",
  lav: "#adb7f7",
  green: "#2f9e6b",
  surface: "#EDF0F8",
  card: "#ffffff",
  border: "rgba(27,28,29,0.10)",
  borderStrong: "rgba(27,28,29,0.18)",
  orangeSubtle: "rgba(254,95,51,0.08)",
  orangeDim: "rgba(254,95,51,0.16)",
} as const;

const disp = "var(--font-display)";
const body = "var(--font-body)";
const data = "var(--font-display)"; // Satoshi faz papel da fonte "data" no app

/* ── ícones (paths exatos do app: components/ui/icons.tsx) ──────────────── */
const PATHS: Record<string, { d: ReactNode; sw?: number }> = {
  "chevron-right": { d: <polyline points="9 18 15 12 9 6" />, sw: 2 },
  "chevron-left": { d: <polyline points="15 18 9 12 15 6" />, sw: 2 },
  fork: {
    d: (
      <>
        <path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2" />
        <path d="M5 2v20" />
        <path d="M17 2v20" />
        <path d="M17 8c0-3 2-5 2-5s2 2 2 5-2 4-2 4" />
      </>
    ),
    sw: 1.6,
  },
  dumbbell: {
    d: (
      <>
        <path d="m6.5 6.5 11 11" />
        <path d="m21 21-1-1" />
        <path d="m3 3 1 1" />
        <path d="m18 22 4-4" />
        <path d="m2 6 4-4" />
        <path d="m3 10 7-7" />
        <path d="m14 21 7-7" />
      </>
    ),
    sw: 1.6,
  },
  drop: { d: <path d="M12 2.7s6 6.1 6 10.3a6 6 0 0 1-12 0c0-4.2 6-10.3 6-10.3z" />, sw: 1.6 },
  brain: {
    d: (
      <>
        <path d="M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
        <path d="M12 5a3 3 0 1 1 5.997.142 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      </>
    ),
    sw: 1.6,
  },
  bell: {
    d: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />,
  },
  flame: {
    d: (
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    ),
  },
  calendar: {
    d: <path d="M8 2v4M16 2v4M3.5 9.5h17M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />,
  },
  swap: {
    d: (
      <>
        <path d="m16 3 4 4-4 4" />
        <path d="M20 7H4" />
        <path d="m8 21-4-4 4-4" />
        <path d="M4 17h16" />
      </>
    ),
    sw: 1.8,
  },
  chat: { d: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />, sw: 1.8 },
  gear: {
    d: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
  },
  home: {
    d: (
      <>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
  },
  chart: {
    d: (
      <>
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </>
    ),
  },
  users: {
    d: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  user: {
    d: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
  },
};

export function Ico({
  name,
  size = 20,
  color = "currentColor",
  strokeWidth,
}: {
  name: keyof typeof PATHS;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const p = PATHS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth ?? p.sw ?? 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {p.d}
    </svg>
  );
}

/* ── primitivas ────────────────────────────────────────────────────────── */
export function MeshAura({
  mesh,
  size = 90,
  blur = 18,
  opacity = 0.5,
  style,
}: {
  mesh: MeshKey;
  size?: number;
  blur?: number;
  opacity?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: size,
        height: size,
        background: MESH[mesh],
        filter: `blur(${blur}px)`,
        opacity,
        borderRadius: "50%",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

export function AppCard({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: 14,
        boxShadow: "0 4px 24px rgba(27,28,29,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Avatar({ initial, mesh, size = 36 }: { initial: string; mesh: MeshKey; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: MESH[mesh],
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: disp,
        fontWeight: 700,
        fontSize: size * 0.38,
      }}
    >
      {initial}
    </div>
  );
}

/** linha de macros: kcal laranja + P/C/G com quadradinhos coloridos */
export function MacroRow({ kcal, p, c, g }: { kcal: number; p: number; c: number; g: number }) {
  const macro = (label: string, value: number, color: string) => (
    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, color: C.muted }}>
      <span style={{ width: 6, height: 6, borderRadius: 2, background: color }} />
      {label} {value}g
    </span>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
      <span style={{ fontFamily: data, fontWeight: 700, fontSize: 12.5, color: C.orange }}>{kcal} kcal</span>
      {macro("P", p, C.orange)}
      {macro("C", c, C.amber)}
      {macro("G", g, C.lav)}
    </div>
  );
}

export function Badge({ tone, children }: { tone: "warm" | "success" | "neutral"; children: ReactNode }) {
  const v =
    tone === "success"
      ? { bg: "rgba(47,158,107,0.12)", color: C.green }
      : tone === "warm"
        ? { bg: "rgba(254,175,76,0.16)", color: C.orangeDeep }
        : { bg: C.surface, color: C.muted };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        height: 21,
        padding: "0 8px",
        borderRadius: 40,
        background: v.bg,
        color: v.color,
        fontSize: 10.5,
        fontWeight: 600,
        whiteSpace: "nowrap",
        fontFamily: body,
      }}
    >
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }} />
      {children}
    </span>
  );
}

export function Tag({ tone, children }: { tone?: "warm"; children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 22,
        padding: "0 10px",
        borderRadius: 40,
        background: tone === "warm" ? "rgba(254,175,76,0.16)" : C.surface,
        color: tone === "warm" ? C.orangeDeep : C.muted,
        fontSize: 10.5,
        fontWeight: 500,
        whiteSpace: "nowrap",
        fontFamily: body,
      }}
    >
      {children}
    </span>
  );
}

/** header interno do app: seta voltar + título + subtítulo + ação à direita */
export function BackHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: `1px solid ${C.border}`,
          background: C.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: C.ink,
        }}
      >
        <Ico name="chevron-left" size={15} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: disp, fontWeight: 900, fontSize: 17, letterSpacing: "-0.03em", color: C.ink }}>
          {title}
        </div>
        {subtitle && <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

/* ── bottom nav (hoje / mente / progresso / amigos / perfil) ────────────── */
const TABS = [
  { key: "hoje", label: "hoje", icon: "home" },
  { key: "mente", label: "mente", icon: "brain" },
  { key: "progresso", label: "progresso", icon: "chart" },
  { key: "amigos", label: "amigos", icon: "users" },
  { key: "perfil", label: "perfil", icon: "user" },
] as const;

export type TabKey = (typeof TABS)[number]["key"];

export function TabBar({ active }: { active: TabKey }) {
  return (
    <div
      style={{
        flexShrink: 0,
        height: 56,
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(16px) saturate(1.6)",
        WebkitBackdropFilter: "blur(16px) saturate(1.6)",
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-around",
        paddingTop: 9,
      }}
    >
      {TABS.map((t) => {
        const on = t.key === active;
        return (
          <div key={t.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1 }}>
            <Ico name={t.icon} size={21} color={on ? C.orange : C.muted} />
            <span style={{ fontSize: 9.5, fontWeight: 600, color: on ? C.orange : C.muted, fontFamily: body }}>
              {t.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** casca da tela: fundo do app + área de conteúdo + bottom nav */
export function Screen({ active, children }: { active: TabKey; children: ReactNode }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg,#fbfcfe 0%,#e9edf7 100%)",
        fontFamily: body,
        color: C.ink,
      }}
    >
      <div style={{ flex: 1, overflow: "hidden", padding: "12px 15px 6px" }}>{children}</div>
      <TabBar active={active} />
    </div>
  );
}
