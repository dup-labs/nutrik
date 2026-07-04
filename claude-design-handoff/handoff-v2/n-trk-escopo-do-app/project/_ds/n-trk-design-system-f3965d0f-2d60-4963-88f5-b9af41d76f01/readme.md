# Nūtrk Design System

> Light-only, quente, humano. A jornada mais que o resultado.

**Versão:** 2.0 — Julho 2026
**Estúdio:** Dup.Labs
**Marca:** Nūtrk ("nútrique") — o ū com macron é inegociável, nunca U simples.
**Brand bar:** @nutrk.io

---

## Empresa e Produto

Nūtrk é uma ferramenta de **nutrição e treino** onde nutricionista e personal conversam entre si, dentro do produto, buscando aderência e evolução do paciente. Não é app de dieta. O diferencial é a colaboração entre os dois profissionais em torno do mesmo paciente — sem sofrimento, com consistência e um pouco de jogo.

**Três públicos com peso igual:** paciente, nutricionista, personal. Nutri e personal não são rivais: são as duas pontas que se conectam dentro da Nūtrk.

**O coração da marca:** a Nūtrk faz apreciar a jornada mais do que buscar o resultado. O resultado é consequência, não o assunto. O assunto é o bem-estar de fazer — o movimento como prazer, a comida como convite, a consistência como ritual que faz bem no dia.

**Objetivo:** autoridade + educação, topo de funil com qualidade.

**Fontes utilizadas:**
- `uploads/logo-nutrk.svg` — wordmark vetorial oficial
- `uploads/specs-nutrk.md` — perfil de marca (tokens, regras visuais, voz, segurança)
- `NUTRK.fig` (Figma) — mesh gradients multi-cor, paleta, iconografia fitness

---

## FUNDAMENTOS DE CONTEÚDO

**Idioma:** Português brasileiro. Todo o copy de UI em pt-BR.

**Tom:** quem corre na praia com o sol nascendo, senta num quiosque com água de coco e conta, sem pressa, que dá pra viver bem e evoluir ao mesmo tempo.
- **PDV:** "você" com o paciente (próximo, sem julgamento). "a gente sabe que..." com nutri e personal (parceiro, não vendedor). Nunca acima, sempre ao lado.
- **Capitalização:** sentence case em TUDO. Sem all-caps (diferencia da SWTCHR).
- **Pontuação-assinatura:** sem travessão. Ponto final em headlines. Sem linguagem de IA.

**USA:** consistência · protocolo · leveza · ritual · movimento
**NUNCA usa:** dieta (restritivo) · sacrifício · proibido · fracasso/falha/recaída · jargão sem tradução

**CTA:** compartilhamento contextual conforme o público. Paciente: "manda pro seu nutri". Nutri: "manda pra um paciente que precisa ler isso". Personal: "manda pro seu aluno". **Nunca "começar agora"** (não há porta aberta ainda).

**Emoji:** só se a marca pedir. Na UI, evitar.

---

## REGRA DE SEGURANÇA — INEGOCIÁVEL (marca de saúde)

Comida e suplemento aparecem como **convite sensorial e prático** (cor, praticidade, prazer, contexto de uso), nunca como prescrição.

**Proibido:** número de caloria, grama, macro, meta de peso, plano alimentar prescritivo, "antes e depois" de corpo.

**Imagem de pessoas:** representa o bem-estar de FAZER, nunca o que se conquista. Pessoas em movimento, cozinhando, hidratando. Nunca corpo-como-meta, nunca resultado, nunca shape idealizado.

Referência: ✅ "olha esse pratão colorido", "água de coco pra hidratar na corrida" · ❌ "50g de chia", "déficit de 300 kcal".

---

## FUNDAMENTOS VISUAIS

### Cor
- **Light-only.** Sem alternância dark. Fundo sólido claro com gradiente suave `#ffffff → #e7ecf7`. Sem grid, sem ruído.
- **Laranja `#fe5f33` = o calor.** Accent principal, CTA, destaque, marca.
- **Temperaturas conversam:** warm (`#feaf4c`) puxa paciente · cool (`#adb7f7` / `#adf3f3`) puxa nutri/profissional · neutro é coringa.
- **O contraste vem das auras mesh e das imagens tratadas — nunca do preto.**

### Mesh gradients (as auras)
A assinatura visual. 4 swatches radiais multi-cor (`--mesh-warm`, `--mesh-cool`, `--mesh-mist`, `--mesh-fresh`), extraídos do Figma. Flutuam como auras decorativas em cards e slides (cor fixa por componente, não interativa) ou servem de superfície saturada com texto branco no card de fechamento. Componente: `MeshAura`.

