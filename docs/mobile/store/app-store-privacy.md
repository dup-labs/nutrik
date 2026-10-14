# App Store: App Privacy (nutrition labels)

> Aviso: isto não é aconselhamento jurídico. As respostas abaixo derivam do código em 2026-10-14 e a política de privacidade deve ser revisada por advogado antes de publicar. Respostas da Apple e da política precisam bater entre si.

Mapeamento feito lendo `lib/types.ts`, migrations, `lib/actions.ts` e `app/(auth)/anamnese`. Ver o que o app **não** coleta no fim.

## Perguntas gerais

| Pergunta | Resposta |
|---|---|
| Coletamos dados? | Sim |
| URL da política de privacidade | `https://app.nutrk.io/privacidade` |
| URL de opções de privacidade (opcional) | `https://app.nutrk.io/excluir-conta` |
| Tracking (cruzar dados com outros apps/sites ou compartilhar com data brokers para publicidade)? | **Não.** Sem SDK de anúncio, sem IDFA. Logo: sem ATT prompt e sem `NSUserTrackingUsageDescription` |

## Tipos de dados (todos: "Linked to You" = sim; "Used for Tracking" = não)

| Categoria Apple | Tipo | Coletado? | Dado real no app | Finalidades Apple |
|---|---|---|---|---|
| Health & Fitness | Health | **Sim** | humor, sono (horas/qualidade), água, anamnese (bem-estar, energia, sintomas), check-in (sensação com o corpo, energia, caimento da roupa), sessões de respiração | App Functionality |
| Health & Fitness | Fitness | **Sim** | treinos concluídos, séries, cargas (kg), refeições seguidas | App Functionality |
| Contact Info | Name | **Sim** | nome do perfil e do profissional | App Functionality |
| Contact Info | Email Address | **Sim** | conta, emails transacionais (Resend) | App Functionality |
| Contact Info | Phone Number | **Sim (só profissional)** | campo opcional no cadastro do profissional | App Functionality |
| Contact Info | Physical Address / Other | Não | clínica é nome de local, não endereço estruturado; se virar endereço, marcar | |
| User Content | Photos or Videos | **Sim** | foto de refeição (bucket `nutrk-photos`), enviada à escolha do usuário | App Functionality |
| User Content | Other User Content | **Sim** | mensagens de chat com profissional e da turma, observações em refeição, pedidos de troca, notas internas do profissional | App Functionality |
| Identifiers | User ID | **Sim** | uuid do Supabase, username | App Functionality |
| Identifiers | Device ID | **Sim (quando o push entrar)** | token APNs/FCM | App Functionality |
| Financial Info | Payment Info / Other Financial Info | Não pelo app | pagamento do profissional é processado pelo Asaas, fora do app; o nūtrk não armazena cartão. CPF/CNPJ vai ao Asaas | |
| Sensitive Info | Sensitive Info | Avaliar | Apple define como raça, religião, orientação etc. Nada disso é coletado. Dados de saúde ficam em Health. | |
| Usage Data | Product Interaction | **Não** (sem analytics hoje) | se entrar PostHog/GA etc., marcar e rever | |
| Diagnostics | Crash/Performance Data | **Não** (sem SDK de crash hoje) | logs de servidor da Vercel têm IP; ver "decisão" abaixo | |
| Location | qualquer | Não | | |
| Contacts | Contacts | Não | | |
| Browsing / Search History | Não | | | |
| Purchases | Purchase History | Não | sem IAP | |
| Other Data | Não | | | |

**Decisão aberta:** IP em logs da Vercel/Supabase. A orientação da Apple considera dado coletado quando transmitido para fora do dispositivo e retido além do necessário para atender a requisição. Opção conservadora: declarar "Device ID" ou "Other Diagnostic Data" (Not Linked, App Functionality). Registrar a escolha com o jurídico.

## Resumo do rótulo que o usuário verá

- **Dados vinculados a você:** Saúde e fitness, Informações de contato, Conteúdo do usuário, Identificadores.
- **Dados usados para rastrear você:** nenhum.

## O que NÃO coletamos (não declare)

Peso e medidas corporais (o check-in guarda sensação, energia e caimento da roupa), localização, contatos, dados do HealthKit, IDFA, publicidade, analytics de terceiros, foto de perfil por upload (a coluna `avatar_url` existe, mas não há fluxo de upload hoje; se entrar, vira Photos or Videos).

## Itens de projeto ligados a isso

- Usos de câmera/fotos: `NSCameraUsageDescription` e `NSPhotoLibraryUsageDescription` com texto em pt-BR ("para anexar a foto da sua refeição").
- Sem HealthKit: não ligar a capability, não incluir `NSHealthShareUsageDescription`.
- Privacy Manifest (`PrivacyInfo.xcprivacy`) deve declarar os mesmos tipos e as APIs "required reason" que a casca Capacitor e os plugins usam (UserDefaults etc.). Plugins do Capacitor trazem manifest próprio nas versões recentes; conferir no build do archive.
- Revisar este arquivo toda vez que entrar SDK (analytics, crash, anúncio).
