"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { PlanTemplate } from "@/lib/types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrada");
  return { supabase, user };
}

// ── Onboarding ──────────────────────────────────────────────

export async function completeCadastro(input: {
  name: string;
  objective: string;
  inviteCode?: string;
}): Promise<{ ok: boolean; linked?: boolean; error?: string }> {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    name: input.name.trim(),
    objective: input.objective,
    email: user.email ?? null,
  });
  if (error) return { ok: false, error: "não conseguimos salvar seu perfil." };

  let linked = false;
  const code = input.inviteCode?.trim().toUpperCase();
  if (code) {
    const { data: pro } = await supabase
      .from("professionals")
      .select("id, type")
      .eq("invite_code", code)
      .maybeSingle();
    if (!pro) return { ok: false, error: "código não encontrado. confere com seu profissional?" };
    const { error: linkErr } = await supabase
      .from("patient_professional_links")
      .insert({
        patient_id: user.id,
        professional_id: pro.id,
        professional_type: pro.type,
      });
    if (linkErr && !linkErr.message.includes("duplicate"))
      return { ok: false, error: "não conseguimos vincular o código agora." };
    linked = true;
  }
  return { ok: true, linked };
}

const OBJECTIVE_TO_MEAL_PLAN: Record<string, string> = {
  "me sentir melhor": "manter",
  "mais energia": "manter",
  "movimento e força": "crescer",
  "rotina mais leve": "secar",
};

// seg=push, ter=legs, qua=pull, qui=upper, sex=lower · sáb/dom descanso
const SOLO_WEEK: { dow: number; key: string | null }[] = [
  { dow: 1, key: "push" },
  { dow: 2, key: "legs" },
  { dow: 3, key: "pull" },
  { dow: 4, key: "upper" },
  { dow: 5, key: "lower" },
  { dow: 6, key: null },
  { dow: 0, key: null },
];

export async function instantiateSoloPlans(): Promise<{ ok: boolean }> {
  const { supabase, user } = await requireUser();

  // se já tem qualquer protocolo ativo, não duplica
  const { data: existing } = await supabase
    .from("meal_protocols")
    .select("id")
    .eq("patient_id", user.id)
    .eq("status", "active")
    .limit(1);
  if (existing && existing.length > 0) return { ok: true };

  const { data: profile } = await supabase
    .from("profiles")
    .select("objective")
    .eq("id", user.id)
    .single();

  const { data: templates } = await supabase
    .from("plan_templates")
    .select("*");
  if (!templates) return { ok: false };
  const byKey = new Map((templates as PlanTemplate[]).map((t) => [t.key, t]));

  // plano alimentar
  const mealKey = OBJECTIVE_TO_MEAL_PLAN[profile?.objective ?? ""] ?? "manter";
  const mealTpl = byKey.get(mealKey);
  if (mealTpl?.payload.meals) {
    const { data: mp } = await supabase
      .from("meal_protocols")
      .insert({
        patient_id: user.id,
        name: `plano ${mealTpl.name}`,
        plan_type: mealTpl.key,
      })
      .select("id")
      .single();
    if (mp) {
      await supabase.from("protocol_meals").insert(
        mealTpl.payload.meals.map((m, i) => ({
          protocol_id: mp.id,
          name: m.name,
          time: m.time,
          description: m.description,
          sort_order: i,
          kcal: m.mac?.kcal ?? null,
          protein_g: m.mac?.p ?? null,
          carbs_g: m.mac?.c ?? null,
          fat_g: m.mac?.g ?? null,
        })),
      );
    }
  }

  // plano de treino semanal
  const { data: tp } = await supabase
    .from("training_protocols")
    .insert({
      patient_id: user.id,
      name: "treino base solo",
      split_type: "solo",
    })
    .select("id")
    .single();
  if (tp) {
    for (const { dow, key } of SOLO_WEEK) {
      const tpl = key ? byKey.get(key) : null;
      const { data: day } = await supabase
        .from("workout_days")
        .insert({
          protocol_id: tp.id,
          day_of_week: dow,
          name: tpl ? tpl.name : "descanso",
          tags: tpl?.payload.tags ?? [],
          is_rest: !tpl,
          est_minutes: tpl?.payload.est_minutes ?? null,
        })
        .select("id")
        .single();
      if (day && tpl?.payload.exercises) {
        await supabase.from("workout_exercises").insert(
          tpl.payload.exercises.map((e, i) => ({
            workout_day_id: day.id,
            name: e.name,
            sets: e.sets,
            reps_label: e.reps_label,
            suggested_load: e.suggested_load ?? null,
            target_muscles: e.target_muscles ?? null,
            sort_order: i,
          })),
        );
      }
    }
  }
  return { ok: true };
}

