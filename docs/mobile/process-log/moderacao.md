# process log — moderação de UGC (agente `moderacao`)

Escopo: denunciar, bloquear, ocultar e agir sobre conteúdo gerado por usuário
(chat paciente↔profissional e chat das turmas). Exigência: App Store guideline
1.2 e política de UGC do Google Play.

## Levantamento do que existia
- O que fiz: li o modelo de dados antes de desenhar. Chat direto = `nutrk.messages`
  (`patient_id`, `professional_id`, `sender`), só paciente↔profissional, **não há
  DM paciente↔paciente**. Turma = `nutrk.group_messages` (`group_id`, `sender_id`),
  escrita só pela RPC `send_group_message` (que também notifica). "Sair da turma"
  já existia (`LeaveGroupButton`). Não havia denúncia, bloqueio nem contato de moderação.
- Tempo/esforço (estimado): 30 min de leitura.
- Travou em / pegadinha: o MCP do Supabase não enxerga o projeto do nūtrk (só
  comprinhas/dup-geo-audit/brunodup.com), então **não li o schema remoto**. A
  tabela `messages` e o tipo do `messages.id` não estão nas migrations do repo
  (vieram de antes). Por isso `reports.message_id` é `text`, e as policies sobre
  `messages` são `restrictive` (somam por AND com o que já existe, sem reescrever
  policy que não vi).
- Genérico ou específico: **genérico** — primeiro passo de qualquer web→app com UGC é
  mapear *onde o texto de terceiros aparece* (chat, comentário, nome, avatar, bio).
  Aqui só mensagens; username é visível no ranking (ver riscos).

## Modelo de dados (migration `20261014_02_moderation.sql`, NÃO aplicada)
- O que fiz:
  - `nutrk.reports`: reporter, alvo, contexto (`turma_mensagem` / `chat_mensagem` /
    `turma_membro`), `group_id`, `group_message_id` (FK), `message_id` (text),
    `message_excerpt` (cópia do texto: a prova sobrevive se a mensagem for apagada),
    motivo (`assedio|ofensivo|spam|outro`), `details`, `status`
    (`open|reviewing|actioned|dismissed`), `resolution_note`, `reviewed_at`.
    RLS: usuário cria e lê só as suas; sem update/delete (triagem via service role).
  - `nutrk.user_blocks` (`blocker_id`, `blocked_id`, unique): dono gerencia.
  - Helpers `security definer`: `i_blocked`, `blocked_between`, `pro_user_id`,
    `i_reported_group_message`, `i_reported_message`.
  - Policies **restrictive** em `group_messages` e `messages` (ver abaixo).
  - `send_group_message` recriada: não gera notificação pra quem bloqueou o remetente
    (senão o preview da mensagem bloqueada vazaria no push/notificação).
- Tempo/esforço (estimado): 1 h.
- Travou em / pegadinha: policy permissiva não dá pra "subtrair"; o jeito limpo de
  esconder linha por quem bloqueou/denunciou sem tocar nas policies existentes é
  `AS RESTRICTIVE`. Realtime (`postgres_changes`) respeita RLS, então mensagem de
  bloqueado também não chega ao vivo.
- Genérico ou específico: padrão de restrictive policy + tabela de evidências com
  snapshot é **genérico**; nomes de tabela são específicos.

## Como o bloqueio funciona de fato
| Situação | Efeito |
|---|---|
| Turma: A bloqueia B | RLS esconde as mensagens de B pra A (select restritivo em `group_messages`). `getGroupMessages` também filtra no servidor (defesa em profundidade) e o client remove na hora. B continua vendo A e continua na turma. B não gera mais notificação pra A. |
| Paciente bloqueia profissional | Conversa some pra ele (RLS), input fecha ("chat fechado"). **Insert** de mensagem em qualquer direção entre os dois é barrado por policy restritiva em `messages` — o profissional também não consegue escrever pra ele. |
| Profissional bloqueia paciente | Mesma lógica, espelhada (usa `professionals.user_id`). |
| Denunciar mensagem | Linha em `reports` + email; a mensagem some imediatamente pra quem denunciou (client na hora; RLS `i_reported_*` no refresh/realtime). Segue visível pro resto da turma até a triagem. |

