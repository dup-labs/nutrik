# Nūtrk Design System

> Escuro, técnico, preciso. Feito de consistência.

**Versão:** 1.0 — Junho 2026  
**Estúdio:** Dup.Labs  
**Pronúncia:** "nutrik" — o mácron no Ū é estético, não fonético.

---

## Empresa e Produto

Nūtrk é uma plataforma SaaS de acompanhamento nutricional esportivo. Ela conecta atletas e nutricionistas em um protocolo compartilhado — registro de refeições, treinos, sono e suplementos — com a precisão de um laboratório e a clareza de um dashboard.

O produto vive na interseção entre **esporte de performance** e **nutrição clínica**. Não é um contador de calorias para usuários casuais; é uma ferramenta profissional para quem trata a nutrição como variável de treino.

**Promessa central:** "Consistência operacionalizada." — O sistema que mantém o protocolo vivo entre as consultas.

**Fontes utilizadas:**
- `uploads/nutrk-logo.svg` — wordmark vetorial oficial
- `uploads/nutrk-design-system-prompt.md` — briefing do Dup.Labs
- `uploads/Screenshot 2026-06-11 at 09.38.47.png` — ficha de identidade (tipografia, iconografia, pilares da marca)
- `uploads/Screenshot 2026-06-11 at 09.38.56.png` — ícone do app + referência do elemento streak
- `uploads/Screenshot 2026-06-11 at 09.39.03.png` — versões do logo (Principal, Secundária, Clara)
- `uploads/WhatsApp Image 2026-06-11 at 09.07.*.jpeg` — painel de referência visual (Fayze eyewear, The Projekt agency)

---

## FUNDAMENTOS DE CONTEÚDO

**Idioma:** Português brasileiro. Todo o copy de UI em pt-BR.

**Tom:** Técnico mas humano. Preciso como um laudo, claro como um bom treinador.
- Fale diretamente com o usuário: **"você"**, nunca "usuário"
- Comandos são afirmativos, nunca passivos: "Registrar refeição" não "Refeição registrada com sucesso por você"
- Números sempre em notação brasileira: `2.340 kcal`, `84,3 kg`

**Caixa:**
- Labels de seção: `CAIXA ALTA` com `letter-spacing: 0.08em` — sempre Inter, sempre cor muted
- Nomes de funcionalidades e botões: Title Case ou caixa normal conforme o contexto
- Métricas e dados: numerais brutos em DM Mono, nunca por extenso
- Nunca CAIXA ALTA em headings — apenas em metadados e labels

**Estilo de copy:**
- Frases curtas. Sem enchimento. Sem advérbios desnecessários.
- ✓ "Protocolo ativo." — ✗ "O seu protocolo nutricional está ativo no momento."
- ✓ "Meta atingida." — ✗ "Parabéns! Você atingiu sua meta do dia com sucesso!"
- Tagline da marca: **"Feito de consistência."**

**Emoji:** Nunca usar na UI. Nenhuma exceção.

**Números e unidades:** Sempre em DM Mono. Sufixo de unidade separado por 1 espaço: `2.340 kcal`, `178 g`, `12 dias`.

**Mensagens de erro:** Diretas e instrutivas. "Formato inválido" não "Oops! Algo deu errado."

---

## FUNDAMENTOS VISUAIS

### Cor
- **Fundo sempre escuro.** Nunca branco como base. Base: `#05070B`.
- **Azul = o sistema.** Usado em todas as ações primárias, destaques de dados, estados ativos e elementos interativos.
- **Âmbar = a recompensa.** Usado exclusivamente para streaks, conquistas e gamificação. Nunca como cor de ação primária ou decoração.
- A regra: "O azul é o sistema. O âmbar é a recompensa. Nunca inverter."

### Tipografia
Três famílias, três papéis. **Máximo de dois pesos por tela.**
- **Satoshi 700/800** — Display e títulos. Tracking fechado (`-0.03em`). Nunca abaixo de 16px.
- **Inter 400/500/600** — Todo o corpo de texto e labels de UI. Tracking levemente negativo (`-0.01em`).
- **DM Mono 400** — Todos os números, métricas, nutrientes, timestamps. Nunca para prosa.

Labels de seção: Inter 500, 10–12px, CAPS, `letter-spacing: 0.08–0.12em`, cor muted.

