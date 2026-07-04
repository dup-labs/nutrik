import Link from "next/link";
import { Card, InitialAvatar } from "@/components/ui";
import { IconChevronRight } from "@/components/ui/icons";
import { relativeLabel } from "@/lib/dates";
import { PRO_COPY } from "@/lib/pro/copy";
import { getProContext, getProPatients } from "@/lib/pro/queries";
import { meshFor } from "@/lib/pro/shared";

export const dynamic = "force-dynamic";

export default async function ProMensagensPage() {
  const { supabase, pro } = await getProContext();
  const copy = PRO_COPY[pro.type];
  const patients = await getProPatients(supabase, pro.id);

  const { data: messages } = await supabase
    .from("messages")
    .select("patient_id, sender, body, created_at, read_at")
    .eq("professional_id", pro.id)
    .order("created_at", { ascending: false })
    .limit(300);

  const lastByPatient = new Map<string, { body: string; at: string; fromPatient: boolean }>();
  const unreadByPatient = new Map<string, number>();
  for (const m of messages ?? []) {
    if (!lastByPatient.has(m.patient_id))
      lastByPatient.set(m.patient_id, {
        body: m.body,
        at: m.created_at,
        fromPatient: m.sender === "patient",
      });
    if (m.sender === "patient" && !m.read_at)
      unreadByPatient.set(m.patient_id, (unreadByPatient.get(m.patient_id) ?? 0) + 1);
  }

  const conversations = patients
    .map((p) => ({
      patient: p,
      last: lastByPatient.get(p.id) ?? null,
      unread: unreadByPatient.get(p.id) ?? 0,
    }))
    .sort((a, b) => (b.last?.at ?? "").localeCompare(a.last?.at ?? ""));

  return (
    <div style={{ padding: "28px 24px", maxWidth: 700, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 26, letterSpacing: "-0.03em" }}>
          mensagens
        </div>
        <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
          conversas com seus {copy.pessoas}.
        </div>
      </div>

      {conversations.length === 0 ? (
        <Card style={{ padding: "32px 22px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>
            nenhuma conversa ainda.
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 6 }}>
            quando alguém se vincular a você, o chat aparece aqui.
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {conversations.map(({ patient, last, unread }) => (
            <Link key={patient.id} href={`/pro/mensagens/${patient.id}`} style={{ textDecoration: "none" }}>
              <Card style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}>
                <InitialAvatar initial={patient.initial} mesh={meshFor(patient.id)} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: unread ? 700 : 600, color: "var(--color-text)" }}>
                      {patient.name}
                    </span>
                    {last && (
                      <span style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--color-text-muted)", marginLeft: "auto" }}>
                        {relativeLabel(last.at)}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: unread ? "var(--color-text)" : "var(--color-text-muted)",
                      fontWeight: unread ? 600 : 400,
                      marginTop: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {last ? `${last.fromPatient ? "" : "você: "}${last.body}` : "sem mensagens ainda — puxa assunto."}
                  </div>
                </div>
                {unread > 0 && (
                  <span style={{ minWidth: 20, height: 20, padding: "0 6px", borderRadius: 99, background: "var(--color-orange)", color: "#fff", fontFamily: "var(--font-data)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {unread}
                  </span>
                )}
                <IconChevronRight size={18} color="var(--color-text-muted)" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