**Decisão (bloquear o próprio profissional):** é permitido, mas **não apaga o vínculo**
(`patient_professional_links`) nem os dados clínicos. Só fecha o canal de chat dos
dois lados. Motivo: apagar vínculo é destrutivo, irreversível pro profissional (perde
plano/histórico do paciente) e eu não conheço as policies de `links`; fechar o chat já
cumpre "parar de receber contato abusivo". O texto de confirmação avisa isso e diz que,
pra encerrar o acompanhamento de vez, é só desvincular. **Pendência pro integrador:**
se o Dup preferir que bloquear = desvincular, é um `delete` em `patient_professional_links`
dentro de `blockUser` quando o alvo é profissional.
O bloqueio de membro de turma não remove ninguém da turma (quem expulsa é o dono).

- Genérico ou específico: a matriz acima (bloquear = esconder + impedir contato +
  não notificar) é **genérica**; a regra do vínculo clínico é **específica do nūtrk**.

## UI
- O que fiz: `lib/moderation/ModerationMenu.tsx`.
  - `MessageActions`: envolve o balão de mensagem de *outra* pessoa. Long-press
    (450 ms) no toque, botão direito no desktop, e um "⋯" discreto ao lado. Abre um
    sheet: denunciar / bloquear / cancelar.
  - Denúncia: motivos (assédio ou ameaça, conteúdo ofensivo, spam, outro) + texto
    opcional → confirmação "denúncia enviada e a mensagem sumiu pra você".
  - Bloqueio: tela de confirmação com o que muda (texto próprio pra profissional).
  - `MemberMenuButton`: "⋯" em cada membro do ranking da turma (denunciar pessoa /
    bloquear). Aplicado em chat paciente, chat da turma, painel do profissional e
    página da turma. "Sair da turma" já existia.
  - A mensagem só some depois que o sheet fecha (senão o componente desmontava antes
    da tela de "pronto").
- Tempo/esforço (estimado): 2 h.
- Travou em / pegadinha: `-webkit-touch-callout: none` no wrapper evita o menu nativo
  de iOS competir com o long-press (custo: não dá pra copiar o texto do balão alheio
  por long-press). Mensagens otimistas (`tmp-`) e as próprias ficam sem menu.
- Genérico ou específico: **genérico** (componente sheet + wrapper). Tom pt-BR minúsculo é específico.

## Ação sobre denúncia (servidor)
- O que fiz: `lib/moderation/actions.ts` (`reportContent`, `blockUser`, `unblockUser`,
  `listMyBlocks`). O servidor resolve o autor da mensagem pelo `messageId` (nunca
  confia em `userId` do client), limita a 20 denúncias/24 h por usuário, grava e manda
  email pra `app@nutrk.io` via `lib/email.ts` (denúncia, motivo, denunciante, alvo,
  trecho da mensagem, detalhes). Falha de email não derruba a denúncia (fica em `reports`).
- Tempo/esforço (estimado): 1 h.
- Travou em / pegadinha: `sendEmail` é no-op sem `RESEND_API_KEY` — **conferir a chave
  em produção**, senão a denúncia fica só na tabela e ninguém é avisado. `unblockUser`
  e `listMyBlocks` existem mas **não têm tela** (perfil/configurações fora do meu
  escopo) — ver pedidos.
- Genérico ou específico: **genérico** (denúncia → tabela → email).

