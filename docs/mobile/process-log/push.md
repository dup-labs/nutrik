# Process log — push

## Decisão: APNs direto (iOS) + FCM v1 (Android) vs FCM nos dois
- O que fiz: avaliei as duas rotas. Escolhi **APNs direto no iOS e FCM no Android**.
- Por quê: com o `@capacitor/push-notifications` padrão, o iOS devolve o **token
  APNs cru**. Usar FCM no iOS exigiria Firebase SDK + `GoogleService-Info.plist`
  + método swizzling/AppDelegate na casca e a chave APNs enviada ao Firebase —
  mais uma peça nativa pra manter, e nada ganho: já precisamos da chave .p8 de
  qualquer jeito. Direto, são ~80 linhas com `node:crypto` + `node:http2`.
  FCM nos dois valeria a pena com muitos tipos de payload/tópicos/analytics, ou
  se o backend não fosse Node. Aqui não.
- Dependências novas: nenhuma. (`firebase-admin` puxa ~dezenas de MB pra fazer
  um POST + um JWT; `@parse/node-apn` e similares duplicam o que o http2 nativo faz.)
- Genérico: vale pra qualquer web→app em Node. Específico: nada.

## Migration device_tokens
- O que fiz: tabela com `token unique`, RLS "só os seus" (select/insert/update/delete).
- Tempo/esforço: ~10 min.
- Pegadinha: token é por **instalação**, não por usuário. Troca de conta no mesmo
  aparelho = mesmo token, dono novo. RLS de update bloquearia (a linha é de outro).
  Solução: `registerDevice` valida a sessão e faz o upsert com service role.
  Apaga-se o token do dono antigo na prática por sobrescrita.
- Genérico.

## PushRegistrar (cliente)
- O que fiz: componente null montado nos layouts logados (paciente e pro). Fora
  do app, sai no primeiro `if`. Ordem: listeners → `checkPermissions` → se
  `denied`, para; se `granted`, `register()` a cada abertura (renova token +
  `last_seen_at`); se `prompt`, agenda `requestPermissions` com atraso.
- Timing do prompt: 1º acesso espera 45s, acessos seguintes 4s (flag em
  localStorage). Não é perfeito (o ideal é pedir depois de um momento de valor,
  tipo "quando o pro te vincular" ou 1ª refeição registrada), mas evita o prompt
  frio no primeiro frame, que a Apple desencoraja e que derruba o opt-in. A Apple
  só deixa o sistema perguntar **uma vez**: se o usuário nega, só reativa em
  Ajustes — por isso não gastar a chance cedo demais.
- Toque na notificação: `data.url` → `router.push`, só aceita caminho interno
  (`/x`, nunca `//x` nem URL absoluta) pra um payload forjado não abrir site externo.
- Pegadinha: o plugin não vem tipado (o web não instala `@capacitor/*`),
  então os tipos são declarados localmente.
- Genérico, exceto as rotas.

## Envio server-side
- O que fiz: `lib/push/{apns,fcm,send,config}.ts`. JWT ES256 pro APNs, JWT RS256
  → OAuth → HTTP v1 pro FCM. Tokens com 410/`Unregistered`/`UNREGISTERED`/`BadDeviceToken`
  são apagados. `pushAfter()` usa `after()` do Next 16: a resposta da server
  action sai antes e a função serverless continua viva até o push terminar
  (promessa solta em serverless pode ser congelada e o push nunca sai).
- Pegadinhas:
  - `createSign(...).sign()` pra ES256 devolve DER por padrão; JWT exige r||s:
    `dsaEncoding: "ieee-p1363"` (verifiquei o round-trip localmente).
  - APNs exige HTTP/2: `fetch` do Node não serve, daí `node:http2`.
  - Token de sandbox em endpoint de produção = `BadDeviceToken` (e a gente
    apaga). Documentado em push-setup.md.
  - Cache do JWT/access token em memória do módulo: sobrevive entre
    invocações na mesma instância (Fluid Compute), sem mágica.
  - O push do chat não leva o texto da mensagem (lock screen mostra pra todo
    mundo; é dado de saúde). Título com nome do pro + "abre o chat".
- Sem credenciais: no-op com `console.info`. Não testado contra APNs/FCM reais
  (sem conta ainda) — só typecheck e verificação da assinatura ES256.
- Genérico, exceto os textos.

## Ligação nos eventos
- O que fiz: `notifyPatient` (plano, treino, check-in) ganhou `pushAfter` e
  parâmetro opcional `url`; `proSendMessage` e `sendMessage` (paciente → pro,
  via `pushToProfessionalAfter`, porque tokens são por `auth.users` e não por
  `professionals.id`). Mudança mínima nas actions.
- Fora: notificações de turma nascem dentro de RPCs SQL (`invite_to_group`,
  `send_group_message`, ...), então não passam por server action. Opções:
  database webhook/Edge Function no INSERT de `notifications`, ou a action
  chamar push depois do RPC. Melhor desenho genérico: **um trigger/webhook em
  `notifications` dispararia push de tudo, em um lugar só** — recomendo isso
  numa v2 (evita esquecer evento novo).
- Genérico (o padrão "tabela de notificações → push") vs específico (nomes).

## Tempo/esforço total
~1h30 de código + docs, sem nenhum teste em aparelho real.

## Pedidos ao integrador
- Aplicar `20261014_01_device_tokens.sql`.
- Casca: `google-services.json` + plugin Gradle do google-services; capability
  Push Notifications e Background Modes no Xcode; confirmar `AppDelegate` com
  `didRegisterForRemoteNotificationsWithDeviceToken` repassando ao Capacitor.
- Logout (se o agente de auth quiser): chamar `unregisterDevice(token)` de
  `lib/push/actions.ts` — hoje o aparelho continua recebendo push da conta que
  saiu até outra conta logar nele. Exige guardar o token (ex.: Preferences).
- Decidir se vale um webhook em `notifications` pra cobrir turmas (ver acima).
- `after` precisa de runtime Node: as actions já rodam em Node, nada a fazer.

## Pendências que dependem de conta Apple/Google
- Projeto Firebase, `google-services.json`, service account → `FCM_SERVICE_ACCOUNT_JSON`.
- Apple Developer: App ID com Push, chave .p8, Key ID, Team ID.
- Teste ponta a ponta em aparelho real nos dois sistemas.
