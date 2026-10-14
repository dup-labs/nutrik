import type { CapacitorConfig } from "@capacitor/cli";

// Em produção o app carrega https://app.nutrk.io (ver docs/mobile/ARCHITECTURE.md).
// Em dev, CAP_SERVER_URL aponta pro IP da máquina (ex.: http://192.168.0.10:3000)
// e o cleartext (http) só é liberado nesse caso.
const serverUrl = process.env.CAP_SERVER_URL ?? "https://app.nutrk.io";
const isCleartext = serverUrl.startsWith("http://");

const config: CapacitorConfig = {
  appId: "io.nutrk.app",
  appName: "Nūtrk",
  webDir: "www",
  server: {
    url: serverUrl,
    cleartext: isCleartext,
    // Tela local mostrada quando a página remota não carrega (sem internet).
    errorPath: "offline.html",
    // Navegar pra fora dessa lista abre no navegador do sistema.
    allowNavigation: ["app.nutrk.io", "*.supabase.co"],
  },
  ios: {
    appendUserAgent: "NutrkApp/1 ios",
    contentInset: "never",
    backgroundColor: "#ffffff",
  },
  android: {
    appendUserAgent: "NutrkApp/1 android",
    backgroundColor: "#ffffff",
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      backgroundColor: "#ffffff",
      showSpinner: false,
      androidScaleType: "CENTER_INSIDE",
      splashFullScreen: true,
      splashImmersive: false,
    },
    StatusBar: {
      // LIGHT = texto/ícones ESCUROS (pra fundo claro). DARK é o contrário —
      // o nome confunde: no Capacitor o estilo descreve o fundo, não o texto.
      style: "LIGHT",
      backgroundColor: "#ffffff",
      overlaysWebView: false,
    },
    Keyboard: {
      resize: "body", // webview encolhe; evita o layout "pular" atrás do teclado
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
