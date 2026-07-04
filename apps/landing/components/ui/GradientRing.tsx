"use client";

import { useId } from "react";

interface GradientRingProps {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
  trackColor?: string;
}

export default function GradientRing({ value = 0, max = 100, size = 132, stroke = 12, children, trackColor = "rgba(24,25,29,0.07)" }: GradientRingProps) {
  const rawId = useId();
  const id = `ring-${rawId.replace(/:/g, "-")}`;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - Math.min(value / max, 1));

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FE5F33" />
            <stop offset="40%"  stopColor="#FEAF4C" />
            <stop offset="75%"  stopColor="#ADB7F7" />
            <stop offset="100%" stopColor="#ADF3F3" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={`url(#${id})`} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.2,0,0,1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}
