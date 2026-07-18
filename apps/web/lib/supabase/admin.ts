import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client service-role: bypassa RLS. SÓ para código server-side sem sessão de
// usuário (webhook do Asaas, cron de reconciliação, escrita de assinatura).
// NUNCA importar em client component — a chave não pode vazar pro browser.
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada");

  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    db: { schema: "nutrk" },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
