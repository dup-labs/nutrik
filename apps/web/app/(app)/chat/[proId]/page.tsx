import { notFound } from "next/navigation";
import { getPatientContext } from "@/lib/queries";
import type { Message, Professional } from "@/lib/types";
import { ChatClient } from "./ChatClient";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ proId: string }>;
}) {
  const { proId } = await params;
  const { supabase, user } = await getPatientContext();

  const [{ data: pro }, { data: messages }] = await Promise.all([
    supabase.from("professionals").select("*").eq("id", proId).maybeSingle(),
    supabase
      .from("messages")
      .select("*")
      .eq("patient_id", user.id)
      .eq("professional_id", proId)
      .order("created_at")
      .limit(200),
  ]);
  if (!pro) notFound();

  return (
    <ChatClient
      pro={pro as Professional}
      initialMessages={(messages ?? []) as Message[]}
      userId={user.id}
    />
  );
}
