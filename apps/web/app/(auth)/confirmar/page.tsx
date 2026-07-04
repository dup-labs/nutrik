import Link from "next/link";
import { MeshAura } from "@/components/ui";
import { IconMail } from "@/components/ui/icons";

export default function ConfirmarPage() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 30px",
      }}
    >
      <MeshAura mesh="cool" size={260} blur={34} opacity={0.45} style={{ top: 60, right: -70 }} />
      <div
        style={{
          position: "relative",
          width: 76,
          height: 76,
          borderRadius: "50%",
          background: "var(--mesh-cool)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "ntrkPop .5s var(--ease-spring) both",
        }}
      >
        <IconMail size={34} color="#fff" />
      </div>
      <div
        style={{
          marginTop: 20,
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: 24,
          letterSpacing: "-0.03em",
          color: "var(--color-text)",
        }}
      >
        confirma seu email.
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 15,
          lineHeight: 1.5,
          color: "var(--color-text-secondary)",
          maxWidth: 280,
        }}
      >
        te enviamos um link. é só tocar nele que sua conta entra no ar e a gente continua daqui.
      </div>
      <Link
        href="/login"
        style={{
          marginTop: 32,
          fontSize: 14,
          fontWeight: 600,
          color: "var(--color-orange)",
          textDecoration: "none",
        }}
      >
        já confirmei, quero entrar
      </Link>
    </div>
  );
}
