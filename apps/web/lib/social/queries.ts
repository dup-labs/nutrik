// Leituras do sistema social "turma". RLS garante que só membros enxergam
// grupo, membros, mensagens e placares (daily_scores) uns dos outros.

import { localDateISO, weekStart } from "@/lib/dates";
import type { createClient } from "@/lib/supabase/server";
import {
  groupMetrics,
  type DailyScore,
  type FeatureKey,
  type FriendGroup,
  type FriendProfile,
  type GroupMessage,
} from "@/lib/types";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export type RankingPeriod = "semana" | "geral";

export interface GroupOverview {
  group: FriendGroup;
  memberCount: number;
  myWeekPoints: number;
  myPosition: number; // 1-based
}

export interface RankingEntry {
  profile: FriendProfile;
  points: number;
  isMe: boolean;
  today: Pick<DailyScore, "dieta" | "treino" | "agua" | "meditacao" | "sono"> | null;
}

export interface PendingInvite {
  id: string;
  group_id: string;
  group_name: string;
  inviter_name: string | null;
  created_at: string;
}

export interface PendingRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  requester_username: string | null;
  created_at: string;
}

/** placar por pilar de um dia (o que o ranking soma, filtrado pela turma) */
type ScoreRow = Pick<
  DailyScore,
  "patient_id" | "dieta" | "treino" | "agua" | "meditacao" | "sono"
>;

const SCORE_COLS = "patient_id, dieta, treino, agua, meditacao, sono";

/** soma pontos por paciente contando só os pilares que a turma pontua */
function sumPoints(scores: ScoreRow[], metrics: FeatureKey[]) {
  const byPatient = new Map<string, number>();
  for (const s of scores) {
    let pts = 0;
    for (const m of metrics) if (s[m]) pts++;
    byPatient.set(s.patient_id, (byPatient.get(s.patient_id) ?? 0) + pts);
  }
  return byPatient;
}

/** turmas do paciente com contagem de membros e posição na semana */
export async function getMyGroups(
  supabase: Supabase,
  userId: string,
): Promise<GroupOverview[]> {
  const { data: myMemberships } = await supabase
    .from("friend_group_members")
    .select("group_id")
    .eq("patient_id", userId);
  const groupIds = (myMemberships ?? []).map((m) => m.group_id);
  if (groupIds.length === 0) return [];

  const today = localDateISO();
  const [{ data: groups }, { data: members }] = await Promise.all([
    supabase.from("friend_groups").select("*").in("id", groupIds),
    supabase
      .from("friend_group_members")
      .select("group_id, patient_id")
      .in("group_id", groupIds),
  ]);

  const memberIds = [...new Set((members ?? []).map((m) => m.patient_id))];
  const { data: scores } = await supabase
    .from("daily_scores")
    .select(SCORE_COLS)
    .in("patient_id", memberIds)
    .gte("date", weekStart(today))
    .lte("date", today);

  return ((groups ?? []) as FriendGroup[])
    .map((group) => {
      // cada turma pontua só seus pilares → placar recalculado por turma
      const points = sumPoints((scores ?? []) as ScoreRow[], groupMetrics(group));
      const ids = (members ?? [])
        .filter((m) => m.group_id === group.id)
        .map((m) => m.patient_id);
      const ranked = ids
        .map((id) => ({ id, pts: points.get(id) ?? 0 }))
        .sort((a, b) => b.pts - a.pts);
      const myIndex = ranked.findIndex((r) => r.id === userId);
      return {
        group,
        memberCount: ids.length,
        myWeekPoints: points.get(userId) ?? 0,
        myPosition: myIndex === -1 ? ids.length : myIndex + 1,
      };
    })
    .sort((a, b) => a.group.name.localeCompare(b.group.name));
}

/** ranking completo de uma turma (null se não for membro) */
export async function getGroupRanking(
  supabase: Supabase,
  groupId: string,
  period: RankingPeriod,
  userId: string,
): Promise<{ group: FriendGroup; entries: RankingEntry[] } | null> {
  const { data: group } = await supabase
    .from("friend_groups")
    .select("*")
    .eq("id", groupId)
    .maybeSingle();
  if (!group) return null;

  const { data: members } = await supabase
    .from("friend_group_members")
    .select("patient_id")
    .eq("group_id", groupId);
  const memberIds = (members ?? []).map((m) => m.patient_id);
  if (memberIds.length === 0) return { group: group as FriendGroup, entries: [] };

  const today = localDateISO();
  let scoresQuery = supabase
    .from("daily_scores")
    .select(SCORE_COLS)
    .in("patient_id", memberIds)
    .lte("date", today);
  if (period === "semana") scoresQuery = scoresQuery.gte("date", weekStart(today));

  const [{ data: profiles }, { data: scores }, { data: todayScores }] =
    await Promise.all([
      supabase.from("friend_profiles").select("*").in("id", memberIds),
      scoresQuery,
      supabase.from("daily_scores").select(SCORE_COLS).in("patient_id", memberIds).eq("date", today),
    ]);

  const points = sumPoints((scores ?? []) as ScoreRow[], groupMetrics(group as FriendGroup));
  const todayBy = new Map(
    (todayScores ?? []).map((s) => [s.patient_id, s]),
  );
  const profileBy = new Map(
    ((profiles ?? []) as FriendProfile[]).map((p) => [p.id, p]),
  );

  const entries: RankingEntry[] = memberIds
    .map((id) => ({
      profile:
        profileBy.get(id) ??
        ({ id, name: "alguém", username: null, avatar_url: null } as FriendProfile),
      points: points.get(id) ?? 0,
      isMe: id === userId,
      today: todayBy.get(id) ?? null,
    }))
    .sort(
      (a, b) => b.points - a.points || a.profile.name.localeCompare(b.profile.name),
    );

  return { group: group as FriendGroup, entries };
}

/** mensagens da turma (asc) + perfis dos autores */
export async function getGroupMessages(supabase: Supabase, groupId: string) {
  const { data: messages } = await supabase
    .from("group_messages")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .limit(200);
  const list = ((messages ?? []) as GroupMessage[]).reverse();

  const senderIds = [...new Set(list.map((m) => m.sender_id))];
  const { data: profiles } = senderIds.length
    ? await supabase.from("friend_profiles").select("*").in("id", senderIds)
    : { data: [] };
  const senders = new Map(
    ((profiles ?? []) as FriendProfile[]).map((p) => [p.id, p]),
  );
  return { messages: list, senders };
}

/** convites pendentes pra mim (RPC — invitee ainda não é membro) */
export async function getPendingInvites(supabase: Supabase): Promise<PendingInvite[]> {
  const { data } = await supabase.rpc("my_pending_invites");
  return (data ?? []) as PendingInvite[];
}

/** solicitações pendentes de entrada (RPC — só retorna algo pro owner) */
export async function getPendingRequests(
  supabase: Supabase,
  groupId: string,
): Promise<PendingRequest[]> {
  const { data } = await supabase.rpc("group_pending_requests", {
    p_group: groupId,
  });
  return (data ?? []) as PendingRequest[];
}
