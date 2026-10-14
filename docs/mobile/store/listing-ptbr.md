# Listagem pt-BR (App Store e Google Play)

> Aviso: isto não é aconselhamento jurídico. Textos de loja que mencionam saúde precisam passar por revisão (sem promessa de resultado, sem alegação clínica). A política de privacidade deve ser revisada por advogado antes de publicar.

Tom da marca: minúsculo, gentil, sem culpa. "o que importa é a consistência." Copy base tirada da landing (`apps/landing`): "nutrição, treino e mente no seu ritmo", "sem dieta punitiva", "conquistas que celebram a volta, não só a sequência perfeita", "pequenas vitórias, todo dia". Atenção: o nome da marca é **Nūtrk** (com macron) na loja.

## Identidade

| Campo | Valor | Limite |
|---|---|---|
| Nome (iOS e Play) | `Nūtrk: nutrição e treino` | iOS 30 / Play 30. (24 caracteres). Fallback sem macron se a loja rejeitar: `Nutrk: nutrição e treino` |
| Subtítulo iOS | `seu dia, no seu ritmo` | 30 (21 caracteres) |
| Texto promocional iOS | ver abaixo | 170 |
| Descrição curta Play | ver abaixo | 80 |
| Palavras-chave iOS | ver abaixo | 100 |
| URL de suporte | `https://nutrk.io` (trocar por página de suporte quando existir) | |
| URL de marketing | `https://nutrk.io` | |
| Email de contato | `app@nutrk.io` | |
| Política de privacidade | `https://app.nutrk.io/privacidade` | |

### Texto promocional (iOS, 170)

```
nutrição, treino e mente num plano só. marque o que fez, junte sua turma e volte quando precisar: o que importa é a consistência.
```
(129 caracteres)

### Descrição curta (Play, 80)

```
nutrição, treino e mente no seu ritmo. o que importa é a consistência.
```
(70 caracteres)

### Palavras-chave iOS (100, separadas por vírgula, sem espaço)

```
nutricionista,personal,dieta,refeições,treino,hábitos,água,sono,humor,bem-estar,meditação,saúde
```
(95 caracteres). Não repetir palavras do nome/subtítulo/categoria (a Apple já indexa). Ajustar após o 1º mês com dados de busca.

### Descrição longa (iOS e Play)

```
o nūtrk junta nutrição, treino e saúde mental num plano diário simples, do jeito que cabe na sua rotina. sem dieta punitiva, sem cobrança: o que importa é a consistência.

o que você faz no nūtrk

• marque suas refeições e, se quiser, tire uma foto do prato
• siga seus treinos, anote as cargas e veja a evolução
• registre água, sono e humor em poucos toques
• faça pausas de respiração guiadas quando o dia apertar
• responda check-ins gentis sobre como você está se sentindo

com seu nutricionista e seu personal

se você tem um profissional, ele monta seu plano alimentar e seu treino direto no nūtrk e acompanha sua rotina entre as consultas. converse com ele pelo chat, peça troca de refeição e agende retornos, tudo no mesmo lugar. a vinculação é feita com um código que o profissional te passa, e você pode encerrá-la quando quiser.

sem profissional ainda? comece com planos-base e ajuste no seu ritmo.

turmas de amigos

crie uma turma, chame quem você gosta e juntem pontos pelos hábitos do dia. os amigos veem só a pontuação, nunca seus registros. conquistas que celebram a volta, não só a sequência perfeita.

sua privacidade

seus dados de saúde são seus. você escolhe o que acompanhar, quem enxerga e pode excluir sua conta a qualquer momento, dentro do app.

para profissionais

nutricionistas e personal trainers acompanham pacientes, montam protocolos e agenda no painel profissional. o cadastro e a assinatura são feitos em app.nutrk.io. o login com sua conta funciona normalmente no aplicativo.

importante: o nūtrk não faz diagnóstico nem substitui consulta com profissional de saúde. em caso de dor ou mal-estar, procure atendimento.
```

> Para o texto do **iOS**: não citar preço, planos pagos nem "cadastre-se em app.nutrk.io" como chamada para compra (guideline 3.1.1). O parágrafo "para profissionais" acima está em forma neutra de propósito; se o revisor reclamar, remover a frase "o cadastro e a assinatura são feitos em app.nutrk.io" da versão iOS e manter só no Play.

## Categorias

| Loja | Primária | Secundária |
|---|---|---|
| App Store | **Saúde e fitness** | **Estilo de vida** (alternativa: Alimentos e bebidas; descartada porque o app não é de receitas/delivery e atrairia expectativa errada) |
| Google Play | **Saúde e fitness** | (Play só aceita uma) |

## Classificação etária

Decisão: **público 18+ nos termos de uso**; classificação das lojas reflete o conteúdo, não a idade mínima contratual.

### App Store (questionário atual)

Apple tem faixas 4+, 9+, 13+, 16+, 18+. Em 2026-07 foram adicionadas perguntas sobre redes sociais/feeds de conteúdo de usuário (obrigatório para novos apps e updates a partir de set/2026). Reconferir no App Store Connect.

| Pergunta (resumo) | Resposta |
|---|---|
| Violência de desenho/realista, armas, sexo/nudez, linguagem, humor, terror, drogas, álcool, jogos de azar, loot box | Nenhum |
| Temas médicos ou de bem-estar (informações médicas/de saúde) | **Sim, infrequente/leve** (planos de nutrição/treino e exercícios de respiração; sem tratamento de doenças) |
| Conteúdo gerado por usuário / chat com desconhecidos | Chat entre paciente-profissional vinculado e entre membros de turma que se convidam por código/username. Responder conforme o formulário: tem mensagens de usuário, **sem** mensagens abertas a desconhecidos |
| Redes sociais (feed que redistribui UGC) | Não há feed público; só turmas fechadas. Responder "não" se a pergunta for sobre feed/discovery; se for sobre interação social em geral, "sim" |
| Controle parental / verificação de idade | Não |
| Compras no app / acesso web irrestrito | Não / Não (webview só do próprio domínio) |

Resultado esperado: **13+** se cair na regra de piso por UGC social; senão **9+** ou **4+**. Escolher manualmente a faixa mais alta que o formulário gerar e não rebaixar. Se a Apple impuser 13+, tudo bem: os termos continuam exigindo 18.

### Google Play (IARC)

Categoria do questionário: "Referência, notícias ou educação" não serve; usar **"Utilidade, produtividade, comunicação ou outro"** (há comunicação entre usuários).

| Pergunta | Resposta |
|---|---|
| Violência, sexo, linguagem, substâncias, jogos de azar | Não |
| Usuários podem interagir/trocar conteúdo | **Sim** (chat) |
| Compartilha localização | Não |
| Permite compras digitais | Não no app |
| Pode expor a conteúdo não moderado de usuário | Sim (chat de turma). Marcar |

Resultado esperado: classificação ESRB "Everyone" / PEGI 3 com aviso "Interação entre usuários"; para o Brasil, **Livre** ou **10** conforme o ClassInd retornado pelo IARC. Aceitar o resultado calculado.

## Locais e extras

- Localização principal: Português (Brasil). Opcional depois: Inglês.
- Direitos autorais: `© 2026 [RAZÃO SOCIAL]`.
- Nome de vendedor: `[RAZÃO SOCIAL]` (conta de organização; ver checklist).
- "O que há de novo" da v1.0: `primeira versão nas lojas. bora criar o hábito, um dia de cada vez.`
