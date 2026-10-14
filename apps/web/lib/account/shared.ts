// Constantes e helpers compartilhados entre a server action e a UI.
// (arquivo "use server" só pode exportar funções async, por isso ficam aqui)

export const CONFIRM_WORD = "excluir";

/** pra onde o usuário vai depois de excluir (rota pública, mostra o aviso) */
export const DELETED_REDIRECT = "/excluir-conta?concluida=1";

export function normalizeConfirm(v: string): string {
  return v.trim().toLowerCase();
}
