import Link from "next/link";

const link: React.CSSProperties = {
  color: "var(--color-text-secondary)",
  textDecoration: "underline",
};

/** linha discreta de aceite nas telas de login/cadastro (exigência das lojas) */
export function LegalConsent() {
  return (
    <p
      style={{
        textAlign: "center",
        fontSize: 12,
        lineHeight: 1.5,
        color: "var(--color-text-muted)",
        margin: "16px 0 0",
      }}
    >
      ao continuar você concorda com os{" "}
      <Link href="/termos" style={link}>
        termos
      </Link>{" "}
      e a{" "}
      <Link href="/privacidade" style={link}>
        política de privacidade
      </Link>
      .
    </p>
  );
}
