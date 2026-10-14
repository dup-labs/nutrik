# nūtrk mobile — arquitetura e contrato

> Branch `feat/mobile`, aberta em 2026-10-14. Este arquivo é o contrato entre os
> agentes que trabalham em paralelo. Mudou algo aqui? Avise o integrador; não
> mude por conta própria.

## Estratégia

O `apps/web` é Next.js 16 com SSR, server actions e sessão em cookie, então
**não dá pra fazer export estático**. O app das lojas é uma **casca Capacitor
que carrega `https://app.nutrk.io`** (`server.url`), com recursos nativos por
cima. Deploy na Vercel atualiza o app na hora; build nativo só quando mudar
algo nativo.

```
apps/mobile/              casca Capacitor (iOS + Android)
  capacitor.config.ts     server.url, appendUserAgent, plugins
  www/                    só o que roda local: offline.html (errorPath)
  ios/ android/           projetos nativos gerados (versionados)
apps/web/                 o app de verdade; ganha a camada "native-aware"
  lib/native.ts           detecção + acesso a plugins (client)
  lib/native-server.ts    plataforma pela requisição (server)
docs/mobile/              este contrato, process-log, material das lojas
```

## Constantes (não invente outras)

| Coisa | Valor |
|---|---|
| appId / bundle id / package | `io.nutrk.app` |
| Nome exibido | `Nūtrk` |
| URL carregada | `https://app.nutrk.io` (dev: env `CAP_SERVER_URL`) |
| User-agent anexado | iOS `NutrkApp/1 ios` · Android `NutrkApp/1 android` |
| Scheme de deep link | `io.nutrk.app://` — `io.nutrk.app://X?y` abre `/X?y` no webview |
| Callback de OAuth | `io.nutrk.app://auth/callback` → `/auth/callback` (rota existente) |
| Universal/App Links | `https://app.nutrk.io/.well-known/*` (precisa do Team ID Apple e do SHA-256 da chave Android — usar placeholders `TEAM_ID` / `SHA256_FINGERPRINT`) |
| Schema Supabase | `nutrk` |

## Como o web fala com o nativo

- O bridge do Capacitor é injetado nas páginas remotas. **O `apps/web` não
  instala pacotes `@capacitor/*`.** Acesse plugins por `nativePlugin<T>("Nome")`
  de `lib/native.ts` e declare localmente só os tipos que usar.
- Fora do app, `nativePlugin` retorna `undefined`: todo código nativo precisa
  de fallback web (o site continua sendo um PWA normal).
- Server: `getRequestPlatform()` (lib/native-server.ts) lê o user-agent.
- Os plugins instalados na casca (o agente da casca mantém esta lista):
  `App`, `Browser`, `PushNotifications`, `Haptics`, `StatusBar`,
  `SplashScreen`, `Keyboard`, `Network`, `Preferences`.

## Regras de loja que o código precisa cumprir

1. **Login social fora do webview** — Google bloqueia OAuth em webview. Fluxo:
   `signInWithOAuth({ skipBrowserRedirect: true, redirectTo: "io.nutrk.app://auth/callback" })`
   → abre a URL com o plugin `Browser` → o provider redireciona pro scheme →
   o handler de deep link fecha o Browser e navega o webview pra
   `/auth/callback?code=...` → a rota troca o code por sessão (o PKCE verifier
   está no cookie do webview, que foi quem iniciou o fluxo).
2. **Sign in with Apple** — obrigatório no iOS porque existe login com Google.
3. **Exclusão de conta** dentro do app + página pública `/excluir-conta`.
4. **Sem checkout no iOS** — no app iOS o profissional não vê CTA de compra
   nem preço do Asaas; vê "gerencie sua assinatura em app.nutrk.io" sem link.
5. **Não parecer site** — push, haptics, safe areas, tela offline, sem zoom,
   links externos no Browser nativo, botão voltar do Android funcionando.

## Rotas públicas já liberadas no middleware

`/privacidade`, `/termos`, `/excluir-conta`, e `/.well-known/*` fora do matcher.

## Regras para os agentes

- Cada agente só edita os arquivos do seu escopo (ver o prompt dele). Precisou
  de algo fora? Escreva em `docs/mobile/process-log/<agente>.md` na seção
  "Pedidos ao integrador" e siga com um stub.
- **Não aplicar migrations no Supabase remoto** e não fazer deploy. Só criar o
  arquivo em `apps/web/supabase/migrations/`.
- Antes de escrever código Next, leia `apps/web/node_modules/next/dist/docs/`
  (é Next 16, APIs mudaram). `middleware.ts` continua sendo o nome usado aqui.
- Typecheck: `cd apps/web && npx tsc --noEmit`. Não rode `next build` nem build
  nativo (Xcode/Gradle) — a máquina é compartilhada; build é na integração.
- Commits pequenos, mensagem no padrão do repo (`feat(mobile): ...`,
  `feat(web): ...`), em português, sem push.

## Process log (matéria-prima do playbook)

Todo agente mantém `docs/mobile/process-log/<agente>.md`:

```
## <etapa>
- O que fiz:
- Tempo/esforço (estimado):
- Travou em / pegadinha:
- Genérico (vale pra qualquer web→app) ou específico do nūtrk:
## Pedidos ao integrador
## Pendências que dependem de conta Apple/Google
```
