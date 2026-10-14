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
