import GradText from "@/components/ui/GradText";
import PhoneFrame from "@/components/ui/PhoneFrame";
import HojeScreen from "@/components/app-screens/HojeScreen";
import TreinoScreen from "@/components/app-screens/TreinoScreen";
import RefeicoesScreen from "@/components/app-screens/RefeicoesScreen";
import RankingScreen from "@/components/app-screens/RankingScreen";

export default function AppShowcase() {
  return (
    <section id="app" style={{ padding: "96px 0 104px", position: "relative" }}>
      <div className="container">
        <div className="reveal" style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 8px", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <span className="pill-label">O app</span>
          <h2 className="h2">Seu dia inteiro <GradText>em um só lugar.</GradText></h2>
          <p className="lead" style={{ maxWidth: 540 }}>
            Nutrição, treino e mente conversam entre si — e a sua turma te puxa pra frente. Telas de verdade do que já roda hoje.
          </p>
        </div>
      </div>
      {/* fileira de telefones num container próprio, mais largo que o padrão */}
      <div className="phone-wrap">
        <div className="phone-row">
          <div className="reveal reveal-d0 phone-slot"><PhoneFrame width={300}><HojeScreen /></PhoneFrame></div>
          <div className="reveal reveal-d1 phone-slot"><PhoneFrame width={300}><TreinoScreen /></PhoneFrame></div>
          <div className="reveal reveal-d2 phone-slot"><PhoneFrame width={300}><RefeicoesScreen /></PhoneFrame></div>
          <div className="reveal reveal-d3 phone-slot"><PhoneFrame width={300}><RankingScreen /></PhoneFrame></div>
        </div>
      </div>
    </section>
  );
}