export async function submitAnamnese(input: {
  wellbeing: number;
  energy: number;
  symptoms: string[];
  sleepQuality: number | null;
  notes: string;
}): Promise<{ ok: boolean }> {
  const { supabase, user } = await requireUser();

  await supabase.from("anamneses").insert({
    patient_id: user.id,
    kind: "onboarding",
    wellbeing: input.wellbeing,
    energy: input.energy,
    symptoms: input.symptoms,
    sleep_quality: input.sleepQuality,
    notes: input.notes || null,
  });

  // solo (sem vínculo ativo)? instancia os planos base
  const { data: links } = await supabase
    .from("patient_professional_links")
    .select("id")
    .eq("patient_id", user.id)
    .eq("status", "active")
    .limit(1);
  if (!links || links.length === 0) await instantiateSoloPlans();

  await supabase
    .from("profiles")
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq("id", user.id);

  revalidatePath("/", "layout");
  return { ok: true };
}

// ── Refeições ───────────────────────────────────────────────

export async function logMeal(input: {
  protocolMealId: string;
  date: string;
  status: "done" | "skipped";
  follow: "seguiu" | "adaptou" | null;
  note: string;
  photoPath: string | null;
}) {
  const { supabase, user } = await requireUser();
  await supabase.from("meal_logs").upsert(
    {
      patient_id: user.id,
      protocol_meal_id: input.protocolMealId,
      date: input.date,
      status: input.status,
      follow: input.status === "done" ? input.follow : null,
      note: input.note || null,
      photo_path: input.photoPath,
    },
    { onConflict: "patient_id,protocol_meal_id,date" },
  );
  revalidatePath("/refeicoes");
  revalidatePath("/");
}

export async function requestSubstitution(input: {
  protocolMealId: string;
  reason: string;
  suggestion: string;
}) {
  const { supabase, user } = await requireUser();
  await supabase.from("substitution_requests").insert({
    patient_id: user.id,
    protocol_meal_id: input.protocolMealId,
    reason: input.reason,
    suggestion: input.suggestion || null,
  });
  revalidatePath("/refeicoes");
}

// ── Treino ──────────────────────────────────────────────────

export async function saveSet(input: {
  exerciseId: string;
  date: string;
  setNumber: number;
  done: boolean;
  loadKg: number | null;
  noLoad: boolean;
}) {
  const { supabase, user } = await requireUser();
  await supabase.from("set_logs").upsert(
    {
      patient_id: user.id,
      exercise_id: input.exerciseId,
      date: input.date,
      set_number: input.setNumber,
      done: input.done,
      load_kg: input.noLoad ? null : input.loadKg,
      no_load: input.noLoad,
    },
    { onConflict: "patient_id,exercise_id,date,set_number" },
  );
}

export async function concludeWorkout(input: {
  workoutDayId: string;
  date: string;
}) {
  const { supabase, user } = await requireUser();
  await supabase.from("workout_sessions").upsert(
    {
      patient_id: user.id,
      workout_day_id: input.workoutDayId,
      date: input.date,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "patient_id,workout_day_id,date" },
  );
  await unlockAchievement("first_workout");
  revalidatePath("/treino");
  revalidatePath("/");
}

