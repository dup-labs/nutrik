import { AuthSplit } from "@/components/AuthSplit";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AuthSplit variant="paciente">{children}</AuthSplit>;
}
