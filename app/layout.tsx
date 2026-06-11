import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nūtrk — Feito de consistência.",
  description: "Nūtrk conecta nutricionistas e personal trainers em uma plataforma única — do registro ao resultado, sem lacunas no protocolo.",
  keywords: ["nutricionista", "personal trainer", "protocolo", "aderência", "saúde"],
  openGraph: {
    title: "Nūtrk — Feito de consistência.",
    description: "Do registro ao resultado, sem lacunas no protocolo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
