import { EntrarClient } from "./EntrarClient";

export const dynamic = "force-dynamic";

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ codigo?: string }>;
}) {
  const { codigo } = await searchParams;
  return <EntrarClient codigo={codigo ?? ""} />;
}
