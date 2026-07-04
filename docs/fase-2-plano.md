# nūtrk — plano da fase 2 (handoff v2)

> Fonte: `claude-design-handoff/handoff-v2/` — Paciente atualizado + Nutricionista + Personal.
> Status: aprovado em 2026-07-04 · execução por etapas abaixo.

## O que mudou no design

1. **Paciente v2**: única mudança é exibir **kcal + macros (P/C/G)** nos cards de refeição e no detalhe. (Reverte a regra v1 de "sem números pro paciente".)
2. **Nutricionista** (desktop sidebar + mobile): Dashboard (stats, "precisam de você", check-ins de hoje, agenda, colaboração com o par) · Pacientes (busca + filtro em dia/atenção/sumindo) · Detalhe do paciente com abas **geral / anamnese / plano (montador) / evolução / notas com o par** · Agenda · Mensagens (pacientes + par fixado) · Check-ins (feed) · Perfil.
3. **Personal**: mesmo shell; montador é de **treino** (dia a dia: tipo do treino, exercícios com vídeo de execução, séries com carga POR SÉRIE, reps) · evolução com métricas de treino.

### Montador do nutri (detalhe)
Dias da semana → refeições do dia (com totais que somam sozinhos) → editor: busca em base de alimentos (unit/base/macros), stepper de quantidade, remover, "adicionar refeição", "copiar de outro dia", **"publicar pro paciente"**. Card "total do dia" com kcal/P/C/G.

### Montador do personal (detalhe)
Dias da semana → tipo do treino (ou descanso) → exercícios: thumbnail de vídeo (escolher/trocar), reps, séries como pills com valor de carga (+/-), adicionar série/exercício, "copiar de outro dia", **"publicar pro aluno"**.

## Mudanças de schema (migration fase 2)

- `foods`: seed com a base do design (16 itens) — estrutura já existe ✓
- `plan_templates`: adicionar `foods` (itens c/ qty) e macros por refeição nos payloads solo
- `protocol_meal_items`: passa a ser populado sempre (macros do paciente = soma dos itens)
- `workout_exercises`: + coluna `set_targets jsonb` (carga sugerida por série)
- `exercise_videos`: nova tabela (name, url, thumb) — biblioteca de vídeos do personal (MVP: URL/YouTube)
- `patient_details`: nova tabela (objetivo, rotina, restricoes[], historico, sintomas[], resolvidos[]) — aba "geral", editável pelo pro
- `appointments`: + `duration_min`, `mode ('online'|'presencial')`, `notes`
- `professionals`: fluxo de cadastro do pro (user_id + geração de invite_code)
- View `patient_events`: união de meal_logs/mood_logs/water/checkins → feed "check-ins de hoje"
- Status do paciente (em dia/atenção/sumindo): **computado** (última atividade + tendência de aderência), não armazenado

## Decisões de arquitetura

- **Mesmo app** (`apps/web`), route group `(pro)` em `/pro/*` — compartilha tokens, UI, lib, supabase. Roteamento pós-login: tem linha em `professionals`? → `/pro`. Senão → app do paciente.
- Desktop-first com sidebar em `lg:`, bottom nav no mobile (o design entrega os dois).
- Chat pro↔paciente reusa `messages` + realtime ✓. Notas com o par = `internal_notes` (thread por paciente) ✓ — a conversa fixada "par" na tela de mensagens abre esse thread.
- "Publicar pro paciente/aluno" = protocolo `draft` → `active` + notificação pro paciente.

## Etapas de execução

| Etapa | Escopo | Depende de |
|---|---|---|
| **2.0** | Paciente v2: macros na UI (cards + detalhe), seeds solo com itens/macros, seed foods | — |
| **2.1** | Fundação pro: migration, cadastro/login do pro, layout sidebar+mobile, roteamento por papel | 2.0 |
| **2.2** | Dashboard + Pacientes (lista, filtros, alertas, feed) | 2.1 |
| **2.3** | Detalhe do paciente: abas geral, anamnese, evolução (gráficos) | 2.2 |
| **2.4** | Montador de plano alimentar (nutri) + publicar | 2.3 |
| **2.5** | Montador de treino (personal) + vídeos + publicar | 2.3 |
| **2.6** | Agenda, Mensagens, Check-ins, Perfil do pro | 2.2 |
| **2.7** | Notificações de publicação, polish, deploy | tudo |

## Defaults assumidos (grita se discordar)

- Cadastro de profissional **aberto** (qualquer um cria conta pro; sem aprovação manual na v1)
- Vídeos de exercício: campo de URL (YouTube/Vimeo) na v1; biblioteca própria depois
- Screenshots do handoff usados como referência visual; `.dc.html` é a fonte da verdade
- Dashboard do pro no mesmo domínio (`app.nutrk.io/pro`); subdomínio `pro.nutrk.io` fica pra depois se quiserem
