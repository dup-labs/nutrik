// Token de push deste aparelho, guardado no client pro logout conseguir
// desregistrar só este aparelho (os outros da mesma conta seguem recebendo).
import { unregisterDevice } from "./actions";

const TOKEN_KEY = "nutrk.push.token";

export function rememberDeviceToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // storage bloqueado: o logout só não desregistra este aparelho
  }
}

// Chamar antes do signOut. Nunca bloqueia o logout por falha aqui.
export async function forgetThisDevice() {
  let token: string | null = null;
  try {
    token = localStorage.getItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    return;
  }
  if (!token) return;
  try {
    await unregisterDevice(token);
  } catch {
    // segue o logout
  }
}
