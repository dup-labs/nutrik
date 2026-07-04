import { Badge, Card, InitialAvatar } from "@/components/ui";
import { addDays, dayNumber, localDateISO, monthShort, timeHM, weekdayLong } from "@/lib/dates";
import { PRO_COPY } from "@/lib/pro/copy";
import { getProContext } from "@/lib/pro/queries";
import { meshFor } from "@/lib/pro/shared";
import { RespondButtons } from "./RespondButtons";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  primeira: "1ª consulta",
  retorno: "retorno",
  avaliacao: "avaliação",
  checkin: "check-in",
};

export default async function ProAgendaPage() {
  const { supabase, pro } = await getProContext();
  const copy = PRO_COPY[pro.type];
  const today = localDateISO();

  const { data: appts } = await supabase
    .from("appointments")
    .select("*, patient:profiles(id, name)")
    .eq("professional_id", pro.id)
    .in("status", ["requested", "confirmed"])
    .gte("scheduled_at", `${today}T00:00:00`)
    .order("scheduled_at")
    .limit(60);

  const groups = new Map<string, NonNullable<typeof appts>>();
  for (const a of appts ?? []) {
    const day = String(a.scheduled_at).slice(0, 10);
    const arr = groups.get(day) ?? [];
    arr.push(a);
    groups.set(day, arr);
  }

  const dayLabel = (d: string) =>
    d === today
      ? "hoje"
      : d === addDays(today, 1)
        ? "amanhã"
        : `${weekdayLong(d)}, ${dayNumber(d)} ${monthShort(d)}`;

  const pending = (appts ?? []).filter((a) => a.status === "requested");

  return (
    <div style={{ padding: "28px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 26, letterSpacing: "-0.03em" }}>
          agenda
        </div>
        <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
          {pending.length > 0
            ? `${pending.length} solicitação${pending.length > 1 ? "ões" : ""} aguardando sua confirmação.`
            : "o que vem pela frente."}
        </div>
      </div>

      {(appts ?? []).length === 0 ? (
        <Card style={{ padding: "32px 22px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>
            agenda livre.
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 6, lineHeight: 1.5 }}>
            quando um {copy.pessoa} solicitar um horário pelo app, aparece aqui pra você confirmar.
          </div>
        </Card>
      ) : (
        [...groups.entries()].map(([day, items]) => (
          <div key={day} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 10 }}>
              {dayLabel(day)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((a) => {
                const patient = a.patient as { id?: string; name?: string } | null;
                return (
                  <Card key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 16, color: "var(--color-orange)", width: 50 }}>
                      {timeHM(a.scheduled_at)}
                    </span>
                    <InitialAvatar
                      initial={(patient?.name ?? "?")[0]?.toUpperCase()}
                      mesh={meshFor(patient?.id ?? "x")}
                      size={38}
                    />
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{patient?.name ?? copy.pessoa}</div>
                      <div style={{ fontSize: 12.5, color: "var(--color-text-muted)", marginTop: 1 }}>
                        {TYPE_LABEL[a.type] ?? a.type} · {a.duration_min}min
                      </div>
                    </div>
                    <Badge variant={a.mode === "online" ? "cool" : "warm"}>{a.mode}</Badge>
                    {a.status === "requested" ? (
                      <RespondButtons appointmentId={a.id} />
                    ) : (
                      <Badge variant="success" dot>
                        confirmada
                      </Badge>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
