# process-log — polimento

Agente `polimento`. Fecha as arestas de loja que ficaram entre os outros agentes:
links legais dentro do app, haptics, nome após Sign in with Apple, revogação
do token da Apple.

## Links legais dentro do app
- O que fiz: `lib/account/LegalLinks.tsx` (privacidade, termos, "como excluir
  sua conta") antes do bloco de exclusão em configurações do paciente e no
  perfil do pro (sem tocar em billing). `components/auth/LegalConsent.tsx`:
  linha "ao continuar você concorda com os termos e a política de privacidade"
  em login, cadastro e `/pro/cadastro`, logo abaixo dos botões sociais.
- Tempo/esforço: ~20 min.
- Pegadinha: as duas lojas conferem o link na tela de login E dentro do app
  logado. A linha de aceite fica sob o botão social porque é ali que o aceite
  é "implícito" (Apple/Google tratam login social como criação de conta).
- Genérico: dois lugares (pré-login e dentro do app), mesmos três links.
  Específico: tom minúsculo do nūtrk; rotas `/privacidade` `/termos` `/excluir-conta`.

## Haptics
- O que fiz: `haptic()` (no-op na web) em registrar refeição (success se feita,
  light se pulada), série marcada (light), concluir exercício (light), concluir
  treino (success), água (light), humor/sono/check-in salvos (success).
- Tempo/esforço: ~20 min.
- Pegadinha: não existe erro de validação visível nesses clients (os botões
  ficam `disabled` até o formulário valer), então não há onde disparar
  `warning` sem inventar UI. `warning` fica disponível pra quando houver.
- Genérico: haptic só no resultado (depois do `await`), nunca no toque cru;
  uma chamada por momento. Específico: lista de telas.

## Nome e Sign in with Apple
- O que fiz: `lib/account/apple.ts` (`isAppleUser` por `app_metadata.provider`
  ou `identities`; `fallbackNickname`: parte local do email, ou "você" se o
  email é relay `privaterelay.appleid.com`). `/cadastro?completar=1`: para
  quem veio da Apple o campo vira "opcional" e o botão libera sem nome;
  `completeCadastro` grava o apelido se vier vazio. Google/email inalterados.
- Tempo/esforço: ~30 min.
- Pegadinha: a Apple, pelo fluxo OAuth, nem entrega o nome ao Supabase, então
  o campo sempre chega vazio para esses usuários. A decisão tem que ser no
  servidor também, não só no botão.
- Genérico: nunca bloquear o fluxo da Apple por dado que ela não deu.
  Específico: apelido + edição no perfil.
- Risco: `/pro/cadastro` ainda pede "nome profissional" (obrigatório) para
  quem entra pela Apple. É dado do negócio do profissional, não do
  perfil pessoal, mas um revisor rígido pode questionar; se for o caso,
  aplicar a mesma regra em `createProfessionalProfile`.

## Revogação do Sign in with Apple na exclusão
- Pesquisa e conclusão:
  1. A Apple exige revogar via `POST https://appleid.apple.com/auth/revoke`
     com refresh ou access token válido (TN3194). Sem token, a própria Apple
     manda cumprir a exclusão mesmo assim: apagar dados e orientar o usuário
     a revogar em Ajustes > Apple ID > Entrar com a Apple.
     https://developer.apple.com/documentation/technotes/tn3194-handling-account-deletions-and-revoking-tokens-for-sign-in-with-apple
  2. O Supabase **não guarda** o token: "Provider tokens are intentionally not
     stored in your project's database" e não os renova; também não há na doc
     do provider Apple nenhuma menção a revogar ao deletar usuário (e
     server-to-server notifications não são suportadas).
     https://supabase.com/docs/guides/auth/social-login
     https://supabase.com/docs/guides/auth/social-login/auth-apple
  3. O `provider_refresh_token` só vem na sessão logo após o login.
- Implementado: `lib/account/apple-revoke.ts` (client secret ES256 com
  `node:crypto`, mesmo padrão de `lib/push/apns.ts`, sem dependência) chamado
  por `deleteAccount` como best-effort (nunca bloqueia; falha só vai pro log).
  Usa o token se ainda estiver em `session.provider_refresh_token`. Env:
  `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`, `APPLE_CLIENT_ID`
  (Services ID `io.nutrk.app.web`, o mesmo do provider no Supabase; o
  `client_id` da revogação precisa ser o da autorização).
- Limite honesto: na prática o token raramente estará na sessão no momento da
  exclusão. Cobertura completa exige capturar e guardar o refresh token no
  login (callback `/auth/callback`, após `exchangeCodeForSession`), em tabela
  com acesso só por service role (migration + cifra em repouso). Fora do meu
  escopo e exige decisão de segurança; ver pedidos abaixo.
- Resposta pra revisão da Apple, se perguntarem: "a exclusão dentro do app
  apaga todos os dados e o login; tentamos revogar o token via /auth/revoke
  quando disponível. Como o provedor de auth (Supabase) não persiste o token
  da Apple, orientamos o usuário a remover o acesso em Ajustes > Apple ID, conforme
  a TN3194." (texto também sugerido para `docs/mobile/store/review-notes.md`).
- Tempo/esforço: ~1h (a maior parte, pesquisa).
- Genérico: auth gerenciado (Supabase/Firebase/Auth0) em geral não guarda o
  token do provider; planeje capturá-lo no login se for revogar de verdade.
  Específico: Services ID, env e o Supabase.

## Pedidos ao integrador
- Se quiser revogação completa: no `/auth/callback`, quando o provider for
  Apple, guardar `session.provider_refresh_token` (tabela só service role,
  cifrado) e passar a `revokeAppleToken` em `deleteAccount`. Hoje ele lê só
  da sessão.
- Setar `APPLE_TEAM_ID/KEY_ID/PRIVATE_KEY/CLIENT_ID` na Vercel (a chave precisa
  ter Sign in with Apple habilitado; pode ser a mesma do client secret do
  Supabase).
- Colar a resposta da Apple acima nas notas de revisão.
- Decidir se `/pro/cadastro` deve tornar o nome opcional pra Apple.
- Garantir que o perfil permita editar o nome depois (apelido provisório).

## Pendências que dependem de conta Apple/Google
- Chave `.p8` com Sign in with Apple e Services ID (ver `auth-setup.md`).
- Testar em device real: login Apple sem nome → apelido → editar no perfil;
  excluir conta de um usuário Apple e conferir o log `[account] apple revoke`.
