"use client";

import { useState } from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "amber";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  fullWidth?: boolean;
  pulse?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const sizes = {
  sm: { height: "28px", padding: "0 12px", fontSize: "var(--text-sm)",  gap: "6px"  },
  md: { height: "36px", padding: "0 16px", fontSize: "var(--text-base)", gap: "8px"  },
  lg: { height: "44px", padding: "0 24px", fontSize: "20px",             gap: "10px" },
};

export default function Button({ children, variant = "primary", size = "md", disabled = false, fullWidth = false, pulse = false, type = "button", onClick }: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed]  = useState(false);

  const s = sizes[size];

  const variantStyles: Record<string, React.CSSProperties> = {
    primary:   { background: hovered ? "var(--color-blue-glow)" : "var(--color-blue-core)", color: "#fff",                    border: "none", boxShadow: hovered ? "var(--glow-blue)" : "none" },
    secondary: { background: hovered ? "var(--color-surface-elevated)" : "var(--color-surface)", color: "var(--color-text)", border: "var(--glass-border)", boxShadow: hovered ? "var(--shadow-card)" : "none" },
    ghost:     { background: hovered ? "var(--color-blue-subtle)" : "transparent", color: hovered ? "var(--color-text)" : "var(--color-text-muted)", border: "1px solid transparent" },
    amber:     { background: hovered ? "#FFBE5A" : "var(--color-amber)", color: "var(--color-base)", border: "none", boxShadow: hovered ? "var(--glow-amber)" : "none" },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        fontSize: s.fontSize,
        fontFamily: "var(--font-interface)",
        fontWeight: 500,
        letterSpacing: "-0.01em",
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        width: fullWidth ? "100%" : "auto",
        transition: "all var(--transition-fast)",
        animation: pulse && !hovered ? "btnPulse 5s ease-in-out infinite" : "none",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        outline: "none",
        whiteSpace: "nowrap",
        textDecoration: "none",
        ...variantStyles[variant],
      }}
    >
      {children}
    </button>
  );
}
