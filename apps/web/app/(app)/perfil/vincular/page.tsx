import { getPatientContext } from "@/lib/queries";
import { VincularClient } from "./VincularClient";

export const dynamic = "force-dynamic";

export default async function VincularPage() {
  const { links } = await getPatientContext();

  const slot = (type: "nutri" | "personal") => {
    const link = links.find((l) => l.professional_type === type);
    return link
      ? {
          linked: true as const,
          name: link.professional.name,
          code: link.professional.invite_code,
        }
      : { linked: false as const };
  };

  return <VincularClient nutri={slot("nutri")} personal={slot("personal")} />;
}
