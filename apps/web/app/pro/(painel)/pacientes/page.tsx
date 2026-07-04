import { getProContext, getProPatients } from "@/lib/pro/queries";
import { PRO_COPY } from "@/lib/pro/copy";
import { PacientesClient } from "./PacientesClient";

export const dynamic = "force-dynamic";

export default async function ProPacientesPage() {
  const { supabase, pro } = await getProContext();
  const patients = await getProPatients(supabase, pro.id);

  return (
    <PacientesClient
      patients={patients}
      copy={{ pessoas: PRO_COPY[pro.type].pessoas }}
      inviteCode={pro.invite_code}
    />
  );
}
