"use server";

// Exclusão de conta (Apple 5.1.1(v) / Google Play). Ordem pensada pra falhar
// "pra frente": cada passo é idempotente, então se algo quebra no meio o usuário
// só tenta de novo (a sessão continua válida até o último passo).
//   1. sessão + confirmação digitada
//   2. cancela a assinatura no Asaas (se profissional e não cancelada) — antes
//      de apagar qualquer coisa, pra nunca sobrar cobrança sem conta
//   3. apaga as fotos do Storage (bucket nutrk-photos, pasta <userId>/)
//   4. nutrk.delete_account_data(): dados do schema (ver migration 20261014_03)
//   5. auth.admin.deleteUser — exceto se o usuário também usa outro app do
//      mesmo projeto Supabase (polr/pblshr compartilham auth.users)
//   6. signOut local + redirect

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { asaasConfigured, cancelAsaasSubscription } from "@/lib/billing/asaas";
import { isAppleUser } from "./apple";
import { revokeAppleToken } from "./apple-revoke";
import { CONFIRM_WORD, DELETED_REDIRECT, normalizeConfirm } from "./shared";

const PHOTO_BUCKET = "nutrk-photos";

export type DeleteAccountResult = { ok: false; error: string };

type Admin = ReturnType<typeof createAdminClient>;

/** caminhos de todos os arquivos sob <prefix>/ (pastas aninhadas incluídas) */
async function listAllFiles(admin: Admin, prefix: string, depth = 0): Promise<string[]> {
  if (depth > 4) return [];
  const files: string[] = [];
  let offset = 0;
  for (;;) {
    const { data, error } = await admin.storage
      .from(PHOTO_BUCKET)
      .list(prefix, { limit: 100, offset });
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;
    for (const item of data) {
      // pasta: sem id; arquivo: com id
      if (item.id) files.push(`${prefix}/${item.name}`);
      else files.push(...(await listAllFiles(admin, `${prefix}/${item.name}`, depth + 1)));
    }
    if (data.length < 100) break;
    offset += 100;
  }
  return files;
}

async function removePhotos(admin: Admin, userId: string) {
  const files = await listAllFiles(admin, userId);
  for (let i = 0; i < files.length; i += 100) {
    const { error } = await admin.storage.from(PHOTO_BUCKET).remove(files.slice(i, i + 100));
    if (error) throw new Error(error.message);
  }
}

export async function deleteAccount(input: {
  confirmation: string;
}): Promise<DeleteAccountResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "sessão expirada. entra de novo pra excluir sua conta?" };

  if (normalizeConfirm(input.confirmation) !== CONFIRM_WORD) {
    return { ok: false, error: `digite "${CONFIRM_WORD}" pra confirmar.` };
  }

  // refresh token da Apple, se ainda estiver na sessão (o Supabase não o
  // persiste); lido antes de apagar o usuário
  let appleRefreshToken: string | null = null;
  if (isAppleUser(user)) {
    try {
      const { data } = await supabase.auth.getSession();
      appleRefreshToken = data.session?.provider_refresh_token ?? null;
    } catch {
      /* best-effort */
    }
  }

  let admin: Admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    console.error("[account] admin client:", err);
    return { ok: false, error: "não conseguimos excluir agora. tenta de novo em instantes?" };
  }

  // 2. assinatura (lida com service role: a tabela só tem policy de select)
  try {
    const { data: pro } = await admin
      .from("professionals")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (pro) {
      const { data: sub } = await admin
        .from("professional_subscriptions")
        .select("asaas_subscription_id, status")
        .eq("professional_id", pro.id)
        .maybeSingle();
      if (sub?.asaas_subscription_id && sub.status !== "canceled") {
        if (!asaasConfigured()) {
          // sem como cancelar = risco de cobrar quem já foi embora; não segue
          throw new Error("asaas não configurado com assinatura ativa");
        }
        try {
          await cancelAsaasSubscription(sub.asaas_subscription_id);
        } catch (err) {
          // 404 = já não existe no Asaas; qualquer outro erro interrompe
          if (!(err instanceof Error && err.message.includes("→ 404"))) throw err;
        }
      }
    }
  } catch (err) {
    console.error("[account] cancelar assinatura:", err);
    return {
      ok: false,
      error:
        "não conseguimos cancelar sua assinatura no sistema de pagamento, então não excluímos nada. tenta de novo? se persistir, escreve pra app@nutrk.io.",
    };
  }

  // 3. fotos
  try {
    await removePhotos(admin, user.id);
  } catch (err) {
    console.error("[account] fotos:", err);
    return { ok: false, error: "não conseguimos apagar suas fotos agora. tenta de novo em instantes?" };
  }

  // 4. dados do schema
  let otherApps = false;
  try {
    const { data, error } = await admin.rpc("delete_account_data", { p_user: user.id });
    if (error) throw new Error(error.message);
    otherApps = Boolean((data as { other_apps?: boolean } | null)?.other_apps);
  } catch (err) {
    console.error("[account] delete_account_data:", err);
    return { ok: false, error: "não conseguimos apagar seus dados agora. tenta de novo em instantes?" };
  }

  // 5. login (só se não for usado por outro app do mesmo projeto)
  if (!otherApps) {
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) {
      console.error("[account] deleteUser:", error.message);
      return {
        ok: false,
        error: "seus dados foram apagados, mas faltou encerrar o login. tenta de novo pra concluir.",
      };
    }
  }

  // 5b. Sign in with Apple: revoga o token (best-effort, nunca bloqueia)
  if (appleRefreshToken) await revokeAppleToken(appleRefreshToken);

  // 6. encerra a sessão deste dispositivo (o usuário já pode nem existir mais)
  try {
    await supabase.auth.signOut({ scope: "local" });
  } catch {
    // cookies vencem sozinhos; não é motivo pra falhar
  }
  redirect(DELETED_REDIRECT);
}
