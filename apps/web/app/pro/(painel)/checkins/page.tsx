import Link from "next/link";
import { Badge, Card, InitialAvatar } from "@/components/ui";
import { addDays, localDateISO, relativeLabel } from "@/lib/dates";
import { PRO_COPY } from "@/lib/pro/copy";
import { getProContext, getProPatients } from "@/lib/pro/queries";
import { meshFor } from "@/lib/pro/shared";

export const dynamic = "force-dynamic";

const KIND_BADGE: Record<string, "warm" | "cool" | "accent" | "neutral"> = {
  refeição: "warm",
  humor: "cool",
  sono: "cool",
  avaliação: "accent",
  água: "neutral",
  mente: "cool",
};

export default async function ProCheckinsPage() {
  const { supabase, pro } = await getProContext();
  const copy = PRO_COPY[pro.type];
  const patients = await getProPatients(supabase, pro.id);
  const byId = new Map(patients.map((p) => [p.id, p]));
  const ids = patients.map((p) => p.id);

  const { data: events } = ids.length
    ? await supabase
        .from("patient_events")
        .select("*")
        .in("patient_id", ids)
        .gte("at", `${addDays(localDateISO(), -6)}T00:00:00`)
        .order("at", { ascending: false })
        .limit(60)
    : { data: [] };

  return (
    <div style={{ padding: "28px 24px", maxWidth: 700, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 26, letterSpacing: "-0.03em" }}>
          check-ins
        </div>
        <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
          tudo que seus {copy.pessoas} registraram nos últimos 7 dias.
        </div>
      </div>

      {(events ?? []).length === 0 ? (
        <Card style={{ padding: "32px 22px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>
            silêncio por aqui.
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 6 }}>
            os registros dos seus {copy.pessoas} aparecem aqui em tempo real.
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(events ?? []).map((e, i) => {
            const p = byId.get(e.patient_id);
            return (
              <Link key={i} href={`/pro/pacientes/${e.patient_id}`} style={{ textDecoration: "none" }}>
                <Card style={{ display: "flex", gap: 12, padding: "13px 16px", cursor: "pointer" }}>
                  <InitialAvatar initial={p?.initial ?? "?"} mesh={meshFor(e.patient_id)} size={38} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)" }}>
                        {p?.name ?? copy.pessoa}
                      </span>
                      <Badge variant={KIND_BADGE[e.kind] ?? "neutral"}>{e.kind}</Badge>
                      <span style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--color-text-muted)", marginLeft: "auto" }}>
                        {relativeLabel(e.at)}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 3, lineHeight: 1.45 }}>
                      {e.text}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
