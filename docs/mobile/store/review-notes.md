# Notas para o revisor (Apple e Google)

> Aviso: isto não é aconselhamento jurídico. A política de privacidade e o enquadramento da assinatura B2B devem ser revisados por advogado antes de submeter. O enquadramento nas guidelines da Apple é uma interpretação nossa e **o revisor decide**: preparar plano B (abaixo).

Colar nos campos "App Review Information > Notes" (Apple) e "App access" (Google). Credenciais são placeholders: criar as contas em produção, com dados fictícios, e não expirar a senha.

## Texto para a Apple (App Review Notes), em inglês

```
Nūtrk is a nutrition, workout and mental wellbeing companion. Patients follow meal and workout plans created by their nutritionist or personal trainer, log meals (optional photo), water, workouts, mood and sleep, chat with their professional and join small friend groups.

The app is a native shell (Capacitor, WKWebView) that loads our authenticated web app at https://app.nutrk.io, with native features added: push notifications, haptics, native share/external browser, offline screen, deep links (io.nutrk.app://) and Sign in with Apple.

DEMO ACCOUNTS (no 2FA, no email confirmation required)
Patient:       [EMAIL_PACIENTE_DEMO]  /  [SENHA_PACIENTE_DEMO]
Professional:  [EMAIL_PROFISSIONAL_DEMO]  /  [SENHA_PROFISSIONAL_DEMO]
The patient is already linked to the professional, has an active meal plan and workout plan, and belongs to a friend group.

HOW TO TEST
1. Sign in as the patient (email/password; Google and Sign in with Apple are also offered). 
2. Home: daily goals. Meals: open a meal, mark done, optionally attach a photo (camera or library).
3. Training: open today's workout, log sets/loads. Water and Mind: log water, mood, sleep, breathing.
4. Chat: message the professional. Friends: open the demo group, see ranking and group chat.
5. Profile > Settings > Delete account: in-app account deletion (Guideline 5.1.1(v)). Please do NOT delete the demo accounts; a second pair is provided if you need to test deletion: [EMAIL_DEMO_DELETE] / [SENHA_DEMO_DELETE].
6. Professional account: patients list, plan editing, messages, agenda.

IN-APP PURCHASE / PAYMENTS
The app offers no in-app purchases and sells nothing to patients; it is free for patients. Professionals (nutritionists/personal trainers) hold a B2B subscription to the professional dashboard, contracted and managed outside the app on our website (billing by Asaas, a Brazilian payment processor). In the iOS app there is no price, no purchase button, no link and no call to action to buy or to leave the app to pay (Guideline 3.1.1). Professionals who already have an account simply sign in. Per 3.1.3(b)/(c), this is a multiplatform/B2B service where the user already holds an account paid for outside the app. If you consider that insufficient, please tell us exactly what you need and we will adjust before rejecting.

PRIVACY
Privacy policy: https://app.nutrk.io/privacidade · Terms: https://app.nutrk.io/termos · Account deletion page: https://app.nutrk.io/excluir-conta
Health data is typed by the user; we do not use HealthKit. No tracking and no ads (no ATT prompt). Camera/photo access is requested only when attaching a meal photo.

MEDICAL DISCLAIMER
Nūtrk does not diagnose, treat or give automated medical advice. Plans are created by licensed professionals (CRN/CREF in Brazil). This is stated in the Terms and listing.

USER-GENERATED CONTENT (Guideline 1.2)
Chat exists only between a patient and the professional they linked to by invite code, and inside small invite-only friend groups. [DESCREVER: denunciar/bloquear usuário, filtro, contato de moderação app@nutrk.io, SLA de resposta]. 

Contact: app@nutrk.io
```

## Texto para o Google (App access / declarações)

- **App access:** "Restricted. Instruções:" mesmas credenciais de paciente e profissional acima + passo a passo 1 a 6 (em inglês ou português).
- **Funcionalidades de saúde:** sem Health Connect, ver `play-health-declaration.md`.
- **Pagamentos (política de Payments):** o app Android também não vende nada ao paciente. A assinatura B2B do profissional é contratada fora do app, sem botão de compra no app Android. Pela política do Google Play, serviços vendidos fora do app e consumidos pelo profissional como acesso a conta já existente não exigem Play Billing enquanto não há compra de bem digital dentro do app. **Decisão pendente:** o web atual mostra tela de assinatura do Asaas; no Android a mesma regra do iOS (sem CTA) é a opção mais segura e mantém a casca idêntica. O contrato do Capacitor já prevê isso para iOS; aplicar também ao Android para a primeira submissão.
- **Segurança de dados e exclusão:** URL de exclusão `https://app.nutrk.io/excluir-conta`.

## Por que não há IAP (argumento)

1. O paciente (usuário principal do app) não paga nada.
2. O profissional contrata uma ferramenta de trabalho (software B2B) no site, por assinatura com cobrança do Asaas; o app é um cliente da conta que ele já tem.
3. Guideline **3.1.1**: o app não oferece compra por outros meios nem direciona o usuário a pagar fora (nenhum botão, link ou preço no iOS).
4. Guideline **3.1.3(b) Multiplatform Services** e **3.1.3(c) Enterprise Services** dão cobertura parcial a esse modelo (acesso a conta contratada fora). Atenção: 3.1.3(c) fala em venda a organizações para seus funcionários/alunos e 3.1.3(b) em exigir IAP se vender dentro do app; o profissional autônomo é o ponto mais discutível. Esta é a fragilidade do enquadramento.

### Se a Apple rejeitar por 3.1.1

Plano B, em ordem:
1. Responder no Resolution Center com o argumento acima e perguntando o que ajustar.
2. Remover a área do profissional da casca iOS (o app iOS vira só paciente; profissional usa web). A Apple costuma aceitar isso.
3. Brasil: desde junho de 2026 a Apple permite, na storefront brasileira, apontar para pagamento externo (texto sem link sem comissão; botão/link externo com comissão de 15% segundo a imprensa). Exige entitlement e termos específicos. Confirmar valores e requisitos em developer.apple.com antes de decidir.
4. Último recurso: oferecer IAP de assinatura para o profissional (15% no Small Business Program).

## Recursos nativos usados (para provar valor além de "site empacotado", Guideline 4.2)

Push notifications (APNs/FCM), haptics, status bar e safe areas, splash, teclado nativo, detecção de rede com tela offline nativa, navegador nativo (SFSafariViewController/Custom Tabs) para OAuth e links externos, deep links e universal/app links, câmera/galeria para foto da refeição, Sign in with Apple, botão voltar do Android.

## Checklist de promessas que o revisor vai testar

- [ ] Sign in with Apple funciona no iOS e a conta se vincula/cria no Supabase.
- [ ] Excluir conta dentro do app apaga o usuário de ponta a ponta (5.1.1(v)).
- [ ] Nenhum preço/CTA de compra no iOS (nem em e-mails de trial dentro do app).
- [ ] Denunciar/bloquear conteúdo e usuário nas turmas e no chat (1.2). **Ainda não existe no código.**
- [ ] Links de privacidade e termos abrem dentro do app e no Connect/Console.
- [ ] Texto de permissão de câmera/fotos em pt-BR e coerente com o uso.
