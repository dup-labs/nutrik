// Resolução de papel pós-auth. O papel viaja nos metadados do usuário
// (definidos no signUp), sobrevivendo ao round-trip do email de confirmação:
//   role: 'patient' | 'pro'
//   patient → name, objective, invite_code?
//   pro     → name, pro_type ('nutri'|'personal'), reg_code?

import type { User } from "@supabase/supabase-js";
import type { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export function generateInviteCode(name: string): string {
  const initials = name
    .replace(/^Dra?\. /i, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 2)
    .padEnd(2, "X");
  const rand = Array.from({ length: 2 }, () =>
    "23456789ABCDEFGHJKMNPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 31)),
  ).join("");
  return `NUTRK-${initials}${rand}`;
}

/** cria a linha de professional a partir dos metadados; true se criou/já existe */
export async function ensureProfessionalFromMetadata(
  supabase: Supabase,
  user: User,
): Promise<boolean> {
  const meta = (user.user_metadata ?? {}) as {
    role?: string;
    name?: string;
    pro_type?: string;
    reg_code?: string;
  };
  if (meta.role !== "pro" || !meta.name) return false;
  if (meta.pro_type !== "nutri" && meta.pro_type !== "personal") return false;

  const shortName = meta.name.replace(/^Dra?\. /i, "").split(" ")[0];
  for (let attempt = 0; attempt < 5; attempt++) {
    const { error } = await supabase.from("professionals").insert({
      user_id: user.id,
      type: meta.pro_type,
      name: meta.name.trim(),
      short_name: shortName,
      reg_code: meta.reg_code || null,
      email: user.email,
      invite_code: generateInviteCode(meta.name),
    });
    if (!error) return true;
    // user_id duplicado = já existe → ok; invite_code duplicado → tenta outro
    if (error.message.includes("professionals_user_id_key")) return true;
    if (!error.message.includes("duplicate")) return false;
  }
  return false;
}

/** cria o perfil de paciente (+ vínculo por convite) a partir dos metadados */
export async function ensurePatientFromMetadata(
  supabase: Supabase,
  user: User,
): Promise<boolean> {
  const meta = (user.user_metadata ?? {}) as {
    role?: string;
    name?: string;
    objective?: string;
    invite_code?: string;
  };
  if (meta.role !== "patient" || !meta.name) return false;

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    name: meta.name.trim(),
    objective: meta.objective ?? null,
    email: user.email ?? null,
  });
  if (error) return false;

  if (meta.invite_code) {
    const { data: pro } = await supabase
      .from("professionals")
      .select("id, type")
      .eq("invite_code", meta.invite_code.trim().toUpperCase())
      .maybeSingle();
    if (pro) {
      await supabase.from("patient_professional_links").insert({
        patient_id: user.id,
        professional_id: pro.id,
        professional_type: pro.type,
      });
    }
  }
  return true;
}

/**
 * Para onde mandar um usuário autenticado — o cérebro das duas jornadas.
 *   pro (linha ou metadado) → /pro · /pro/cadastro (falta completar)
 *   paciente → / · /anamnese (onboarding) · /cadastro?completar=1 (sem dados)
 */
export async function resolveDestination(
  supabase: Supabase,
  user: User,
  flowHint?: string | null,
): Promise<string> {
  const { data: pro } = await supabase
    .from("professionals")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (pro) return "/pro";

  const meta = (user.user_metadata ?? {}) as { role?: string };
  if (meta.role === "pro") {
    const created = await ensureProfessionalFromMetadata(supabase, user);
    return created ? "/pro" : "/pro/cadastro";
  }
  if (flowHint === "pro") return "/pro/cadastro"; // ex.: Google no fluxo pro

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, onboarding_completed_at")
    .eq("id", user.id)
    .maybeSingle();
  if (profile) return profile.onboarding_completed_at ? "/" : "/anamnese";

  const created = await ensurePatientFromMetadata(supabase, user);
  return created ? "/anamnese" : "/cadastro?completar=1";
}
