# nūtrk — app do paciente

App mobile-first (PWA) do paciente. Next.js 16 + Supabase (schema `nutrk` no projeto brunodup.com) + design system do handoff Claude Design.

## Rodando

```bash
npm install
npm run dev
```

Env necessária (`.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Arquitetura

- `app/(auth)` — entrada, login, cadastro, recuperar/redefinir senha, anamnese
- `app/(app)` — telas logadas (home, refeições, treino, água, mente, progresso, perfil, chat, consultas, notificações)
- `lib/actions.ts` — server actions (todas as escritas)
- `lib/queries.ts` — leituras server-side
- `lib/supabase` — clients browser/server (schema `nutrk`)
- Dados sensíveis: kcal/macros existem no banco mas NUNCA aparecem pro paciente (regra de marca)

## Contas de teste (modo vinculado)

Códigos de convite seed: `NUTRK-CR28` (nutri Dra. Camila) · `NUTRK-RN91` (personal Rafa)
