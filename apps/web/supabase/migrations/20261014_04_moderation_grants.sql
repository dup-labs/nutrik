-- Helpers da moderação (20261014_02) só para usuário logado: o default do
-- Postgres dá EXECUTE a public, e blocked_between/pro_user_id expõem quem
-- bloqueou quem e o user_id de um profissional pra quem chama a RPC sem login.
-- As policies que usam essas funções rodam como authenticated, que mantém acesso.
revoke execute on function
  nutrk.i_blocked(uuid),
  nutrk.blocked_between(uuid, uuid),
  nutrk.pro_user_id(uuid),
  nutrk.i_reported_group_message(uuid),
  nutrk.i_reported_message(text)
from public, anon;
