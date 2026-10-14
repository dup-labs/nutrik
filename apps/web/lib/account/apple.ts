import type { User } from "@supabase/supabase-js";

// Sign in with Apple: a Apple rejeita apps que pedem nome depois do login com
// a Apple. Estes helpers decidem quando o nome vira opcional e qual apelido
// usar. Sem "use server": também roda no client.

export function isAppleUser(user: User | null | undefined): boolean {
  if (!user) return false;
  if (user.app_metadata?.provider === "apple") return true;
  return (user.identities ?? []).some((i) => i.provider === "apple");
}

/** apelido provisório: parte local do email (se for email real) ou "você" */
export function fallbackNickname(email: string | null | undefined): string {
  const e = (email ?? "").toLowerCase();
  if (!e || e.endsWith("@privaterelay.appleid.com")) return "você";
  const local = (e.split("@")[0] ?? "").split(/[+.\-_]/)[0].replace(/[^a-z0-9à-ú]/gi, "");
  return local.length >= 2 ? local : "você";
}
