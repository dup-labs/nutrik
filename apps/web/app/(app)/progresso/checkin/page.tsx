import { getPatientContext } from "@/lib/queries";
import { CheckinClient } from "./CheckinClient";

export const dynamic = "force-dynamic";

export default async function CheckinPage() {
  const { links } = await getPatientContext();
  const proNames = links.map((l) => l.professional.short_name ?? l.professional.name);
  return <CheckinClient proNames={proNames} />;
}
