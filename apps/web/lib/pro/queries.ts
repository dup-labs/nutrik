import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { getProBillingState } from "@/lib/billing/queries";
import { addDays, localDateISO } from "@/lib/dates";
import { currentStreak } from "@/lib/streak";
import type { Profile } from "@/lib/types";

import { meshFor, type PatientStatus, type ProPatient } from "@/lib/pro/shared";
export { meshFor, STATUS_BADGE, type PatientStatus, type ProPatient } from "@/lib/pro/shared";

/**
 * contexto de toda tela do painel: usuário precisa ter perfil profissional
 * E acesso vigente (trial, assinatura em dia ou isenção) — senão cai na
 * página de assinatura. A própria /pro/assinatura usa getProBillingState.
 */
export const getProContext = cache(async () => {
  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect("/pro/cadastro");

  const billing = await getProBillingState();
  if (!billing) redirect("/pro/cadastro");
  if (!billing.entitlement.ok) redirect("/pro/assinatura");

  return { supabase, user, pro: billing.pro };
});

function lastLabel(daysAgo: number | null): string {
  if (daysAgo === null) return "sem registro";
  if (daysAgo <= 0) return "hoje";
  if (daysAgo === 1) return "ontem";
  return `${daysAgo} dias`;
}

/** pacientes vinculados + métricas computadas (streak, aderência 28d, status) */
export async function getProPatients(
  supabase: Awaited<ReturnType<typeof createClient>>,
  professionalId: string,
): Promise<ProPatient[]> {
  const { data: links } = await supabase
    .from("patient_professional_links")
    .select("patient_id, linked_at, patient:profiles(id, name, created_at)")
    .eq("professional_id", professionalId)
    .eq("status", "active");
  if (!links || links.length === 0) return [];

  const ids = links.map((l) => l.patient_id);
  const today = localDateISO();
  const from = addDays(today, -27);

  const { data: activity } = await supabase
    .from("daily_activity")
    .select("patient_id, date")
    .in("patient_id", ids);

  const byPatient = new Map<string, string[]>();
  for (const a of activity ?? []) {
    const arr = byPatient.get(a.patient_id) ?? [];
    arr.push(a.date);
    byPatient.set(a.patient_id, arr);
  }

  return links
    .map((l) => {
      const patient = l.patient as unknown as Profile & { created_at: string };
      const dates = byPatient.get(l.patient_id) ?? [];
      const recent = dates.filter((d) => d >= from);
      const adherence = Math.round((recent.length / 28) * 100);
      const streak = currentStreak(dates, today);
      const last = dates.length ? dates.reduce((a, b) => (a > b ? a : b)) : null;
      const daysAgo = last
        ? Math.round(
            (new Date(today).getTime() - new Date(last).getTime()) / 86400000,
          )
        : null;
      const status: PatientStatus =
        daysAgo !== null && daysAgo <= 1 && adherence >= 50
          ? "em dia"
          : daysAgo !== null && daysAgo <= 4
            ? "atenção"
            : "sumindo";
      return {
        id: l.patient_id,
        name: patient?.name ?? "paciente",
        initial: (patient?.name ?? "?")[0]?.toUpperCase(),
        since: String(l.linked_at).slice(0, 10),
        streak,
        adherence,
        lastActivity: last,
        lastLabel: lastLabel(daysAgo),
        status,
      };
    })
    .sort((a, b) => b.adherence - a.adherence);
}
