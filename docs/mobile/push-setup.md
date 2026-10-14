# Push do nūtrk — setup

Android sai por FCM (Firebase), iOS sai direto pelo APNs. O código não precisa
de nenhuma dependência nova e **sem env configurada o app funciona normal**:
`sendPush` vira no-op e só loga.

Itens marcados **[CONTA]** dependem de conta Apple Developer / Google ainda não criada.

## 1. Banco

Aplicar `apps/web/supabase/migrations/20261014_01_device_tokens.sql` (o integrador aplica).

## 2. Android — Firebase / FCM

1. **[CONTA Google]** console.firebase.google.com → criar projeto "nutrk".
2. Adicionar app Android com package `io.nutrk.app`. Baixar `google-services.json`.
3. Colocar o arquivo em `apps/mobile/android/app/google-services.json` (a casca
   já precisa do plugin `com.google.gms.google-services` no Gradle; o agente da casca cuida).
   Esse arquivo não é segredo, mas confira se vai ou não pro git.
4. Firebase → Configurações do projeto → Contas de serviço → **Gerar nova chave
   privada**. Vem um JSON.
5. Na Vercel (projeto `apps/web`), criar `FCM_SERVICE_ACCOUNT_JSON` com o JSON
   inteiro (cole como está; Vercel aceita multilinha). Marcar Production e Preview se quiser testar lá.
6. Habilitar a API "Firebase Cloud Messaging API (V1)" (já vem ativa em projetos novos).

## 3. iOS — APNs

1. **[CONTA Apple Developer, US$ 99/ano]** developer.apple.com → Identifiers →
   App ID `io.nutrk.app` com a capability **Push Notifications**.
2. Keys → criar chave com "Apple Push Notifications service (APNs)". Baixar o
   `.p8` (só baixa uma vez!). Anotar o **Key ID**. O **Team ID** está em Membership.
3. No Xcode (casca): Signing & Capabilities → **+ Push Notifications** e
   **Background Modes → Remote notifications**. O agente da casca confere o
   `AppDelegate` (repasse do token ao Capacitor).
4. Envs na Vercel:

| Env | Valor |
|---|---|
| `APNS_KEY_P8` | conteúdo do `.p8` inteiro (`-----BEGIN PRIVATE KEY-----...`). Se colar numa linha, use `\n` literal |
| `APNS_KEY_ID` | Key ID da chave |
| `APNS_TEAM_ID` | Team ID |
| `APNS_BUNDLE_ID` | `io.nutrk.app` (default, opcional) |
| `APNS_ENV` | `production` ou `sandbox` |

### Sandbox vs produção (a pegadinha)

O token do APNs é específico do ambiente. Build rodando do Xcode / debug gera token
**sandbox**; TestFlight e App Store geram token **produção**. Mandar token de um
pro endpoint do outro dá `BadDeviceToken` — e o nosso código **apaga tokens
com esse erro**. Regra: `APNS_ENV=production` no deploy de produção (default
quando `NODE_ENV=production`), e pra testar com build de Xcode use um deploy
Preview com `APNS_ENV=sandbox`. TestFlight já é produção.

## 4. Envs novas (resumo)

`FCM_SERVICE_ACCOUNT_JSON`, `APNS_KEY_P8`, `APNS_KEY_ID`, `APNS_TEAM_ID`,
`APNS_ENV`, (opcional) `APNS_BUNDLE_ID`. Também precisa de
`SUPABASE_SERVICE_ROLE_KEY` (já existe por causa do Asaas): o envio lê tokens
de outros usuários e `registerDevice` troca o dono do token.

## 5. Testar

1. Build da casca num aparelho real (push não funciona em simulador iOS antigo; no Android emulador com Google Play funciona).
2. Logar, esperar o prompt de permissão (1º acesso: ~45s depois; próximos: ~4s).
3. Conferir `select * from nutrk.device_tokens`.
4. Como pro, mandar mensagem pro paciente → push com título "<nome> te mandou uma mensagem"; tocar abre `/chat`.
5. Sem push chegando: log da Vercel com prefixo `[push]`.

## O que dispara push hoje

| Evento | Quem recebe | Abre |
|---|---|---|
| pro publica plano alimentar | paciente | `/refeicoes` |
| pro publica treino | paciente | `/treino` |
| pro pede check-in | paciente | `/notificacoes` |
| pro manda mensagem | paciente | `/chat` |
| paciente manda mensagem | profissional | `/pro/mensagens` |

Fora: notificações de turma (criadas dentro de RPCs SQL — ver "Pedidos" no process log).
