# process-log — exclusão de conta

Agente `exclusao-conta`. Regra de loja: Apple 5.1.1(v) (exclusão dentro do app,
sem fricção artificial) e Google Play (exclusão dentro do app + URL pública de
solicitação, com política de retenção explícita).

## Mapear o que a exclusão precisa apagar
- O que fiz: li o schema real do Supabase (somente leitura: `pg_constraint`,
  `information_schema`, `storage.buckets/objects`) em vez de confiar nas
  migrations. As migrations do repo cobrem só ~4 arquivos; o schema base
  (profiles, professionals, logs...) não está versionado.
- Tempo/esforço: ~1h, a maior parte do projeto.
- Travou em / pegadinhas (todas só aparecem olhando o banco):
  1. `professionals.user_id` é `ON DELETE SET NULL`: `auth.admin.deleteUser`
     deixa nome, email, telefone e bio do profissional **órfãos**. Teria passado
     em qualquer teste "o login sumiu".
  2. `meal_protocols.created_by` e `training_protocols.created_by` apontam pra
     `professionals` **sem cascade** (NO ACTION): apagar o profissional falha.
  3. `daily_activity` e `patient_events` não têm FK pra `profiles`: sobram.
  4. `friend_groups.owner_id` é cascade: apagar o dono derruba a turma de todos.
  5. **O projeto Supabase é compartilhado com outros apps** (polr, pblshr usam o
     mesmo `auth.users`). `deleteUser` apagaria o login e os dados do usuário
     nesses outros apps. A função SQL detecta e a action poupa o login.
  6. Bucket privado `nutrk-photos`, fotos em `<userId>/meals/...`: Storage não
     entra em cascade nenhum, precisa remover por API.
- Genérico: sempre auditar FKs de/para `auth.users` (`SET NULL` e "sem FK" são
  os vilões), tabelas sem FK que guardam id de usuário, Storage, e se o
  auth é compartilhado entre projetos.
- Específico do nūtrk: itens 1 a 6 acima; o papel duplo paciente/profissional.

## Server action `deleteAccount()` (`lib/account/actions.ts`)
- O que fiz: ordem pensada pra ser retomável: sessão + confirmação digitada
  (validada no servidor, não só no botão) → cancela Asaas → apaga fotos →
  função SQL transacional → `auth.admin.deleteUser` → `signOut` local →
  redirect. Cada passo é idempotente; falha no meio mantém a sessão e o usuário
  tenta de novo. A lógica de dados fica numa função `security definer`
  (`nutrk.delete_account_data`, migration `20261014_02`), executável só por
  `service_role`, porque são vários deletes que precisam ser atômicos.
- Decisões:
  - Assinatura ativa e não conseguiu cancelar (Asaas fora do ar, sem chave):
    **não apaga nada**. Pior caso aceitável é "tenta de novo", não "cobrando
    de quem não tem mais conta". 404 do Asaas conta como já cancelada.
  - Pacientes de um profissional excluído ficam com os próprios dados e com os
    planos montados (`created_by = null`). Efeito colateral: o app trata
    `created_by` nulo como "plano solo" (ver `soloPlanKey` nas configurações),
    então o paciente pode trocar o plano. Aceitável, mas é decisão de produto.
  - Turma: dono sai, turma passa pro membro mais antigo; sem outros membros, some.
  - O customer do Asaas não é deletado: tem cobranças, e retenção fiscal manda.
  - Redireciono pra `/excluir-conta?concluida=1` (rota pública, já liberada)
    em vez de `/entrada?excluida=1`, porque `/entrada` está fora do meu escopo.
- Tempo/esforço: ~1h.
- Pegadinha: arquivo `"use server"` só exporta funções async; constantes foram
  pra `lib/account/shared.ts`. `redirect()` dentro de action chamada do client
  lança `NEXT_REDIRECT`: o `catch` do client não pode engolir.
- Genérico: ordem "cancela cobrança primeiro"; tudo idempotente; confirmação no
  servidor; função SQL pra atomicidade. Específico: Asaas, schema, auth compartilhado.

