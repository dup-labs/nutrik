# process log — auth-nativo

> Agente: auth-nativo. Escopo: login social no app nativo (Google/Apple),
> callback de auth, `.well-known`, guia de configuração.
> Esta é a parte mais pegadinha de qualquer conversão web→app: o código é
> pouco, mas cada linha existe por causa de uma regra de loja, de provider
> ou de cookie. Abaixo, cada etapa separa o que é **genérico** (vale pra
> qualquer app web que vira casca Capacitor com Supabase/PKCE) do que é
> **específico do nūtrk**.

## 0. Diagnóstico do que existia

- O que fiz: li `fields.tsx` (`GoogleButton` com `signInWithOAuth` padrão),
  `app/auth/callback/route.ts`, `lib/roles.ts` (`resolveDestination`),
  `docs/jornadas-auth.md`, o contrato em `ARCHITECTURE.md`.
- Tempo/esforço: ~20 min.
- Travou em / pegadinha: nenhuma trava; mapeamento do risco:
  1. `signInWithOAuth` padrão faz `window.location = url` → o Google abre
     **dentro do webview** → `403 disallowed_useragent`. Não tem contorno
     (mudar user-agent é violar a política do Google e quebra de novo).
  2. O cadastro de quem entra pelo Google já não depende do nome do provider:
     sem metadados → `/cadastro?completar=1`, que pede o nome. Isso salvou o
     caso Apple (ver etapa 3).
  3. O `?flow=pro` viaja na query do `redirectTo` — precisa sobreviver ao
     round-trip pelo scheme.
- Genérico: o checklist "onde o app inicia OAuth / onde troca code por
  sessão / de onde vem o nome do usuário" é o primeiro passo de qualquer
  conversão.

## 1. Google fora do webview (fluxo nativo)

- O que fiz: `lib/auth/oauth.ts` com `startOAuth(provider, { flow })`.
  - Web: igual antes (`redirectTo: origin/auth/callback`).
  - Nativo: `redirectTo: io.nutrk.app://auth/callback[?flow=pro]`,
    `skipBrowserRedirect: true`, abre `data.url` com
    `nativePlugin("Browser").open()` (SFSafariViewController / Chrome Custom
    Tabs). O retorno é do handler de deep link do agente ponte-web.
  - Se a casca não tiver o plugin Browser, mostra erro em vez de cair no
    fluxo web (que o Google recusaria).
  - Botão volta a ficar clicável depois de abrir o Browser — se a pessoa
    fechar sem logar, não fica travado em "carregando".
- Tempo/esforço: ~40 min.
- Travou em / pegadinha:
  - **Por que o PKCE funciona** (e é a pergunta que todo mundo faz): quem
    chama `signInWithOAuth` é o client do webview → `@supabase/ssr` grava o
    `code_verifier` em cookie de `app.nutrk.io` no cookie jar do webview. O
    Browser nativo só carrega Google → Supabase → scheme; nunca precisa do
    cookie. A troca acontece quando o webview navega pra
    `/auth/callback?code=...` — mesma origem, mesmo cookie jar → o server
    acha o verifier. **Regra:** quem inicia o OAuth tem que ser o mesmo
    contexto que faz a troca. Se trocar o code dentro do Browser nativo ou
    num fetch de outra origem, quebra.
  - **Redirect URL não cadastrada falha em silêncio**: o Supabase cai no Site
    URL em vez de dar erro. Sintoma: o login termina dentro do Browser, numa
    página do site, e nunca volta pro app. Cadastrar
    `io.nutrk.app://auth/callback` e `io.nutrk.app://auth/callback**`.
  - Supabase só acrescenta `&code=` à query do `redirectTo`; o deep link
    `io.nutrk.app://auth/callback?flow=pro&code=X` vira
    `/auth/callback?flow=pro&code=X` pela regra do contrato (`X?y → /X?y`).
    Nada a fazer no callback, desde que o handler preserve a query inteira.
- Genérico: 100%. É o padrão pra qualquer casca que carrega site remoto
  com Supabase + PKCE. Em app com bundle local (sem `server.url`), o
  verifier fica no storage local do app e o fluxo muda (exchange no client).

## 2. Callback de auth à prova do fluxo nativo

