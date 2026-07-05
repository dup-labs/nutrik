export function PageLoader() {
  return (
    <div
      style={{
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: 28,
          letterSpacing: "-0.03em",
          color: "var(--color-text)",
          animation: "ntrkFloat 1.6s var(--ease-out) infinite",
        }}
      >
        Nūtrk
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--color-orange)",
              opacity: 0.35,
              animation: `ntrkPop 1.2s ${i * 0.18}s var(--ease-out) infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
