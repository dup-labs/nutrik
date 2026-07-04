import { BackHeader, Card } from "@/components/ui";
import { addDays, localDateISO, weekStart } from "@/lib/dates";
import { getActivityDates, getPatientContext } from "@/lib/queries";
import { Heatmap } from "./Heatmap";

export const dynamic = "force-dynamic";

export default async function EvolucaoPage() {
  const { supabase, user } = await getPatientContext();
  const today = localDateISO();
  const activity = await getActivityDates(supabase, user.id);
  const byDate = new Map(activity.map((a) => [a.date, a.entries]));

  // barras: últimas 4 semanas — % de dias com registro
  const thisMonday = weekStart(today);
  const weekBars = [3, 2, 1, 0].map((back) => {
    const start = addDays(thisMonday, -7 * back);
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i)).filter(
      (d) => d <= today,
    );
    const active = days.filter((d) => byDate.has(d)).length;
    return {
      label: back === 0 ? "essa sem" : `sem -${back}`,
      pct: days.length ? Math.round((active / days.length) * 100) : 0,
    };
  });

  return (
    <div style={{ padding: "24px 20px 28px" }}>
      <BackHeader
        href="/progresso"
        title="sua evolução"
        subtitle="cada quadradinho é um dia que você apareceu."
      />

      <Card style={{ padding: "16px 14px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 12 }}>
          consistência no ano
        </div>
        <Heatmap
          year={Number(today.slice(0, 4))}
          today={today}
          activity={Object.fromEntries(byDate)}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 6,
            marginTop: 8,
          }}
        >
          <span style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--color-text-muted)" }}>
            menos
          </span>
          {[
            "rgba(27,28,29,0.05)",
            "rgba(254,175,76,0.38)",
            "rgba(254,143,60,0.62)",
            "rgba(254,95,51,0.92)",
          ].map((c) => (
            <span key={c} style={{ width: 11, height: 11, borderRadius: 3, background: c }} />
          ))}
          <span style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--color-text-muted)" }}>
            mais
          </span>
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 14 }}>
          constância nas últimas semanas
        </div>
        <svg width="100%" viewBox="0 0 320 96" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fe8f3c" />
              <stop offset="100%" stopColor="#feaf4c" />
            </linearGradient>
          </defs>
          {weekBars.map((d, i) => {
            const bh = Math.round((d.pct / 100) * 70);
            const x = 8 + i * 72;
            return (
              <g key={i}>
                <rect x={x} y={78 - bh} width={46} height={Math.max(bh, 2)} rx={6} fill="url(#barG)" />
                <text
                  x={x + 23}
                  y={74 - bh}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="var(--font-data)"
                  fontWeight={700}
                  fill="var(--color-text)"
                >
                  {d.pct}%
                </text>
                <text
                  x={x + 23}
                  y={93}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--color-text-muted)"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </Card>
    </div>
  );
}
