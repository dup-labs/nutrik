export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--gradient-canvas)",
        display: "flex",
        flexDirection: "column",
        maxWidth: 560,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}
