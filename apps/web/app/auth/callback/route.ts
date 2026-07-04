import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolveDestination } from "@/lib/roles";

// troca do code (OAuth Google / links de email) por sessão e roteia por papel
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const flow = searchParams.get("flow");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (next) return NextResponse.redirect(`${origin}${next}`);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const dest = await resolveDestination(supabase, user, flow);
        return NextResponse.redirect(`${origin}${dest}`);
      }
      return NextResponse.redirect(`${origin}/`);
    }
  }
  return NextResponse.redirect(`${origin}${flow === "pro" ? "/pro/entrada" : "/login"}`);
}
