import { redirect } from "next/navigation";
import { getPatientContext } from "@/lib/queries";
import { getGroupMessages } from "@/lib/social/queries";
import type { FriendGroup } from "@/lib/types";
import { GroupChatClient } from "./GroupChatClient";

export const dynamic = "force-dynamic";

export default async function TurmaChatPage({
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
  if (!group) redirect("/amigos");

  const { messages, senders } = await getGroupMessages(supabase, groupId);

  return (
    <GroupChatClient
      group={group as FriendGroup}
      initialMessages={messages}
      senders={Object.fromEntries(
        [...senders.entries()].map(([id, p]) => [
          id,
          { name: p.name, username: p.username },
        ]),
      )}
      userId={user.id}
    />
  );
}
