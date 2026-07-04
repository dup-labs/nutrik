import Link from "next/link";
import { Badge, Card, InitialAvatar, MeshAura } from "@/components/ui";
import { IconChevronRight } from "@/components/ui/icons";
import { localDateISO, timeHM, todayLabel } from "@/lib/dates";
import { PRO_COPY } from "@/lib/pro/copy";
import { getProContext, getProPatients, meshFor, STATUS_BADGE } from "@/lib/pro/queries";

export const dynamic = "force-dynamic";

export default async function ProDashboardPage() {
  const { supabase, pro } = await getProContext();
  const copy = PRO_COPY[pro.type];
  const today = localDateISO();

  const patients = await getProPatients(supabase, pro.id);
  const ids = patients.map((p) => p.id);
  const byId = new Map(patients.map((p) => [p.id, p]));

  const [{ data: events }, { data: appts }] = await Promise.all([
    ids.length
      ? supabase
          .from("patient_events")
          .select("*")
          .in("patient_id", ids)
          .gte("at", `${today}T00:00:00`)
          .order("at", { ascending: false })
          .limit(12)
      : Promise.resolve({ data: [] }),
    supabase
      .from("appointments")
      .select("*, patient:profiles(id, name)")
      .eq("professional_id", pro.id)
      .in("status", ["requested", "confirmed"])
      .gte("scheduled_at", `${today}T00:00:00`)
      .lte("scheduled_at", `${today}T23:59:59`)
      .order("scheduled_at"),
  ]);

  const alerts = patients.filter((p) => p.status !== "em dia");
  const avgAdherence = patients.length
    ? Math.round(patients.reduce((a, p) => a + p.adherence, 0) / patients.length)
    : 0;

  const stats = [
    { value: String(patients.length), label: `${copy.pessoas} ativos`, mesh: "cool" as const, color: "var(--color-text)" },
    { value: String((events ?? []).length), label: "check-ins hoje", mesh: "warm" as const, color: "var(--color-orange)" },
    { value: `${avgAdherence}%`, label: "constância média", mesh: "mist" as const, color: "#c67518" },
    { value: String((appts ?? []).length), label: "consultas hoje", mesh: "fresh" as const, color: "var(--color-text)" },
  ];

  const KIND_BADGE: Record<string, "warm" | "cool" | "accent" | "neutral"> = {
    refeição: "warm",
    humor: "cool",
    sono: "cool",
    avaliação: "accent",
    água: "neutral",
    mente: "cool",
  };

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 14, color: "var(--color-text-muted)" }}>{todayLabel(today)}</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 28, letterSpacing: "-0.03em", marginTop: 2 }}>
          oi, {pro.short_name ?? pro.name}.
        </div>
        <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 4 }}>
          {alerts.length > 0
            ? `você tem ${alerts.length} ${alerts.length === 1 ? copy.pessoa : copy.pessoas} pedindo atenção e ${(appts ?? []).length} consultas hoje.`
            : `tudo em dia por aqui. ${(appts ?? []).length} consultas hoje.`}
        </div>
      </div>

      {/* stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {stats.map((s) => (
          <Card key={s.label} style={{ position: "relative", overflow: "hidden", padding: 18 }}>
            <MeshAura mesh={s.mesh} size={90} blur={24} opacity={0.5} style={{ top: -24, right: -24 }} />
            <div style={{ position: "relative", fontFamily: "var(--font-data)", fontWeight: 900, fontSize: 30, letterSpacing: "-0.03em", color: s.color, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ position: "relative", fontSize: 13, color: "var(--color-text-muted)", marginTop: 6 }}>
              {s.label}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        {/* precisam de você */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>
              precisam de você
            </span>
            {alerts.length > 0 && <Badge variant="error">{alerts.length}</Badge>}
          </div>
          {alerts.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--color-text-muted)", padding: "12px 0" }}>
              ninguém sumido. seus {copy.pessoas} estão no ritmo.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {alerts.map((p) => (
                <Link key={p.id} href={`/pro/pacientes/${p.id}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: `1px solid ${p.status === "sumindo" ? "rgba(239,68,68,0.24)" : "rgba(254,175,76,0.30)"}`,
                      background: p.status === "sumindo" ? "rgba(239,68,68,0.05)" : "rgba(254,175,76,0.07)",
                    }}
                  >
                    <InitialAvatar initial={p.initial} mesh={meshFor(p.id)} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)" }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                        último registro: {p.lastLabel} · constância {p.adherence}%
                      </div>
                    </div>
                    <Badge variant={STATUS_BADGE[p.status]} dot>
                      {p.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* check-ins de hoje */}
        <Card>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>
            check-ins de hoje
          </div>
          {(events ?? []).length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--color-text-muted)", padding: "12px 0" }}>
              nada ainda hoje. os registros dos seus {copy.pessoas} aparecem aqui em tempo real.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(events ?? []).slice(0, 6).map((e, i) => {
                const p = byId.get(e.patient_id);
                return (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <InitialAvatar initial={p?.initial ?? "?"} mesh={meshFor(e.patient_id)} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{p?.name ?? copy.pessoa}</span>
                        <Badge variant={KIND_BADGE[e.kind] ?? "neutral"}>{e.kind}</Badge>
                        <span style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--color-text-muted)", marginLeft: "auto" }}>
                          {timeHM(e.at)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--color-text-secondary)", marginTop: 2, lineHeight: 1.4 }}>
                        {e.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* agenda de hoje */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>agenda de hoje</span>
            <Link href="/pro/agenda" style={{ fontSize: 12, fontWeight: 600, color: "var(--color-orange)", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
              ver tudo <IconChevronRight size={13} />
            </Link>
          </div>
          {(appts ?? []).length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--color-text-muted)", padding: "12px 0" }}>
              agenda livre hoje.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(appts ?? []).map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 14, color: "var(--color-orange)", width: 46 }}>
                    {timeHM(a.scheduled_at)}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {(a.patient as { name?: string } | null)?.name ?? copy.pessoa}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                      {a.type} · {a.duration_min}min
                    </div>
                  </div>
                  <Badge variant={a.mode === "online" ? "cool" : "warm"}>{a.mode}</Badge>
                  {a.status === "requested" && <Badge variant="accent" dot>pendente</Badge>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
