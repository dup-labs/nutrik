import GradText from "@/components/ui/GradText";
import PhoneFrame from "@/components/ui/PhoneFrame";
import PlanoScreen from "@/components/app-screens/PlanoScreen";
import NutricaoScreen from "@/components/app-screens/NutricaoScreen";
import RespiracaoScreen from "@/components/app-screens/RespiracaoScreen";

export default function AppShowcase() {
  return (
    <section id="app" style={{ padding: "96px 0 104px", position: "relative" }}>
      <div className="container">
        <div className="reveal" style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 8px", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <span className="pill-label">O app</span>
          <h2 className="h2">Seu dia inteiro <GradText>em um só lugar.</GradText></h2>
          <p className="lead" style={{ maxWidth: 520 }}>
            Nutrição, treino e mente conversam entre si. Um plano diário simples de seguir — e fácil de manter, no seu ritmo.
          </p>
        </div>
        <div className="phone-row">
          <div className="reveal reveal-d1 phone-a">
            <PhoneFrame width={280}><NutricaoScreen /></PhoneFrame>
          </div>
          <div className="reveal phone-b">
            <PhoneFrame width={300}><PlanoScreen /></PhoneFrame>
          </div>
          <div className="reveal reveal-d1 phone-c">
            <PhoneFrame width={280}><RespiracaoScreen /></PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
