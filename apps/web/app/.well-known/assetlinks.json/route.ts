// Digital Asset Links — App Links do Android (https://app.nutrk.io/... abre o
// app sem perguntar). Route handler pelo mesmo motivo do AASA: garantir
// application/json e manter os dois arquivos juntos.
//
// SHA256_FINGERPRINT: placeholder. Depois do primeiro upload no Play Console,
// usar o SHA-256 da "App signing key" (Play Console → Test and release →
// App integrity), NÃO o da upload key. Pode listar as duas (e a de debug)
// no array. Ver docs/mobile/auth-setup.md.
//
// Ao contrário do AASA, aqui não há regra de path: quais paths abrem o app é
// decidido pelos intent-filters do AndroidManifest (casca). Lá, /auth/callback
// NÃO deve entrar (mesmo motivo do AASA).

const assetlinks = [
  {
    relation: [
      "delegate_permission/common.handle_all_urls",
      "delegate_permission/common.get_login_creds",
    ],
    target: {
      namespace: "android_app",
      package_name: "io.nutrk.app",
      sha256_cert_fingerprints: ["SHA256_FINGERPRINT"],
    },
  },
];

export const dynamic = "force-static";

export function GET() {
  return Response.json(assetlinks, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
