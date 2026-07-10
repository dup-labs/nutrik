-- Métricas pontuáveis por turma: o dono escolhe quais pilares valem ponto no
-- ranking daquela turma. O ranking passa a somar os booleanos por pilar de
-- daily_scores filtrados por esta lista — não o `total` global do paciente.
-- (Pilar que o paciente desligou nas configs já vem false em daily_scores,
-- então continua não pontuando mesmo que a turma o inclua.)

alter table nutrk.friend_groups
  add column if not exists scored_metrics text[] not null
  default array['dieta', 'treino', 'agua', 'meditacao', 'sono'];

-- só aceita os 5 pilares conhecidos (subconjunto); vazio é barrado no app
alter table nutrk.friend_groups drop constraint if exists friend_groups_metrics_valid;
alter table nutrk.friend_groups add constraint friend_groups_metrics_valid
  check (scored_metrics <@ array['dieta', 'treino', 'agua', 'meditacao', 'sono']::text[]);
