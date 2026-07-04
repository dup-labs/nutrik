import { addDays, localDateISO } from "@/lib/dates";

/** streak atual: dias consecutivos com atividade, terminando hoje ou ontem */
export function currentStreak(activityDates: string[], today = localDateISO()): number {
  const set = new Set(activityDates);
  let cursor = set.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (set.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** melhor sequência histórica */
export function bestStreak(activityDates: string[]): number {
  const set = new Set(activityDates);
  let best = 0;
  for (const d of set) {
    if (set.has(addDays(d, -1))) continue; // não é início de sequência
    let len = 1;
    let cursor = addDays(d, 1);
    while (set.has(cursor)) {
      len++;
      cursor = addDays(cursor, 1);
    }
    best = Math.max(best, len);
  }
  return best;
}

/** semanas distintas com pelo menos um registro */
export function weeksTracked(activityDates: string[]): number {
  const weeks = new Set<string>();
  for (const d of activityDates) {
    const [y, m, day] = d.split("-").map(Number);
    const dt = new Date(y, m - 1, day);
    const dow = dt.getDay();
    const monday = new Date(y, m - 1, day - (dow === 0 ? 6 : dow - 1));
    weeks.add(localDateISO(monday));
  }
  return weeks.size;
}
