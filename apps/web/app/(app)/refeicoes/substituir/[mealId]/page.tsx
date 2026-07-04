import { notFound, redirect } from "next/navigation";
import { getPatientContext } from "@/lib/queries";
import { SubstituirClient } from "./SubstituirClient";

export const dynamic = "force-dynamic";

export default async function SubstituirPage({
  params,
}: {
  params: Promise<{ mealId: string }>;
}) {
  const { mealId } = await params;
  const { supabase, links } = await getPatientContext();
  const nutri = links.find((l) => l.professional_type === "nutri");
  if (!nutri) redirect("/refeicoes");

  const { data: meal } = await supabase
    .from("protocol_meals")
    .select("id, name, time, description")
    .eq("id", mealId)
    .maybeSingle();
  if (!meal) notFound();

  return (
    <SubstituirClient
      meal={meal}
      nutriName={nutri.professional.short_name ?? nutri.professional.name}
    />
  );
}
