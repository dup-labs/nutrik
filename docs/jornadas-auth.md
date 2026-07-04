# nūtrk — jornadas de autenticação (paciente × profissional)

> Fonte da verdade do roteamento: `lib/roles.ts` (`resolveDestination`).
> O papel viaja nos **metadados do usuário** (`role: 'patient' | 'pro'`), definidos no
> signUp — por isso sobrevive ao round-trip do email de confirmação.

## Jornada do PACIENTE

```
/entrada ─┬─ "tenho um código" ──→ /cadastro?convite=1 ─┐
          ├─ "começar sozinho" ──→ /cadastro ───────────┤
          └─ "entrar" ──→ /login                        │
                                                        ▼
                       signUp (metadados: role=patient, name, objective, invite_code)
                                                        │
             ┌── sessão imediata (confirm OFF) ──→ completeCadastro → /anamnese
             └── confirm ON ──→ /confirmar ··· email ··→ /auth/callback
                                                        │ (cria perfil + vínculo
                                                        │  a partir dos metadados)
                                                        ▼
                                                   /anamnese → /  (home)
```

- Login de paciente → `/` → layout `(app)` chama `resolveDestination`:
  perfil ok+onboarding ok → home · sem onboarding → `/anamnese` · sem perfil → cria dos
  metadados ou `/cadastro?completar=1` (caso Google, sem metadados).

## Jornada do PROFISSIONAL

```
/pro (deslogado) ──→ /pro/entrada ─┬─ "já tenho painel" ──→ /login
                                   └─ "criar meu painel" ──→ /pro/cadastro
                                                                 │
                signUp (metadados: role=pro, name, pro_type, reg_code)
                                                                 │
        ┌── sessão imediata ──→ cria professional → tela do código → /pro
        └── confirm ON ──→ /confirmar?pro=1 ··· email ··→ /auth/callback
                                                                 │ (cria professional
                                                                 │  a partir dos metadados,
                                                                 │  gera invite code)
                                                                 ▼
                                                               /pro
```

- Login de profissional → `/` → `resolveDestination` acha a linha em `professionals` → `/pro`.
- Metadados dizem `role=pro` mas falta `pro_type` (conta antiga/incompleta) → `/pro/cadastro`
  logado, só escolhe o tipo e conclui.
- Google no fluxo pro: botão passa `?flow=pro` pro callback → sem linha e sem metadados →
  `/pro/cadastro` pra completar.

## Regras de ouro

1. **Uma conta = um papel.** Quem tem linha em `professionals` SEMPRE cai no painel;
   o app do paciente redireciona (`(app)/layout`). Pra testar os dois lados, dois emails.
2. Deslogado: rota `/pro/*` manda pra `/pro/entrada`; resto manda pra `/entrada` (middleware).
3. `/auth/callback` é o único ponto de troca de code por sessão — todo `emailRedirectTo`
   e OAuth aponta pra ele, nunca pra raiz.
4. Papel indefinido e sem metadados (ex.: Google direto) → assume paciente
   (`/cadastro?completar=1`), a menos que `flow=pro`.
