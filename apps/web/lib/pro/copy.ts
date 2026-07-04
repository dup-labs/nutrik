import type { ProfessionalType } from "@/lib/types";

// dicionário de copy por tipo — um painel só, os blocos mudam por aqui
export const PRO_COPY: Record<
  ProfessionalType,
  {
    role: string;
    pessoa: string;
    pessoas: string;
    publicar: string;
    planoTab: string;
    planoHint: string;
    regLabel: string;
    evoDefaultTopic: string;
  }
> = {
  nutri: {
    role: "nutricionista",
    pessoa: "paciente",
    pessoas: "pacientes",
    publicar: "publicar pro paciente",
    planoTab: "plano alimentar",
    planoHint:
      "monte o plano dia a dia. os macros somam sozinhos conforme você adiciona alimentos e quantidades.",
    regLabel: "CRN",
    evoDefaultTopic: "refeicao",
  },
  personal: {
    role: "personal",
    pessoa: "aluno",
    pessoas: "alunos",
    publicar: "publicar pro aluno",
    planoTab: "plano de treino",
    planoHint:
      "monte a semana dia a dia: o treino, os exercícios, o vídeo de execução, as séries e a carga de cada série.",
    regLabel: "CREF",
    evoDefaultTopic: "treino",
  },
};
