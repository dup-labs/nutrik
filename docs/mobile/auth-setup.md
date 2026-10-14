# nūtrk mobile — configuração de auth fora do código

> O que alguém precisa clicar em painéis (Supabase, Apple, Google) pra o login
> funcionar no app. O código já está pronto (`lib/auth/oauth.ts`,
> `components/auth/fields.tsx`, `app/auth/*`, `app/.well-known/*`).
>
> Legenda: **[sem conta]** depende de conta que ainda não existe ·
> **[já dá]** dá pra fazer hoje · **[manutenção]** item recorrente.
>
> `<REF>` = ref do projeto Supabase (o subdomínio de `NEXT_PUBLIC_SUPABASE_URL`).

## Ordem recomendada

1. Supabase → Redirect URLs (já dá; sem isso o app nativo nunca loga)
2. Google Cloud → conferir o client OAuth (já dá)
3. Apple Developer → App ID, Services ID, chave (sem conta)
4. Supabase → provider Apple (depende do 3)
5. Templates de email → `/auth/confirm` (já dá; ver seção própria)
6. `.well-known` → trocar placeholders (depende das contas)

---

## 1. Supabase — URL Configuration **[já dá]**

Dashboard → Authentication → URL Configuration.

- **Site URL**: `https://app.nutrk.io` (não mudar).
- **Redirect URLs** — adicionar:
  - `io.nutrk.app://auth/callback`
  - `io.nutrk.app://auth/callback**` (o fluxo pro manda `?flow=pro`; o `**`
    cobre a query — a doc do Supabase não garante que query string casa com
    entrada exata, então cadastre as duas)
  - conferir que já existe `https://app.nutrk.io/**` (ou
    `https://app.nutrk.io/auth/callback**` e `https://app.nutrk.io/auth/confirm**`).

**Pegadinha:** se o `redirectTo` não casar com nenhuma entrada, o Supabase
**não dá erro** — ele cai no Site URL. No app isso aparece como "logou no
Google e ficou parado numa página do nūtrk dentro do Browser, sem voltar pro
app". Se acontecer, é esta lista.

## 2. Google Cloud — OAuth **[já dá]**

console.cloud.google.com → APIs & Services → Credentials → o client
"Web application" que já alimenta o Supabase.

- **Authorized redirect URIs**: `https://<REF>.supabase.co/auth/v1/callback`
  (já deve estar — é o que faz o login web funcionar hoje).
- **Nada novo pro app**: o app usa o mesmo client Web, porque o Google só
  conversa com o Supabase; quem volta pro app é o Supabase (pelo scheme). Não
  criar client iOS/Android agora — eles só servem pra login nativo com SDK
  do Google (`signInWithIdToken`), que não estamos usando.
- **OAuth consent screen**: precisa estar em "In production" (em "Testing"
  só os test users logam). Se pedir verificação, os escopos são só
  `email`/`profile`/`openid` → verificação simples. Links de política e
  termos: `https://app.nutrk.io/privacidade` e `/termos`.
- Supabase → Authentication → Providers → Google: Client ID e Secret desse
  client (já configurado).

## 3. Apple Developer **[sem conta]**

Precisa da conta Apple Developer Program (US$ 99/ano) — a mesma que publica
o app. Anote o **Team ID** (Membership details, 10 caracteres).

### 3.1 App ID (o app iOS)

Certificates, Identifiers & Profiles → Identifiers → **+** → App IDs → App.

- Bundle ID (explicit): `io.nutrk.app`
- Capabilities: **Sign in with Apple** (Enable as a primary App ID) e
  **Associated Domains** (pros Universal Links).
- Server-to-Server Notification Endpoint: deixar vazio (o Supabase não usa).

### 3.2 Services ID (o "client" do OAuth web)

Identifiers → **+** → Services IDs.

- Identifier: `io.nutrk.app.web` (tem que ser diferente do bundle id)
- Description: `Nūtrk` — **é o nome que aparece na tela da Apple** pro usuário.
- Marcar **Sign in with Apple** → Configure:
  - Primary App ID: `io.nutrk.app`
  - Domains and Subdomains: `<REF>.supabase.co` (e `app.nutrk.io`)
  - Return URLs: `https://<REF>.supabase.co/auth/v1/callback`

### 3.3 Chave (.p8)

Keys → **+** → marcar **Sign in with Apple** → Configure → Primary App ID
`io.nutrk.app` → Register → **Download** `AuthKey_XXXXXXXXXX.p8`.

- Só dá pra baixar **uma vez**. Guardar no cofre de senhas (não no repo, não
  nesta pasta — ela sincroniza com nuvem).
- Anotar o **Key ID** (os 10 caracteres do nome do arquivo).

