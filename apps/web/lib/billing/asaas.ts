// Wrapper fino da API v3 do Asaas (REST puro, sem SDK).
// Envs: ASAAS_API_KEY (obrigatória pra cobrar) e ASAAS_BASE_URL
// (default sandbox: https://api-sandbox.asaas.com/v3 · prod: https://api.asaas.com/v3).
// Checkout hospedado: criamos customer + subscription e mandamos o pro pra
// invoiceUrl da 1ª cobrança — cartão/Pix rodam no Asaas, sem PCI aqui.

const BASE_URL = process.env.ASAAS_BASE_URL ?? "https://api-sandbox.asaas.com/v3";

export function asaasConfigured(): boolean {
  return Boolean(process.env.ASAAS_API_KEY);
}

async function asaasFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const key = process.env.ASAAS_API_KEY;
  if (!key) throw new Error("ASAAS_API_KEY não configurada");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      access_token: key,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Asaas ${init?.method ?? "GET"} ${path} → ${res.status}: ${body}`);
  }
  return (await res.json()) as T;
}

export interface AsaasPayment {
  id: string;
  status: string;
  value: number;
  dueDate: string; // YYYY-MM-DD
  invoiceUrl: string;
  subscription?: string;
  customer: string;
}

const PAID_STATUSES = new Set(["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"]);

export function isPaid(status: string): boolean {
  return PAID_STATUSES.has(status);
}

export async function createCustomer(input: {
  name: string;
  email: string;
  cpfCnpj: string;
  externalReference: string;
}): Promise<{ id: string }> {
  return asaasFetch("/customers", { method: "POST", body: JSON.stringify(input) });
}

export async function createSubscription(input: {
  customer: string;
  value: number;
  cycle: "MONTHLY" | "YEARLY";
  nextDueDate: string; // YYYY-MM-DD (1ª cobrança)
  description: string;
  externalReference: string;
}): Promise<{ id: string }> {
  return asaasFetch("/subscriptions", {
    method: "POST",
    // UNDEFINED = cliente escolhe cartão ou Pix na fatura; cartão pago na
    // fatura fica tokenizado e renova sozinho nos próximos ciclos
    body: JSON.stringify({ ...input, billingType: "UNDEFINED" }),
  });
}

export async function cancelAsaasSubscription(id: string): Promise<void> {
  await asaasFetch(`/subscriptions/${id}`, { method: "DELETE" });
}

/** cobranças da assinatura, mais recente primeiro */
export async function getSubscriptionPayments(id: string): Promise<AsaasPayment[]> {
  const res = await asaasFetch<{ data: AsaasPayment[] }>(
    `/subscriptions/${id}/payments?limit=100`,
  );
  return (res.data ?? []).sort((a, b) => (a.dueDate < b.dueDate ? 1 : -1));
}

export async function getPayment(id: string): Promise<AsaasPayment> {
  return asaasFetch(`/payments/${id}`);
}