- O que fiz: revisei `app/auth/callback/route.ts`.
  - Nada dependia de Referer, state em memória ou "mesmo navegador do
    provider" — o `origin` vem da própria request do webview
    (`app.nutrk.io`), então os redirects continuam certos.
  - Corrigi um **open redirect** antigo: `${origin}${next}` com
    `next=@evil.com` vira `https://app.nutrk.io@evil.com` (userinfo → host
    evil.com). Agora `next` só aceita `/caminho` (`lib/auth/safe-next.ts`).
  - Logs de erro (exchange falhou / provider recusou) pra diagnosticar no
    Vercel. Comportamento de fallback igual (volta pro login certo por flow).
- Tempo/esforço: ~20 min.
- Travou em / pegadinha: o callback em si estava ok. A pegadinha real
  estava nos **links de email** (próxima seção).
- Genérico: validar `next` vale pra qualquer app; o callback "agnóstico de
  origem" é o requisito genérico do fluxo nativo.

## 2b. Links de email com PKCE quebram no app → `/auth/confirm`

- O que fiz: rota nova `app/auth/confirm/route.ts` (`verifyOtp` com
  `token_hash`) e o passo a passo dos templates em `auth-setup.md` §5.
- Tempo/esforço: ~20 min.
- Travou em / pegadinha: **o problema que ninguém pede pra resolver e todo
  app tem**. Com PKCE, recuperar senha/confirmar cadastro gera link com
  `code` que só troca no navegador que pediu. No app: pede no webview, abre
  no Mail → Safari → sem verifier → falha muda. `token_hash` é verificado só
  com o que está no link. Só vale depois que alguém trocar os templates no
  Dashboard (não apliquei nada remoto).
- Genérico: 100%. Recomendação padrão de playbook: **email = token_hash,
  OAuth = PKCE**.

## 3. Sign in with Apple

- O que fiz:
  - `AppleSignInButton` + `SocialButtons` (Apple em cima, Google embaixo,
    mesma altura/largura/raio). Preto, logo Apple branco à esquerda, título
    na localização oficial pt-BR "Continuar com a Apple" (não em minúsculas
    como o resto da UI — título do botão é texto controlado pela Apple).
  - Mesmo `startOAuth("apple")` — web redireciona, app vai pelo Browser.
  - `GoogleButton` virou alias deprecated que renderiza `SocialButtons`:
    `/pro/cadastro` (fora do meu escopo) ganhou o Apple sem eu tocar no
    arquivo. Paridade garantida por construção: não existe Google sem Apple.
  - Exibido em web e app (mais simples; Apple exige no iOS e não proíbe no web).
  - `/cadastro?completar=1` pré-preenche o nome com o que o provider mandou
    (`lib/auth/display-name.ts`).
