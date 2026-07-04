import Link from "next/link";
import { BackHeader, Card } from "@/components/ui";
import { IconCalendar } from "@/components/ui/icons";
import { dayNumber, monthShort, timeHM } from "@/lib/dates";
import { getAppointments, getPatientContext } from "@/lib/queries";
import { PRO_ACCENT } from "@/lib/types";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  primeira: "1ª consulta",
  retorno: "retorno",
  avaliacao: "avaliação",
  checkin: "check-in",
};

export default async function ConsultasPage() {
  const { supabase, user, links } = await getPatientContext();
  const appts = await getAppointments(supabase, user.id);

  return (
    <div style={{ padding: "24px 20px 28px" }}>
      <BackHeader href="/perfil" title="suas consultas" subtitle="o que vem pela frente." />

      {links.length === 0 ? (
        <Card style={{ padding: "32px 22px", textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>
            sem profissional vinculado.
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 6, lineHeight: 1.5 }}>
            consultas aparecem aqui quando você vincular um nutri ou personal.
          </div>
          <Link
            href="/perfil/vincular"
            style={{
              display: "inline-flex",
              marginTop: 16,
              height: 40,
              padding: "0 20px",
              borderRadius: "var(--radius-pill)",
              background: "var(--color-orange)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            vincular agora
          </Link>
        </Card>
      ) : (
        <>
          {appts.length === 0 ? (
            <Card style={{ padding: "28px 22px", textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>
                nada agendado por enquanto.
              </div>
              <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 6 }}>
                que tal marcar um horário?
              </div>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              {appts.map((a) => {
                const acc = PRO_ACCENT[a.professional.type];
                const dateISO = String(a.scheduled_at).slice(0, 10);
                const pending = a.status === "requested";
                return (
                  <Card
                    key={a.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "var(--radius-md)",
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        background: acc.bg,
                        border: acc.border,
                      }}
                    >
                      <span style={{ fontFamily: "var(--font-data)", fontWeight: 700, fontSize: 16, lineHeight: 1, color: acc.accent }}>
                        {dayNumber(dateISO)}
                      </span>
                      <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", color: acc.accent }}>
                        {monthShort(dateISO)}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, textTransform: "capitalize" }}>
                        {TYPE_LABEL[a.type] ?? a.type}
                        {pending && (
                          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-muted)" }}>
                            {" "}
                            · aguardando confirmação
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2 }}>
                        <span style={{ fontFamily: "var(--font-data)", fontSize: 13, color: acc.accent }}>
                          {timeHM(a.scheduled_at)}
                        </span>
                        <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                          {a.professional.short_name ?? a.professional.name}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        height: 26,
                        padding: "0 10px",
                        borderRadius: "var(--radius-pill)",
                        background: acc.soft,
                      }}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: acc.accent }} />
                      <span style={{ fontSize: 11, color: acc.accent }}>
                        {a.professional.type === "nutri" ? "nutri" : "personal"}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <Link href="/consultas/agendar" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "100%",
                height: 54,
                borderRadius: "var(--radius-pill)",
                background: "var(--color-orange)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 16,
                boxShadow: "0 4px 16px rgba(254,95,51,0.24)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <IconCalendar size={18} /> solicitar agendamento
            </div>
          </Link>
        </>
      )}
    </div>
  );
}
