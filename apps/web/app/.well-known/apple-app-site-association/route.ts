// Apple App Site Association — Universal Links + autofill de senha.
// Servido por route handler (não public/) porque o arquivo não tem extensão
// e a Apple exige Content-Type application/json; o middleware já exclui
// /.well-known do matcher. A Apple busca via CDN dela
// (app-site-association.cdn-apple.com), então mudanças levam horas pra valer.
//
// TEAM_ID: placeholder até existir a conta Apple Developer (10 caracteres,
// em developer.apple.com → Membership). Ver docs/mobile/auth-setup.md.
//
// Regras de path (a ordem importa — a primeira que casa vence):
//  - /auth/callback* NÃO abre o app. Esse link carrega um code PKCE cujo
//    verifier está no cookie de quem iniciou o login. Se alguém logou pelo
//    Safari e o iOS desviasse o retorno pro app, o app não teria o verifier e
//    o login quebraria. No app, o OAuth volta pelo scheme io.nutrk.app://.
//  - /auth/confirm* abre o app: é token_hash, funciona em qualquer navegador
//    (links de email de cadastro/recuperação caem direto no app).
//  - /api/* e /.well-known/* nunca.
//  - o resto (convite, perfil, etc.) abre no app se instalado.

const TEAM_ID = "TEAM_ID";
const APP_ID = `${TEAM_ID}.io.nutrk.app`;

const aasa = {
  applinks: {
    details: [
      {
        appIDs: [APP_ID],
        components: [
          { "/": "/auth/callback*", exclude: true, comment: "PKCE: verifier no navegador de origem" },
          { "/": "/api/*", exclude: true },
          { "/": "/.well-known/*", exclude: true },
          { "/": "/auth/confirm*", comment: "links de email (token_hash)" },
          { "/": "/*" },
        ],
      },
    ],
  },
  webcredentials: {
    apps: [APP_ID],
  },
};

export const dynamic = "force-static";

export function GET() {
  return Response.json(aasa, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
