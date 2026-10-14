import Link from "next/link";

const row: React.CSSProperties = {
  display: "block",
  padding: "13px 16px",
  fontSize: 14,
  fontWeight: 600,
  color: "var(--color-text)",
  textDecoration: "none",
};

/** privacidade, termos e excluir conta: exigidos pelas lojas dentro do app */
export function LegalLinks() {
  const items: [string, string][] = [
    ["/privacidade", "política de privacidade"],
    ["/termos", "termos de uso"],
    ["/excluir-conta", "como excluir sua conta e seus dados"],
  ];
  return (
    <div
      style={{
        marginTop: 24,
        background: "var(--color-surface-elevated)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {items.map(([href, label], i) => (
        <Link
          key={href}
          href={href}
          style={{
            ...row,
            borderTop: i === 0 ? "none" : "1px solid var(--color-border)",
          }}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
