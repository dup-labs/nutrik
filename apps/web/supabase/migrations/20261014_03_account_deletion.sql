-- Exclusão de conta (Apple 5.1.1(v) / Google Play).
-- Uma função só, transacional, chamada pela server action deleteAccount()
-- (lib/account/actions.ts) com service role. Por que precisa de função:
--  1) professionals.user_id é ON DELETE SET NULL: apagar o auth.users deixaria
--     a linha do profissional (nome, email, telefone, bio) órfã.
--  2) meal_protocols.created_by / training_protocols.created_by apontam pra
--     professionals SEM cascade: bloqueiam o delete do profissional.
--  3) daily_activity e patient_events não têm FK pra profiles: ficariam órfãs.
--  4) friend_groups.owner_id é cascade: apagar o dono derrubaria a turma de
--     todo mundo. Aqui a turma passa pro membro mais antigo.
--  5) o projeto Supabase é compartilhado (polr, pblshr usam o mesmo auth.users):
--     a função avisa se o usuário existe em outro app, pra action NÃO apagar
--     o login nesse caso.
-- Não apaga auth.users nem arquivos do Storage (isso é feito pela action).

create or replace function nutrk.delete_account_data(p_user uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_pro_ids uuid[];
  v_group record;
  v_new_owner uuid;
  v_other boolean := false;
  v_exists boolean;
begin
  if p_user is null then
    raise exception 'p_user obrigatório';
  end if;

  -- profissional (se houver): protocolos que ele criou ficam com o paciente,
  -- sem autor (o dado é do paciente); depois a linha cai com tudo em cascade
  -- (assinatura, vínculos, mensagens, consultas, notas internas, vídeos...)
  select coalesce(array_agg(id), '{}') into v_pro_ids
    from nutrk.professionals where user_id = p_user;

  if array_length(v_pro_ids, 1) > 0 then
    update nutrk.meal_protocols set created_by = null where created_by = any (v_pro_ids);
    update nutrk.training_protocols set created_by = null where created_by = any (v_pro_ids);
    delete from nutrk.professionals where id = any (v_pro_ids);
  end if;

  -- turmas: repassa pro membro mais antigo; sem outros membros, a turma some
  for v_group in select id from nutrk.friend_groups where owner_id = p_user loop
    v_new_owner := null;
    select patient_id into v_new_owner
      from nutrk.friend_group_members
      where group_id = v_group.id and patient_id <> p_user
      order by joined_at asc limit 1;
    if v_new_owner is null then
      delete from nutrk.friend_groups where id = v_group.id;
    else
      update nutrk.friend_groups set owner_id = v_new_owner where id = v_group.id;
    end if;
  end loop;

  -- tabelas sem FK
  delete from nutrk.daily_activity where patient_id = p_user;
  delete from nutrk.patient_events where patient_id = p_user;
  -- aparelhos de push (o cascade em auth.users não roda quando o login é mantido)
  delete from nutrk.device_tokens where user_id = p_user;
  -- moderação (o cascade em auth.users não roda quando o login é mantido)
  delete from nutrk.user_blocks where blocker_id = p_user or blocked_id = p_user;
  delete from nutrk.reports where reporter_id = p_user or target_user_id = p_user;

  -- paciente: tudo o mais cai em cascade a partir de profiles
  delete from nutrk.profiles where id = p_user;

  -- o usuário usa outro app do mesmo projeto Supabase?
  if to_regclass('polr.profiles') is not null then
    execute 'select exists (select 1 from polr.profiles where id = $1)' into v_exists using p_user;
    v_other := v_other or v_exists;
  end if;
  if to_regclass('pblshr.profiles') is not null then
    execute 'select exists (select 1 from pblshr.profiles where id = $1)' into v_exists using p_user;
    v_other := v_other or v_exists;
  end if;

  return jsonb_build_object('other_apps', v_other);
end;
$$;

-- só o service role chama (a action valida a sessão antes)
revoke all on function nutrk.delete_account_data(uuid) from public, anon, authenticated;
grant execute on function nutrk.delete_account_data(uuid) to service_role;