### Tipografia
Duas famílias. **Sentence case em tudo.**
- **Satoshi** (400/500/700/900) — headlines, display, cover e números. Black = impacto/cover; Medium = subhead/label. Tracking fechado (`-0.03em`).
- **Inter** (400/500/600) — corpo de texto e labels de UI.
- **Gradient de texto:** Satoshi Bold + gradient `#fe7031 → #b6b8f6` (`background-clip: text`), só em palavra isolada, máx 1–2 por slide. Classe `.ntrk-grad-text`. Marcador no copy: `*palavra*`.

### Fundo e profundidade
- Fundo claro com gradiente suave (`--gradient-canvas`). O gradiente e as auras fazem a profundidade.
- **Sem glassmorphism escuro. Sem grid, sem ruído.**

### Liquid glass
Vidro sobre claro: branco translúcido + blur/saturate, borda de luz e brilho especular interno (`--glass-bg`, `--glass-blur`, `--glass-shadow`). Usar em barras, chips flutuantes, botões e cards **sobre mesh/imagem** — nunca sobre fundo claro plano (o blur some).

### Cards, botões e sombras
- Cards: radius `~10px` soft (`--radius-md`). Sombra leve `0 4px 24px rgba(27,28,29,0.06)` — o gradiente faz a profundidade.
- Botões: **pill 40px** (`--radius-pill`). Primary laranja, halo suave no hover.

### Ícones
- Outline fino-médio (1.5px), temática fitness/saúde. Container 50×50px (`--icon-container`).
- Set fitness disponível no Figma (dumbbell, kettlebell, yoga, corrida, etc). Lucide para UI genérica.

### Gestos de diagramação (assinatura)
- **Mosaico / grid de quadrantes:** organiza informação com respiro. Leve, arejado.
- **Círculos que se conectam:** círculos de linha fina que se cruzam — a colaboração entre nutri, personal e paciente em torno de um centro comum.
- **Texto sobre imagem/mesh tratado:** headline sentando sobre foto tratada (glitch prismático) ou mesh, sem competir.
- **Linha fina como estrutura:** colunas, círculos, divisórias como organização leve, nunca como peso.

### Capa e fechamento
- **Capa** (conceito/dica/ritual): mesh gradient por temperatura do público. Tema com corpo/treino/comida: imagem tratada com glitch prismático, pessoa sempre **fazendo**.
- **Último card:** mesh gradient forte/saturado, texto branco. A Nūtrk fecha no calor, não no preto.

### Animação e Movimento
- Easing padrão: `cubic-bezier(0.2, 0, 0, 1)`. Spring (recompensa): `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Estado de pressão: escala `0.97` no `mousedown`. Sem loops decorativos.

---

## COMPONENTES

- **Button** — controle de ação principal (pill). Variants: primary, gradient, secondary, ghost, warm, glass.
- **Card** — container de superfície. Variants: base, elevated, glass (liquid glass), mesh (aura + texto branco).
- **MeshAura** — a aura mesh reutilizável (warm/cool/mist/fresh). Float ou superfície de fechamento.
- **Badge** — pílula de status. accent · warm · cool · neutral · success · error.
- **Tag** — chip inline de categoria/momento/tema.
- **Input** — campo de texto, foco com anel laranja.
- **Stat** — bloco de métrica (Satoshi). Nunca para caloria/grama/peso.
- **StreakRing** — anel de ritual/consistência (dias seguidos), gradiente warm.

---

## MANIFESTO DE ARQUIVOS

```
styles.css                          ← Ponto de entrada global (apenas imports)

tokens/
  colors.css                        ← Cor: canvas claro, laranja, temperaturas, bases mesh
  typography.css                    ← Fontes (Satoshi/Inter) + escala + gradient text
  spacing.css                       ← Espaçamento, radius soft, pill, ícones, z-index
  effects.css                       ← Mesh gradients, liquid glass, sombra leve

assets/
  nutrk-logo.svg                    ← Wordmark oficial

guidelines/                         ← Cards de vitrine do design system
components/core/                     ← Button, Card, MeshAura, Badge, Tag, Input, Stat, StreakRing
readme.md                           ← Este arquivo
SKILL.md                            ← Definição de skill para o Claude
```

---

## REGRAS DA MARCA (resumo)

1. Light-only. Fundo sempre claro. **O contraste vem das auras mesh, nunca do preto.**
2. Laranja `#fe5f33` é o calor e o accent principal. Temperaturas: warm→paciente, cool→nutri.
3. Sentence case em TUDO. Sem all-caps.
4. O ū com macron é inegociável. Nunca U simples.
5. Gradient de texto só em palavra isolada, máx 1–2 por slide.
6. Liquid glass precisa de fundo contrastante (mesh/imagem) para ser visível.
7. **Marca de saúde:** nunca caloria, grama, macro ou meta de peso. A jornada, nunca o troféu.

---

*Nūtrk Design System v2.0 — Dup.Labs — 2026*
