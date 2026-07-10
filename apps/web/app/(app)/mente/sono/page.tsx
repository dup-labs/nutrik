import { localDateISO } from "@/lib/dates";
import { getPatientContext, getSleepOn, requireFeature } from "@/lib/queries";
import { SonoClient } from "./SonoClient";

export const dynamic = "force-dynamic";

export default async function SonoPage() {
  await requireFeature("sono");
  const { supabase, user } = await getPatientContext();
  const today = localDateISO();
  const sleep = await getSleepOn(supabase, user.id, today);

  return (
    <SonoClient
      date={today}
      initialHours={sleep?.hours ?? 7}
      initialQuality={sleep?.quality ?? null}
      initialWakeMood={sleep?.wake_mood ?? null}
    />
  );
}
