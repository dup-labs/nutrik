import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolveDestination } from "@/lib/roles";
import { safeNext } from "@/lib/auth/safe-next";

// Confirmação de links de EMAIL (cadastro, recuperar senha, troca de email)
// por token_hash — sem PKCE.
//
// Por que existe: com PKCE, o link do email só troca por sessão no MESMO
// navegador que pediu (o code_verifier está no cookie dele). No app nativo a
// pessoa pede "recuperar senha" dentro do webview e abre o email no app de
// Mail → o link abre no Safari/Chrome, que não tem o verifier → falha. O
// token_hash é verificado só com o que vem no link, em qualquer navegador.
//
// Só passa a ser usado quando os templates de email do Supabase apontarem
// pra cá (ver docs/mobile/auth-setup.md). Até lá, /auth/callback segue
// atendendo os links antigos.
//
// Link esperado no template:
//   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=<tipo>&next=...

const TYPES: EmailOtpType[] = ["signup", "invite", "magiclink", "recovery", "email_change", "email"];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const rawType = searchParams.get("type") as EmailOtpType | null;
  const type = rawType && TYPES.includes(rawType) ? rawType : null;
  // recuperar senha sempre termina em /redefinir
  const next = safeNext(searchParams.get("next")) ?? (type === "recovery" ? "/redefinir" : null);

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      if (next) return NextResponse.redirect(`${origin}${next}`);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        return NextResponse.redirect(`${origin}${await resolveDestination(supabase, user)}`);
      }
      return NextResponse.redirect(`${origin}/`);
    }
    console.error("[auth/confirm] verifyOtp:", error.message);
  }
  return NextResponse.redirect(`${origin}/login`);
}
