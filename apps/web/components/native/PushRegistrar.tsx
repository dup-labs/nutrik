"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPlatform, nativePlugin } from "@/lib/native";
import { registerDevice } from "@/lib/push/actions";

// Tipos mínimos do @capacitor/push-notifications (o pacote vive só na casca).
type Permission = "prompt" | "prompt-with-rationale" | "granted" | "denied";
interface ListenerHandle {
  remove: () => Promise<void>;
}
interface PushPlugin {
  checkPermissions: () => Promise<{ receive: Permission }>;
  requestPermissions: () => Promise<{ receive: Permission }>;
  register: () => Promise<void>;
  addListener: (
    event: "registration" | "registrationError" | "pushNotificationActionPerformed",
    cb: (data: never) => void,
  ) => Promise<ListenerHandle>;
}
interface ActionPerformed {
  notification: { data?: { url?: string } };
}

const SEEN_KEY = "nutrk.push.seen";
// 1º acesso: espera um tempo antes de pedir (não no primeiro frame);
// nos seguintes, o usuário já conhece o app e pedimos logo.
const FIRST_RUN_DELAY_MS = 45_000;
const RETURNING_DELAY_MS = 4_000;

function isSafeInternalUrl(url: unknown): url is string {
  return typeof url === "string" && url.startsWith("/") && !url.startsWith("//");
}

function readSeen(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // storage bloqueado: sem problema, só perde o "já conhece o app"
  }
}

/**
 * Registra o aparelho pra push dentro do app nativo. Fora do app (web) não
 * renderiza nem faz nada. Montado nos layouts autenticados, então só roda
 * depois do login. Quem negou a permissão nunca é incomodado de novo.
 */
export function PushRegistrar() {
  const router = useRouter();

  useEffect(() => {
    const push = nativePlugin<PushPlugin>("PushNotifications");
    const platform = getPlatform();
    if (!push || platform === "web") return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handles: ListenerHandle[] = [];

    async function setup(p: PushPlugin) {
      // listeners antes do register(); o toque que abriu o app (cold start) é
      // entregue ao listener assim que ele existe
      handles.push(
        await p.addListener("registration", ((t: { value: string }) => {
          if (platform === "ios" || platform === "android") {
            void registerDevice(t.value, platform);
          }
        }) as (d: never) => void),
        await p.addListener("registrationError", ((e: unknown) => {
          console.warn("[push] registro falhou", e);
        }) as (d: never) => void),
        await p.addListener("pushNotificationActionPerformed", ((a: ActionPerformed) => {
          const url = a.notification?.data?.url;
          if (isSafeInternalUrl(url)) router.push(url);
        }) as (d: never) => void),
      );
      if (cancelled) return;

      const { receive } = await p.checkPermissions();
      if (receive === "denied") return; // respeita a negativa

      if (receive === "granted") {
        markSeen();
        await p.register(); // renova o token e o last_seen_at a cada abertura
        return;
      }

      // ainda não perguntamos: pede num momento razoável, não no primeiro frame
      const delay = readSeen() ? RETURNING_DELAY_MS : FIRST_RUN_DELAY_MS;
      markSeen();
      timer = setTimeout(async () => {
        if (cancelled) return;
        const res = await p.requestPermissions();
        if (res.receive === "granted") await p.register();
      }, delay);
    }

    setup(push).catch((e) => console.warn("[push] setup", e));

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      handles.forEach((h) => void h.remove());
    };
  }, [router]);

  return null;
}
