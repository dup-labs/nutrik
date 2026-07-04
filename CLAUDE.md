# nūtrk monorepo

- `apps/landing` — landing page (nutrk.io). Next.js 16 + Tailwind 4.
- `apps/web` — aplicativo web (app.nutrk.io). Mesmo stack.
- `packages/` — ainda não existe; criar apenas quando houver código compartilhado real.

Cada app tem `package.json`, lockfile e `CLAUDE.md`/`AGENTS.md` próprios — leia o do app em que for trabalhar. Não há workspaces: rode `npm install`/`npm run dev` dentro do app.

Deploy via Vercel, um projeto por app (Root Directory: `apps/landing` e `apps/web`).
A pasta `brand/` na raiz é material de marca local (não versionado).
