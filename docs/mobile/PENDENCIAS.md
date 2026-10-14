# nūtrk mobile — o que falta

> Atualizado em 2026-10-14, quando a `feat/mobile` foi pra produção.
> iOS (simulador) e Android (emulador) testados e no mesmo ponto: cadastro por
> email, navegação, câmera, páginas legais, status bar, botão voltar.
> Detalhes técnicos de cada item: `auth-setup.md`, `push-setup.md`, `store/`.

## Bloqueado por conta (caminho crítico)

1. ~~D-U-N-S~~ **feito em 2026-10-14: 943334590** (DUP.AGENCY TECNOLOGIA E CRIATIVIDADE LTDA, já existia na D&B). Account Holder Apple: hi@brunodup.com.
2. **Apple Developer (empresa)**: enrollment enviado em 2026-10-14 (Enrollment ID `5FG76S4D4G`), aguardando verificação da Apple → pagamento US$ 99 → Team ID. Depois:
   - substituir `TEAM_ID` em `apps/web/app/.well-known/apple-app-site-association/route.ts`;
   - ligar `App.entitlements` no target (Push, Associated Domains, Sign in with Apple);
   - chave APNs `.p8` → envs `APNS_KEY_P8`, `APNS_KEY_ID`, `APNS_TEAM_ID`, `APNS_ENV`;
   - Sign in with Apple no Supabase (Services ID, chave, Team ID) → ligar `NEXT_PUBLIC_APPLE_SIGNIN=1` na Vercel. **Obrigatório antes da App Store** (guideline 4.8, porque tem login com Google). A chave expira a cada 6 meses: pôr na agenda;
   - envs `APPLE_*` pra revogação na exclusão de conta (best-effort).
3. **Google Play Console (empresa)**: conta "dup.lab" criada em 2026-10-14 (ID 6910184612422243703, dono hi@brunodup.com). Verificações (identidade, site, telefone) concluídas em 2026-10-14. Próximo: criar o app, gerar a chave de upload e subir o 1º AAB em teste interno → SHA-256 da chave de assinatura em `apps/web/app/.well-known/assetlinks.json/route.ts` (`SHA256_FINGERPRINT`).
4. ~~Firebase~~ **feito em 2026-10-14**: projeto `nutrk-47430` (plano Spark), app Android `io.nutrk.app`, `google-services.json` em `apps/mobile/android/app/` (fora do git), `FCM_SERVICE_ACCOUNT_JSON` na Vercel (produção, sensível). Vale no próximo deploy.

## Configuração (sem conta nova)

- **Supabase → Auth → Redirect URLs**: adicionar `io.nutrk.app://auth/callback` e `io.nutrk.app://auth/callback**`. Sem isso o login com Google não volta pro app.
- **Supabase → templates de email**: trocar pra `/auth/confirm` com `token_hash` (ver `auth-setup.md`), pra recuperar senha e confirmar cadastro pedidos no app funcionarem quando o email é aberto fora dele.
- ~~Vercel: `RESEND_API_KEY`~~ **feito em 2026-10-14**: só existia no `.env.local`, copiada pra produção (sensível). Emails de auth continuam saindo pelo SMTP do Supabase.
- **Telefone público do perfil no Google Play** é o celular pessoal do Dup: trocar por um número da empresa quando houver (o Google pede verificar de novo).
- **Email `privacidade@nutrk.io`**: o Dup cria (é o contato do encarregado na política).

## Jurídico e dados da empresa

- Razão social, CNPJ, endereço (define o foro), nome do encarregado, data de publicação: placeholders em `/privacidade` e `/termos`.
- Revisão por advogado antes de publicar.
- Revisar a copy da landing: fala em "composição corporal", mas o app não coleta peso nem medidas.

## Testes que faltam

**No simulador / emulador (dá pra fazer já):**
- excluir conta (paciente; profissional; dono de turma com membros; usuário que também usa polr/pblshr);
- denunciar e bloquear (precisa de 2 contas);
- tela offline (desligar a rede);
- links externos abrindo no navegador do app;

**Só com conta / aparelho real:**
- login com Google e com Apple ponta a ponta;
- push (registro, recebimento, toque abrindo a tela certa);
- universal links / app links;
- rodar em iPhone e Android físicos.

## Antes de submeter

- Contas de teste pro revisor (paciente e profissional) e notas de revisão (`store/review-notes.md`).
- Screenshots (`store/screenshots-spec.md`) e textos da ficha (`store/listing-ptbr.md`).
- Build de loja: `npm run sync` **sem** `CAP_SERVER_URL` (os scripts de dev gravam localhost no projeto nativo).
- Formulários de privacidade das lojas (`store/app-store-privacy.md`, `store/play-data-safety.md`, `store/play-health-declaration.md`).
- Rotina de moderação: denúncia que chega em app@nutrk.io precisa ser tratada em até 24h.

## Melhorias registradas (não bloqueiam)

- Push das turmas: hoje as notificações de turma nascem em RPC SQL e não disparam push. Melhor caminho: gatilho único na tabela `notifications`.
- Tela de "usuários bloqueados" nas configurações (`listMyBlocks`/`unblockUser` já existem).
- Bloqueado ainda consegue convidar o bloqueador pra uma turma (RPCs de convite sem filtro).
- Pedir permissão de push depois de um momento de valor (vínculo com profissional, 1ª refeição), não por tempo.
- Separar o projeto Supabase do nūtrk quando houver usuários (hoje compartilha login com polr/pblshr).
- `middleware.ts` → `proxy.ts` (convenção nova do Next 16; hoje só gera aviso).
