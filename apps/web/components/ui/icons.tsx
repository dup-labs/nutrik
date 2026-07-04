// Ícones outline 1.5-1.7px do protótipo (lucide-style), temática fitness/saúde.

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

function base(
  paths: React.ReactNode,
  { size = 20, color = "currentColor", strokeWidth = 1.7, className }: IconProps,
) {
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
      className={className}
    >
      {paths}
    </svg>
  );
}

export const IconChevronRight = (p: IconProps) =>
  base(<polyline points="9 18 15 12 9 6" />, { strokeWidth: 2, ...p });
export const IconChevronLeft = (p: IconProps) =>
  base(<polyline points="15 18 9 12 15 6" />, { strokeWidth: 2, ...p });
export const IconClose = (p: IconProps) =>
  base(
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>,
    { strokeWidth: 2.2, ...p },
  );
export const IconCheck = (p: IconProps) =>
  base(<path d="M20 6 9 17l-5-5" />, { strokeWidth: 2.4, ...p });
export const IconFlame = (p: IconProps) =>
  base(
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
    p,
  );
export const IconFork = (p: IconProps) =>
  base(
    <>
      <path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2" />
      <path d="M5 2v20" />
      <path d="M17 2v20" />
      <path d="M17 8c0-3 2-5 2-5s2 2 2 5-2 4-2 4" />
    </>,
    { strokeWidth: 1.6, ...p },
  );
export const IconDumbbell = (p: IconProps) =>
  base(
    <>
      <path d="m6.5 6.5 11 11" />
      <path d="m21 21-1-1" />
      <path d="m3 3 1 1" />
      <path d="m18 22 4-4" />
      <path d="m2 6 4-4" />
      <path d="m3 10 7-7" />
      <path d="m14 21 7-7" />
    </>,
    { strokeWidth: 1.6, ...p },
  );
export const IconDrop = (p: IconProps) =>
  base(
    <path d="M12 2.7s6 6.1 6 10.3a6 6 0 0 1-12 0c0-4.2 6-10.3 6-10.3z" />,
    { strokeWidth: 1.6, ...p },
  );
export const IconBrain = (p: IconProps) =>
  base(
    <>
      <path d="M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.142 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    </>,
    { strokeWidth: 1.6, ...p },
  );
export const IconBell = (p: IconProps) =>
  base(
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />,
    p,
  );
export const IconCalendar = (p: IconProps) =>
  base(
    <path d="M8 2v4M16 2v4M3.5 9.5h17M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />,
    p,
  );
export const IconHome = (p: IconProps) =>
  base(
    <>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>,
    p,
  );
export const IconChart = (p: IconProps) =>
  base(
    <>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </>,
    p,
  );
export const IconUser = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>,
    p,
  );
export const IconPlay = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <polygon points="7 4 20 12 7 20 7 4" />
  </svg>
);
export const IconPlayOutline = (p: IconProps) =>
  base(<polygon points="6 3 20 12 6 21 6 3" />, { strokeWidth: 1.6, ...p });
export const IconChat = (p: IconProps) =>
  base(
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    { strokeWidth: 1.8, ...p },
  );
export const IconSend = (p: IconProps) =>
  base(
    <>
      <path d="m22 2-7 20-4-9-9-4z" />
      <path d="M22 2 11 13" />
    </>,
    { strokeWidth: 1.9, ...p },
  );
export const IconSwap = (p: IconProps) =>
  base(
    <>
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </>,
    { strokeWidth: 1.8, ...p },
  );
export const IconMoon = (p: IconProps) =>
  base(<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />, { strokeWidth: 1.6, ...p });
export const IconClock = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </>,
    { strokeWidth: 1.6, ...p },
  );
export const IconLink = (p: IconProps) =>
  base(
    <>
      <path d="M15 7h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3" />
      <path d="M9 17H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </>,
    p,
  );
export const IconBolt = (p: IconProps) =>
  base(<path d="M13 2 3 14h9l-1 8 10-12h-9z" />, p);
export const IconLogout = (p: IconProps) =>
  base(
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
    { strokeWidth: 1.8, ...p },
  );
export const IconGear = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>,
    p,
  );
export const IconCopy = (p: IconProps) =>
  base(
    <>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>,
    { strokeWidth: 1.8, ...p },
  );
export const IconGrid = (p: IconProps) =>
  base(
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>,
    { strokeWidth: 1.8, ...p },
  );
export const IconClipboardCheck = (p: IconProps) =>
  base(
    <path d="M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />,
    { strokeWidth: 1.8, ...p },
  );
export const IconCircleCheck = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>,
    { strokeWidth: 2, ...p },
  );
export const IconCircle = (p: IconProps) =>
  base(<circle cx="12" cy="12" r="10" />, { strokeWidth: 2, ...p });
export const IconMapPin = (p: IconProps) =>
  base(
    <>
      <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>,
    p,
  );
export const IconPhone = (p: IconProps) =>
  base(
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />,
    p,
  );
export const IconMail = (p: IconProps) =>
  base(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>,
    p,
  );

/** carinha de humor (boca varia) */
export function IconFace({
  mouth,
  size = 30,
  color = "currentColor",
}: {
  mouth: string;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="9" y1="9.5" x2="9.01" y2="9.5" />
      <line x1="15" y1="9.5" x2="15.01" y2="9.5" />
      <path d={mouth} />
    </svg>
  );
}

export const MOOD_DEFS = [
  { key: "otimo", label: "ótimo", mouth: "M8 14.5 Q12 18.5 16 14.5", color: "#c67518", bg: "rgba(254,175,76,0.18)" },
  { key: "bem", label: "bem", mouth: "M8.5 14.5 Q12 17 15.5 14.5", color: "#2f9e6b", bg: "rgba(47,158,107,0.14)" },
  { key: "neutro", label: "neutro", mouth: "M9 15.5 L15 15.5", color: "#6b6f78", bg: "var(--color-surface)" },
  { key: "baixo", label: "baixo", mouth: "M8.5 16 Q12 14 15.5 16", color: "#5a63c4", bg: "rgba(173,183,247,0.18)" },
  { key: "dificil", label: "difícil", mouth: "M8 16.5 Q12 13.5 16 16.5", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
] as const;
