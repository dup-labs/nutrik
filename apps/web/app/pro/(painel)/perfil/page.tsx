import { getProContext } from "@/lib/pro/queries";
import { PRO_COPY } from "@/lib/pro/copy";
import { ProPerfilClient } from "./ProPerfilClient";

export const dynamic = "force-dynamic";

export default async function ProPerfilPage() {
  const { pro } = await getProContext();
  return (
    <ProPerfilClient
      pro={{
        name: pro.name,
        type: pro.type,
        regCode: pro.reg_code ?? "",
        clinic: pro.clinic ?? "",
        phone: pro.phone ?? "",
        bio: pro.bio ?? "",
        tags: pro.tags,
        inviteCode: pro.invite_code,
      }}
      regLabel={PRO_COPY[pro.type].regLabel}
    />
  );
}
