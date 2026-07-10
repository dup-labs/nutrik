import GradText from "@/components/ui/GradText";
import AppCarousel from "@/components/showcase/AppCarousel";

export default function AppShowcase() {
  return (
    <section id="app" style={{ padding: "96px 0 104px", position: "relative", overflow: "hidden" }}>
      <div className="container">
        <div className="reveal" style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 8px", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <span className="pill-label">O app</span>
          <h2 className="h2">Seu dia inteiro <GradText>em um só lugar.</GradText></h2>
          <p className="lead" style={{ maxWidth: 540 }}>
            Nutrição, treino e mente conversam entre si — e a sua turma te puxa pra frente. Telas de verdade do que já roda hoje.
          </p>
        </div>
      </div>
      <div className="reveal reveal-d1">
        <AppCarousel />
      </div>
    </section>
  );
}
