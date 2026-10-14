# Checklist de submissão (App Store e Google Play)

> Aviso: isto não é aconselhamento jurídico. A política de privacidade e os termos devem ser revisados por advogado antes de publicar. Prazos de contas e regras das lojas mudam: reconfira nas páginas oficiais.

Legenda: **[CONTA]** depende de conta Apple/Google aprovada · **[D-U-N-S]** depende de D-U-N-S/CNPJ verificado · **[JUR]** depende de decisão jurídica · **[DEV]** código · sem marca = pode fazer já.

## Fase 0: empresa e contas (o caminho crítico, comece hoje)

1. [ ] Dados da empresa definitivos: razão social, CNPJ, endereço, email do encarregado (DPO). Substituir placeholders em `/privacidade` e `/termos`. **[JUR]**
2. [ ] Obter **D-U-N-S** do CNPJ (gratuito pela Dun & Bradstreet Brasil, costuma levar de dias a semanas; endereço e nome precisam bater com o CNPJ). **[D-U-N-S]**
3. [ ] **Apple Developer Program** como organização (US$ 99/ano), usando o D-U-N-S; a Apple liga para validar. Sem D-U-N-S só como pessoa física, e então o vendedor aparece com o nome da pessoa. **[D-U-N-S] [CONTA]**
4. [ ] **Google Play Console** como organização (US$ 25 uma vez) com D-U-N-S e verificação da empresa. Conta pessoal nova exige **teste fechado com 12 testadores por 14 dias seguidos** antes de produção; conta de organização fica isenta. Se for pessoal, comece o teste fechado cedo. **[D-U-N-S] [CONTA]**
5. [ ] Domínio de email `app@nutrk.io` recebendo e monitorado (contato de suporte e privacidade).

## Fase 1: identificadores e chaves

6. [ ] Apple: criar App ID `io.nutrk.app` com capabilities Push Notifications, Sign in with Apple, Associated Domains. **[CONTA]**
7. [ ] Apple: registrar Services ID e chave do Sign in with Apple; configurar no Supabase (Auth, Apple). **[CONTA]**
8. [ ] Apple: chave APNs `.p8`; Firebase: projeto, app iOS e Android com `io.nutrk.app`, `google-services.json` e `GoogleService-Info.plist`. **[CONTA]**
9. [ ] Pegar o **Team ID** (troca `TEAM_ID` no `apple-app-site-association`) e o **SHA-256 da chave de assinatura** do Android (Play App Signing; troca `SHA256_FINGERPRINT` no `assetlinks.json`). **[CONTA]**
10. [ ] Google OAuth: clientes iOS e Android no Google Cloud; redirecionamento `io.nutrk.app://auth/callback` liberado no Supabase.
11. [ ] Keystore/upload key do Android guardada em cofre (nunca no repo). **[CONTA]**

## Fase 2: produto pronto para revisão

12. [ ] **[DEV]** Sign in with Apple funcionando (obrigatório no iOS por haver Google login, guideline 4.8).
13. [ ] **[DEV]** Excluir conta dentro do app e `/excluir-conta` pública (5.1.1(v) e política Google).
14. [ ] **[DEV]** Sem preço/CTA de compra/link de assinatura no iOS (e, por decisão, no Android).
15. [ ] **[DEV]** Denunciar/bloquear usuário e conteúdo nas turmas e no chat; contato de moderação (guideline 1.2 e política UGC do Google). Hoje não existe: é o item com maior risco de rejeição. **[JUR]** definir SLA.
16. [ ] **[DEV]** Funciona como app: push, haptics, safe areas, offline, sem zoom, botão voltar (4.2 "minimum functionality").
17. [ ] Revisão jurídica final de `/privacidade` e `/termos`; trocar "[DATA DE PUBLICAÇÃO]" e os prazos de retenção. **[JUR]**
18. [ ] Decidir: idade mínima 18 (adotada), enquadramento da assinatura B2B (3.1.1/3.1.3) e retenção. **[JUR]**
19. [ ] Criar as contas demo (paciente, profissional, par extra para teste de exclusão) em produção com dados fictícios.

## Fase 3: ativos de loja

20. [ ] Ícone 1024 × 1024 sem transparência (Apple) e 512 × 512 (Google).
21. [ ] Screenshots conforme `screenshots-spec.md` (8 telas) e feature graphic 1024 × 500.
22. [ ] Textos de `listing-ptbr.md` revisados (nome, subtítulo, descrições, palavras-chave).
23. [ ] URLs públicas no ar: `/privacidade`, `/termos`, `/excluir-conta`, suporte, marketing.

## Fase 4: formulários

24. [ ] **Apple, App Privacy:** `app-store-privacy.md`. **[CONTA]**
25. [ ] **Apple, classificação etária** (incl. perguntas novas de redes sociais) e categoria. **[CONTA]**
26. [ ] **Apple, Export compliance:** o app usa só HTTPS padrão; marcar `ITSAppUsesNonExemptEncryption = NO` no Info.plist. **[CONTA]**
27. [ ] **Apple, notas do revisor** com contas demo: `review-notes.md`. **[CONTA]**
28. [ ] **Google, Data safety:** `play-data-safety.md`. **[CONTA]**
29. [ ] **Google, declaração de apps de saúde**, público-alvo 18+, anúncios (não), IARC, app access, URL de exclusão: `play-health-declaration.md`. **[CONTA]**
30. [ ] Google: conferir target API level exigido para novos apps no ano e permissões declaradas (câmera, notificações).

## Fase 5: build e envio

31. [ ] Build iOS archive (Xcode), Privacy Manifest conferido, `NSCameraUsageDescription`/`NSPhotoLibraryUsageDescription` em pt-BR, versão 1.0 build 1. **[CONTA]**
32. [ ] Subir ao **TestFlight**; teste interno com dispositivo real: login (email, Google, Apple), push, câmera, deep link, exclusão de conta. **[CONTA]**
33. [ ] Build Android AAB assinado; **teste interno** na Play Console; (conta pessoal: teste fechado 12 × 14 dias). **[CONTA]**
34. [ ] Testar em aparelho real o login Google fora do webview e o retorno por `io.nutrk.app://`.
35. [ ] Submeter para revisão (Apple "Add for Review"; Google "Send for review" na produção ou lançamento gradual 10%).
36. [ ] Lançamento manual (não automático) para controlar a hora e preparar o suporte.

## Fase 6: depois do envio

37. [ ] Monitorar Resolution Center (Apple costuma responder em 24 a 48 h) e Policy status (Google, pode levar dias para apps novos). Responder rejeição com o argumento de `review-notes.md`.
38. [ ] Registrar rejeições e correções no process-log (vira playbook).
39. [ ] Anotar o link do app e atualizar landing (botões App Store/Google Play).