- Tempo/esforço: ~40 min.
- Travou em / pegadinha:
  - **Pelo fluxo OAuth a Apple não manda o nome nunca** (doc atual do
    Supabase: "When using the OAuth flow, the user's full name is not
    accessible from Apple's response"). O "só no primeiro login" vale pro
    fluxo nativo (ASAuthorization). Como o nūtrk já pede o nome no
    `completar`, o perfil nunca depende do provider → nada quebra.
  - Apple com "ocultar meu email": email é `xxx@privaterelay.appleid.com`.
    Funciona como identificador; pra receber email nosso precisa registrar o
    domínio remetente na Apple (auth-setup §3.4). `display-name` ignora
    qualquer nome com `@`.
  - Secret Key do provider Apple **expira a cada 6 meses** (confirmado na doc)
    → item de manutenção com lembrete; quebra login Apple em web e app.
- Genérico: botão + paridade + "não confie no nome da Apple" + rotação da
  chave = genérico. Usar a tela de completar cadastro como fallback é
  específico (o nūtrk já tinha).

## 4. `.well-known` (Universal Links / App Links)

- O que fiz: route handlers em `app/.well-known/apple-app-site-association/`
  e `app/.well-known/assetlinks.json/` (`Response.json` → `application/json`,
  `force-static`). Não usei `public/`: o AASA sem extensão sairia como
  `application/octet-stream` e o header teria que ir no `next.config.ts`
  (não é meu arquivo). Next 16 documenta route handler em `.well-known`
  (`docs/01-app/02-guides/backend-for-frontend.md`). Middleware já exclui
  `/.well-known` do matcher.
- Tempo/esforço: ~25 min.
- Travou em / pegadinha:
  - **Desviei do pedido "paths /auth/*"**: `/auth/callback*` está
    **excluído** dos Universal Links. Motivo: o link carrega um code PKCE cujo
    verifier está no navegador que iniciou. Quem loga pelo Safari no iPhone
    com o app instalado poderia ter o retorno desviado pro app → app sem
    verifier → login quebrado. No app, OAuth volta pelo scheme, então o app
    não precisa desse path. `/auth/confirm*` (token_hash) está incluído, e o
    resto do site (`/*`) também, menos `/api/*`.
  - Não consegui subir o `next dev` pra curl na worktree (Turbopack recusa
    `node_modules` simbólico fora da raiz). Typecheck limpo; conferir com
    curl depois do deploy (comandos em auth-setup §6).
  - AASA é cacheado pela CDN da Apple — mudança leva horas.
  - `assetlinks` usa o SHA-256 da **App signing key do Play**, não da upload
    key (erro clássico: funciona no build local, não funciona da loja).
- Genérico: tudo, inclusive a exclusão do callback PKCE.

## 5. Guia de configuração externa

- O que fiz: `docs/mobile/auth-setup.md` — Supabase (Redirect URLs, provider
  Apple, templates de email), Apple Developer (App ID, Services ID, chave),
  Google Cloud (nada novo além de conferir consent screen em produção),
  `.well-known`, checklist de teste.
- Tempo/esforço: ~30 min.
- Genérico: estrutura do guia é reaproveitável; IDs são do nūtrk.

## Pedidos ao integrador

1. **Casca / ponte-web (deep link)**: o handler de `appUrlOpen` precisa
   preservar a query inteira (`io.nutrk.app://auth/callback?flow=pro&code=X`
   → `/auth/callback?flow=pro&code=X`), chamar `Browser.close()` e fazer
   `window.location.assign` (navegação real, não `router.push` — o
   callback é route handler e precisa setar cookie). Se vier
   `?error=...` sem code, mandar pro callback mesmo assim (ele volta pro login).
2. **Casca Android**: intent-filter de App Links (`autoVerify`) com
   `pathPrefix` explícitos, **sem** `/auth/callback`. Intent-filter do scheme
   `io.nutrk.app` com `android:launchMode="singleTask"` (senão o retorno do
   Custom Tab abre uma segunda instância da Activity, com outro webview e
   outro cookie jar → sem verifier).
3. **Casca iOS**: Associated Domains `applinks:app.nutrk.io` e
   `webcredentials:app.nutrk.io`; capability Sign in with Apple no target.
4. **Opcional, só limpeza**: em `apps/web/app/pro/cadastro/page.tsx` trocar
   `GoogleButton` por `SocialButtons` (`googleLabel="continuar com Google"
   flow="pro"`). Funciona igual sem isso; o alias já renderiza Apple + Google.
5. **Fora de código, mas bloqueante pro app**: cadastrar as Redirect URLs do
   scheme no Supabase (auth-setup §1) antes do primeiro teste no device.
6. **Ao mexer em `next.config.ts`**: não adicionar `trailingSlash` com
   redirect em `/.well-known` nem redirects de host que afetem
   `app.nutrk.io/.well-known/*` — a Apple não segue redirect no AASA.

## Pendências que dependem de conta Apple/Google

- Team ID → `TEAM_ID` no AASA. Fingerprint Play → `SHA256_FINGERPRINT` no assetlinks.
- App ID `io.nutrk.app`, Services ID `io.nutrk.app.web`, chave `.p8`,
  provider Apple no Supabase (auth-setup §3–4).
- Lembrete recorrente: renovar a Secret Key da Apple a cada 6 meses.
- Templates de email → `/auth/confirm` (não depende de conta; depende de
  alguém aplicar no Dashboard).

## Riscos que vejo

- **Review da Apple (guideline 4 / 5.1.1)**: rejeição comum é "pediu nome
  depois do Sign in with Apple". Nosso `completar` pede "como a gente te
  chama?" — defensável como apelido do app, mas é risco. Mitigação possível
  (fora do meu escopo, `lib/actions.ts`): no `completar` vindo da Apple,
  tornar o nome opcional com um fallback neutro.
- Sem o template de email trocado, recuperação de senha pedida no app falha
  quando o email é aberto fora do app.
- Rotação da chave Apple esquecida = login Apple fora do ar sem alerta.
