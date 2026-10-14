// Tipos e textos compartilhados da moderação (server + client).

export const REPORT_REASONS = [
  { key: "assedio", label: "assédio ou ameaça", hint: "perseguição, intimidação, ameaça" },
  { key: "ofensivo", label: "conteúdo ofensivo", hint: "ódio, conteúdo sexual, violência" },
  { key: "spam", label: "spam", hint: "propaganda, golpe, mensagem repetida" },
  { key: "outro", label: "outro motivo", hint: "conta pra gente com suas palavras" },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]["key"];

export const REPORT_REASON_KEYS: string[] = REPORT_REASONS.map((r) => r.key);

/** onde a mensagem mora */
export type MessageKind = "group" | "direct";

export type ModerationTarget =
  | { type: "group_message"; messageId: string; groupId: string }
  | { type: "direct_message"; messageId: string }
  | { type: "member"; userId: string; groupId?: string };

export type ModerationResult = { ok: boolean; error?: string };
