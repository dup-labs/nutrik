import Link from "next/link";
import { Card } from "@/components/ui";
import { getPatientContext } from "@/lib/queries";
import { CheckinClient } from "./CheckinClient";

export const dynamic = "force-dynamic";

export default async function CheckinPage({
  searchParams,
}: {
  searchParams: Promise<{ req?: string }>;
}) {
  const { req } = await searchParams;
  const { supabase, user } = await getPatientContext();

  const { data: request } = await supabase
    .from("checkin_requests")
    .select("id, professional:professionals(name, short_name)")
    .eq("patient_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  void req;

  if (!request) {
    return (
      <div style={{ padding: "24px 20px 28px", maxWidth: 640, margin: "0 auto" }}>
        <Card style={{ padding: "36px 24px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>
            nenhum check-in pendente.
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 8, lineHeight: 1.5 }}>
            o check-in do mês é solicitado pelo seu profissional. quando chegar
            um pedido, ele aparece na sua home.
          </div>
          <Link
            href="/progresso"
            style={{ display: "inline-flex", marginTop: 18, height: 42, padding: "0 22px", borderRadius: "var(--radius-pill)", background: "var(--color-orange)", color: "#fff", fontWeight: 600, fontSize: 14, alignItems: "center", textDecoration: "none" }}
          >
            ver meu progresso
          </Link>
        </Card>
      </div>
    );
  }

  const pro = request.professional as { name?: string; short_name?: string } | null;
  return (
    <CheckinClient
      requestId={request.id}
      requesterName={pro?.short_name ?? pro?.name ?? "seu profissional"}
      proNames={[pro?.short_name ?? pro?.name ?? "seu profissional"]}
    />
  );
}
