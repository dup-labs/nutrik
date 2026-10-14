import { createSign } from "node:crypto";
import type { PushMessage, SendResult } from "./types";

// FCM HTTP v1 sem SDK: JWT RS256 da service account → access token OAuth →
// POST /v1/projects/<id>/messages:send.

interface ServiceAccount {
  project_id: string;
  client_email: string;
  private_key: string;
}

let cachedToken: { value: string; exp: number } | null = null;

function b64url(input: string): string {
  return Buffer.from(input).toString("base64url");
}

async function accessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.value;

  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signature = createSign("RSA-SHA256")
    .update(`${header}.${claims}`)
    .sign(sa.private_key)
    .toString("base64url");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
  });
  if (!res.ok) throw new Error(`FCM oauth ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: json.access_token, exp: now + json.expires_in };
  return json.access_token;
}

export async function sendFcm(tokens: string[], msg: PushMessage): Promise<SendResult> {
  const result: SendResult = { sent: 0, invalid: [] };
  const sa = JSON.parse(process.env.FCM_SERVICE_ACCOUNT_JSON!) as ServiceAccount;
  const bearer = await accessToken(sa);

  await Promise.all(
    tokens.map(async (token) => {
      const res = await fetch(
        `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${bearer}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            message: {
              token,
              notification: { title: msg.title, body: msg.body },
              data: { url: msg.url },
              android: { priority: "HIGH" },
            },
          }),
        },
      );
      if (res.ok) {
        result.sent++;
        return;
      }
      const text = await res.text();
      if (res.status === 404 || /UNREGISTERED/.test(text)) {
        result.invalid.push(token); // app desinstalado / token expirado
      } else {
        console.error(`[push] fcm ${res.status}: ${text.slice(0, 200)}`);
      }
    }),
  );
  return result;
}
