import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nūtrk — Sua melhor versão é um processo diário.",
  description: "Nutrição inteligente, treino personalizado e equilíbrio mental — tudo em um app só. Feito pra quem cuida da saúde no seu ritmo, sem neurose.",
  keywords: ["nutrição", "treino", "saúde", "bem-estar", "hábitos", "processo diário"],
  openGraph: {
    title: "Nūtrk — Sua melhor versão é um processo diário.",
    description: "Nutrição inteligente, treino personalizado e equilíbrio mental — tudo em um app só.",
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
