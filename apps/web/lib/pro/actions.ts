"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateInviteCode } from "@/lib/roles";
import { sendEmail } from "@/lib/email";

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
  const { data: appt } = await supabase
    .from("appointments")
    .update({ status: input.status })
    .eq("id", input.appointmentId)
    .eq("professional_id", pro.id)
    .select("scheduled_at, patient:profiles(name, email)")
    .maybeSingle();
  if (input.status === "confirmed" && appt) {
    const patient = appt.patient as { name?: string; email?: string } | null;
    if (patient?.email) {
      const dt = new Date(appt.scheduled_at).toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      });
      await sendEmail({
        to: patient.email,
        subject: "consulta confirmada",
        heading: `confirmado, ${(patient.name ?? "").split(" ")[0]}.`,
        body: `${pro.name} confirmou sua consulta: ${dt}. te esperamos lá.`,
        ctaLabel: "ver minhas consultas",
        ctaUrl: "https://app.nutrk.io/consultas",
      });
    }
  }
  revalidatePath("/pro/agenda");
}

// ── publicação de planos ────────────────────────────────────

export interface PublishMeal {
  name: string;
  time: string;
  foods: { foodId: string; qty: number }[];
}

export async function publishMealPlan(input: {
  patientId: string;
  planByDay: Record<number, PublishMeal[]>;
}): Promise<{ ok: boolean; error?: string }> {
  const { supabase, pro } = await requirePro();
  if (pro.type !== "nutri") return { ok: false, error: "só o nutri publica plano alimentar." };

  const { data: foods } = await supabase.from("foods").select("*");
  const foodById = new Map((foods ?? []).map((f) => [f.id, f]));

  // encerra protocolos alimentares ativos (solo ou anteriores)
  await supabase
    .from("meal_protocols")
    .update({ status: "ended", ends_on: new Date().toISOString().slice(0, 10) })
    .eq("patient_id", input.patientId)
    .eq("status", "active");

  const { data: protocol, error } = await supabase
    .from("meal_protocols")
    .insert({
      patient_id: input.patientId,
      created_by: pro.id,
      name: `plano da ${pro.short_name ?? "nutri"}`,
      plan_type: "pro",
    })
    .select("id")
    .single();
  if (error || !protocol) return { ok: false, error: "não conseguimos publicar agora." };

  for (const [dowStr, meals] of Object.entries(input.planByDay)) {
    const dow = Number(dowStr);
    for (let i = 0; i < meals.length; i++) {
      const meal = meals[i];
      const rows = meal.foods
        .map((f) => {
          const food = foodById.get(f.foodId);
          if (!food) return null;
          const k = f.qty / Number(food.base_qty || 1);
          return {
            food,
            qty: f.qty,
            p: Number(food.protein_g ?? 0) * k,
            c: Number(food.carbs_g ?? 0) * k,
            g: Number(food.fat_g ?? 0) * k,
            kcal: Number(food.kcal ?? 0) * k,
          };
        })
        .filter(Boolean) as {
        food: { id: string; name: string; unit: string };
        qty: number;
        p: number;
        c: number;
        g: number;
        kcal: number;
      }[];

      const description = rows
        .map((r) => `${r.food.name} (${r.qty}${r.food.unit === "un" || r.food.unit === "fatia" || r.food.unit === "dose" ? ` ${r.food.unit}` : r.food.unit})`)
        .join(", ");
      const sum = rows.reduce(
        (a, r) => ({ p: a.p + r.p, c: a.c + r.c, g: a.g + r.g, kcal: a.kcal + r.kcal }),
        { p: 0, c: 0, g: 0, kcal: 0 },
      );

      const { data: pm } = await supabase
        .from("protocol_meals")
        .insert({
          protocol_id: protocol.id,
          day_of_week: dow,
          name: meal.name,
          time: meal.time || null,
          description: description || meal.name,
          sort_order: i,
          kcal: Math.round(sum.kcal),
          protein_g: Math.round(sum.p),
          carbs_g: Math.round(sum.c),
          fat_g: Math.round(sum.g),
        })
        .select("id")
        .single();

      if (pm && rows.length > 0) {
        await supabase.from("protocol_meal_items").insert(
          rows.map((r) => ({
            protocol_meal_id: pm.id,
            food_id: r.food.id,
            name: r.food.name,
            qty: r.qty,
            unit: r.food.unit,
            protein_g: Math.round(r.p * 10) / 10,
            carbs_g: Math.round(r.c * 10) / 10,
            fat_g: Math.round(r.g * 10) / 10,
            kcal: Math.round(r.kcal),
          })),
        );
      }
    }
  }

  await notifyPatient({
    patientId: input.patientId,
    type: "protocolo",
    title: "plano alimentar novo no ar",
    body: `${pro.name} deu uma repaginada no seu plano. dá uma olhada quando puder.`,
  });
  const { data: patient } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", input.patientId)
    .maybeSingle();
  if (patient?.email) {
    await sendEmail({
      to: patient.email,
      subject: "seu plano alimentar novo tá no ar",
      heading: `oi, ${patient.name.split(" ")[0]}.`,
      body: `${pro.name} acabou de publicar seu novo plano alimentar. o convite é comer bem, no seu tempo.`,
      ctaLabel: "ver meu plano",
      ctaUrl: "https://app.nutrk.io/refeicoes",
    });
  }
  revalidatePath(`/pro/pacientes/${input.patientId}`);
  return { ok: true };
}