## UI (configurações do paciente, perfil do profissional)
- O que fiz: componente único `lib/account/DeleteAccount.tsx`, inline (sem
  modal), 3 estados: botão discreto-mas-visível → lista do que é apagado → digitar
  "excluir". Texto muda por papel. Fica no fim da tela, sem esconder em submenu
  (Apple recusa se for difícil de achar).
- Regra 3.1.1 no perfil pro: o card "assinatura" (link pra `/pro/assinatura`,
  que tem checkout) vira texto neutro "gerencie sua assinatura em app.nutrk.io",
  sem link, quando `isNativeIOS()`. Detecção em `useEffect` pra não quebrar
  hidratação (no 1º render o link aparece por um instante no iOS; se incomodar,
  trocar por `getRequestPlatform()` no server e passar prop — e a própria página
  `/pro/assinatura` precisa do mesmo bloqueio, fora do meu escopo).
- Tempo/esforço: ~30 min.
- Genérico: onde colocar (perto de sair/trocar senha), dois passos, tom sem drama.
  Específico: marca minúscula e gentil; componentes `Card`/`TextInput` do nūtrk.

## `/excluir-conta` pública
- O que fiz: página sem login com: como excluir pelo app, formulário pra quem
  perdeu acesso, o que é apagado, o que pode ser retido e por quanto tempo. O
  formulário manda email pra `app@nutrk.io` via `lib/email.ts` (Resend) e **não**
  manda nada pro endereço digitado (evita virar relay de spam); a resposta
  manual confirma que o email é do dono. Honeypot contra bot; conteúdo do
  usuário escapado (o `sendEmail` injeta HTML cru). Sem `RESEND_API_KEY` o form
  devolve erro orientando a escrever pro email, em vez de fingir sucesso.
- Tempo/esforço: ~30 min.
- Pegadinha: o Google valida a URL na ficha da Play Console; ela precisa estar
  pública (middleware) e citar o nome do app/desenvolvedor, o que é apagado e a
  retenção. Sem rate limit real (só honeypot): ok pra volume baixo.
- Genérico: toda a estrutura da página e a regra de não responder ao email
  informado. Específico: prazos e tabelas de retenção abaixo.

## Apagado vs retido (nūtrk)
Apagado na hora: login, perfil, todos os registros do paciente, fotos, mensagens
e vínculos, turmas/mensagens de turma, perfil/consultas/notas/vídeos do pro,
assinatura (cancelada).
Retido: cobranças e dados fiscais no Asaas (declarado: até 5 anos); backups do
Supabase (declarado: até 30 dias); registro do pedido de exclusão por email.
**Valores 5 anos / 30 dias são afirmações públicas: confirmar com o jurídico e
com o plano de backup real do Supabase antes de publicar.**

## Pedidos ao integrador
- Aplicar `apps/web/supabase/migrations/20261014_02_account_deletion.sql` no
  Supabase **antes** de liberar o build: sem ela a exclusão falha com erro
  amigável (a função `delete_account_data` não existe), nada é apagado, exceto
  fotos e assinatura cancelada, que já aconteceram — idempotente, ok.
- `/pro/assinatura` e qualquer outra tela com preço/checkout precisam do mesmo
  tratamento `isNativeIOS()`; só cobri o card em `ProPerfilClient`.
- Testar com conta descartável (paciente, profissional com assinatura sandbox,
  dona de turma com membros, usuário que também existe em polr/pblshr).
- Cogitar notificar pacientes quando o profissional excluir (hoje o vínculo
  some em silêncio).
- Se a rota de login (`/entrada`) quiser mostrar "conta excluída", aceitar
  `?excluida=1`; hoje usamos a própria `/excluir-conta?concluida=1`.

## Pendências que dependem de conta Apple/Google
- Play Console: colar a URL `https://app.nutrk.io/excluir-conta` no formulário
  "Segurança dos dados / exclusão de conta".
- App Store Connect: nada específico; o revisor precisa achar o fluxo
  (perfil → configurações → excluir). Colocar o caminho nas notas de revisão e
  uma conta demo.
- Se houver Sign in with Apple (outro agente): Apple pede **revogar o token**
  de Sign in with Apple na exclusão (`/auth/revoke`). Não coberto aqui; precisa
  do refresh token e das chaves Apple — fica como pendência.
