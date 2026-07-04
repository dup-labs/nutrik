import { BackHeader, Card } from "@/components/ui";
import { addDays, localDateISO, weekDays } from "@/lib/dates";
import { getActiveMealProtocol, getMealLogs, getPatientContext } from "@/lib/queries";
import { RefeicoesClient } from "./RefeicoesClient";

export const dynamic = "force-dynamic";

export default async function RefeicoesPage() {
  const { supabase, user, links } = await getPatientContext();
  const today = localDateISO();
  const days = weekDays(today);

  const [{ meals }, logs] = await Promise.all([
    getActiveMealProtocol(supabase, user.id),
    getMealLogs(supabase, user.id, addDays(days[0], -0), days[6]),
  ]);

  const linked = links.length > 0;
  const nutriName =
    links.find((l) => l.professional_type === "nutri")?.professional.name;

  return (
    <div style={{ padding: "24px 20px 28px" }}>
      <BackHeader
        href="/"
        title="refeições de hoje"
        subtitle="o convite é comer bem, no seu tempo."
      />
      {meals.length === 0 ? (
        <Card style={{ padding: "32px 22px", textAlign: "center" }}>
          <div
            style={{
              width: 60,
              height: 60,
              margin: "0 auto",
              borderRadius: "50%",
              background: "var(--mesh-warm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginTop: 14 }}>
            nada por aqui ainda.
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 6, lineHeight: 1.5 }}>
            {linked
              ? `${nutriName ?? "seu nutri"} ainda está montando seu cardápio.`
              : "seu plano solo está sendo gerado. já já aparece."}
          </div>
        </Card>
      ) : (
        <RefeicoesClient meals={meals} logs={logs} today={today} days={days} />
      )}
    </div>
  );
}
