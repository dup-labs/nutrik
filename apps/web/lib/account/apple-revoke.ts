import { createSign } from "node:crypto";

// Revogação do Sign in with Apple na exclusão de conta (Apple TN3194).
// Best-effort: nunca lança, nunca bloqueia a exclusão.
//
// Limite conhecido: o Supabase NÃO guarda o refresh token da Apple ("Provider
// tokens are intentionally not stored in your project's database") e não chama
// /auth/revoke ao apagar o usuário. O token só existe na sessão logo após o
// login (session.provider_refresh_token) e some depois de um refresh. Então
// isto só revoga quando o token ainda está disponível; sem ele, vale o
// caminho que a Apple descreve na TN3194 (dados apagados + usuário revoga em
// Ajustes > Apple ID > Entrar com a Apple). Ver docs/mobile/process-log/polimento.md.
//
// Env: APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY (.p8, \n literais ok),
// APPLE_CLIENT_ID (Services ID, o mesmo configurado no provider do Supabase).

export function appleRevokeConfigured(): boolean {
  return Boolean(
    process.env.APPLE_TEAM_ID &&
      process.env.APPLE_KEY_ID &&
      process.env.APPLE_PRIVATE_KEY &&
      process.env.APPLE_CLIENT_ID,
  );
}

function clientSecret(): string {
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const header = b64({ alg: "ES256", kid: process.env.APPLE_KEY_ID });
  const claims = b64({
    iss: process.env.APPLE_TEAM_ID,
    iat: now,
    exp: now + 5 * 60,
    aud: "https://appleid.apple.com",
    sub: process.env.APPLE_CLIENT_ID,
  });
  const key = process.env.APPLE_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const sig = createSign("SHA256")
    .update(`${header}.${claims}`)
    .sign({ key, dsaEncoding: "ieee-p1363" })
    .toString("base64url");
  return `${header}.${claims}.${sig}`;
}

/** @returns true se a Apple aceitou a revogação */
export async function revokeAppleToken(refreshToken: string | null | undefined): Promise<boolean> {
  if (!refreshToken || !appleRevokeConfigured()) return false;
  try {
    const res = await fetch("https://appleid.apple.com/auth/revoke", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.APPLE_CLIENT_ID!,
        client_secret: clientSecret(),
        token: refreshToken,
        token_type_hint: "refresh_token",
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[account] apple revoke:", res.status);
    return res.ok;
  } catch (err) {
    console.error("[account] apple revoke:", err instanceof Error ? err.message : err);
    return false;
  }
}
