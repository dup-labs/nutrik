# Process log: compliance-loja

> Aviso: isto não é aconselhamento jurídico. Política de privacidade, termos e respostas de formulário devem ser revisados por advogado antes de publicar.

Matéria-prima do playbook "web para app nas lojas". Cada etapa tem **Genérico** (template reaproveitável para qualquer cliente web para app) e **Específico** (só nūtrk).

---

## 1. Mapear o que o app coleta de verdade

- **O que fiz:** li `lib/types.ts`, migrations, `lib/actions.ts`, a anamnese, o fluxo de upload de foto e o cadastro do profissional; procurei SDKs de analytics/crash/ads (nenhum); listei dados por tabela.
- **Tempo/esforço (estimado):** 1 h.
- **Travou em / pegadinha:** o briefing falava em "peso/medidas" no check-in, mas o código só guarda sensação com o corpo, energia e caimento da roupa. A landing também promete "histórico de composição corporal" (profissional). Declarar o que o código faz, não o que o marketing diz. `avatar_url` existe mas não há upload.
- **Genérico:** a fonte da verdade dos formulários das lojas é o código, não o briefing. Roteiro: (1) tabelas e colunas; (2) formulários e uploads; (3) SDKs no `package.json` e scripts no HTML; (4) logs de servidor e terceiros (email, pagamento, auth). Gerar uma tabela "dado, onde nasce, quem vê, quem processa" e derivar tudo dela.
- **Específico:** nūtrk coleta saúde digitada pelo usuário (humor, sono, água, anamnese, treino, refeição) e foto de refeição; sem HealthKit/Health Connect, sem localização.

## 2. Páginas públicas de política e termos

- **O que fiz:** `/privacidade` e `/termos` como server components estáticos, com casca compartilhada (`LegalLayout`), tokens do app, legíveis no celular; placeholders `[RAZÃO SOCIAL]`, `[CNPJ]`, `[ENDEREÇO]`, `[DATA DE PUBLICAÇÃO]`; faixa "minuta em revisão jurídica" no topo.
- **Tempo/esforço (estimado):** 1,5 h.
- **Travou em / pegadinha:** a rota precisa estar fora do login no middleware (já estava). O Google pede URL que não seja PDF e acessível sem geofence. Link da política precisa estar também dentro do app.
- **Genérico:** estrutura mínima de política LGPD: controlador, dados por categoria, finalidade e base legal (art. 7 e art. 11 para saúde, com consentimento), compartilhamento e operadores, retenção, exclusão, direitos (art. 18), encarregado, menores, alterações. Termos: uso, limite do app (não substitui profissional), papel de terceiros (profissional), assinatura, conduta/UGC, encerramento, foro. Sempre passar por advogado.
- **Específico:** profissional vinculado vê os registros do paciente; turma só vê pontuação diária; assinatura B2B do profissional via Asaas; idade mínima 18 (decisão nossa, mais simples que tratar menor com saúde e chat, art. 14 LGPD).

## 3. Pesquisa das regras atuais das lojas (2026-10)

- **O que fiz:** busquei screenshots, classificação etária, declaração de apps de saúde, regra de testadores do Play e pagamentos externos no Brasil.
- **Tempo/esforço (estimado):** 1 h.
- **Travou em / pegadinha:** blogs de ASO divergem sobre set 6.5" (legado) e 1260 × 2736; usar 1320 × 2868 como principal. A Apple adicionou perguntas de rede social ao questionário etário em 2026-07 (obrigatório a partir de set/2026). Desde 2026-06 a Apple permite pagamento externo no Brasil (texto sem link sem comissão; botão com comissão). Eu não consegui abrir as páginas oficiais (só resultados de busca): tudo marcado como "reconferir no dia".
- **Genérico:** reservar uma etapa "reconferir ao vivo" imediatamente antes de submeter; formulários e tamanhos mudam a cada poucos meses. Fonte oficial primeiro; blogs só para achar a página.
- **Específico:** Brasil tem regime próprio de pagamento externo na Apple; isso pode virar plano B para a assinatura do profissional.

## 4. Formulários de privacidade das lojas

