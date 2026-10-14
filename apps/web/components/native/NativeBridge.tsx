"use client";

import { useEffect } from "react";
import {
  deepLinkToPath,
  getPlatform,
  isNativeApp,
  nativePlugin,
  type AppPlugin,
  type BrowserPlugin,
  type PluginHandle,
  type SplashScreenPlugin,
  type StatusBarPlugin,
} from "@/lib/native";

const WEB_HOST = "app.nutrk.io";
// Hosts que ficam dentro do webview (app, dev, auth). O resto vai pro Browser nativo.
const INTERNAL_HOSTS = [WEB_HOST, "localhost", "127.0.0.1"];
const ROOT_ROUTES = ["/", "/pro"];

function isInternalHost(host: string): boolean {
  return (
    host === window.location.host ||
    INTERNAL_HOSTS.includes(host.split(":")[0]) ||
    host.endsWith(".supabase.co")
  );
}

// Monta listeners nativos e classes de CSS. Não renderiza nada; no-op na web.
export function NativeBridge() {
  useEffect(() => {
    if (!isNativeApp()) return;

    const platform = getPlatform();
    document.documentElement.classList.add("is-native", `is-${platform}`);

    const App = nativePlugin<AppPlugin>("App");
    const Browser = nativePlugin<BrowserPlugin>("Browser");
    const handles: Promise<PluginHandle>[] = [];

    if (App) {
      // Deep links / universal links (fecha o fluxo de OAuth).
      handles.push(
        Promise.resolve(
          App.addListener("appUrlOpen", ({ url }) => {
            const path = deepLinkToPath(url, WEB_HOST);
            if (!path) return;
            // O Browser pode nem estar aberto; ignora o erro.
            Promise.resolve(Browser?.close())
              .catch(() => {})
              .finally(() => {
                // Navegação de verdade: /auth/callback precisa de request no
                // server pra setar o cookie de sessão.
                window.location.assign(path);
              });
          }),
        ),
      );

      // Abertura a frio por link: o appUrlOpen pode disparar antes deste
      // listener existir (a página remota ainda carregava). Processa a URL de
      // lançamento uma vez só — sessionStorage evita loop após o redirect.
      App.getLaunchUrl()
        .then((launch) => {
          const url = launch?.url;
          if (!url) return;
          const KEY = "nutrk.launchUrl";
          if (sessionStorage.getItem(KEY) === url) return;
          sessionStorage.setItem(KEY, url);
          const path = deepLinkToPath(url, WEB_HOST);
          if (path && path !== window.location.pathname + window.location.search) {
            window.location.assign(path);
          }
        })
        .catch(() => {});

      // Botão voltar do Android.
      handles.push(
        Promise.resolve(
          App.addListener("backButton", () => {
            const path = window.location.pathname.replace(/\/+$/, "") || "/";
            if (ROOT_ROUTES.includes(path) || window.history.length <= 1) {
              App.minimizeApp().catch(() => {});
            } else {
              window.history.back();
            }
          }),
        ),
      );
    }

    // Status bar: texto escuro sobre fundo branco. Splash some quando montar.
    const StatusBar = nativePlugin<StatusBarPlugin>("StatusBar");
    StatusBar?.setStyle({ style: "LIGHT" }).catch(() => {});
    StatusBar?.setBackgroundColor?.({ color: "#ffffff" }).catch(() => {});
    nativePlugin<SplashScreenPlugin>("SplashScreen")
      ?.hide({ fadeOutDuration: 200 })
      .catch(() => {});

    // Links externos e target=_blank.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || !Browser) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href) return;
      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.protocol !== "http:" && url.protocol !== "https:") return; // mailto:, tel:
      const external = !isInternalHost(url.host);
      if (!external && a.target !== "_blank") return;
      e.preventDefault();
      if (external) Browser.open({ url: url.href }).catch(() => {});
      else window.location.assign(url.href); // _blank interno: mesma janela
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      handles.forEach((h) => h.then((x) => x.remove()).catch(() => {}));
    };
  }, []);

  return null;
}
