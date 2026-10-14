import type { User } from "@supabase/supabase-js";

// Nome que o provider social mandou, pra pré-preencher o "como a gente te
// chama?" no /cadastro?completar=1.
//   Google → full_name / name sempre presentes.
//   Apple  → pelo fluxo OAuth (web e Browser do app) a Apple NÃO entrega o
//            nome ao Supabase — nem no primeiro login. Só o fluxo nativo
//            (ASAuthorization) recebe, e só no primeiro login. Então aqui vem
//            vazio e a pessoa digita; o perfil nunca depende do nome do
//            provider.
// Quem tem role nos metadados (signUp por email) nem passa pelo completar,
// então o `name` dos nossos metadados não cai aqui por engano.
export function providerDisplayName(user: User | null | undefined): string {
  const m = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const pick = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const full =
    pick(m.full_name) ||
    pick(m.name) ||
    [pick(m.given_name), pick(m.family_name)].filter(Boolean).join(" ");
  // nunca usar email (ou relay da Apple) como nome
  return full.includes("@") ? "" : full;
}
