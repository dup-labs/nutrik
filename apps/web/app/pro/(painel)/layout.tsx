import { redirect } from "next/navigation";
import { ProShell } from "@/components/pro/ProShell";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { ensureProfessionalFromMetadata } from "@/lib/roles";

export default async function ProPainelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect("/pro/entrada");

  let { data: pro } = await supabase
    .from("professionals")
    .select("id, name, type")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!pro && (await ensureProfessionalFromMetadata(supabase, user))) {
    ({ data: pro } = await supabase
      .from("professionals")
      .select("id, name, type")
      .eq("user_id", user.id)
      .maybeSingle());
  }
  if (!pro) redirect("/pro/cadastro");

  const { count } = await supabase
    .from("patient_professional_links")
    .select("id", { count: "exact", head: true })
    .eq("professional_id", pro.id)
    .eq("status", "active");

  return (
    <ProShell proName={pro.name} proType={pro.type} patientCount={count ?? 0}>
      {children}
    </ProShell>
  );
}
