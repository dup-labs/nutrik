import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nūtrk",
  description: "Nutrição inteligente, treino personalizado e equilíbrio mental — tudo em um app só.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