export async function requestWorkoutChange(input: {
  workoutDayId: string;
  fromLabel: string;
  toLabel: string;
  justification: string;
}) {
  const { supabase, user } = await requireUser();
  await supabase.from("workout_change_requests").insert({
    patient_id: user.id,
    workout_day_id: input.workoutDayId,
    from_label: input.fromLabel,
    to_label: input.toLabel || null,
    justification: input.justification,
  });
  revalidatePath("/treino");
}

// ── Água ────────────────────────────────────────────────────

export async function addWater(input: { date: string; amountMl: number }) {
  const { supabase, user } = await requireUser();
  await supabase.from("water_logs").insert({
    patient_id: user.id,
    date: input.date,
    amount_ml: input.amountMl,
  });

  const [{ data: setting }, { data: logs }] = await Promise.all([
    supabase.from("water_settings").select("daily_goal_ml").eq("patient_id", user.id).maybeSingle(),
    supabase.from("water_logs").select("amount_ml").eq("patient_id", user.id).eq("date", input.date),
  ]);
  const total = (logs ?? []).reduce((s, l) => s + l.amount_ml, 0);
  if (total >= (setting?.daily_goal_ml ?? 2000)) await unlockAchievement("hydration_day");

  revalidatePath("/agua");
  revalidatePath("/");
}

export async function setWaterGoal(goalMl: number) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("water_settings")
    .upsert({ patient_id: user.id, daily_goal_ml: goalMl });
  revalidatePath("/agua");
}

// ── Mente ───────────────────────────────────────────────────

export async function saveMood(input: {
  date: string;
  mood: string;
  tags: string[];
}) {
  const { supabase, user } = await requireUser();
  await supabase.from("mood_logs").upsert(
    { patient_id: user.id, date: input.date, mood: input.mood, tags: input.tags },
    { onConflict: "patient_id,date" },
  );
  revalidatePath("/mente");
  revalidatePath("/");
}

export async function saveSleep(input: {
  date: string;
  hours: number;
  quality: number;
  wakeMood: number;
}) {
  const { supabase, user } = await requireUser();
  await supabase.from("sleep_logs").upsert(
    {
      patient_id: user.id,
      date: input.date,
      hours: input.hours,
      quality: input.quality,
      wake_mood: input.wakeMood,
    },
    { onConflict: "patient_id,date" },
  );
  revalidatePath("/mente");
  revalidatePath("/");
}

export async function logBreath(input: { kind: "box" | "pausa"; durationS: number }) {
  const { supabase, user } = await requireUser();
  await supabase.from("breath_sessions").insert({
    patient_id: user.id,
    kind: input.kind,
    duration_s: input.durationS,
  });
  await unlockAchievement("first_breath");
  revalidatePath("/mente");
  revalidatePath("/");
}

// ── Check-in mensal ─────────────────────────────────────────

export async function saveCheckin(input: {
  bodyFeeling: number;
  energy: number;
  clothesFit: string | null;
  requestId?: string;
}) {
  const { supabase, user } = await requireUser();
  const { data: checkin } = await supabase
    .from("wellbeing_checkins")
    .insert({
      patient_id: user.id,
      body_feeling: input.bodyFeeling,
      energy: input.energy,
      clothes_fit: input.clothesFit,
    })
    .select("id")
    .single();

  if (input.requestId && checkin) {
    await supabase
      .from("checkin_requests")
      .update({
        status: "completed",
        checkin_id: checkin.id,
        completed_at: new Date().toISOString(),
      })
      .eq("id", input.requestId)
      .eq("patient_id", user.id);
  }
  revalidatePath("/progresso");
  revalidatePath("/");
}

// ── Conquistas ──────────────────────────────────────────────

export async function unlockAchievement(key: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("patient_achievements")
    .upsert(
      { patient_id: user.id, achievement_key: key },
      { onConflict: "patient_id,achievement_key", ignoreDuplicates: true },
    );
}

// ── Vínculo com profissional ────────────────────────────────