export interface PublishExercise {
  name: string;
  reps: string;
  videoUrl: string;
  series: string[]; // carga sugerida por série (ex.: "30 kg", "corpo livre")
}

export async function publishTrainingPlan(input: {
  patientId: string;
  week: Record<number, { name: string; rest: boolean; exercises: PublishExercise[] }>;
}): Promise<{ ok: boolean; error?: string }> {
  const { supabase, pro } = await requirePro();
  if (pro.type !== "personal") return { ok: false, error: "só o personal publica treino." };

  await supabase
    .from("training_protocols")
    .update({ status: "ended", ends_on: new Date().toISOString().slice(0, 10) })
    .eq("patient_id", input.patientId)
    .eq("status", "active");

  const { data: protocol, error } = await supabase
    .from("training_protocols")
    .insert({
      patient_id: input.patientId,
      created_by: pro.id,
      name: `treino do ${pro.short_name ?? "personal"}`,
      split_type: "pro",
    })
    .select("id")
    .single();
  if (error || !protocol) return { ok: false, error: "não conseguimos publicar agora." };

  for (const [dowStr, day] of Object.entries(input.week)) {
    const dow = Number(dowStr);
    const isRest = day.rest || day.exercises.length === 0;
    const { data: wd } = await supabase
      .from("workout_days")
      .insert({
        protocol_id: protocol.id,
        day_of_week: dow,
        name: isRest ? "descanso" : day.name || "treino",
        is_rest: isRest,
        est_minutes: isRest ? null : Math.max(30, day.exercises.length * 9),
      })
      .select("id")
      .single();

    if (wd && !isRest) {
      await supabase.from("workout_exercises").insert(
        day.exercises.map((e, i) => ({
          workout_day_id: wd.id,
          name: e.name,
          sets: Math.max(1, e.series.length),
          reps_label: e.reps || "10 reps",
          suggested_load: e.series.find((s) => s.trim()) ?? null,
          set_targets: e.series,
          video_url: e.videoUrl || null,
          sort_order: i,
        })),
      );
    }
  }

  await notifyPatient({
    patientId: input.patientId,
    type: "protocolo",
    title: "treino novo no ar",
    body: `${pro.name} montou sua nova semana de treino. bora?`,
  });
  const { data: patient } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", input.patientId)
    .maybeSingle();
  if (patient?.email) {
    await sendEmail({
      to: patient.email,
      subject: "sua nova semana de treino chegou",
      heading: `oi, ${patient.name.split(" ")[0]}.`,
      body: `${pro.name} montou sua nova semana de treino. movimento como prazer, não obrigação.`,
      ctaLabel: "ver meu treino",
      ctaUrl: "https://app.nutrk.io/treino",
    });
  }
  revalidatePath(`/pro/pacientes/${input.patientId}`);
  return { ok: true };
}

export async function addExerciseVideo(input: { name: string; url: string }) {
  const { supabase, pro } = await requirePro();
  await supabase.from("exercise_videos").insert({
    professional_id: pro.id,
    name: input.name,
    url: input.url,
  });
  revalidatePath("/pro", "layout");
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
