interface StreakRingProps {
  days?: number;
  max?: number;
  size?: number;
  showLabel?: boolean;
}

export default function StreakRing({ days = 0, max = 30, size = 160, showLabel = true }: StreakRingProps) {
  const cx = size / 2;
  const cy = size / 2;
  const strokeW = size * 0.038;
  const r = size / 2 - strokeW * 1.8;
  const circumference = 2 * Math.PI * r;
  const progress = Math.min(days / max, 1);
  const dashArray = circumference * progress;
  const dashOffset = circumference * 0.25;

  const gradId = `ag-${size}`;
  const glowId = `glow-${size}`;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#FF8A00" />
            <stop offset="100%" stopColor="#FFD080" />
          </linearGradient>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,178,58,0.10)" strokeWidth={strokeW} />

        {/* Outer ambient ring */}
        <circle cx={cx} cy={cy} r={r + strokeW * 1.2} fill="none" stroke="rgba(255,178,58,0.05)" strokeWidth={strokeW * 0.5} />

        {/* Progress arc */}
        {progress > 0 && (
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={`${dashArray} ${circumference}`}
            strokeDashoffset={dashOffset}
            filter={`url(#${glowId})`}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        )}
      </svg>

      {/* Inner content */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: size * 0.01 }}>
        <svg width={size * 0.175} height={size * 0.175} viewBox="0 0 24 24" fill="none" stroke="var(--color-amber)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
        <span style={{ fontSize: size * 0.225, fontFamily: "var(--font-data)", color: "var(--color-amber)", lineHeight: 1, letterSpacing: "-0.03em" }}>
          {days}
        </span>
        {showLabel && (
          <span style={{ fontSize: size * 0.072, fontFamily: "var(--font-interface)", color: "var(--color-text-muted)", letterSpacing: "0.04em" }}>
            dias seguidos
          </span>
        )}
      </div>
    </div>
  );
}
