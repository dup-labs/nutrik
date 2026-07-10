-- Toggles de features por paciente: o que ele acompanha no app.
-- Pilar desligado some da UI e não pontua no ranking da turma.

alter table nutrk.profiles
  add column if not exists features jsonb not null
  default '{"dieta":true,"treino":true,"agua":true,"meditacao":true,"sono":true}'::jsonb;
