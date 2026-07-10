"use server";

// Ações do sistema social "turma": criar/entrar/gerenciar grupos, convites,
// mensagens. Mutações sensíveis (convite, pedido, mensagem+notificação)
// passam pelas RPCs security definer do schema nutrk.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FEATURE_KEYS, type FeatureKey, type FriendProfile, type GroupMessage } from "@/lib/types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrada");
  return { supabase, user };
}

const USERNAME_REQUIRED =
  "escolhe seu username primeiro — é ele que te identifica no ranking e no chat.";

/** username é obrigatório pra participar de turma (evita nomes duplicados no ranking) */
async function hasUsername(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle();
  return !!data?.username;
}

function generateGroupCode(): string {
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  const rand = Array.from({ length: 4 }, () =>
    alphabet.charAt(Math.floor(Math.random() * alphabet.length)),
  ).join("");
  return `NUTRK-${rand}`;
}

export async function createGroup(input: {
  name: string;
  joinPolicy: "open" | "approval";
}): Promise<{ ok: boolean; groupId?: string; error?: string }> {
  const { supabase, user } = await requireUser();
  const name = input.name.trim();
  if (name.length < 2) return { ok: false, error: "dá um nome pra turma." };
  if (!(await hasUsername(supabase, user.id))) return { ok: false, error: USERNAME_REQUIRED };

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: group, error } = await supabase
      .from("friend_groups")
      .insert({
        name,
        code: generateGroupCode(),
        owner_id: user.id,
        join_policy: input.joinPolicy,
      })
      .select("id")
      .single();
    if (error) {
      if (error.message.includes("duplicate")) continue; // código colidiu, tenta outro
      return { ok: false, error: "não conseguimos criar a turma agora." };
    }
    await supabase
      .from("friend_group_members")
      .insert({ group_id: group.id, patient_id: user.id });
    revalidatePath("/amigos");
    return { ok: true, groupId: group.id };
  }
  return { ok: false, error: "não conseguimos criar a turma agora." };
}

export async function joinGroupWithCode(code: string): Promise<{
  ok: boolean;
  status?: "member" | "joined" | "requested";
  groupId?: string;
  name?: string;
  error?: string;
}> {
  const { supabase, user } = await requireUser();
  if (!(await hasUsername(supabase, user.id))) return { ok: false, error: USERNAME_REQUIRED };
  const { data, error } = await supabase.rpc("join_group_with_code", {
    p_code: code,
  });
  if (error || !data)
    return { ok: false, error: "não conseguimos entrar agora. tenta de novo?" };
  if (!data.ok) return { ok: false, error: "código não encontrado. confere com a turma?" };
  revalidatePath("/amigos");
  return {
    ok: true,
    status: data.status as "member" | "joined" | "requested",
    groupId: data.group_id as string,
    name: data.name as string,
  };
}

export async function searchProfiles(query: string): Promise<FriendProfile[]> {
  const { supabase } = await requireUser();
  if (query.trim().length < 3) return [];
  const { data } = await supabase.rpc("search_profiles", { p_query: query });
  return (data ?? []) as FriendProfile[];
}

export async function inviteToGroup(
  groupId: string,
  profileId: string,
): Promise<{ ok: boolean; status?: string; error?: string }> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.rpc("invite_to_group", {
    p_group: groupId,
    p_invitee: profileId,
  });
  if (error || !data) return { ok: false, error: "não conseguimos convidar agora." };
  if (!data.ok)
    return {
      ok: false,
      error: data.error === "already_member" ? "essa pessoa já tá na turma." : "algo deu errado.",
    };
  return { ok: true, status: data.status as string };
}

export async function respondInvite(
  inviteId: string,
  accept: boolean,
): Promise<{ ok: boolean; groupId?: string; error?: string }> {
  const { supabase, user } = await requireUser();
  if (accept && !(await hasUsername(supabase, user.id)))
    return { ok: false, error: USERNAME_REQUIRED };
  const { data, error } = await supabase.rpc("respond_group_invite", {
    p_invite: inviteId,
    p_accept: accept,
  });
  if (error || !data?.ok) return { ok: false, error: "não conseguimos responder agora." };
  revalidatePath("/amigos");
  return { ok: true, groupId: data.group_id as string };
}

export async function updateGroup(
  groupId: string,
  input: {
    name?: string;
    joinPolicy?: "open" | "approval";
    scoredMetrics?: FeatureKey[];
  },
): Promise<{ ok: boolean; error?: string }> {
  const { supabase } = await requireUser();
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) {
    const name = input.name.trim();
    if (name.length < 2) return { ok: false, error: "dá um nome pra turma." };
    patch.name = name;
  }
  if (input.joinPolicy) patch.join_policy = input.joinPolicy;
  if (input.scoredMetrics !== undefined) {
    const metrics = FEATURE_KEYS.filter((k) => input.scoredMetrics!.includes(k));
    if (metrics.length === 0)
      return { ok: false, error: "escolhe pelo menos uma métrica pra pontuar." };
    patch.scored_metrics = metrics;
  }
  const { error } = await supabase.from("friend_groups").update(patch).eq("id", groupId);
  if (error) return { ok: false, error: "não conseguimos salvar agora." };
  revalidatePath(`/amigos/${groupId}`);
  revalidatePath("/amigos");
  return { ok: true };
}

export async function removeMember(groupId: string, patientId: string) {
  const { supabase } = await requireUser();
  await supabase
    .from("friend_group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("patient_id", patientId);
  revalidatePath(`/amigos/${groupId}`);
}

export async function leaveGroup(groupId: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("friend_group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("patient_id", user.id);
  revalidatePath("/amigos");
  redirect("/amigos");
}

export async function deleteGroup(groupId: string) {
  const { supabase } = await requireUser();
  // RLS: só o owner consegue; cascade limpa membros, mensagens e convites
  await supabase.from("friend_groups").delete().eq("id", groupId);
  revalidatePath("/amigos");
  redirect("/amigos");
}

export async function sendGroupMessage(
  groupId: string,
  body: string,
): Promise<{ ok: boolean; message?: GroupMessage; error?: string }> {
  const { supabase } = await requireUser();
  const text = body.trim();
  if (!text) return { ok: false, error: "mensagem vazia." };
  const { data, error } = await supabase.rpc("send_group_message", {
    p_group: groupId,
    p_body: text,
  });
  if (error || !data) return { ok: false, error: "não conseguimos enviar agora." };
  return { ok: true, message: data as GroupMessage };
}
