const MO = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const INTENSITY = [
  "rgba(27,28,29,0.05)",
  "rgba(254,175,76,0.38)",
  "rgba(254,143,60,0.62)",
  "rgba(254,95,51,0.92)",
];

export function Heatmap({
  year,
  today,
  activity,
}: {
  year: number;
  today: string;
  activity: Record<string, number>;
}) {
  const cell = 11;
  const gap = 3;

  const days: (string | null)[] = [];
  const jan1Dow = new Date(year, 0, 1).getDay();
  for (let i = 0; i < jan1Dow; i++) days.push(null);
  for (let m = 0; m < 12; m++) {
    const dim = new Date(year, m + 1, 0).getDate();
    for (let d = 1; d <= dim; d++)
      days.push(
        `${year}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      );
  }
  const cols: (string | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    const col = days.slice(i, i + 7);
    while (col.length < 7) col.push(null);
    cols.push(col);
  }

  const moPos: Record<number, string> = {};
  let last = -1;
  cols.forEach((wk, wi) => {
    const f = wk.find((x) => x);
    if (f) {
      const m = Number(f.split("-")[1]) - 1;
      if (m !== last) {
        moPos[wi] = MO[m];
        last = m;
      }
    }
  });

  function level(d: string): number {
    if (d > today) return -1;
    const e = activity[d] ?? 0;
    if (e === 0) return 0;
    if (e <= 2) return 1;
    if (e <= 4) return 2;
    return 3;
  }

  return (
    <div className="ntrk-scroll" style={{ overflowX: "auto", paddingBottom: 4 }}>
      <div style={{ minWidth: "max-content" }}>
        <div style={{ display: "flex", gap, height: 14, marginBottom: 3 }}>
          {cols.map((_, wi) => (
            <div key={wi} style={{ width: cell, flexShrink: 0 }}>
              {moPos[wi] && (
                <span
                  style={{
                    fontFamily: "var(--font-data)",
                    fontSize: 9,
                    color: "var(--color-text-muted)",
                  }}
                >
                  {moPos[wi]}
                </span>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap }}>
          {cols.map((wk, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap }}>
              {wk.map((d, di) => {
                if (!d) return <div key={di} style={{ width: cell, height: cell }} />;
                const lv = level(d);
                return (
                  <div
                    key={di}
                    title={d}
                    style={{
                      width: cell,
                      height: cell,
                      borderRadius: 3,
                      flexShrink: 0,
                      background: lv < 0 ? "transparent" : INTENSITY[lv],
                      border: d === today ? "1.5px solid var(--color-orange)" : "none",
                      boxSizing: "border-box",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
