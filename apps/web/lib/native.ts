// Ponte com o app nativo (Capacitor). O app nas lojas é uma casca que carrega
// app.nutrk.io; o bridge do Capacitor é injetado nas páginas, então o acesso a
// plugins é via window.Capacitor.Plugins — sem dependência de @capacitor/* aqui.
// Só para client components. No server, use lib/native-server.ts.

export type Platform = "ios" | "android" | "web";

// Marca adicionada ao user-agent pela casca (capacitor.config.ts →
// ios/android.appendUserAgent): "NutrkApp/1 ios" | "NutrkApp/1 android".
export const NATIVE_UA = "NutrkApp";

// Scheme do deep link: io.nutrk.app://<path> abre /<path> dentro do app.
export const NATIVE_SCHEME = "io.nutrk.app";

type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
  Plugins?: Record<string, unknown>;
};

function capacitor(): CapacitorGlobal | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
}

export function isNativeApp(): boolean {
  return capacitor()?.isNativePlatform?.() ?? false;
}

export function getPlatform(): Platform {
  const p = isNativeApp() ? capacitor()?.getPlatform?.() : undefined;
  return p === "ios" || p === "android" ? p : "web";
}

export function isNativeIOS(): boolean {
  return getPlatform() === "ios";
}

// Plugin nativo pelo nome registrado (ex.: "App", "Browser", "PushNotifications").
// Retorna undefined fora do app — sempre trate esse caso.
export function nativePlugin<T>(name: string): T | undefined {
  if (!isNativeApp()) return undefined;
  return capacitor()?.Plugins?.[name] as T | undefined;
}

// ── extensões (ponte-web) ────────────────────────────────────────────────────

// Converte um deep link (io.nutrk.app://auth/callback?code=x) ou universal link
// (https://app.nutrk.io/auth/callback?code=x) em caminho interno ("/auth/callback?code=x").
// Retorna null pra qualquer outra coisa — nunca devolve URL absoluta (sem open redirect).
export function deepLinkToPath(raw: string, webHost = "app.nutrk.io"): string | null {
  let rest: string;
  if (raw.startsWith(`${NATIVE_SCHEME}://`)) {
    rest = raw.slice(NATIVE_SCHEME.length + 3);
  } else {
    try {
      const u = new URL(raw);
      if (u.protocol !== "https:" || u.host !== webHost) return null;
      rest = u.pathname + u.search + u.hash;
    } catch {
      return null;
    }
  }
  rest = rest.replace(/^\/+/, "");
  return `/${rest}`;
}

// Plugins usados pela ponte (tipos mínimos; o pacote @capacitor/* mora na casca).
export type PluginHandle = { remove: () => Promise<void> | void };

export interface AppPlugin {
  addListener(
    event: "appUrlOpen",
    cb: (e: { url: string }) => void,
  ): Promise<PluginHandle> | PluginHandle;
  addListener(
    event: "backButton",
    cb: (e: { canGoBack: boolean }) => void,
  ): Promise<PluginHandle> | PluginHandle;
  minimizeApp(): Promise<void>;
  getLaunchUrl(): Promise<{ url: string } | undefined>;
}

export interface BrowserPlugin {
  open(opts: { url: string }): Promise<void>;
  close(): Promise<void>;
}

export interface StatusBarPlugin {
  // LIGHT = texto escuro (pra fundo claro); DARK = texto claro.
  setStyle(opts: { style: "LIGHT" | "DARK" | "DEFAULT" }): Promise<void>;
  setBackgroundColor?(opts: { color: string }): Promise<void>;
}

export interface SplashScreenPlugin {
  hide(opts?: { fadeOutDuration?: number }): Promise<void>;
}
