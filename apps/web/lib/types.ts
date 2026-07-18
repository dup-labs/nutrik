// Tipos de domínio — espelham o schema `nutrk` no Supabase.

export type ProfessionalType = "nutri" | "personal";

/** pilares que o paciente escolhe acompanhar (configurações) */
export type FeatureKey = "dieta" | "treino" | "agua" | "meditacao" | "sono";

export const FEATURE_KEYS: FeatureKey[] = ["dieta", "treino", "agua", "meditacao", "sono"];

export interface Profile {
  id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  objective: string | null;
  onboarding_completed_at: string | null;
  features: Partial<Record<FeatureKey, boolean>> | null;
}

/** pilar ligado? (default true — perfis antigos/sem a coluna acompanham tudo) */
export function featureOn(profile: Pick<Profile, "features"> | null, key: FeatureKey): boolean {
  return profile?.features?.[key] !== false;
}

export interface Professional {
  id: string;
  type: ProfessionalType;
  name: string;
  short_name: string | null;
  reg_code: string | null;
  clinic: string | null;
  phone: string | null;
  email: string | null;
  bio: string | null;
  tags: string[];
  invite_code: string;
  billing_exempt: boolean | null;
  trial_ends_at: string | null;
}

/** assinatura do profissional no Asaas (1:1 com professionals) */
export interface ProfessionalSubscription {
  professional_id: string;
  asaas_customer_id: string | null;
  asaas_subscription_id: string | null;
  asaas_last_payment_id: string | null;
  plan: "monthly" | "yearly";
  status: "pending" | "active" | "past_due" | "canceled";
  current_period_end: string | null;
}

export interface ProfessionalLink {
  id: string;
  patient_id: string;
  professional_id: string;
  professional_type: ProfessionalType;
  status: "active" | "ended";
  professional?: Professional;
}

export interface MealProtocol {
  id: string;
  patient_id: string;
  created_by: string | null;
  name: string;
  plan_type: string | null;
  status: "draft" | "active" | "ended";
}

export interface ProtocolMeal {
  id: string;
  protocol_id: string;
  day_of_week: number | null;
  name: string;
  time: string | null;
  description: string;
  sort_order: number;
  kcal: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
}

export interface MealLog {
  id: string;
  protocol_meal_id: string | null;
  date: string;
  status: "done" | "skipped";
  follow: "seguiu" | "adaptou" | null;
  note: string | null;
  photo_path: string | null;
}

export interface TrainingProtocol {
  id: string;
  patient_id: string;
  created_by: string | null;
  name: string;
  split_type: string | null;
  status: "draft" | "active" | "ended";
}

export interface WorkoutDay {
  id: string;
  protocol_id: string;
  day_of_week: number;
  name: string;
  tags: string[];
  is_rest: boolean;
  est_minutes: number | null;
}

export interface WorkoutExercise {
  id: string;
  workout_day_id: string;
  name: string;
  sets: number;
  reps_label: string;
  suggested_load: string | null;
  target_muscles: string | null;
  video_url: string | null;
  sort_order: number;
}

export interface WorkoutSession {
  id: string;
  workout_day_id: string;
  date: string;
  completed_at: string | null;
}

export interface SetLog {
  id: string;
  exercise_id: string;
  date: string;
  set_number: number;
  done: boolean;
  load_kg: number | null;
  no_load: boolean;
}

export interface WaterLog {
  id: string;
  date: string;
  amount_ml: number;
}

export interface MoodLog {
  id: string;
  date: string;
  mood: "otimo" | "bem" | "neutro" | "baixo" | "dificil";
  tags: string[];
}

export interface SleepLog {
  id: string;
  date: string;
  hours: number;
  quality: number | null;
  wake_mood: number | null;
}

export interface Appointment {
  id: string;
  professional_id: string;
  type: "primeira" | "retorno" | "avaliacao" | "checkin";
  scheduled_at: string;
  status: "requested" | "confirmed" | "declined" | "cancelled" | "done";
  professional?: Professional;
}

export interface Message {
  id: string;
  patient_id: string;
  professional_id: string;
  sender: "patient" | "professional";
  body: string;
  created_at: string;
  read_at: string | null;
}

export interface AppNotification {
  id: string;
  professional_id: string | null;
  group_id: string | null;
  type: "protocolo" | "mensagem" | "resultado" | "consulta" | "turma";
  title: string;
  body: string | null;
  created_at: string;
  read_at: string | null;
}

// ── Social: turmas ──────────────────────────────────────────

export interface FriendGroup {
  id: string;
  name: string;
  code: string;
  owner_id: string;
  join_policy: "open" | "approval";
  /** pilares que valem ponto no ranking desta turma (default: todos) */
  scored_metrics: FeatureKey[] | null;
  created_at: string;
}

/** métricas pontuáveis da turma, normalizadas (turma sem config = todos os pilares) */
export function groupMetrics(group: Pick<FriendGroup, "scored_metrics">): FeatureKey[] {
  const m = group.scored_metrics;
  if (!m || m.length === 0) return FEATURE_KEYS;
  return FEATURE_KEYS.filter((k) => m.includes(k));
}

export interface FriendGroupMember {
  group_id: string;
  patient_id: string;
  joined_at: string;
}

/** perfil público de colega de turma (view nutrk.friend_profiles) */
export interface FriendProfile {
  id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
}

export interface GroupInvite {
  id: string;
  group_id: string;
  kind: "invite" | "request";
  inviter_id: string | null;
  invitee_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

export interface GroupMessage {
  id: string;
  group_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export interface DailyScore {
  patient_id: string;
  date: string;
  dieta: boolean;
  treino: boolean;
  agua: boolean;
  meditacao: boolean;
  sono: boolean;
  total: number;
}

export interface Achievement {
  key: string;
  title: string;
  icon: string | null;
  description: string | null;
}

export interface PlanTemplate {
  id: string;
  kind: "meal" | "training";
  key: string;
  name: string;
  description: string | null;
  payload: {
    meals?: {
      name: string;
      time: string;
      description: string;
      mac?: { kcal: number; p: number; c: number; g: number };
    }[];
    tags?: string[];
    est_minutes?: number;
    exercises?: {
      name: string;
      sets: number;
      reps_label: string;
      suggested_load?: string;
      target_muscles?: string;
    }[];
  };
}

/** Cores/acentos por tipo de profissional (do design system). */
export const PRO_ACCENT: Record<
  ProfessionalType,
  { accent: string; bg: string; soft: string; border: string; mesh: string; role: string }
> = {
  nutri: {
    accent: "#5a63c4",
    bg: "rgba(173,183,247,0.22)",
    soft: "rgba(173,183,247,0.14)",
    border: "1px solid rgba(173,183,247,0.5)",
    mesh: "var(--mesh-cool)",
    role: "nutricionista",
  },
  personal: {
    accent: "#c67518",
    bg: "rgba(254,175,76,0.20)",
    soft: "rgba(254,175,76,0.12)",
    border: "1px solid rgba(254,175,76,0.45)",
    mesh: "var(--mesh-warm)",
    role: "personal",
  },
};
