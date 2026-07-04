// Partes client-safe do domínio pro (importáveis de client components).

export type PatientStatus = "em dia" | "atenção" | "sumindo";

export interface ProPatient {
  id: string;
  name: string;
  initial: string;
  since: string;
  streak: number;
  adherence: number;
  lastActivity: string | null;
  lastLabel: string;
  status: PatientStatus;
}

const MESHES = ["var(--mesh-warm)", "var(--mesh-cool)", "var(--mesh-mist)", "var(--mesh-fresh)"];
export function meshFor(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return MESHES[h % MESHES.length];
}

export const STATUS_BADGE: Record<PatientStatus, "success" | "warm" | "error"> = {
  "em dia": "success",
  atenção: "warm",
  sumindo: "error",
};
