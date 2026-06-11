"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "amber" | "neutral" | "success" | "error";
  dot?: boolean;
  size?: "sm" | "md" | "lg";
}

const variants = {
  blue:    { background: "var(--color-blue-subtle)",   color: "var(--color-blue-glow)",  border: "1px solid var(--color-blue-dim)",  dotColor: "var(--color-blue-core)"  },
  amber:   { background: "var(--color-amber-subtle)",  color: "var(--color-amber)",       border: "1px solid var(--color-amber-dim)", dotColor: "var(--color-amber)"      },
  neutral: { background: "var(--color-surface-elevated)", color: "var(--color-text-muted)", border: "1px solid rgba(255,255,255,0.07)", dotColor: "var(--color-text-muted)" },
  success: { background: "rgba(46,204,113,0.10)",     color: "#2ECC71",                  border: "1px solid rgba(46,204,113,0.20)", dotColor: "#2ECC71"                 },
  error:   { background: "rgba(255,75,75,0.10)",      color: "#FF4B4B",                  border: "1px solid rgba(255,75,75,0.20)",  dotColor: "#FF4B4B"                 },
};

const sizes = {
  sm: { fontSize: "10px", padding: "2px 7px",  height: "18px", gap: "4px" },
  md: { fontSize: "11px", padding: "3px 9px",  height: "22px", gap: "5px" },
  lg: { fontSize: "12px", padding: "4px 12px", height: "26px", gap: "6px" },
};

export default function Badge({ children, variant = "blue", dot = false, size = "md" }: BadgeProps) {
  const v = variants[variant];
  const s = sizes[size];

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      fontSize: s.fontSize,
      fontFamily: "var(--font-interface)",
      fontWeight: 500,
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      borderRadius: "var(--radius-full)",
      whiteSpace: "nowrap",
      background: v.background,
      color: v.color,
      border: v.border,
    }}>
      {dot && (
        <span style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: v.dotColor,
          flexShrink: 0,
          boxShadow: `0 0 6px ${v.dotColor}`,
        }} />
      )}
      {children}
    </span>
  );
}
