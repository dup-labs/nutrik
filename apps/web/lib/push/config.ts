// Envs de push. Tudo opcional: sem env, sendPush vira no-op (igual o Asaas).
//
// Android (FCM HTTP v1):
//   FCM_SERVICE_ACCOUNT_JSON  JSON inteiro da service account (uma linha)
// iOS (APNs, token-based):
//   APNS_KEY_P8     conteúdo da chave .p8 (aceita "\n" literal)
//   APNS_KEY_ID     Key ID da chave
//   APNS_TEAM_ID    Team ID Apple
//   APNS_BUNDLE_ID  default io.nutrk.app
//   APNS_ENV        "production" | "sandbox" (default: production se NODE_ENV=production)

export function fcmConfigured(): boolean {
  return Boolean(process.env.FCM_SERVICE_ACCOUNT_JSON);
}

export function apnsConfigured(): boolean {
  return Boolean(
    process.env.APNS_KEY_P8 && process.env.APNS_KEY_ID && process.env.APNS_TEAM_ID,
  );
}

export function pushConfigured(): boolean {
  return fcmConfigured() || apnsConfigured();
}
