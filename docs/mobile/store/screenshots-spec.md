# Especificação de screenshots

> Aviso: isto não é aconselhamento jurídico. Prints não podem mostrar dado real de pessoa nem alegação de resultado clínico; use a conta demo. Tamanhos conferidos em fontes de 2026 (guias de terceiros, que divergem em detalhes): **reconfira em App Store Connect e Play Console antes de exportar.**

## App Store

| Dispositivo | Pixels (retrato) | Obrigatório? |
|---|---|---|
| iPhone 6.9" (16/17 Pro Max etc.) | **1320 × 2868** (aceitos também 1290 × 2796 e 1260 × 2736) | **Sim, é o set principal.** A Apple reduz para os menores quando a UI é a mesma |
| iPhone 6.5" | 1284 × 2778 ou 1242 × 2688 | Só se não houver set 6.9" (legado). Gerar só se o Connect pedir |
| iPad 13" | 2064 × 2752 (ou 2048 × 2732) | **Só se o app rodar em iPad.** Decisão: build **iPhone-only** (`TARGETED_DEVICE_FAMILY = 1`) no 1.0 para não exigir set de iPad nem layout tablet. Se for universal, é obrigatório |

Regras: PNG ou JPEG, sem transparência, de 1 a 10 imagens por set, sem moldura de aparelho obrigatória (pode usar, mas não alterar a tela). Prévia em vídeo: opcional, até 30 s, não necessária no 1.0.

## Google Play

| Ativo | Especificação | Obrigatório? |
|---|---|---|
| Screenshots de celular | PNG/JPEG 24-bit sem alpha, 2 a 8 imagens, cada lado entre 320 e 3840 px, proporção até 2:1. Usar **1080 × 2400** (9:20) | Sim, mínimo 2; use 8 (4+ ajuda a ser recomendado) |
| Feature graphic | **1024 × 500**, JPEG ou PNG 24-bit sem alpha | **Sim** |
| Ícone | 512 × 512 PNG 32-bit, até 1 MB | Sim |
| Tablet 7"/10" | opcional (recomendado se quiser qualidade em tablets) | Não |

## Quais telas (mesma sequência nas duas lojas, 8 no total)

Capturar com a conta demo de paciente (ver `review-notes.md`), dados fictícios em pt-BR, status bar limpa (9:41, bateria cheia). Fundo/aura mesh do design system atrás do aparelho; legenda em cima, em Satoshi Black, minúscula, cor `#1b1c1d`, uma palavra em gradiente no máximo.

| # | Tela (rota) | Legenda |
|---|---|---|
| 1 | Início do dia (`/`): ofensiva, metas do dia | **seu dia, num lugar só.** |
| 2 | Refeições (`/refeicoes`) com uma refeição marcada | **marque o que comeu, sem culpa.** |
| 3 | Detalhe da refeição com foto (`/refeicoes/[id]`) | **uma foto do prato, se quiser.** |
| 4 | Treino do dia (`/treino`) com séries e cargas | **treino do seu jeito.** |
| 5 | Água e Mente (`/agua` ou `/mente`: respiração, humor, sono) | **água, sono e humor em poucos toques.** |
| 6 | Chat com o profissional (`/chat/[proId]`) | **seu nutri e seu personal, juntos.** |
| 7 | Turma de amigos com ranking (`/amigos/[id]`) | **junte a turma. pontue o hábito.** |
| 8 | Progresso e conquistas (`/progresso`) | **celebre a volta, não só a sequência.** |

Observações:
- Tela 6 mostra mensagens genéricas; sem nomes ou conselhos clínicos reais.
- Na versão **iOS**, nenhuma tela pode mostrar preço, plano pago ou botão de assinar. As 8 acima já não mostram. Não capturar `/pro/assinatura`.
- Se mostrar o painel profissional como screenshot extra, usar só no Play (e sem tela de assinatura).
- Gerar a partir do app real (simulador iPhone 17 Pro Max e emulador Pixel 8) ou via ferramenta de mockup; manter o mesmo conteúdo em todas as resoluções.

## Feature graphic (Play, 1024 × 500)

Fundo `--mesh-cool`, wordmark `nūtrk` à esquerda, frase "nutrição, treino e mente no seu ritmo." à direita. Sem screenshots minúsculos nem texto fora da zona central.
