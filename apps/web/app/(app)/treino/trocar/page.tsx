import { redirect } from "next/navigation";
import { dayOfWeek, localDateISO } from "@/lib/dates";
import { getActiveTrainingProtocol, getPatientContext } from "@/lib/queries";
import { TrocarClient } from "./TrocarClient";

export const dynamic = "force-dynamic";

export default async function TrocarPage({
  searchParams,
}: {
  searchParams: Promise<{ dia?: string }>;
}) {
  const { dia } = await searchParams;
  const { supabase, user, links } = await getPatientContext();
  if (!links.some((l) => l.professional_type === "personal")) redirect("/treino");

  const training = await getActiveTrainingProtocol(supabase, user.id);
  const day =
    training.days.find((d) => d.id === dia) ??
    training.days.find((d) => d.day_of_week === dayOfWeek(localDateISO()));
  if (!day) redirect("/treino");

  const personal = links.find((l) => l.professional_type === "personal")!;

  return (
    <TrocarClient
      day={{ id: day.id, name: day.name }}
      personalName={personal.professional.short_name ?? personal.professional.name}
    />
  );
}