### 3.4 Email relay (se o app mandar email)

Services → Sign in with Apple for Email Communication → registrar o domínio
remetente (o do Resend/SMTP). Sem isso, emails pra quem escolheu "ocultar meu
email" (`xxx@privaterelay.appleid.com`) são descartados pela Apple.

## 4. Supabase — provider Apple **[sem conta]**

Dashboard → Authentication → Providers → Apple → Enable.

- **Client IDs**: `io.nutrk.app.web` (o Services ID). Se um dia entrar o login
  nativo (ASAuthorization), adicionar `io.nutrk.app` depois, separado por
  vírgula — o Services ID vem primeiro.
- **Secret Key (for OAuth)**: um JWT gerado a partir do `.p8`, Team ID, Key
  ID e Services ID. Usar o gerador da própria página de docs do Supabase
  (supabase.com/docs/guides/auth/social-login/auth-apple — roda no navegador,
  a chave não sai da máquina; não funciona no Safari, usar Chrome/Firefox).

### [manutenção] A Secret Key expira a cada 6 meses

Confirmado na doc atual do Supabase: "Apple requires you to generate a new
secret key every 6 months using the signing key (.p8 file)". Quando expira,
**o login com Apple para de funcionar sem aviso** (web e app).

- Gerar a nova com o mesmo `.p8` (por isso guardar o arquivo) e colar no
  mesmo campo. Sem deploy.
- Pôr no calendário: lembrete em **5 meses** a partir de cada geração.
- Registrar aqui a data da última geração: `____-__-__`.

## 5. Templates de email → `/auth/confirm` **[já dá, recomendado]**

Problema: com PKCE, o link do email só funciona no **mesmo navegador** que
pediu. No app, a pessoa pede "recuperar senha" no webview e abre o email no
app de Mail → o link abre no Safari/Chrome → "code verifier" ausente → volta
pro login sem explicação. Mesma coisa com confirmação de cadastro feito no app.

Solução: os templates passam a usar `token_hash`, que é verificado em
qualquer navegador pela rota nova `app/auth/confirm/route.ts`.

Dashboard → Authentication → Email Templates:

| Template | Link novo |
|---|---|
| Confirm signup | `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email` |
| Reset password | `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/redefinir` |
| Change email | `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email_change` |
| Magic link (se usar) | `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink` |

Trocar só o `href` do botão/link; o resto do HTML fica. `/auth/callback`
continua existindo pro OAuth e pra links antigos já enviados.

Com Universal Links ativos (passo 6), esses links abrem direto no app.

## 6. Universal Links / App Links **[sem conta]**

Servidos por route handler em `apps/web/app/.well-known/`:

- `apple-app-site-association/route.ts` → trocar `TEAM_ID` pelo Team ID.
- `assetlinks.json/route.ts` → trocar `SHA256_FINGERPRINT` pelo SHA-256 da
  **App signing key** (Play Console → Test and release → Setup → App
  integrity → App signing). Pode pôr também o da upload key e o de debug.

Conferir depois do deploy:

```
curl -sI https://app.nutrk.io/.well-known/apple-app-site-association   # 200, application/json, sem redirect
curl -s  https://app-site-association.cdn-apple.com/a/v1/app.nutrk.io  # o que a Apple cacheou (demora)
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://app.nutrk.io&relation=delegate_permission/common.handle_all_urls
```

Na casca (agente da casca/integrador):

- iOS: Associated Domains `applinks:app.nutrk.io` e `webcredentials:app.nutrk.io`.
- Android: intent-filter `autoVerify="true"` pra `https://app.nutrk.io`, com
  `pathPrefix` explícitos — **sem** `/auth/callback` (ver process log).

## Checklist de teste (quando as contas existirem)

- [ ] Web, desktop: Google e Apple → cai na home / `/anamnese` / `/cadastro?completar=1`.
- [ ] Web, Safari iPhone **com o app instalado**: Google → não pode abrir o app no meio.
- [ ] App iOS: Google → Browser abre, loga, Browser fecha, webview logado.
- [ ] App iOS: Apple → idem; testar "ocultar meu email".
- [ ] App iOS: Apple, conta nova → `/cadastro?completar=1` pede o nome (a
      Apple não manda nome pelo OAuth).
- [ ] App Android: Google e Apple (Apple no Android é OAuth puro, normal).
- [ ] App: `/pro/cadastro` → Google/Apple → `/pro/cadastro` logado (flow=pro preservado).
- [ ] App: fechar o Browser sem logar → botões voltam a funcionar.
- [ ] App: recuperar senha → abrir o email no Mail → link abre o app (ou o
      Safari) e chega em `/redefinir` logado.
