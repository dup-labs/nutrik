"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Registra (ou revalida) o token do aparelho pro usuário logado. Service role
 * porque o token é único por instalação e pode trocar de dono (outra conta no
 * mesmo aparelho); a sessão é validada aqui antes.
 */
export async function registerDevice(token: string, platform: "ios" | "android") {
  if (!token || token.length > 4096 || (platform !== "ios" && platform !== "android")) {
    return { ok: false };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  try {
    const { error } = await createAdminClient()
      .from("device_tokens")
      .upsert(
        { user_id: user.id, token, platform, last_seen_at: new Date().toISOString() },
        { onConflict: "token" },
      );
    return { ok: !error };
  } catch {
    // service role ausente (dev) → o app segue sem push
    return { ok: false };
  }
}

/** Logout: o aparelho para de receber push da conta que saiu (RLS: só apaga o seu). */
export async function unregisterDevice(token: string) {
  const supabase = await createClient();
  await supabase.from("device_tokens").delete().eq("token", token);
}
