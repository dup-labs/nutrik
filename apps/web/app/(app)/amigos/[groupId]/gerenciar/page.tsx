import { redirect } from "next/navigation";
import { BackHeader } from "@/components/ui";
import { getPatientContext } from "@/lib/queries";
import type { FriendGroup, FriendProfile } from "@/lib/types";
import { GerenciarClient } from "./GerenciarClient";

export const dynamic = "force-dynamic";

export default async function GerenciarPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const { supabase, user } = await getPatientContext();

  const { data: group } = await supabase
    .from("friend_groups")
    .select("*")
    .eq("id", groupId)
    .maybeSingle();
  if (!group || (group as FriendGroup).owner_id !== user.id) redirect(`/amigos/${groupId}`);

  const { data: members } = await supabase
    .from("friend_group_members")
    .select("patient_id")
    .eq("group_id", groupId);
  const memberIds = (members ?? []).map((m) => m.patient_id);
  const { data: profiles } = memberIds.length
    ? await supabase.from("friend_profiles").select("*").in("id", memberIds)
    : { data: [] };

  return (
    <div style={{ padding: "24px 20px 28px", maxWidth: 640, margin: "0 auto" }}>
      <BackHeader href={`/amigos/${groupId}`} title="gerenciar turma" />
      <GerenciarClient
        group={group as FriendGroup}
        members={((profiles ?? []) as FriendProfile[]).sort((a, b) =>
          a.name.localeCompare(b.name),
        )}
        ownerId={user.id}
      />
    </div>
  );
}
