"use server";

// Denunciar e bloquear (UGC — Apple 1.2 / Google). Toda resolução do alvo
// (quem escreveu a mensagem) é feita aqui no servidor, nunca confiando no client.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";
import {
  REPORT_REASONS,
  REPORT_REASON_KEYS,
  type ModerationResult,
  type ModerationTarget,
  type ReportReason,
} from "./types";

const MAX_REPORTS_PER_DAY = 20;
const MODERATION_INBOX = "app@nutrk.io";

type Supabase = Awaited<ReturnType<typeof createClient>>;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrada");
  return { supabase, user };
}

interface Resolved {
  targetUserId: string;
  context: "turma_mensagem" | "chat_mensagem" | "turma_membro";
  groupId: string | null;
  groupMessageId: string | null;
  messageId: string | null;
  excerpt: string | null;
}

/** descobre autor/contexto da mensagem (ou membro) pelo servidor, via RLS do usuário */
async function resolveTarget(
  supabase: Supabase,
  meId: string,
  target: ModerationTarget,
): Promise<Resolved | null> {
  if (target.type === "member") {
    return {
      targetUserId: target.userId,
      context: "turma_membro",
      groupId: target.groupId ?? null,
      groupMessageId: null,
      messageId: null,
      excerpt: null,
    };
  }
  if (target.type === "group_message") {
    const { data } = await supabase
      .from("group_messages")
      .select("id, group_id, sender_id, body")
      .eq("id", target.messageId)
      .maybeSingle();
    if (!data) return null;
    return {
      targetUserId: data.sender_id as string,
      context: "turma_mensagem",
      groupId: data.group_id as string,
      groupMessageId: data.id as string,
      messageId: null,
      excerpt: String(data.body).slice(0, 500),
    };
  }
  const { data: msg } = await supabase
    .from("messages")
    .select("id, patient_id, professional_id, body")
    .eq("id", target.messageId)
    .maybeSingle();
  if (!msg) return null;
  let other: string | null = msg.patient_id as string;
  if (msg.patient_id === meId) {
    const { data: pro } = await supabase
      .from("professionals")
      .select("user_id")
      .eq("id", msg.professional_id)
      .maybeSingle();
    other = (pro?.user_id as string | undefined) ?? null;
  }
  if (!other) return null;
  return {
    targetUserId: other,
    context: "chat_mensagem",
    groupId: null,
    groupMessageId: null,
    messageId: String(msg.id),
    excerpt: String(msg.body).slice(0, 500),
  };
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");

export async function reportContent(input: {
  target: ModerationTarget;
  reason: ReportReason;
  details?: string;
}): Promise<ModerationResult> {
  const { supabase, user } = await requireUser();
  if (!REPORT_REASON_KEYS.includes(input.reason))
    return { ok: false, error: "escolhe um motivo pra continuar." };
  const details = (input.details ?? "").trim().slice(0, 1000) || null;

  const resolved = await resolveTarget(supabase, user.id, input.target);
  if (!resolved) return { ok: false, error: "não encontramos esse conteúdo." };
  if (resolved.targetUserId === user.id)
    return { ok: false, error: "você não pode denunciar a si mesmo." };

  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("reporter_id", user.id)
    .gte("created_at", since);
  if ((count ?? 0) >= MAX_REPORTS_PER_DAY)
    return { ok: false, error: "você já mandou várias denúncias hoje. a gente tá olhando." };

  const { data: report, error } = await supabase
    .from("reports")
    .insert({
      reporter_id: user.id,
      target_user_id: resolved.targetUserId,
      context: resolved.context,
      group_id: resolved.groupId,
      group_message_id: resolved.groupMessageId,
      message_id: resolved.messageId,
      message_excerpt: resolved.excerpt,
      reason: input.reason,
      details,
    })
    .select("id")
    .single();
  if (error || !report) return { ok: false, error: "não conseguimos enviar agora. tenta de novo?" };

  await notifyModerators(supabase, {
    reportId: report.id as string,
    reporterId: user.id,
    resolved,
    reason: input.reason,
    details,
  });

  if (resolved.groupId) revalidatePath(`/amigos/${resolved.groupId}/chat`);
  return { ok: true };
}

/** email pra caixa de moderação — falha de envio nunca derruba a denúncia */
async function notifyModerators(
  supabase: Supabase,
  r: {
    reportId: string;
    reporterId: string;
    resolved: Resolved;
    reason: ReportReason;
    details: string | null;
  },
) {
  try {
    const { data: people } = await supabase
      .from("profiles")
      .select("id, name, username")
      .in("id", [r.reporterId, r.resolved.targetUserId]);
    const label = (id: string) => {
      const p = people?.find((x) => x.id === id);
      return p ? `${p.name ?? "?"}${p.username ? ` (@${p.username})` : ""} — ${id}` : id;
    };
    const reasonLabel = REPORT_REASONS.find((x) => x.key === r.reason)?.label ?? r.reason;
    const rows: [string, string][] = [
      ["denúncia", r.reportId],
      ["contexto", r.resolved.context],
      ["motivo", reasonLabel],
      ["quem denunciou", label(r.reporterId)],
      ["alvo", label(r.resolved.targetUserId)],
    ];
    if (r.resolved.groupId) rows.push(["turma", r.resolved.groupId]);
    if (r.resolved.excerpt) rows.push(["mensagem", r.resolved.excerpt]);
    if (r.details) rows.push(["detalhes", r.details]);
    await sendEmail({
      to: MODERATION_INBOX,
      subject: `[denúncia] ${reasonLabel} — ${r.resolved.context}`,
      heading: "nova denúncia no nūtrk",
      body:
        rows.map(([k, v]) => `<b>${k}:</b> ${esc(v)}`).join("<br>") +
        "<br><br>prazo: agir em até 24h (Apple 1.2). triagem no Supabase, tabela nutrk.reports.",
    });
  } catch (e) {
    console.error("[moderation] falha ao avisar por email", e);
  }
}

export async function blockUser(target: ModerationTarget): Promise<ModerationResult> {
  const { supabase, user } = await requireUser();
  const resolved = await resolveTarget(supabase, user.id, target);
  if (!resolved) return { ok: false, error: "não encontramos essa pessoa." };
  if (resolved.targetUserId === user.id)
    return { ok: false, error: "você não pode bloquear a si mesmo." };

  const { error } = await supabase
    .from("user_blocks")
    .upsert(
      { blocker_id: user.id, blocked_id: resolved.targetUserId },
      { onConflict: "blocker_id,blocked_id", ignoreDuplicates: true },
    );
  if (error) return { ok: false, error: "não conseguimos bloquear agora. tenta de novo?" };

  revalidatePath("/amigos", "layout");
  revalidatePath("/pro/mensagens", "layout");
  return { ok: true };
}

export async function unblockUser(userId: string): Promise<ModerationResult> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("user_blocks")
    .delete()
    .eq("blocker_id", user.id)
    .eq("blocked_id", userId);
  if (error) return { ok: false, error: "não conseguimos desbloquear agora." };
  revalidatePath("/amigos", "layout");
  revalidatePath("/pro/mensagens", "layout");
  return { ok: true };
}

/** quem eu bloqueei (pra tela de bloqueados / filtros de UI) */
export async function listMyBlocks(): Promise<{ id: string; name: string; username: string | null }[]> {
  const { supabase, user } = await requireUser();
  const { data } = await supabase
    .from("user_blocks")
    .select("blocked_id")
    .eq("blocker_id", user.id);
  const ids = (data ?? []).map((b) => b.blocked_id as string);
  if (ids.length === 0) return [];
  const { data: profiles } = await supabase
    .from("friend_profiles")
    .select("id, name, username")
    .in("id", ids);
  return (profiles ?? []) as { id: string; name: string; username: string | null }[];
}
