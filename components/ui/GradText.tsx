const GRAD = "linear-gradient(115deg,#FE5F33 0%,#FEAF4C 30%,#ADB7F7 66%,#ADF3F3 100%)";

interface GradTextProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function GradText({ children, style = {} }: GradTextProps) {
  return (
    <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", ...style }}>
      {children}
    </span>
  );
}
