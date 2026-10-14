import { headers } from "next/headers";
import { NATIVE_UA, type Platform } from "./native";

// Plataforma da requisição atual, lida do user-agent que a casca nativa marca.
// Para server components/actions — decide o que renderizar antes de chegar ao
// client (ex.: não mandar o checkout pro app iOS).
export async function getRequestPlatform(): Promise<Platform> {
  const ua = (await headers()).get("user-agent") ?? "";
  const match = ua.match(new RegExp(`${NATIVE_UA}/\\d+ (ios|android)`));
  return (match?.[1] as Platform | undefined) ?? "web";
}
