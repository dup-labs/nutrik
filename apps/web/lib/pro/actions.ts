"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/pro/cadastro");
  return { supabase, user };
}

async function requirePro() {
  const { supabase, user } = await requireUser();
  const { data: pro } = await supabase
    .from("professionals")
    .select("id, type, name, short_name")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!pro) redirect("/pro/cadastro");
  return { supabase, user, pro };
}

function generateInviteCode(name: string): string {
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

export async function createProfessionalProfile(input: {
  name: string;
  type: "nutri" | "personal";
  regCode?: string;
  clinic?: string;
  phone?: string;
  bio?: string;
}): Promise<{ ok: boolean; error?: string; inviteCode?: string }> {
  const { supabase, user } = await requireUser();

  const { data: existing } = await supabase
    .from("professionals")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) return { ok: true };

  const shortName = input.name.replace(/^Dra?\. /i, "").split(" ")[0];

  // tenta até achar um código livre
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateInviteCode(input.name);
    const { error } = await supabase.from("professionals").insert({
      user_id: user.id,
      type: input.type,
      name: input.name.trim(),
      short_name: shortName,
      reg_code: input.regCode || null,
      clinic: input.clinic || null,
      phone: input.phone || null,
      email: user.email,
      bio: input.bio || null,
      invite_code: code,
    });
    if (!error) return { ok: true, inviteCode: code };
    if (!error.message.includes("duplicate")) {
      return { ok: false, error: "não conseguimos criar seu perfil agora. tenta de novo?" };
    }
  }
  return { ok: false, error: "não conseguimos gerar seu código. tenta de novo?" };
}

export async function updateProfessionalProfile(input: {
  name?: string;
  regCode?: string;
  clinic?: string;
  phone?: string;
  bio?: string;
  tags?: string[];
}) {
  const { supabase, pro } = await requirePro();
  await supabase
    .from("professionals")
    .update({
      ...(input.name ? { name: input.name.trim() } : {}),
      reg_code: input.regCode ?? undefined,
      clinic: input.clinic ?? undefined,
      phone: input.phone ?? undefined,
      bio: input.bio ?? undefined,
      tags: input.tags ?? undefined,
    })
    .eq("id", pro.id);
  revalidatePath("/pro", "layout");
}

export async function proSendMessage(input: { patientId: string; body: string }) {
  const { supabase, pro } = await requirePro();
  await supabase.from("messages").insert({
    patient_id: input.patientId,
    professional_id: pro.id,
    sender: "professional",
    body: input.body,
  });
}

export async function addInternalNote(input: { patientId: string; body: string }) {
  const { supabase, pro } = await requirePro();
  await supabase.from("internal_notes").insert({
    patient_id: input.patientId,
    author_professional_id: pro.id,
    body: input.body,
  });
  revalidatePath(`/pro/pacientes/${input.patientId}`);
}

export async function savePatientDetails(input: {
  patientId: string;
  objetivo: string;
  rotina: string;
  restricoes: string[];
  historico: string;
  sintomas: string[];
  resolvidos: string[];
}) {
  const { supabase } = await requirePro();
  await supabase.from("patient_details").upsert({
    patient_id: input.patientId,
    objetivo: input.objetivo || null,
    rotina: input.rotina || null,
    restricoes: input.restricoes,
    historico: input.historico || null,
    sintomas: input.sintomas,
    resolvidos: input.resolvidos,
    updated_at: new Date().toISOString(),
  });
  revalidatePath(`/pro/pacientes/${input.patientId}`);
}

export async function respondAppointment(input: {
  appointmentId: string;
  status: "confirmed" | "declined";
}) {
  const { supabase, pro } = await requirePro();
  await supabase
    .from("appointments")
    .update({ status: input.status })
    .eq("id", input.appointmentId)
    .eq("professional_id", pro.id);
  revalidatePath("/pro/agenda");
}

export async function notifyPatient(input: {
  patientId: string;
  type: "protocolo" | "mensagem" | "resultado" | "consulta";
  title: string;
  body?: string;
}) {
  const { supabase, pro } = await requirePro();
  await supabase.from("notifications").insert({
    patient_id: input.patientId,
    professional_id: pro.id,
    type: input.type,
    title: input.title,
    body: input.body ?? null,
  });
}
