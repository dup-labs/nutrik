# nūtrk — templates de email do auth (Supabase)

Colar em: **Dashboard → Authentication → Emails → Templates**
(https://supabase.com/dashboard/project/yfcmebxowhojdlztfebw/auth/templates)

Pra cada template: cola o **Subject** no campo de assunto e o conteúdo do
`.html` correspondente no corpo (Message body / source).

| Template no Supabase | Subject | Arquivo |
|---|---|---|
| Confirm signup | `falta um toque. confirma seu email` | `confirmar-cadastro.html` |
| Reset password | `senha nova a caminho` | `redefinir-senha.html` |
| Change email address | `confirma seu novo email` | `trocar-email.html` |
| Magic link | `seu link de entrada no nūtrk` | `magic-link.html` |

Identidade aplicada: fundo `#e7ecf7`, card branco radius 16, wordmark Nūtrk,
CTA pill laranja `#fe5f33`, copy pt-BR em sentence case, assinatura
"a jornada, todo dia." — mesmo visual dos transacionais do app (`lib/email.ts`).

Variáveis do Supabase usadas: `{{ .ConfirmationURL }}` (todas),
`{{ .Email }}` / `{{ .NewEmail }}` (troca de email). Não remover.