### Fundos e Gradientes
- Páginas usam um **gradiente radial azul** profundo na metade inferior — elipse `rgba(77,107,255,0.18)` subindo da base. É o "glow atmosférico" que sinaliza inteligência do sistema.
- Sem fundos sólidos planos em telas inteiras. O gradiente está sempre presente em baixa opacidade.
- Cards são superfícies em camadas, não caixas coloridas.

### Glass Morphism
Três níveis de glass (ver `tokens/effects.css`):
1. **Glass Padrão** — `blur(12px)`, `rgba(11,16,32,0.70)`, borda azul dim. Maioria dos cards.
2. **Glass Elevado** — `blur(20px)`, `rgba(18,26,48,0.85)`, borda azul com glow mais forte. Modais, tooltips.
3. **Glass Streak** — `blur(12px)`, `rgba(20,12,4,0.80)`, borda âmbar. Exclusivo para elementos de streak/conquista.

Glass **sempre** sobre um fundo contrastante — seja o gradiente da página ou uma imagem desfocada. Nunca glass sobre fundo escuro plano — o blur fica invisível.

### Sombras e Glows
- Cards usam `--shadow-card` (sombra de profundidade escura, sem cor)
- Elementos ativos/focados do sistema usam `--glow-blue` — `box-shadow` com RGBA azul
- Elementos de streak usam `--glow-amber` — halo âmbar quente. Nunca para UI que não seja streak.
- Glows são sempre `box-shadow`, nunca `filter: drop-shadow` (performance)

### Arredondamento
- `sm` 6px — badges, chips
- `md` 12px — cards, inputs, botões
- `lg` 16px — painéis grandes, sheets
- `full` 9999px — pills, avatares círculo, trilhos de toggle

### Bordas
- Todas as bordas interativas referenciam azul: `rgba(77,107,255,0.15)` padrão, `0.25` elevado.
- Bordas de streak referenciam âmbar: `rgba(255,178,58,0.25)`
- Divisores: `rgba(255,255,255,0.04–0.06)` — quase invisíveis, apenas estruturais.

### Animação e Movimento
- Easing: `cubic-bezier(0.2, 0, 0, 1)` para todas as transições padrão (rápida, desaceleração limpa)
- Spring: `cubic-bezier(0.34, 1.56, 0.64, 1)` exclusivo para recompensas e desbloqueio de conquistas
- `--transition-fast` 150ms — hover states, mudanças de cor
- `--transition-base` 250ms — mudanças de layout, abertura de painéis
- `--transition-slow` 400ms — transições de página
- **Sem animações decorativas em loop.** Sem ícones girando, sem fundos pulsando.
- Estado de pressão: elementos escalam para `0.97` no `mousedown` — pequeno, intencional, físico.

### Estados de Hover
- Botões: cor de preenchimento mais clara + sombra glow
- Elementos ghost: bg levemente azulado (`--color-blue-subtle`)
- Cards interativos: `border-color` clareia levemente
- Sem mudanças de opacidade no hover (reservado para estados desabilitados)

### Estados Desabilitados
- `opacity: 0.4` + `cursor: not-allowed` — sem outra mudança

### Imagens
- Quando fotografias de produto são usadas (atleta, contexto nutricional): tom **escuro, cinematográfico, dessaturado-frio**. Fotografia esportiva editorial, não foto de estoque fitness.
- Imagens de fundo atrás de cards glass devem ter alto contraste — o blur precisa de algo para desfocar.
- Textura de grain/ruído a ~5–8% de opacidade sobre fundos adiciona a qualidade cinematográfica vista nas referências.

### Espaçamento
Escala base-4. Micro espaçamento (4/8/12px) para gaps inline; padding de componentes sempre 16/20/24px; gaps de seção 32/48px; margens de página 48/64px.

---

## ICONOGRAFIA

**Sistema:** Lucide Icons (`https://unpkg.com/lucide@latest/dist/umd/lucide.min.js`)  
**Estilo:** Traço fino (1.5px), linecap/linejoin arredondado, 24px por padrão.  
**Estados:** Cor muted (`--color-text-muted`) para inativo; Azul Core (`--color-blue-core`) para ativo; Âmbar (`--color-amber`) exclusivo para ícones de streak.

