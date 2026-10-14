import type { Metadata } from "next";
import Link from "next/link";
import { B, H2, LI, LegalPage, P, UL } from "./LegalLayout";

export const metadata: Metadata = {
  title: "Política de privacidade · Nūtrk",
  description: "como o nūtrk cuida dos seus dados, em linguagem simples.",
};

export default function PrivacidadePage() {
  return (
    <LegalPage title="política de privacidade." version="[DATA DE PUBLICAÇÃO]">
      <H2>1. quem somos</H2>
      <P>
        o nūtrk é um app de nutrição, treino e saúde mental. a controladora dos
        seus dados pessoais é <B>DUP.AGENCY TECNOLOGIA E CRIATIVIDADE LTDA</B>, CNPJ <B>22.297.356/0001-71</B>, com
        sede em <B>Rua Jerônimo Coelho, 78, Centro, Joinville/SC, CEP 89201-050</B> (&quot;nūtrk&quot;, &quot;nós&quot;).
      </P>
      <P>
        quando um nutricionista ou personal trainer acompanha você pelo app, ele
        também trata seus dados para prestar o serviço dele. nesse papel, ele é
        responsável pelo próprio atendimento, conforme as normas da profissão.
      </P>

      <H2>2. quais dados coletamos</H2>
      <P>só coletamos o que o app precisa para funcionar. hoje são estes:</P>
      <UL>
        <LI>
          <B>conta:</B> nome, email, senha (guardada criptografada), nome de
          usuário e objetivo que você escolhe. se entrar com Google ou Apple,
          recebemos nome e email que o provedor liberar.
        </LI>
        <LI>
          <B>saúde e bem-estar (dados sensíveis):</B> o que você registra no
          app: refeições (feita ou pulada, se seguiu o plano, observações),
          treinos e cargas, água, humor, sono (horas e qualidade), sessões de
          respiração, questionário inicial (&quot;como você chega&quot;:
          bem-estar, energia, sintomas que você marcar, qualidade do sono e
          observações) e check-ins periódicos (sensação com o corpo, energia,
          como a roupa está servindo).
        </LI>
        <LI>
          <B>fotos de refeições:</B> só se você tirar ou escolher uma foto ao
          registrar uma refeição. o app pede acesso à câmera ou às fotos apenas
          nesse momento.
        </LI>
        <LI>
          <B>planos montados pelo profissional:</B> plano alimentar e de treino
          criados para você, pedidos de troca que você faz e notas do
          profissional sobre o seu acompanhamento.
        </LI>
        <LI>
          <B>mensagens:</B> conversas com seu profissional e mensagens nas
          turmas de amigos.
        </LI>
        <LI>
          <B>turmas:</B> nome da turma, quem participa, convites e uma
          pontuação diária (de 0 a 5 pilares cumpridos). os colegas de turma
          veem seu nome, nome de usuário, foto de perfil (se houver) e essa
          pontuação, nunca os seus registros detalhados.
        </LI>
        <LI>
          <B>consultas:</B> pedidos de agendamento e seu status.
        </LI>
        <LI>
          <B>profissionais:</B> nome, email, telefone, clínica, registro
          profissional (CRN/CREF), apresentação e especialidades; para cobrança,
          CPF ou CNPJ e dados de pagamento, tratados pelo Asaas.
        </LI>
        <LI>
          <B>dados técnicos:</B> endereço IP, tipo de dispositivo e navegador, e
          registros de acesso e erros, usados para segurança e para o app
          funcionar. no aplicativo de celular, também um identificador do
          dispositivo para enviar notificações push.
        </LI>
      </UL>
      <P>
        <B>não coletamos:</B> localização, contatos, dados do app Saúde ou
        Health Connect, peso ou medidas corporais, nem usamos publicidade ou
        rastreamento entre apps e sites.
      </P>

      <H2>3. para que usamos e em que base legal</H2>
      <UL>
        <LI>
          <B>prestar o serviço</B> (criar conta, mostrar planos, registrar seu
          dia, chat, turmas, consultas): execução de contrato (LGPD, art. 7º,
          V).
        </LI>
        <LI>
          <B>dados de saúde e bem-estar</B> (dados pessoais sensíveis, LGPD,
          art. 11): tratados com o seu <B>consentimento</B>, dado de forma
          específica quando você os registra e, para o compartilhamento com um
          profissional, quando você usa um código de convite para se vincular a
          ele. você pode retirar o consentimento a qualquer momento (veja
          &quot;seus direitos&quot;). em alguns casos, a tutela da saúde por
          profissional da área (art. 11, II, f) também pode servir de base para
          o tratamento feito pelo profissional.
        </LI>
        <LI>
          <B>notificações e emails do serviço</B> (lembretes, mensagens, avisos
          de plano e de cobrança): execução de contrato e legítimo interesse.
        </LI>
        <LI>
          <B>segurança, prevenção a fraude e cumprimento de obrigações
          legais</B>: legítimo interesse e obrigação legal.
        </LI>
        <LI>
          <B>cobrança dos profissionais:</B> execução de contrato e obrigação
          legal (fiscal).
        </LI>
      </UL>
      <P>
        não vendemos seus dados e não os usamos para publicidade. não tomamos
        decisões automatizadas que produzam efeitos jurídicos sobre você.
      </P>

      <H2>4. com quem compartilhamos</H2>
      <P>
        <B>profissional vinculado.</B> se você se vincular a um nutricionista ou
        personal pelo código de convite, ele passa a ver seus registros
        (refeições e fotos, treinos, água, humor, sono, check-ins, questionário
        e mensagens) para acompanhar você. você pode encerrar o vínculo quando
        quiser, no seu perfil; o acesso dele termina em seguida.
      </P>
      <P>
        <B>colegas de turma</B> veem apenas os dados descritos na seção 2
        (turmas). as mensagens da turma são visíveis para os membros dela.
      </P>
      <P>
        <B>operadores</B> que tratam dados em nosso nome, sob contrato:
      </P>
      <UL>
        <LI>Supabase: banco de dados, autenticação e armazenamento de fotos.</LI>
        <LI>Vercel: hospedagem do site e do app.</LI>
        <LI>Resend: envio de emails do serviço.</LI>
        <LI>Asaas: cobrança da assinatura dos profissionais.</LI>
        <LI>Google e Apple: login social, se você escolher usá-lo.</LI>
        <LI>
          Firebase Cloud Messaging (Google) e Apple Push Notification service:
          entrega de notificações push no celular.
        </LI>
      </UL>
      <P>
        também podemos compartilhar dados quando a lei ou ordem de autoridade
        exigir. alguns desses operadores ficam fora do Brasil; nesses casos a
        transferência internacional segue o art. 33 da LGPD, com cláusulas
        contratuais e garantias adequadas.
      </P>

      <H2>5. por quanto tempo guardamos</H2>
      <P>
        guardamos seus dados enquanto sua conta existir. ao excluir a conta, os
        dados pessoais e as fotos são apagados ou anonimizados, exceto o que
        precisarmos manter por obrigação legal ou para defesa em processos (por
        exemplo, registros fiscais de cobrança de profissionais, por até
        5 anos). cópias de segurança são sobrescritas em até 30 dias.
        o profissional pode ter o dever de manter o prontuário do atendimento
        que ele mesmo realizou, conforme as normas do seu conselho.
      </P>

      <H2>6. como excluir sua conta e seus dados</H2>
      <P>
        dentro do app: perfil, configurações, excluir conta. sem o app, veja a
        página{" "}
        <Link href="/excluir-conta" style={{ color: "var(--color-orange)", fontWeight: 600 }}>
          /excluir-conta
        </Link>{" "}
        ou escreva para app@nutrk.io pelo email da conta.
      </P>

      <H2>7. seus direitos (LGPD, art. 18)</H2>
      <P>
        você pode pedir, a qualquer momento e gratuitamente: confirmação de que
        tratamos seus dados; acesso; correção; anonimização, bloqueio ou
        eliminação de dados desnecessários; portabilidade; eliminação dos dados
        tratados com consentimento; informação sobre com quem compartilhamos;
        informação sobre a possibilidade de não consentir e suas consequências;
        e revogação do consentimento. basta escrever para app@nutrk.io.
        respondemos em até 15 dias. você também pode reclamar à Autoridade
        Nacional de Proteção de Dados (ANPD).
      </P>

      <H2>8. segurança</H2>
      <P>
        usamos conexão criptografada (HTTPS), controle de acesso por conta e
        regras no banco para que cada pessoa veja só o que lhe pertence ou o que
        você liberou. nenhum sistema é 100% seguro; se houver incidente que
        possa causar risco relevante, avisaremos você e a ANPD, como a lei
        manda.
      </P>

      <H2>9. crianças e adolescentes</H2>
      <P>
        o nūtrk é para maiores de <B>18 anos</B>. não coletamos dados de
        menores de propósito. se soubermos que uma conta é de menor, vamos
        encerrá-la e apagar os dados. se você acha que isso aconteceu, avise em
        app@nutrk.io.
      </P>

      <H2>10. cookies e rastreamento</H2>
      <P>
        usamos apenas cookies necessários para manter você logado. não usamos
        cookies de publicidade nem ferramentas de rastreamento de terceiros.
      </P>

      <H2>11. encarregado (DPO)</H2>
      <P>
        encarregado pelo tratamento de dados: <B>[NOME DO ENCARREGADO]</B>,
        contato privacidade@nutrk.io.
      </P>

      <H2>12. mudanças nesta política</H2>
      <P>
        se mudarmos algo relevante, avisamos no app ou por email antes de a
        mudança valer, e a data no topo desta página será atualizada. se a
        mudança exigir novo consentimento, vamos pedi-lo.
      </P>
    </LegalPage>
  );
}
