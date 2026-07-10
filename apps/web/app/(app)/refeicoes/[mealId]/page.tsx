import { notFound } from "next/navigation";
import { localDateISO } from "@/lib/dates";
import { getPatientContext, requireFeature } from "@/lib/queries";
import type { MealLog, ProtocolMeal } from "@/lib/types";
import { MealDetailClient } from "./MealDetailClient";

export const dynamic = "force-dynamic";

export default async function MealDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ mealId: string }>;
  searchParams: Promise<{ d?: string }>;
}) {
  await requireFeature("dieta");
  const { mealId } = await params;
  const { d } = await searchParams;
  const date = d ?? localDateISO();
  const { supabase, user, links } = await getPatientContext();

  const { data: meal } = await supabase
    .from("protocol_meals")
    .select("*")
    .eq("id", mealId)
    .maybeSingle();
  if (!meal) notFound();

  const { data: log } = await supabase
    .from("meal_logs")
    .select("*")
    .eq("patient_id", user.id)
    .eq("protocol_meal_id", mealId)
    .eq("date", date)
    .maybeSingle();

  return (
    <MealDetailClient
      meal={meal as ProtocolMeal}
      log={(log as MealLog) ?? null}
      date={date}
      userId={user.id}
      linked={links.some((l) => l.professional_type === "nutri")}
    />
  );
}
