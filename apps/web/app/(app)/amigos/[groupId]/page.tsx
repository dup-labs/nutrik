import Link from "next/link";
import { redirect } from "next/navigation";
import { BackHeader, Card, InitialAvatar } from "@/components/ui";
import { IconChat, IconGear } from "@/components/ui/icons";
import { getPatientContext } from "@/lib/queries";
import {
  getGroupRanking,
  getPendingRequests,
  type RankingPeriod,
} from "@/lib/social/queries";
import { groupMetrics } from "@/lib/types";
import { GroupInviteCard, PendingRequestsCard, LeaveGroupButton } from "./GroupClient";

export const dynamic = "force-dynamic";

const MESHES = ["var(--mesh-warm)", "var(--mesh-cool)", "var(--mesh-fresh)", "var(--mesh-mist)"];

const PILLARS = [
  { key: "dieta", label: "dieta", color: "#c67518" },
  { key: "treino", label: "treino", color: "#fe5f33" },
  { key: "agua", label: "água", color: "#2b93a8" },
  { key: "meditacao", label: "meditação", color: "#5a63c4" },
  { key: "sono", label: "sono", color: "#2f9e6b" },
] as const;

export default async function TurmaPage({
  params,
  searchParams,
}: {
  params: Promise<{ groupId: string }>;
  searchParams: Promise<{ p?: string }>;
}) {
  const { groupId } = await params;
  const { p } = await searchParams;
  const period: RankingPeriod = p === "geral" ? "geral" : "semana";

  const { supabase, user } = await getPatientContext();
  const ranking = await getGroupRanking(supabase, groupId, period, user.id);
  if (!ranking) redirect("/amigos");

  const { group, entries } = ranking;
  const isOwner = group.owner_id === user.id;
  const requests = isOwner ? await getPendingRequests(supabase, groupId) : [];

  // só os pilares que esta turma pontua entram nos dots e na legenda
  const metrics = groupMetrics(group);
  const scoredPillars = PILLARS.filter((pl) => metrics.includes(pl.key));

  const iconBtn = {
    width: 38,
    height: 38,
    borderRadius: "50%",
    border: "1px solid var(--color-border)",
    background: "var(--color-surface-elevated)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--color-text-secondary)",
  } as const;

  return (
    <div style={{ padding: "24px 20px 28px", maxWidth: 680, margin: "0 auto" }}>
      <BackHeader
        href="/amigos"
        title={group.name}
        subtitle={`${entries.length} ${entries.length === 1 ? "pessoa" : "pessoas"} · ${
          group.join_policy === "open" ? "turma aberta" : "entrada com aprovação"
        }`}
        right={
          <div style={{ display: "flex", gap: 8 }}>
            <Link href={`/amigos/${group.id}/chat`} style={iconBtn} aria-label="chat da turma">
              <IconChat size={18} />
            </Link>
            {isOwner && (
              <Link href={`/amigos/${group.id}/gerenciar`} style={iconBtn} aria-label="gerenciar turma">
                <IconGear size={18} />
              </Link>
            )}
          </div>
        }
      />

      {isOwner && requests.length > 0 && <PendingRequestsCard requests={requests} />}

      {/* período */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {(
          [
            { key: "semana", label: "semana" },
            { key: "geral", label: "geral" },
          ] as const
        ).map((t) => {
          const active = period === t.key;
          return (
            <Link
              key={t.key}
              href={`/amigos/${group.id}${t.key === "geral" ? "?p=geral" : ""}`}
              style={{
                height: 32,
                padding: "0 16px",
                borderRadius: "var(--radius-pill)",
                border: active ? "none" : "1px solid var(--color-border-strong)",
                background: active ? "var(--color-orange)" : "var(--color-surface-elevated)",
                color: active ? "#fff" : "var(--color-text-secondary)",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* ranking */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {entries.map((e, i) => (
          <div
            key={e.profile.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "13px 15px",
              borderRadius: "var(--radius-lg)",
              background: e.isMe ? "var(--color-orange-subtle)" : "var(--color-surface-elevated)",
              border: e.isMe
                ? "1.5px solid var(--color-orange-dim)"
                : "1px solid var(--color-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontWeight: 700,
                fontSize: 14,
                color: i === 0 ? "var(--color-orange)" : "var(--color-text-muted)",
                width: 26,
                flexShrink: 0,
              }}
            >
              {i + 1}º
            </span>
            <InitialAvatar
              initial={(e.profile.name || "?")[0].toUpperCase()}
              mesh={MESHES[i % MESHES.length]}
              size={40}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: "var(--color-text)" }}>
                {e.profile.name.split(" ")[0]}
                {e.isMe && (
                  <span style={{ fontWeight: 500, color: "var(--color-text-muted)" }}> · você</span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                {e.profile.username && (
                  <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                    @{e.profile.username}
                  </span>
                )}
                {scoredPillars.filter((pl) => e.today?.[pl.key]).map((pl) => (
                  <span
                    key={pl.key}
                    title={`${pl.label} hoje`}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: pl.color,
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span
                style={{
                  fontFamily: "var(--font-data)",
                  fontWeight: 900,
                  fontSize: 18,
                  letterSpacing: "-0.02em",
                  color: "var(--color-text)",
                }}
              >
                {e.points}
              </span>
              <span style={{ fontSize: 11, color: "var(--color-text-muted)", marginLeft: 3 }}>
                pts
              </span>
            </div>
          </div>
        ))}
      </div>

      <Card style={{ padding: "12px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.6 }}>
          cada dia vale até {scoredPillars.length}{" "}
          {scoredPillars.length === 1 ? "ponto" : "pontos"} nesta turma:{" "}
          {scoredPillars.map((pl) => pl.label).join(", ")}.{" "}
          {isOwner
            ? "ajuste o que pontua em gerenciar turma."
            : "o dono escolhe o que pontua. pilar que você desligou também não conta."}
        </div>
      </Card>

      <GroupInviteCard groupId={group.id} code={group.code} />

      {!isOwner && <LeaveGroupButton groupId={group.id} />}
    </div>
  );
}
