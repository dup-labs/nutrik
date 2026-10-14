import type { Metadata } from "next";
import { RequestForm } from "./RequestForm";
import { BackButton } from "@/components/ui/BackButton";

export const metadata: Metadata = {
  title: "Excluir conta — Nūtrk",
  description: "como excluir sua conta e seus dados do nūtrk.",
};

const h2: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 800,
  fontSize: 20,
  letterSpacing: "-0.02em",
  margin: "36px 0 10px",
};
const p: React.CSSProperties = { fontSize: 15, lineHeight: 1.65, color: "var(--color-text-secondary)", margin: "0 0 10px" };
const ul: React.CSSProperties = { ...p, paddingLeft: 20 };

export default async function ExcluirContaPage({
  searchParams,
}: {
  searchParams: Promise<{ concluida?: string }>;
}) {
  const { concluida } = await searchParams;

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 64px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <BackButton />
        <div style={{ fontWeight: 900, fontSize: 26, letterSpacing: "-0.03em" }}>nūtrk</div>
      </div>

      {concluida ? (
        <div style={{ background: "rgba(47,158,107,0.10)", border: "1px solid rgba(47,158,107,0.24)", borderRadius: "var(--radius-md)", padding: 20, marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#2f9e6b" }}>conta excluída.</div>
          <p style={{ ...p, margin: "8px 0 0" }}>
            seus dados foram apagados. obrigado por ter passado por aqui, a
            porta fica aberta se quiser voltar.
          </p>
        </div>
      ) : (
        <>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 30, letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            excluir sua conta
          </h1>
          <p style={p}>
            você decide quando ir, e a gente apaga seus dados. dá pra fazer
            sozinho pelo app, ou pedir aqui se não tem mais acesso.
          </p>
        </>
      )}

      <h2 style={h2}>pelo app (mais rápido)</h2>
      <ul style={ul}>
        <li><strong>paciente:</strong> perfil, depois configurações, depois &ldquo;excluir minha conta&rdquo;.</li>
        <li><strong>profissional:</strong> perfil, depois &ldquo;excluir minha conta&rdquo;, no fim da página.</li>
      </ul>
      <p style={p}>você confirma digitando &ldquo;excluir&rdquo;. a exclusão é imediata.</p>

      <h2 style={h2}>sem acesso ao app</h2>
      <p style={p}>
        manda o email da conta. a gente responde nele pra confirmar que é você
        e conclui em até 30 dias. também dá pra escrever direto pra{" "}
        <a href="mailto:app@nutrk.io" style={{ color: "var(--color-orange)" }}>app@nutrk.io</a>.
      </p>
      <RequestForm />

      <h2 style={h2}>o que é apagado</h2>
      <ul style={ul}>
        <li>seu login (email e senha ou conta Google/Apple) e seu perfil;</li>
        <li>tudo o que você registrou: refeições, treinos, água, sono, humor, respiração, check-ins e conquistas;</li>
        <li>fotos de refeição que você enviou;</li>
        <li>mensagens com seu profissional (ou com seus pacientes) e os vínculos entre vocês;</li>
        <li>participação em turmas e suas mensagens nelas. se você é dono de uma turma com outros membros, ela passa pro membro mais antigo;</li>
        <li>se você é profissional: seu perfil, código de convite, consultas, notas internas e vídeos. a assinatura é cancelada, sem novas cobranças.</li>
      </ul>

      <h2 style={h2}>o que pode ser mantido, e por quanto tempo</h2>
      <ul style={ul}>
        <li>
          <strong>registros de cobrança de profissionais</strong> (pagamentos,
          CPF/CNPJ e dados fiscais) ficam com o Asaas, nosso processador de
          pagamento, por até 5 anos, por obrigação legal e fiscal. não usamos
          esses dados pra mais nada;
        </li>
        <li>
          <strong>cópias de segurança</strong> da nossa base podem guardar
          dados já apagados por até 30 dias, até serem substituídas. depois
          disso, somem;
        </li>
        <li>
          <strong>o pedido de exclusão em si</strong> (email e data) fica
          guardado pelo tempo necessário pra comprovar que atendemos o pedido.
        </li>
      </ul>
      <p style={p}>
        dúvidas sobre seus dados? escreve pra{" "}
        <a href="mailto:app@nutrk.io" style={{ color: "var(--color-orange)" }}>app@nutrk.io</a>.
      </p>
    </main>
  );
}
