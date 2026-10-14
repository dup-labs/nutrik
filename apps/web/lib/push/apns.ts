import { createSign } from "node:crypto";
import { connect, type ClientHttp2Session } from "node:http2";
import type { PushMessage, SendResult } from "./types";

// APNs HTTP/2 token-based (chave .p8, JWT ES256) sem dependências.
// O JWT vale até 60 min e a Apple pede pra não renovar com menos de 20 min.

let cachedJwt: { value: string; iat: number } | null = null;

function jwt(): string {
  const now = Math.floor(Date.now() / 1000);
  if (cachedJwt && now - cachedJwt.iat < 40 * 60) return cachedJwt.value;

  const header = Buffer.from(
    JSON.stringify({ alg: "ES256", kid: process.env.APNS_KEY_ID }),
  ).toString("base64url");
  const claims = Buffer.from(
    JSON.stringify({ iss: process.env.APNS_TEAM_ID, iat: now }),
  ).toString("base64url");
  const key = process.env.APNS_KEY_P8!.replace(/\\n/g, "\n");
  // ieee-p1363 = assinatura r||s crua que o JWT ES256 exige (o default é DER)
  const sig = createSign("SHA256")
    .update(`${header}.${claims}`)
    .sign({ key, dsaEncoding: "ieee-p1363" })
    .toString("base64url");

  cachedJwt = { value: `${header}.${claims}.${sig}`, iat: now };
  return cachedJwt.value;
}

function host(): string {
  const env =
    process.env.APNS_ENV ?? (process.env.NODE_ENV === "production" ? "production" : "sandbox");
  return env === "production" ? "https://api.push.apple.com" : "https://api.sandbox.push.apple.com";
}

function post(
  session: ClientHttp2Session,
  token: string,
  payload: string,
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = session.request({
      ":method": "POST",
      ":path": `/3/device/${token}`,
      authorization: `bearer ${jwt()}`,
      "apns-topic": process.env.APNS_BUNDLE_ID ?? "io.nutrk.app",
      "apns-push-type": "alert",
      "apns-priority": "10",
    });
    let status = 0;
    let body = "";
    req.setTimeout(8000, () => req.close());
    req.on("response", (h) => {
      status = Number(h[":status"]);
    });
    req.setEncoding("utf8");
    req.on("data", (c) => (body += c));
    req.on("end", () => resolve({ status, body }));
    req.on("error", reject);
    req.end(payload);
  });
}

export async function sendApns(tokens: string[], msg: PushMessage): Promise<SendResult> {
  const result: SendResult = { sent: 0, invalid: [] };
  const payload = JSON.stringify({
    aps: { alert: { title: msg.title, body: msg.body }, sound: "default" },
    url: msg.url,
  });

  const session = connect(host());
  session.on("error", (e) => console.error("[push] apns sessão:", e.message));
  try {
    await Promise.all(
      tokens.map(async (token) => {
        try {
          const { status, body } = await post(session, token, payload);
          if (status === 200) result.sent++;
          else if (status === 410 || /BadDeviceToken|Unregistered/.test(body)) {
            // atenção: token de sandbox enviado pra prod (ou vice-versa) também dá BadDeviceToken
            result.invalid.push(token);
          } else console.error(`[push] apns ${status}: ${body.slice(0, 200)}`);
        } catch (e) {
          console.error("[push] apns request:", (e as Error).message);
        }
      }),
    );
  } finally {
    session.close();
  }
  return result;
}
