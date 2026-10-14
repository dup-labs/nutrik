import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { apnsConfigured, fcmConfigured, pushConfigured } from "./config";
import { sendApns } from "./apns";
import { sendFcm } from "./fcm";
import type { PushMessage } from "./types";

/**
 * Envia push pra todos os dispositivos do usuário. Nunca lança: falha de push
 * não pode derrubar a action principal. Sem env configurada → no-op com log.
 */
export async function sendPush(userId: string, msg: PushMessage): Promise<void> {
  try {
    if (!pushConfigured()) {
      console.info("[push] sem credenciais de push configuradas — ignorado");
      return;
    }
    const admin = createAdminClient();
    const { data } = await admin
      .from("device_tokens")
      .select("token, platform")
      .eq("user_id", userId);
    if (!data?.length) return;

    const ios = data.filter((d) => d.platform === "ios").map((d) => d.token as string);
    const android = data.filter((d) => d.platform === "android").map((d) => d.token as string);

    const results = await Promise.all([
      ios.length && apnsConfigured() ? sendApns(ios, msg) : null,
      android.length && fcmConfigured() ? sendFcm(android, msg) : null,
    ]);

    const invalid = results.flatMap((r) => r?.invalid ?? []);
    if (invalid.length) await admin.from("device_tokens").delete().in("token", invalid);
  } catch (e) {
    console.error("[push] falha ao enviar:", (e as Error).message);
  }
}

/**
 * Agenda o envio pra depois da resposta (não bloqueia a action e continua
 * rodando em serverless). Fora de request context, cai pra fire-and-forget.
 */
export function pushAfter(userId: string, msg: PushMessage): void {
  try {
    after(() => sendPush(userId, msg));
  } catch {
    void sendPush(userId, msg);
  }
}

/** Push pro profissional (a tabela guarda tokens por auth user, não por professional.id). */
export function pushToProfessionalAfter(professionalId: string, msg: PushMessage): void {
  const run = async () => {
    try {
      if (!pushConfigured()) return;
      const { data } = await createAdminClient()
        .from("professionals")
        .select("user_id")
        .eq("id", professionalId)
        .maybeSingle();
      if (data?.user_id) await sendPush(data.user_id as string, msg);
    } catch (e) {
      console.error("[push] falha ao enviar:", (e as Error).message);
    }
  };
  try {
    after(run);
  } catch {
    void run();
  }
}
