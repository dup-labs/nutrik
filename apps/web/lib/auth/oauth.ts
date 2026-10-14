"use client";

// Login social (Google / Apple) nas duas pontas:
//   web    → signInWithOAuth redireciona a própria aba (fluxo de sempre)
//   nativo → o provider NÃO pode abrir dentro do webview (Google devolve
//            "disallowed_useragent"; a Apple exige o fluxo no navegador do
//            sistema). Então pedimos a URL sem redirecionar
//            (skipBrowserRedirect), abrimos no Browser nativo
//            (SFSafariViewController / Chrome Custom Tabs) e o provider volta
//            por io.nutrk.app://auth/callback?code=... — o handler de deep link
//            da casca fecha o Browser e navega o webview pra
//            /auth/callback?code=..., que troca o code por sessão.
//
// Por que funciona com PKCE: quem chama signInWithOAuth é o client do
// webview, que grava o code_verifier em cookie de app.nutrk.io. A request do
// /auth/callback sai do MESMO webview, com o mesmo cookie jar — o server acha
// o verifier. O Browser nativo nunca vê nem precisa desse cookie.

import { createClient } from "@/lib/supabase/client";
import { NATIVE_SCHEME, isNativeApp, nativePlugin } from "@/lib/native";

export type OAuthProvider = "google" | "apple";

type BrowserPlugin = {
  open(options: { url: string; presentationStyle?: "fullscreen" | "popover" }): Promise<void>;
};

export type OAuthOptions = {
  /** "pro" faz o callback mandar pra /pro/cadastro quando não há papel */
  flow?: "pro";
};

/** query string que o /auth/callback entende (flow) */
function callbackQuery({ flow }: OAuthOptions): string {
  return flow ? `?flow=${flow}` : "";
}

export function oauthRedirectTo(opts: OAuthOptions, native: boolean): string {
  const base = native
    ? `${NATIVE_SCHEME}://auth/callback`
    : `${window.location.origin}/auth/callback`;
  return base + callbackQuery(opts);
}

/**
 * Inicia o login social. Resolve com `{ error }` (mensagem pronta pra UI) ou
 * `{}` — no web a página já está saindo; no nativo o Browser abriu e o
 * retorno chega pelo deep link.
 */
export async function startOAuth(
  provider: OAuthProvider,
  opts: OAuthOptions = {},
): Promise<{ error?: string }> {
  const supabase = createClient();
  const native = isNativeApp();
  const browser = native ? nativePlugin<BrowserPlugin>("Browser") : undefined;

  // casca sem o plugin Browser (não deveria acontecer): cair no fluxo web
  // faria o Google recusar dentro do webview. Melhor avisar.
  if (native && !browser) {
    return { error: "não deu pra abrir o login agora. atualize o app e tente de novo." };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: oauthRedirectTo(opts, native),
      skipBrowserRedirect: native,
    },
  });
  if (error) return { error: "não conseguimos iniciar o login. tenta de novo?" };

  if (native && browser && data?.url) {
    await browser.open({ url: data.url });
  }
  return {};
}
