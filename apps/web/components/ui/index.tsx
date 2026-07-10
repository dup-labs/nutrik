import Link from "next/link";
import { IconChevronLeft } from "./icons";

/** aura mesh decorativa flutuando num canto do card/tela */
export function MeshAura({
  mesh,
  size = 100,
  blur = 22,
  opacity = 0.5,
  style,
}: {
  mesh: "warm" | "cool" | "mist" | "fresh";
  size?: number;
  blur?: number;
  opacity?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: size,
        height: size,
        background: `var(--mesh-${mesh})`,
        filter: `blur(${blur}px)`,
        opacity,
        borderRadius: "50%",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

const BADGE_VARIANTS = {
  success: { bg: "rgba(47,158,107,0.12)", color: "#2f9e6b" },
  warm: { bg: "rgba(254,175,76,0.16)", color: "#c67518" },
  cool: { bg: "rgba(173,183,247,0.18)", color: "#5a63c4" },
  accent: { bg: "var(--color-orange-dim)", color: "var(--color-orange)" },
  neutral: { bg: "var(--color-surface)", color: "var(--color-text-muted)" },
  error: { bg: "rgba(239,68,68,0.10)", color: "#ef4444" },
} as const;

export function Badge({
  variant = "neutral",
  dot,
  children,
}: {
  variant?: keyof typeof BADGE_VARIANTS;
  dot?: boolean;
  children: React.ReactNode;
}) {
  const v = BADGE_VARIANTS[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        height: 24,
        padding: "0 10px",
        borderRadius: "var(--radius-pill)",
        background: v.bg,
        color: v.color,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {dot && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "currentColor",
          }}
        />
      )}
      {children}
    </span>
  );
}

export function Tag({
  variant = "neutral",
  children,
}: {
  variant?: "warm" | "neutral";
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 26,
        padding: "0 12px",
        borderRadius: "var(--radius-pill)",
        background:
          variant === "warm" ? "rgba(254,175,76,0.16)" : "var(--color-surface)",
        color: variant === "warm" ? "#c67518" : "var(--color-text-muted)",
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/** card branco elevado padrão */
export function Card({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "var(--color-surface-elevated)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: 16,
        boxShadow: "var(--shadow-card)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** botão pill laranja principal */
export function PrimaryButton({
  children,
  disabled,
  onClick,
  type = "button",
  style,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  style?: React.CSSProperties;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        height: 52,
        borderRadius: "var(--radius-pill)",
        border: "none",
        background: "var(--color-orange)",
        color: "#fff",
        fontWeight: 600,
        fontSize: 16,
        cursor: disabled ? "default" : "pointer",
        boxShadow: "0 4px 16px rgba(254,95,51,0.24)",
        opacity: disabled ? 0.45 : 1,
        transition: "opacity .2s var(--ease-out)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/** switch on/off no estilo do DS (pill laranja quando ligado) */
export function Switch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      style={{
        width: 46,
        height: 28,
        borderRadius: 99,
        border: checked ? "none" : "1px solid var(--color-border-strong)",
        background: checked ? "var(--color-orange)" : "var(--color-surface)",
        position: "relative",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.45 : 1,
        flexShrink: 0,
        padding: 0,
        transition: "background .18s var(--ease-out)",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: checked ? 3 : 2,
          left: checked ? 21 : 3,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
          transition: "left .18s var(--ease-out)",
        }}
      />
    </button>
  );
}

/** header de tela interna: seta de voltar + título + subtítulo */
export function BackHeader({
  href,
  title,
  subtitle,
  right,
}: {
  href: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
      <Link
        href={href}
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "1px solid var(--color-border)",
          background: "var(--color-surface-elevated)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "var(--color-text)",
        }}
      >
        <IconChevronLeft size={18} />
      </Link>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: "-0.03em",
            color: "var(--color-text)",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
            {subtitle}
          </div>
        )}
      </div>
      {right}
    </div>
  );
}

/** anel de streak com gradiente warm */
export function StreakRing({
  days,
  max = 30,
  size = 180,
  label = "dias seguidos",
}: {
  days: number;
  max?: number;
  size?: number;
  label?: string;
}) {
  const stroke = size >= 150 ? 14 : 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(days / max, 1);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(254,175,76,0.18)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#streakGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset .6s var(--ease-out)" }}
        />
        <defs>
          <linearGradient id="streakGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fe5f33" />
            <stop offset="100%" stopColor="#feaf4c" />
          </linearGradient>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-data)",
            fontWeight: 900,
            fontSize: size / 4,
            letterSpacing: "-0.03em",
            color: "var(--color-text)",
            lineHeight: 1,
          }}
        >
          {days}
        </span>
        <span
          style={{
            fontSize: size >= 150 ? 13 : 11,
            color: "var(--color-text-muted)",
            marginTop: 4,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

/** linha de macros: kcal + P/C/G com quadradinhos coloridos (design v2) */
export function MacroRow({
  kcal,
  p,
  c,
  g,
  boxed,
}: {
  kcal: number | null;
  p: number | null;
  c: number | null;
  g: number | null;
  boxed?: boolean;
}) {
  if (kcal == null) return null;
  const macro = (label: string, value: number | null, color: string) =>
    value == null ? null : (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: boxed ? 12 : 11,
          color: "var(--color-text-muted)",
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: 2, background: color }} />
        {label} {Math.round(value)}g
      </span>
    );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: boxed ? 12 : 10,
        ...(boxed
          ? {
              padding: "12px 14px",
              borderRadius: 10,
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }
          : {}),
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-data)",
          fontWeight: 700,
          fontSize: boxed ? 14 : 13,
          color: "var(--color-orange)",
        }}
      >
        {Math.round(kcal)} kcal
      </span>
      {macro("P", p, "var(--color-orange)")}
      {macro("C", c, "var(--warm-amber)")}
      {macro("G", g, "var(--cool-lav)")}
    </div>
  );
}

/** avatar círculo com inicial sobre mesh */
export function InitialAvatar({
  initial,
  mesh,
  size = 44,
}: {
  initial: string;
  mesh: string;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: mesh,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: size * 0.38,
      }}
    >
      {initial}
    </div>
  );
}
