import type { Metadata } from "next";
import Link from "next/link";
import { B, H2, LI, LegalPage, P, UL } from "../privacidade/LegalLayout";

export const metadata: Metadata = {
  title: "Termos de uso · Nūtrk",
  description: "as regras do jogo do nūtrk, em linguagem simples.",
};

const link = { color: "var(--color-orange)", fontWeight: 600 } as const;

export default function TermosPage() {
  return (
    <LegalPage title="termos de uso." version="[DATA DE PUBLICAÇÃO]">
      <H2>1. o que é o nūtrk</H2>
      <P>
        o nūtrk é um app de nutrição, treino e saúde mental, oferecido por{" "}
        <B>[RAZÃO SOCIAL]</B>, CNPJ <B>[CNPJ]</B>, <B>[ENDEREÇO]</B>. ao criar
        uma conta ou usar o app, você concorda com estes termos e com a{" "}
        <Link href="/privacidade" style={link}>política de privacidade</Link>.
      </P>

      <H2>2. quem pode usar</H2>
      <P>
        maiores de 18 anos, com capacidade para aceitar estes termos. você
        precisa informar dados verdadeiros e cuidar da sua senha. você é
        responsável pelo que acontece na sua conta.
      </P>

      <H2>3. o app não substitui orientação profissional</H2>
      <P>
        o nūtrk é uma ferramenta de organização e acompanhamento. ele{" "}
        <B>não faz diagnóstico, não trata doenças e não substitui</B> consulta
        com médico, nutricionista, educador físico ou psicólogo. o conteúdo
        genérico do app (planos-base, respiração, dicas) é informativo.
      </P>
      <P>
        planos alimentares e de treino personalizados são criados pelo
        profissional que acompanha você. a <B>responsabilidade técnica</B> por
        esses planos e pela orientação é do profissional, dentro do seu
        conselho de classe (CRN, CREF ou outro). o nūtrk fornece a plataforma e
        não interfere na conduta dele.
      </P>
      <P>
        se você sentir dor, mal-estar, ou tiver condição de saúde que peça
        atenção, pare e procure atendimento. em emergência, ligue 192 (SAMU).
        se estiver passando por sofrimento emocional intenso, o CVV atende 24h
        pelo 188.
      </P>

      <H2>4. profissionais no nūtrk</H2>
      <UL>
        <LI>
          o profissional informa e é responsável por manter válido o seu
          registro no conselho. o nūtrk pode pedir comprovação e suspender
          contas irregulares.
        </LI>
        <LI>
          os dados dos pacientes só podem ser usados para o acompanhamento e
          conforme o sigilo profissional e a LGPD. é proibido exportá-los ou
          usá-los para outra finalidade.
        </LI>
        <LI>
          <B>assinatura.</B> o uso da área do profissional tem um período de
          teste de 14 dias e depois uma assinatura mensal ou anual, cobrada
          pelo Asaas. os valores e condições vigentes são os apresentados no
          momento da contratação, no site app.nutrk.io. a contratação e o
          gerenciamento da assinatura acontecem fora do aplicativo de celular.
          o cancelamento vale ao fim do período já pago, sem reembolso
          proporcional, salvo quando a lei exigir (por exemplo, o direito de
          arrependimento de 7 dias nas contratações feitas à distância).
        </LI>
        <LI>
          se a assinatura ficar em atraso, o acesso do profissional pode ser
          limitado. os dados dos pacientes continuam preservados e o paciente
          continua usando o app.
        </LI>
      </UL>

      <H2>5. conduta: chat, turmas e conteúdo</H2>
      <P>
        você é responsável pelo que escreve e envia. nas turmas e nos chats é
        proibido: assédio, discriminação, ameaça, conteúdo sexual ou violento,
        golpe, spam, divulgar dados de outras pessoas, incentivar dietas
        extremas, transtornos alimentares ou automutilação, e se passar por
        outra pessoa ou por profissional.
      </P>
      <P>
        turmas são espaços entre amigos, não atendimento. o dono da turma pode
        remover membros. temos tolerância zero com conteúdo ofensivo e
        usuários abusivos: você pode denunciar uma mensagem ou bloquear alguém
        direto no app (segure a mensagem ou abra o menu do membro), ou escrever
        para app@nutrk.io. analisamos denúncias em até 24 horas e podemos
        remover conteúdo e suspender contas que violem estes termos.
      </P>
      <P>
        você mantém a propriedade do conteúdo que cria, mas nos autoriza a
        armazená-lo e exibi-lo para quem você escolheu (seu profissional, sua
        turma) só para o app funcionar.
      </P>

      <H2>6. propriedade intelectual</H2>
      <P>
        a marca nūtrk, o design, o código e os textos do app são de{" "}
        <B>[RAZÃO SOCIAL]</B> ou licenciados a ela. você recebe um direito
        pessoal, não exclusivo e revogável de usar o app. não copie, não
        engenharia reversa, não use o app para treinar sistemas de terceiros.
      </P>

      <H2>7. disponibilidade e mudanças</H2>
      <P>
        buscamos manter o app no ar, mas podem ocorrer manutenções e falhas.
        podemos alterar ou descontinuar funcionalidades. mudanças relevantes
        nestes termos serão avisadas no app ou por email com antecedência
        razoável. continuar usando depois disso é aceitar a nova versão.
      </P>

      <H2>8. responsabilidade</H2>
      <P>
        o app é oferecido como está. dentro do que a lei permite, não nos
        responsabilizamos por decisões de saúde tomadas com base apenas no
        conteúdo do app, por orientações dadas por profissionais ou por danos
        causados por uso indevido da conta. nada aqui limita direitos que o
        Código de Defesa do Consumidor garanta a você.
      </P>

      <H2>9. encerramento</H2>
      <P>
        você pode excluir sua conta quando quiser, no próprio app (perfil,
        configurações) ou em{" "}
        <Link href="/excluir-conta" style={link}>/excluir-conta</Link>. podemos
        suspender ou encerrar contas que violem estes termos ou a lei, avisando
        sempre que possível. os efeitos sobre seus dados estão na política de
        privacidade.
      </P>

      <H2>10. lei aplicável e contato</H2>
      <P>
        valem as leis do Brasil. fica eleito o foro do domicílio do consumidor
        para disputas de consumo e, nos demais casos, o foro de [CIDADE/UF].
        contato: app@nutrk.io.
      </P>
    </LegalPage>
  );
}
