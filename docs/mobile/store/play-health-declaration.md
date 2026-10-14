# Google Play: declaração de apps de saúde

> Aviso: isto não é aconselhamento jurídico. A política de privacidade e estas declarações devem ser revisadas por advogado antes de publicar. Requisitos conferidos em 2026-10-14 na documentação oficial (developer.android.com/health-and-fitness/health-connect/publish e Ajuda do Play Console); **reconfira o formulário no Console no dia de submeter**, ele muda.

## O que o Play exige de apps de saúde

1. Preencher a **Data safety** (ver `play-data-safety.md`).
2. Preencher o formulário **Health apps** em Play Console, App content. Ele vale para todo app que oferece funcionalidade de saúde, e as respostas de Health Connect só pesam se o app usar essas APIs.
3. Política de privacidade em URL pública, ativa, sem geofence e que **não seja PDF**, no campo do Console e acessível dentro do app. `https://app.nutrk.io/privacidade` cumpre.
4. Dados de saúde são dados sensíveis (User Data policy): pedir só o necessário e declarar com precisão.

## Resposta para o nūtrk

| Item | Resposta |
|---|---|
| Usa Health Connect (leitura/escrita)? | **Não.** O app não lê sensores nem Health Connect; os dados são digitados pelo usuário. Não declarar permissões `android.permission.health.*`; não incluir a dependência |
| Usa Google Fit / Fitness APIs? | Não |
| Funcionalidades de saúde (marcar no formulário) | **Nutrição e controle de peso**: sim (registro de refeições e plano alimentar do profissional) · **Atividade e condicionamento físico**: sim (treinos, séries, cargas) · **Sono**: sim · **Saúde mental e bem-estar** (humor, respiração): sim · Gerenciamento de condições médicas, medição de sinais vitais, saúde reprodutiva, resultados clínicos, estudos clínicos: **não** |
| É um dispositivo médico / faz diagnóstico? | Não. Reforçar na descrição da loja que o app não diagnostica nem substitui profissional. (Se o formulário perguntar sobre "software como dispositivo médico/regulatório", responder que não é) |
| Recebe dados de wearables? | Não |
| Fornece aconselhamento médico? | O app organiza planos montados por profissionais habilitados (CRN/CREF); o app não gera aconselhamento clínico automático |

Se no futuro o app ler Health Connect (passos, sono do relógio), será preciso: declarar cada data type com justificativa no formulário, ligar a privacy policy na Health Connect, e atualizar Data safety.

## Categoria na loja

**Saúde e fitness** (Health & Fitness), sem categoria secundária (Play só aceita uma). Tags sugeridas: nutrição, treinos, bem-estar, hábitos.

## Declarações de conteúdo relacionadas (App content)

- **Classificação de conteúdo (IARC):** ver `listing-ptbr.md`.
- **Público-alvo:** 18+ (não marcar crianças; evita a política Families).
- **Anúncios:** não contém.
- **App de notícias / governo / financeiro / criptomoedas:** não.
- **Acesso ao app:** o app exige login. Fornecer conta demo em "App access" (ver `review-notes.md`).
- **Conteúdo gerado pelo usuário (UGC):** o chat de turma e de profissional é UGC. A política Google exige mecanismo de **denunciar/bloquear** conteúdo e moderação; hoje o app tem remoção de membro pelo dono da turma. **Pendência de produto:** botão de denunciar mensagem/usuário, e o mesmo exigido pela guideline 1.2 da Apple.
- **Permissões sensíveis:** `CAMERA` (foto da refeição) e `POST_NOTIFICATIONS` (Android 13+). Sem localização, sem SMS, sem contatos.