**6 ícones de domínio do sistema:**
| Ícone | Nome Lucide | Domínio |
|-------|-------------|---------|
| Utensils | `utensils` | Refeições |
| Dumbbell | `dumbbell` | Treino |
| Moon | `moon` | Sono |
| Pill | `pill` | Suplementos |
| Circle Check | `circle-check` | Progresso |
| Flame | `flame` | Streak (âmbar ONLY) |

**Regras:**
- Sempre 24×24px (ou 20px para UI densa, 16px para inline)
- Ícones via Lucide: traço fino, 24px, arredondado. Nunca emoji.
- Apenas ícones de traço — nunca ícones preenchidos (ficam pesados em UIs escuras)
- SVG customizado: evitar criar novos ícones. Usar Lucide ou solicitar ao time de design.

**Monograma Ū:** Usado como ícone do app. Nunca usado como ícone de UI dentro do próprio app. Fundo: gradiente escuro com glow azul sutil na base. Ver `guidelines/brand-icon.card.html`.

**Logo:** `assets/nutrk-logo.svg` — sempre preenchimento branco. Três versões:
- Principal: branco sobre `#05070B`
- Secundária: branco sobre `#0B1020` (levemente transparente)
- Clara: invertido (escuro) sobre fundo claro

---

## MANIFESTO DE ARQUIVOS

```
styles.css                          ← Ponto de entrada global (apenas imports)

tokens/
  colors.css                        ← Todos os tokens de cor + gradientes
  typography.css                    ← Imports de fontes + tokens de escala tipográfica
  spacing.css                       ← Espaçamento, radius, z-index
  effects.css                       ← Glass, sombras, glows, transições

assets/
  nutrk-logo.svg                    ← Wordmark oficial (preenchimento branco)

guidelines/
  colors-base.card.html             ← Amostras de superfícies de fundo
  colors-blue.card.html             ← Paleta azul do sistema
  colors-amber.card.html            ← Paleta âmbar de recompensa
  colors-text.card.html             ← Hierarquia de texto
  type-display.card.html            ← Especimens Satoshi display
  type-interface.card.html          ← Especimens Inter interface
  type-data.card.html               ← Especimens DM Mono dados
  type-scale.card.html              ← Escala completa 12–48px
  spacing-scale.card.html           ← Blocos de espaçamento
  spacing-radius.card.html          ← Exemplos de border radius
  effects-glass.card.html           ← Três variantes de glass
  effects-glows.card.html           ← Sombras e glows
  brand-logo.card.html              ← Versões do logo
  brand-icon.card.html              ← Ícone de app / monograma Ū
  brand-streak.card.html            ← Elemento streak ring
  brand-essence.card.html           ← Cinco pilares da marca
  brand-icons.card.html             ← Set de ícones do sistema (Lucide)

components/core/
  Button.jsx / .d.ts / .prompt.md   ← Controle de ação primária
  Badge.jsx  / .d.ts / .prompt.md   ← Pílula indicadora de status
  Card.jsx   / .d.ts / .prompt.md   ← Container de superfície
  Input.jsx  / .d.ts / .prompt.md   ← Campo de texto
  Stat.jsx   / .d.ts / .prompt.md   ← Bloco de exibição de métricas
  Tag.jsx    / .d.ts / .prompt.md   ← Chip de label inline
  StreakRing.jsx / .d.ts / .prompt.md ← Anel de streak âmbar
  core.card.html                    ← Card vitrine dos componentes

readme.md                           ← Este arquivo
SKILL.md                            ← Definição de skill para o Claude
```

---

## REGRAS DA MARCA (resumo)

1. Azul é o sistema. Âmbar é a recompensa. **Nunca inverter.**
2. Fundo sempre escuro. **Nunca branco como base.**
3. Máximo de dois pesos tipográficos por tela.
4. O mácron no Ū é estético — não fonético. Pronúncia: **"nutrik"**.
5. Glows sinalizam interatividade (azul) ou conquista (âmbar). Nunca decoração.
6. DM Mono para todos os números. Sempre. Sem exceções.
7. Glass morphism precisa de um fundo contrastante para ser visível. Nunca glass plano sobre escuro plano.

---

*Nūtrk Design System v1.0 — Dup.Labs — 2026*
