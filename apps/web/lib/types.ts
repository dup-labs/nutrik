// Tipos de domínio — espelham o schema `nutrk` no Supabase.

export type ProfessionalType = "nutri" | "personal";

export interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  objective: string | null;
  onboarding_completed_at: string | null;
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
  type: "protocolo" | "mensagem" | "resultado" | "consulta";
  title: string;
  body: string | null;
  created_at: string;
  read_at: string | null;
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
