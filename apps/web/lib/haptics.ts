import { nativePlugin } from "./native";

export type HapticKind = "light" | "medium" | "success" | "warning";

interface HapticsPlugin {
  impact(opts: { style: "LIGHT" | "MEDIUM" | "HEAVY" }): Promise<void>;
  notification(opts: { type: "SUCCESS" | "WARNING" | "ERROR" }): Promise<void>;
}

// Feedback tátil. No-op na web e em qualquer falha (nunca quebra o fluxo).
export function haptic(kind: HapticKind = "light"): void {
  const h = nativePlugin<HapticsPlugin>("Haptics");
  if (!h) return;
  try {
    const p =
      kind === "light"
        ? h.impact({ style: "LIGHT" })
        : kind === "medium"
          ? h.impact({ style: "MEDIUM" })
          : kind === "success"
            ? h.notification({ type: "SUCCESS" })
            : h.notification({ type: "WARNING" });
    p.catch(() => {});
  } catch {
    /* plugin ausente na casca */
  }
}