export async function linkProfessional(
  inviteCode: string,
): Promise<{ ok: boolean; error?: string; proName?: string }> {
  const { supabase, user } = await requireUser();
  const code = inviteCode.trim().toUpperCase();

  const { data: pro } = await supabase
    .from("professionals")
    .select("id, type, name")
    .eq("invite_code", code)
    .maybeSingle();
  if (!pro) return { ok: false, error: "código não encontrado. confere com seu profissional?" };

  // encerra vínculo ativo do mesmo tipo, se houver
  await supabase
    .from("patient_professional_links")
    .update({ status: "ended", ended_at: new Date().toISOString() })
    .eq("patient_id", user.id)
    .eq("professional_type", pro.type)
    .eq("status", "active");

  const { error } = await supabase.from("patient_professional_links").insert({
    patient_id: user.id,
    professional_id: pro.id,
    professional_type: pro.type,
  });
  if (error) return { ok: false, error: "não conseguimos vincular agora. tenta de novo?" };

  revalidatePath("/", "layout");
  return { ok: true, proName: pro.name };
}

export async function unlinkProfessional(linkId: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("patient_professional_links")
    .update({ status: "ended", ended_at: new Date().toISOString() })
    .eq("id", linkId)
    .eq("patient_id", user.id);
  revalidatePath("/", "layout");
}

// ── Consultas ───────────────────────────────────────────────

export async function requestAppointment(input: {
  professionalId: string;
  type: "primeira" | "retorno" | "avaliacao";
  scheduledAt: string;
}) {
  const { supabase, user } = await requireUser();
  await supabase.from("appointments").insert({
    patient_id: user.id,
    professional_id: input.professionalId,
    type: input.type,
    scheduled_at: input.scheduledAt,
  });
  revalidatePath("/consultas");
}

// ── Chat + notificações ─────────────────────────────────────

export async function sendMessage(input: { professionalId: string; body: string }) {
  const { supabase, user } = await requireUser();
  await supabase.from("messages").insert({
    patient_id: user.id,
    professional_id: input.professionalId,
    sender: "patient",
    body: input.body,
  });
}

export async function markNotificationRead(id: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .eq("patient_id", user.id);
  revalidatePath("/notificacoes");
}

export async function markAllNotificationsRead() {
  const { supabase, user } = await requireUser();
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("patient_id", user.id)
    .is("read_at", null);
  revalidatePath("/notificacoes");
}

// ── Perfil / sessão ─────────────────────────────────────────

export async function updateProfileName(name: string) {
  const { supabase, user } = await requireUser();
  await supabase.from("profiles").update({ name: name.trim() }).eq("id", user.id);
  revalidatePath("/perfil");
}

export async function changeMealPlan(planKey: "secar" | "crescer" | "manter") {
  const { supabase, user } = await requireUser();

  const { data: tpl } = await supabase
    .from("plan_templates")
    .select("*")
    .eq("key", planKey)
    .single();
  if (!tpl?.payload?.meals) return;

  // encerra plano solo ativo e cria o novo
  await supabase
    .from("meal_protocols")
    .update({ status: "ended", ends_on: new Date().toISOString().slice(0, 10) })
    .eq("patient_id", user.id)
    .eq("status", "active")
    .is("created_by", null);

  const { data: mp } = await supabase
    .from("meal_protocols")
    .insert({ patient_id: user.id, name: `plano ${tpl.name}`, plan_type: tpl.key })
    .select("id")
    .single();
  if (mp) {
    await supabase.from("protocol_meals").insert(
      (
        tpl.payload.meals as {
          name: string;
          time: string;
          description: string;
          mac?: { kcal: number; p: number; c: number; g: number };
        }[]
      ).map((m, i) => ({
        protocol_id: mp.id,
        name: m.name,
        time: m.time,
        description: m.description,
        sort_order: i,
        kcal: m.mac?.kcal ?? null,
        protein_g: m.mac?.p ?? null,
        carbs_g: m.mac?.c ?? null,
        fat_g: m.mac?.g ?? null,
      })),
    );
  }
  revalidatePath("/", "layout");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/entrada");
}
