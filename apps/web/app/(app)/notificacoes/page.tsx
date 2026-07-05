import { BackHeader, Card } from "@/components/ui";
import { getPatientContext } from "@/lib/queries";
import type { AppNotification, Professional } from "@/lib/types";
import { NotificacoesClient } from "./NotificacoesClient";

export const dynamic = "force-dynamic";

export default async function NotificacoesPage() {
  const { supabase, user } = await getPatientContext();

  const { data: notifs } = await supabase
    .from("notifications")
    .select("*, professional:professionals(id, type, name, short_name)")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(80);

  return (
    <div style={{ padding: "24px 20px 28px", maxWidth: 760, margin: "0 auto" }}>
      <BackHeader href="/" title="novidades" />
      {(notifs ?? []).length === 0 ? (
        <Card style={{ padding: "32px 22px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>
            nada por aqui ainda.
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 6 }}>
            avisos do seu nutri e personal chegam aqui.
          </div>
        </Card>
      ) : (
        <NotificacoesClient
          notifications={
            (notifs ?? []) as (AppNotification & {
              professional: Pick<Professional, "id" | "type" | "name" | "short_name"> | null;
            })[]
          }
        />
      )}
    </div>
  );
}
