import { redirect } from "next/navigation";
import { PatientShell } from "@/components/PatientShell";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { resolveDestination } from "@/lib/roles";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) redirect("/entrada");

  // roteia por papel: pro vai pro painel; paciente sem perfil completa o cadastro
  const dest = await resolveDestination(supabase, user);
  if (dest !== "/") redirect(dest);

  return <PatientShell>{children}</PatientShell>;
}