## SLA da Apple e processo manual (sem painel admin)
**SLA.** O texto oficial da guideline 1.2 pede "um mecanismo para denunciar conteúdo
ofensivo e **respostas oportunas** (timely) a preocupações", bloqueio de usuários
abusivos, filtro de material impróprio e contato publicado. O número **24 horas** vem
dos templates de rejeição da App Review ("agir sobre denúncias em até 24 h, removendo
o conteúdo e expulsando quem o publicou") e não consegui confirmar na página oficial
(a busca não retornou o texto vigente). **Tratar 24 h como o SLA** e conferir o texto
atual em developer.apple.com/app-store/review/guidelines antes de submeter. Fontes:
fórum Apple Developer thread 807358; carta da Apple ao Congresso (abr/2021); relatos
de rejeição 1.2.

**Processo manual sugerido pro Dup:**
1. Cada denúncia chega em `app@nutrk.io` com assunto `[denúncia] <motivo> — <contexto>`.
   Filtro de email com notificação no celular. Olhar de manhã e à tarde (cobre 24 h).
2. Abrir no Supabase: `select * from nutrk.reports where status = 'open' order by created_at;`
3. Decidir:
   - Procede, mensagem: `delete from nutrk.group_messages where id = '<group_message_id>';`
     (chat direto: `delete from nutrk.messages where id::text = '<message_id>';`).
   - Procede, pessoa: remover da turma
     (`delete from nutrk.friend_group_members where group_id = ... and patient_id = ...;`)
     ou, se grave/reincidente, banir a conta (Auth → Users → ban) e registrar.
   - Não procede: só fechar.
4. Fechar: `update nutrk.reports set status = 'actioned' | 'dismissed', resolution_note = '...', reviewed_at = now() where id = '...';`
5. Conteúdo ilegal grave (ameaça, abuso de menor): preservar `reports.message_excerpt`,
   banir e seguir o protocolo legal; não depender de a mensagem original existir.
6. Revisar mensalmente: denúncias abertas > 24 h, reincidentes (`group by target_user_id`).
- Pegadinha: sem painel admin, o gargalo é humano. Se o volume crescer, o primeiro
  investimento é uma view `nutrk.reports_open` + página `/admin/denuncias` protegida.
- Genérico ou específico: SLA e fluxo são **genéricos**; os SQLs são do schema nūtrk.

## Texto pras notas de revisão da Apple (App Review Information → Notes)
> Conteúdo gerado por usuário (guideline 1.2). O Nūtrk tem dois tipos: chat entre
> paciente e profissional de saúde e chat de "turmas" (grupos de amigos).
> **Denunciar:** em qualquer mensagem de outra pessoa, pressione e segure a mensagem
> (ou toque nos três pontinhos "⋯" ao lado) e escolha "denunciar mensagem" → motivo
> (assédio ou ameaça, conteúdo ofensivo, spam, outro) → "enviar denúncia". Também dá
> pra denunciar uma pessoa pelo "⋯" na lista de membros da turma (aba Amigos → turma).
> A mensagem denunciada some imediatamente pra quem denunciou.
> **Bloquear:** no mesmo menu, "bloquear @usuário". O usuário bloqueado deixa de
> aparecer nas turmas pra quem bloqueou, não gera notificações e não consegue
> enviar mensagem no chat direto.
> **Moderação:** toda denúncia chega por email a app@nutrk.io e é analisada em até
> 24 horas; conteúdo que viola os Termos é removido e o usuário é expulso da turma
> ou tem a conta suspensa. **Contato:** app@nutrk.io (também nos Termos de Uso,
> https://app.nutrk.io/termos).
> Para testar: crie duas contas, entre na mesma turma (código na tela da turma),
> mande uma mensagem com uma e denuncie/bloqueie com a outra.

(Credenciais de teste e conta de profissional: ver `docs/mobile/store/review-notes.md`.)

## Riscos e lacunas honestas
- **Filtro automático de conteúdo (parte "filtrar" da 1.2) não foi implementado.** Hoje
  o "filtro" é denúncia + ocultação + ação manual em 24 h. Costuma bastar, mas se o
  reviewer apontar, o caminho barato é uma lista de termos na RPC `send_group_message`.
- **Termos de Uso precisam dizer "tolerância zero com conteúdo ofensivo"** e citar a
  possibilidade de remoção/expulsão (Apple pede EULA com isso). Edição de `/termos`
  fora do meu escopo — pedido abaixo.
- Username/nome aparecem no ranking e em busca (`search_profiles`/`invite_to_group`):
  um bloqueado ainda pode convidar o bloqueador pra uma turma. Não filtrei RPCs de
  convite (mudança maior em SQL de terceiros); denúncia de pessoa cobre o caso.
- Migration não aplicada e não testada contra o banco real (sem acesso ao projeto
  nūtrk via MCP). **Antes de aplicar, conferir**: `professionals.user_id` existe,
  `messages` tem RLS ligado e os tipos de `messages.id`. Rodar em branch/staging.
- Bloqueado vê tudo como antes (não é avisado) — intencional, evita retaliação.

## Pedidos ao integrador
- Aplicar `20261014_02_moderation.sql` (após conferir as premissas acima).
- Confirmar `RESEND_API_KEY` em produção e que `app@nutrk.io` recebe email (o remetente
  também é `app@nutrk.io`; alguns provedores filtram auto-envio).
- Tela "usuários bloqueados" com `listMyBlocks()` / `unblockUser()` em perfil/configurações
  (fora do meu escopo).
- Atualizar `/termos` (tolerância zero, remoção de conteúdo, expulsão de conta) e citar
  `app@nutrk.io` como contato de moderação.
- Decidir se bloquear profissional deve também desvincular (hoje não).

## Pendências que dependem de conta Apple/Google
- Colar o texto das notas de revisão no App Store Connect (App Review Information).
- Google Play: preencher a política de UGC no Play Console (Content → declara que
  há UGC, que existe denúncia e bloqueio) e informar o contato.
