// Datas locais (America/Sao_Paulo é o fuso do público-alvo; usamos a data
// local do dispositivo — o dia do usuário é o dia que ele vive).

export function localDateISO(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d + days);
  return localDateISO(dt);
}

/** dia da semana 0=dom..6=sáb de uma data ISO local */
export function dayOfWeek(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

const WEEKDAYS_SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const WEEKDAYS_LONG = [
  "domingo",
  "segunda",
  "terça",
  "quarta",
  "quinta",
  "sexta",
  "sábado",
];
const MONTHS_SHORT = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

export function weekdayShort(iso: string): string {
  return WEEKDAYS_SHORT[dayOfWeek(iso)];
}

export function weekdayLong(iso: string): string {
  return WEEKDAYS_LONG[dayOfWeek(iso)];
}

export function monthShort(iso: string): string {
  return MONTHS_SHORT[Number(iso.split("-")[1]) - 1];
}

export function dayNumber(iso: string): string {
  return String(Number(iso.split("-")[2]));
}

/** "quinta, 3 de julho" */
export function todayLabel(iso: string = localDateISO()): string {
  const MONTHS_LONG = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  const [, m, d] = iso.split("-").map(Number);
  return `${weekdayLong(iso)}, ${d} de ${MONTHS_LONG[m - 1]}`;
}

/** segunda-feira da semana de `iso` */
export function weekStart(iso: string): string {
  const dow = dayOfWeek(iso);
  return addDays(iso, dow === 0 ? -6 : 1 - dow);
}

/** os 7 dias (seg→dom) da semana de `iso` */
export function weekDays(iso: string): string[] {
  const start = weekStart(iso);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function timeHM(ts: string): string {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** "hoje, 09:12" · "ontem, 14:22" · "28 jun" */
export function relativeLabel(ts: string): string {
  const today = localDateISO();
  const dayISO = localDateISO(new Date(ts));
  if (dayISO === today) return `hoje, ${timeHM(ts)}`;
  if (dayISO === addDays(today, -1)) return `ontem, ${timeHM(ts)}`;
  return `${dayNumber(dayISO)} ${monthShort(dayISO)}`;
}
