import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NativeBridge } from "@/components/native/NativeBridge";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nūtrk",
  description:
    "nutrição, treino e mente no seu ritmo. o que importa é a consistência.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nūtrk",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

// Marca <html> antes da pintura (evita flash de UI de web no app). O user-agent
// carrega "NutrkApp/1 ios|android" (ver lib/native.ts). O NativeBridge repete
// isso no client usando o bridge do Capacitor.
const NATIVE_CLASS_SCRIPT = `(function(){var m=navigator.userAgent.match(/NutrkApp\\/\\d+ (ios|android)/);if(m){document.documentElement.classList.add("is-native","is-"+m[1])}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NATIVE_CLASS_SCRIPT }} />
      </head>
      <body>
        {children}
        <NativeBridge />
      </body>
    </html>
  );
}