- **O que fiz:** `app-store-privacy.md` (nutrition labels) e `play-data-safety.md`, item a item, "linked to user" sim, tracking não; `play-health-declaration.md`.
- **Tempo/esforço (estimado):** 2 h.
- **Travou em / pegadinha:** classificar IP em log de servidor (decisão aberta, conservador = declarar); Google considera service providers como não "compartilhamento", Apple pergunta de coleta total; push token conta como Device ID; Play exige declaração de saúde mesmo sem Health Connect.
- **Genérico:** tabela única de dados vira as duas respostas; manter a política, o rótulo Apple e a Data safety consistentes (inconsistência é motivo de rejeição). Reabrir ao adicionar qualquer SDK.
- **Específico:** o nūtrk não lê sensores nem Health Connect, então a declaração Health é curta; categoria Saúde e fitness nas duas lojas.

## 5. Listagem, screenshots e classificação

- **O que fiz:** `listing-ptbr.md` (nome, subtítulo 30, promo 170, curta 80, longa, keywords 95/100, categorias, questionários) e `screenshots-spec.md` (8 telas com legendas, tamanhos).
- **Tempo/esforço (estimado):** 2 h.
- **Travou em / pegadinha:** limites de caracteres (conferir contagem); macron em "Nūtrk" pode ser rejeitado por alguma loja, deixar fallback; descrição iOS não pode citar preço/assinatura; iPhone-only evita exigir screenshots de iPad.
- **Genérico:** escrever a copy em voz da marca a partir da landing existente; 1 set principal por loja + conta demo com dados fictícios para capturar; legenda curta por tela.
- **Específico:** tom minúsculo e gentil, sem culpa; público 18+ nos termos e 13+ provável no questionário Apple por UGC social.

## 6. Notas do revisor e a assinatura sem IAP

- **O que fiz:** `review-notes.md` com contas demo (placeholders), roteiro de teste, justificativa de ausência de IAP (3.1.1 e 3.1.3(b)/(c)), plano B em quatro degraus.
- **Tempo/esforço (estimado):** 1,5 h.
- **Travou em / pegadinha:** o enquadramento B2B é frágil (3.1.3(c) pensa em empresas e funcionários; profissional autônomo é zona cinzenta). Não vendi como garantido.
- **Genérico:** modelo para qualquer SaaS web com conta paga fora: app grátis para quem usa, zero CTA/preço/link de compra no iOS, login de contas existentes, explicar no review notes, e ter plano B (remover a área paga do iOS, pagamento externo regional, ou IAP).
- **Específico:** pacientes não pagam; só profissionais, via Asaas.

## 7. Checklist de submissão

- **O que fiz:** `checklist-submissao.md`, 39 itens em 6 fases, com marcações CONTA / D-U-N-S / JUR / DEV.
- **Tempo/esforço (estimado):** 1 h.
- **Travou em / pegadinha:** o caminho crítico é D-U-N-S, e depois a conta Apple organização; começar na semana 0. Conta pessoal do Google exige 12 testadores por 14 dias.
- **Genérico:** ordem: empresa e contas, identificadores/chaves, produto conforme regras, ativos, formulários, build/TestFlight, envio, pós-envio. Esse checklist é o esqueleto do entregável vendável.
- **Específico:** `TEAM_ID` e `SHA256_FINGERPRINT` só existem depois das contas.

## Achados que o time precisa resolver (fora do meu escopo)

- Sem denunciar/bloquear usuário ou conteúdo no chat e nas turmas (guideline 1.2 da Apple e política UGC do Google): risco de rejeição.
- Copy da landing menciona "composição corporal" que o app não coleta hoje.
- Casca deve ter `ITSAppUsesNonExemptEncryption = NO` e textos de permissão em pt-BR.

## Pedidos ao integrador

- Garantir links `/privacidade`, `/termos` e `/excluir-conta` dentro do app (Perfil/Configurações) e na tela de login/cadastro.
- Decidir se o Android também esconde CTA de assinatura na 1ª submissão (recomendado, mesma regra do iOS).
- Alinhar com quem faz o push: o texto da política já cita APNs e Firebase.
- Trocar placeholders de empresa na política e nos termos quando o CNPJ chegar.

## Pendências que dependem de conta Apple/Google

- D-U-N-S, Apple Developer (org), Google Play Console (org), Team ID, SHA-256 da chave Android, chave APNs, Services ID de Sign in with Apple, projeto Firebase.
- Criar e preencher App Store Connect (App Privacy, classificação, notas) e Play Console (Data safety, saúde, IARC, app access).
- Contas demo em produção.
