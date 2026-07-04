import { redirect } from "next/navigation";
import { addDays, localDateISO } from "@/lib/dates";
import { getPatientContext } from "@/lib/queries";
import { AgendarClient } from "./AgendarClient";

export const dynamic = "force-dynamic";

export default async function AgendarPage() {
  const { links } = await getPatientContext();
  if (links.length === 0) redirect("/consultas");

  const today = localDateISO();
  // próximos 10 dias úteis
  const dates: string[] = [];
  let cursor = today;
  while (dates.length < 10) {
    cursor = addDays(cursor, 1);
    const dow = new Date(cursor + "T12:00:00").getDay();
    if (dow !== 0 && dow !== 6) dates.push(cursor);
  }

  return (
    <AgendarClient
      pros={links.map((l) => ({
        id: l.professional_id,
        type: l.professional_type,
        name: l.professional.short_name ?? l.professional.name,
        fullName: l.professional.name,
      }))}
      dates={dates}
    />
  );
}
