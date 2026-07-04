import { localDateISO } from "@/lib/dates";
import { getMoodOn, getPatientContext } from "@/lib/queries";
import { HumorClient } from "./HumorClient";

export const dynamic = "force-dynamic";

export default async function HumorPage() {
  const { supabase, user } = await getPatientContext();
  const today = localDateISO();
  const mood = await getMoodOn(supabase, user.id, today);

  return (
    <HumorClient
      date={today}
      initialMood={mood?.mood ?? null}
      initialTags={mood?.tags ?? []}
    />
  );
}
