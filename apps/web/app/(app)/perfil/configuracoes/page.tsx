import { BackHeader } from "@/components/ui";
import { getActiveMealProtocol, getPatientContext } from "@/lib/queries";
import { ConfiguracoesClient } from "./ConfiguracoesClient";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const { supabase, user, profile, links } = await getPatientContext();
  const { protocol } = await getActiveMealProtocol(supabase, user.id);

  return (
    <div style={{ padding: "24px 20px 28px", maxWidth: 640, margin: "0 auto" }}>
      <BackHeader href="/perfil" title="configurações" />
      <ConfiguracoesClient
        name={profile?.name ?? ""}
        email={user.email ?? ""}
        soloPlanKey={
          protocol && !protocol.created_by ? (protocol.plan_type ?? null) : null
        }
        hasLinks={links.length > 0}
      />
    </div>
  );
}
