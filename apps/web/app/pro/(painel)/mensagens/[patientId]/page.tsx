import { notFound } from "next/navigation";
import { getProContext, getProPatients } from "@/lib/pro/queries";
import type { Message } from "@/lib/types";
import { ProChatClient } from "./ProChatClient";

export const dynamic = "force-dynamic";

export default async function ProChatPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const { supabase, pro } = await getProContext();

  const patients = await getProPatients(supabase, pro.id);
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("patient_id", patientId)
    .eq("professional_id", pro.id)
    .order("created_at")
    .limit(200);

  // marca como lidas as mensagens do paciente
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("patient_id", patientId)
    .eq("professional_id", pro.id)
    .eq("sender", "patient")
    .is("read_at", null);

  return (
    <ProChatClient
      patient={{ id: patient.id, name: patient.name, initial: patient.initial }}
      proId={pro.id}
      proType={pro.type}
      initialMessages={(messages ?? []) as Message[]}
    />
  );
}
