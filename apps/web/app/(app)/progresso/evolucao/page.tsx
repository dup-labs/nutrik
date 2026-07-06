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

  // ritmo dos últimos 30 dias (registros por dia) pro gráfico de área
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = addDays(today, i - 29);
    return { date: d, value: byDate.get(d) ?? 0 };
  });

  // % de dias ativos nas últimas 4 semanas (chips)
  const thisMonday = weekStart(today);
  const weekBars = [3, 2, 1, 0].map((back) => {
    const start = addDays(thisMonday, -7 * back);
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i)).filter(
      (d) => d <= today,
    );
    const active = days.filter((d) => byDate.has(d)).length;
    return {
      label: back === 0 ? "essa semana" : `há ${back} sem`,
      pct: days.length ? Math.round((active / days.length) * 100) : 0,
    };
  });

  return (
    <div style={{ padding: "24px 20px 28px", maxWidth: 900, margin: "0 auto" }}>
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
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>
            seu ritmo · últimos 30 dias
          </span>
          <span style={{ fontSize: 11.5, color: "var(--color-text-muted)" }}>registros por dia</span>
        </div>
        <AreaChart data={last30} />
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          {weekBars.map((w) => (
            <div
              key={w.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: "var(--radius-pill)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{w.label}</span>
              <span
                style={{
                  fontFamily: "var(--font-data)",
                  fontWeight: 700,
                  fontSize: 14,
                  color: w.pct >= 70 ? "var(--color-orange)" : w.pct >= 40 ? "#c67518" : "var(--color-text-muted)",
                }}
              >
                {w.pct}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/** área suave com gradiente da marca — sem libs, só SVG */
function AreaChart({ data }: { data: { date: string; value: number }[] }) {
  const W = 640;
  const H = 160;
  const PAD = 8;
  const max = Math.max(4, ...data.map((d) => d.value));
  const pts = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: H - PAD - (d.value / max) * (H - PAD * 2 - 16),
  }));

  // curva suave: quadráticas pelos pontos médios
  let path = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const mx = (pts[i - 1].x + pts[i].x) / 2;
    const my = (pts[i - 1].y + pts[i].y) / 2;
    path += ` Q ${pts[i - 1].x} ${pts[i - 1].y} ${mx} ${my}`;
  }
  path += ` T ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
  const area = `${path} L ${pts[pts.length - 1].x} ${H - PAD} L ${pts[0].x} ${H - PAD} Z`;
  const last = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
      <defs>
        <linearGradient id="evoStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#feaf4c" />
          <stop offset="100%" stopColor="#fe5f33" />
        </linearGradient>
        <linearGradient id="evoFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(254,95,51,0.22)" />
          <stop offset="100%" stopColor="rgba(254,95,51,0)" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={PAD}
          x2={W - PAD}
          y1={H - PAD - f * (H - PAD * 2 - 16)}
          y2={H - PAD - f * (H - PAD * 2 - 16)}
          stroke="var(--color-border)"
          strokeDasharray="3 5"
        />
      ))}
      <path d={area} fill="url(#evoFill)" />
      <path d={path} fill="none" stroke="url(#evoStroke)" strokeWidth={3} strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r={6} fill="#fe5f33" stroke="#fff" strokeWidth={2.5} />
      <text x={PAD} y={H + 6} fontSize={10} fontFamily="var(--font-data)" fill="var(--color-text-muted)">
        {`${Number(data[0].date.slice(8, 10))}/${Number(data[0].date.slice(5, 7))}`}
      </text>
      <text x={W - PAD} y={H + 6} textAnchor="end" fontSize={10} fontFamily="var(--font-data)" fill="var(--color-text-muted)">
        hoje
      </text>
    </svg>
  );
}
