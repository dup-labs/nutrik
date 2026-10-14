// `next` dos callbacks de auth só pode ser caminho interno. "@evil.com"
// viraria https://app.nutrk.io@evil.com (userinfo → outro host) e
// "//evil.com" é protocol-relative. Fora de "/<algo>", ignora.
export function safeNext(next: string | null): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return null;
  }
  return next;
}
