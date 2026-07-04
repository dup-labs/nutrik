import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/server";
import { resolveDestination } from "@/lib/roles";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrada");

  // roteia por papel: pro vai pro painel; paciente sem perfil completa o cadastro
  const dest = await resolveDestination(supabase, user);
  if (dest !== "/") redirect(dest);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--gradient-canvas)",
        maxWidth: 560,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div style={{ paddingBottom: 96 }}>{children}</div>
      <BottomNav />
    </div>
  );
}
