export interface PushMessage {
  title: string;
  body: string;
  /** rota interna aberta ao tocar na notificação (ex.: "/chat") */
  url: string;
}

export interface SendResult {
  sent: number;
  /** tokens que o provedor recusou de forma definitiva (remover do banco) */
  invalid: string[];
}
