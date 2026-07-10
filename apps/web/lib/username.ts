// Username automático no cadastro: parte local do email + número aleatório
// (ex: hi@brunodup.com → "hi482"). O índice único em profiles.username é a
// fonte da verdade — colisão gera novo candidato. Editável nas configurações.

import type { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** candidato válido pro check `^[a-z0-9_.]{3,20}$` */
export function usernameCandidate(email: string | null | undefined): string {
  const local = (email ?? "")
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, "")
    .slice(0, 12);
  const base = local.length >= 2 ? local : "user";
  const num = String(Math.floor(100 + Math.random() * 900));
  return `${base}${num}`.slice(0, 20);
}

/** preenche username do perfil se ainda não tem (retry contra colisão) */
export async function ensureUsername(
  supabase: Supabase,
  userId: string,
  email: string | null | undefined,
) {
  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle();
  if (!data || data.username) return;

  for (let attempt = 0; attempt < 5; attempt++) {
    const { error } = await supabase
      .from("profiles")
      .update({ username: usernameCandidate(email) })
      .eq("id", userId);
    if (!error) return;
    // colisão no índice único → tenta outro número; outro erro → desiste
    // (perfil fica sem username e o /amigos pede na entrada do social)
    if (!error.message.includes("duplicate") && !error.message.includes("unique")) return;
  }
}
