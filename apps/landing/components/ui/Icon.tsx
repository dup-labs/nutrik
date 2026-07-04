const PATHS: Record<string, string> = {
  leaf:      `<path d="M11 20A7 7 0 0 1 4 13c0-5 3-9 12-9 0 7-2 11-9 12z"/><path d="M4 21c1.5-3 4-5.5 8-7"/>`,
  dumbbell:  `<path d="M6.5 6.5 17.5 17.5"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>`,
  mind:      `<path d="M12 4a4 4 0 0 1 4 4c0 1.5-.8 2.5-1.5 3.2"/><path d="M12 4a4 4 0 0 0-4 4c0 1.5.8 2.5 1.5 3.2"/><path d="M9 20c0-2 1.3-3.2 3-3.2s3 1.2 3 3.2"/><path d="M12 11.5V20"/>`,
  flame:     `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/>`,
  check:     `<path d="M20 6 9 17l-5-5"/>`,
  arrowR:    `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`,
  drop:      `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>`,
  moon:      `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`,
  calendar:  `<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>`,
  play:      `<polygon points="6 3 20 12 6 21 6 3"/>`,
  pause:     `<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>`,
  chevron:   `<path d="m6 9 6 6 6-6"/>`,
  sparkle:   `<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m6.3 6.3 2.4 2.4M15.3 15.3l2.4 2.4M17.7 6.3l-2.4 2.4M8.7 15.3l-2.4 2.4"/>`,
  target:    `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>`,
  bell:      `<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>`,
  heart:     `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`,
  clock:     `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  home:      `<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-8h6v8"/>`,
  user:      `<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 12 0v1"/>`,
  plus:      `<path d="M12 5v14M5 12h14"/>`,
  bolt:      `<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>`,
  xmark:     `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
  activity:  `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
  chart:     `<line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>`,
  send:      `<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>`,
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export default function Icon({ name, size = 22, color = "currentColor", strokeWidth = 1.9, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", flexShrink: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: PATHS[name] || "" }}
    />
  );
}
