import { localDateISO } from "@/lib/dates";
import { getPatientContext, getWaterToday, requireFeature } from "@/lib/queries";
import { AguaClient } from "./AguaClient";

export const dynamic = "force-dynamic";

export default async function AguaPage() {
  await requireFeature("agua");
  const { supabase, user } = await getPatientContext();
  const today = localDateISO();
  const water = await getWaterToday(supabase, user.id, today);

  return <AguaClient initialTotal={water.total} initialGoal={water.goal} date={today} />;
}
