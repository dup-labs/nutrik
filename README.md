# nūtrk

Monorepo do produto nūtrk — nutrição inteligente, treino personalizado e equilíbrio mental.

## Estrutura

```
apps/
  landing/   → site institucional (nutrk.io)
  web/       → aplicativo web (app.nutrk.io)
packages/    → (futuro) código compartilhado: ui, brand tokens, tipos
```

Cada app é um projeto Next.js independente, com seu próprio `package.json` e lockfile.
Workspaces (pnpm/Turborepo) só entram quando existir o primeiro pacote compartilhado de verdade.

## Rodando local

```bash
# landing
cd apps/landing && npm install && npm run dev

# app
cd apps/web && npm install && npm run dev
```

## Deploy (Vercel)

Dois projetos Vercel apontando pra este mesmo repositório:

| Projeto | Root Directory | Domínio |
|---|---|---|
| landing | `apps/landing` | nutrk.io |
| web | `apps/web` | app.nutrk.io |

Com Root Directory configurado, a Vercel só rebuilda o projeto cujos arquivos mudaram no push.
