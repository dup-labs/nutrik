# process-log — ponte-web

Agente: camada "native-aware" do `apps/web` (deep links, voltar, status bar, links externos, safe areas, haptics, checkout no iOS).

## NativeBridge (deep links, voltar, status bar, splash, links externos)
- O que fiz: `components/native/NativeBridge.tsx` (client, renderiza `null`), montado no `<body>` do root layout. Tudo atrás de `isNativeApp()`; na web é no-op. Tipos mínimos dos plugins (`App`, `Browser`, `StatusBar`, `SplashScreen`) declarados em `lib/native.ts`, sem instalar `@capacitor/*`.
  - `appUrlOpen`: `deepLinkToPath()` converte `io.nutrk.app://auth/callback?code=x` e `https://app.nutrk.io/...` em `/auth/callback?code=x`; fecha o `Browser` (erro ignorado) e faz `window.location.assign`. Só devolve caminho relativo (colapsa `//` inicial) e rejeita host que não seja o nosso: sem open redirect via deep link.
  - `backButton`: rota raiz (`/`, `/pro`) ou sem histórico -> `App.minimizeApp()`; senão `history.back()`.
  - StatusBar `LIGHT` (no Capacitor, `Style.Light` = texto escuro, nome confunde) + fundo branco; `SplashScreen.hide()` no mount.
  - Clique em `<a>`: host externo -> `Browser.open`; `target=_blank` interno -> mesma janela. `mailto:`/`tel:` ficam com o sistema. Hosts internos: app.nutrk.io, localhost, `*.supabase.co`.
  - Classes `is-native` / `is-ios` / `is-android` no `<html>`. Também aplicadas por script inline no `<head>` (lê o user-agent `NutrkApp/1 ios|android`) para existirem antes da primeira pintura; o `<html>` ganhou `suppressHydrationWarning` por causa disso.
- Tempo/esforço: ~1h.
- Pegadinhas:
  - `window.location.assign` e não `router.push` no deep link: o `/auth/callback` é route handler e precisa de request real pra setar o cookie.
  - O listener do `addListener` devolve Promise no Capacitor 5+; o cleanup guarda a promise.
  - Cold start: o Capacitor dispara `appUrlOpen` com a URL de lançamento, mas o listener só existe depois que a página remota carregou. Pode perder o evento se o webview ainda estiver carregando. Mitigação possível (não feita): `App.getLaunchUrl()` no mount. Testar em device.
  - Sem acesso a device nem Xcode aqui: **nada disso foi executado**, só tipado.
- Genérico: tudo, exceto constantes (`app.nutrk.io`, `/pro`, scheme). O padrão "script inline lê UA -> classe no html" vale pra qualquer web->app com `appendUserAgent`.

## CSS nativo
- O que fiz (`globals.css`, bloco `html.is-native`): `body` com `padding-top/left/right: env(safe-area-inset-*)`; shells de tela cheia (`.pac-shell`, `.pro-shell`, `.auth-split`) descontam o inset do `min-height` pra não gerar scroll fantasma; `overscroll-behavior: none`; `user-select: none` com exceção pra input/textarea/contenteditable/`.selectable`; `-webkit-touch-callout: none`; inputs com `font-size: 16px !important` (anti-zoom do iOS; `!important` porque o app usa font-size inline). `maximumScale: 1` já existia no viewport, mas o iOS ignora em alguns casos, daí o 16px.
- BottomNav e ProShell já usavam `env(safe-area-inset-bottom)` na altura/padding; só somei o inset ao `paddingBottom` do `<main>` dos dois shells. Visual web inalterado (env = 0).
- Pegadinha: se a casca configurar `StatusBar.overlaysWebView = false` (padrão Android), o inset top é 0 e o padding some sozinho. No iOS o webview vai por baixo da status bar quando `contentInset` está `always`/`automatic`: **conferir com a casca** se não está dobrando (webview já recuado + padding).
- Genérico: sim, o receituário todo. Específico: nomes das classes de shell.

## Haptics
- `lib/haptics.ts`: `haptic("light"|"medium"|"success"|"warning")`, no-op na web e em qualquer falha.
- Aplicado em: troca de aba na BottomNav (light), troca de aba no ProShell (light), pagamento confirmado na tela de assinatura (success). Só em arquivos do meu escopo.
- Sugestões pro integrador (arquivos de outros donos): registrar refeição (success), completar série/treino (medium por série, success no fim), adicionar copo de água (light), meta do dia batida (success), erro de validação em formulário (warning), toggle de check-in (light), enviar mensagem no chat (light).

## Checkout no iOS (Apple 3.1.1)
- `assinatura/page.tsx` decide no server por `getRequestPlatform()`: iOS renderiza `AssinaturaNeutra` (só status, "a gestão da assinatura é feita pelo navegador.", sem link). Preços nem entram no payload do client. Web e Android seguem com `AssinaturaClient`.
- `BillingBanner`: no iOS mostra o status (trial/pendente/cancelado) + o texto neutro, sem link. O link de CTA tem classe `ios-hide` (CSS esconde no iOS antes de hidratar, o `useSyncExternalStore` com `isNativeIOS` tira do DOM depois).
- O banner nunca bloqueou acesso: o bloqueio é o redirect de `lib/pro/queries.ts` para `/pro/assinatura`, então no iOS o profissional sem acesso cai na tela neutra (sem saída por ali, só pelo navegador). Comportamento mantido de propósito.
- Pegadinha de review: o texto "pagamento pendente" no banner iOS continua informando estado, não chama pra ação. Se a Apple reclamar, trocar por "há uma pendência na assinatura".
- As server actions (`startSubscription` etc.) continuam chamáveis; só a UI some. Não é vetor de review, mas vale bloquear por plataforma no server se quiser defesa em profundidade.
- Específico do nūtrk: Asaas, rotas `/pro/assinatura`. Genérico: decidir no server pelo UA e não mandar preço pro client; texto neutro sem link.

## Pedidos ao integrador
- `perfil/ProPerfilClient.tsx` (linha ~117) tem link para `/pro/assinatura` e card "assinatura": no iOS precisa de revisão (provavelmente só status, sem CTA/preço). Não era meu arquivo.
- Qualquer outro lugar que mostre preço/CTA de assinatura fora de `assinatura/**` e do banner (grep por `formatBRL`/`BILLING`).
- Aplicar `haptic()` nos pontos sugeridos acima.
- Conferir com a casca: `StatusBar.overlaysWebView` e `contentInset` do iOS (ver seção CSS), e o Android `backButton`: o Capacitor só dispara o evento do listener se o plugin App estiver sincronizado.
- Opcional: `App.getLaunchUrl()` no mount para deep link em cold start.

## Pendências que dependem de conta Apple/Google
- Universal Links / App Links (Team ID, SHA-256) para o ramo `https://app.nutrk.io/...` do deep link só funcionar de verdade.
- Teste em device real de OAuth completo (Browser -> scheme -> callback), que é o que fecha o login social.
