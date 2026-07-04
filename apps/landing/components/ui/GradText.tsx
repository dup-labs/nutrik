interface GradTextProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function GradText({ children, style = {} }: GradTextProps) {
  return (
    <span style={{ background: "var(--grad)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", ...style }}>
      {children}
    </span>
  );
}
