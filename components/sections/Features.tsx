"use client";

import Icon from "@/components/ui/Icon";

/* ── Mini UI — Patient List ──────────────────────────────── */
function MiniPatientList() {
  const rows = [
    { initials: "JF", name: "João Ferreira", pct: 87, debt: false },
    { initials: "AC", name: "Ana Costa",     pct: 72, debt: true  },
    { initials: "PL", name: "Pedro Lima",    pct: 91, debt: false },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {rows.map(r => (
        <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", background: "rgba(255,255,255,0.025)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--color-blue-subtle)", border: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontFamily: "var(--font-interface)", fontWeight: 600, color: "var(--color-blue-glow)", flexShrink: 0 }}>{r.initials}</div>
          <span style={{ fontFamily: "var(--font-interface)", fontSize: 12, fontWeight: 500, color: "var(--color-text)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
          <div className="bar-track" style={{ width: 54 }}><div className="bar-fill" style={{ width: `${r.pct}%`, background: r.pct >= 85 ? "var(--color-blue-glow)" : "#4a8fa0" }} /></div>
          <span style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--color-text-muted)", minWidth: 26, textAlign: "right" }}>{r.pct}%</span>
          {r.debt && <span style={{ fontSize: 9, fontFamily: "var(--font-interface)", color: "var(--color-error)", background: "rgba(255,75,75,0.1)", border: "1px solid rgba(255,75,75,0.2)", borderRadius: 4, padding: "1px 5px", fontWeight: 500 }}>ATRASO</span>}
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: "rgba(109,164,183,0.05)", borderRadius: 8, border: "var(--glass-border)", marginTop: 2 }}>
        <span className="label">Aderência média</span>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 18, color: "var(--color-blue-glow)", lineHeight: 1 }}>83%</span>
      </div>
    </div>
  );
}

/* ── Mini UI — Protocol ──────────────────────────────────── */
function MiniProtocol() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {[
        { role: "NUTRICIONISTA", proto: "Cutting Q2 2026",      icon: "utensils", color: "#0DB9D7"                  },
        { role: "PERSONAL",      proto: "Hipertrofia — Fase 2", icon: "activity", color: "var(--color-blue-glow)"   },
      ].map(({ role, proto, icon, color }) => (
        <div key={role} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.025)", borderRadius: 8, border: "1px solid rgba(109,164,183,0.12)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 6, background: "var(--color-blue-subtle)", border: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name={icon} size={13} color={color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="label" style={{ marginBottom: 2 }}>{role}</div>
            <div style={{ fontFamily: "var(--font-interface)", fontSize: 12, fontWeight: 500, color: "var(--color-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{proto}</div>
          </div>
          <span style={{ fontSize: 9, fontFamily: "var(--font-interface)", color: "var(--color-blue-glow)", background: "var(--color-blue-subtle)", border: "var(--glass-border)", borderRadius: 4, padding: "2px 6px", fontWeight: 500, flexShrink: 0 }}>ATIVO</span>
        </div>
      ))}
      <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="label" style={{ marginBottom: 4 }}>Comentário interno</div>
        <p style={{ fontFamily: "var(--font-interface)", fontSize: 11, color: "var(--color-text-muted)", margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>Atenção ao consumo proteico nos dias de treino pesado.</p>
      </div>
    </div>
  );
}

/* ── Mini UI — Tracking ──────────────────────────────────── */
function MiniTracking() {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const missed = new Set(["4-3", "6-1"]);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5, marginBottom: 10 }}>
        {days.map((day, di) => (
          <div key={di}>
            <div className="label" style={{ textAlign: "center", marginBottom: 6, fontSize: 9 }}>{day}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[0, 1, 2, 3].map(mi => {
                const bad = missed.has(`${di}-${mi}`);
                return (
                  <div key={mi} style={{ height: 20, borderRadius: 4, background: bad ? "rgba(255,75,75,0.10)" : "rgba(109,164,183,0.08)", border: bad ? "1px solid rgba(255,75,75,0.22)" : "1px solid rgba(109,164,183,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={bad ? "xmark" : "check"} size={9} color={bad ? "#CC2E2E" : "#6DA4B7"} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 12px", background: "rgba(109,164,183,0.06)", borderRadius: 7, border: "var(--glass-border)" }}>
        <span className="label">Esta semana</span>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 18, color: "var(--color-blue-glow)", lineHeight: 1 }}>90%</span>
      </div>
    </div>
  );
}

/* ── Mini UI — Agenda ────────────────────────────────────── */
function MiniAgenda() {
  const appts = [
    { time: "09:00", name: "Sofia Rocha",   type: "Retorno",   init: "SR" },
    { time: "10:30", name: "Pedro Lima",    type: "Avaliação", init: "PL" },
    { time: "14:00", name: "João Ferreira", type: "Consulta",  init: "JF" },
    { time: "15:30", name: "Ana Costa",     type: "Retorno",   init: "AC" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {["Seg", "Ter", "Qua", "Qui", "Sex"].map((d, i) => (
          <div key={d} style={{ flex: 1, textAlign: "center", padding: "4px 2px", borderRadius: 5, background: i === 2 ? "var(--color-blue-subtle)" : "rgba(255,255,255,0.025)", border: i === 2 ? "var(--glass-border)" : "1px solid rgba(255,255,255,0.04)", fontFamily: "var(--font-interface)", fontSize: 9, color: i === 2 ? "var(--color-blue-glow)" : "var(--color-text-muted)", fontWeight: i === 2 ? 500 : 400 }}>{d}</div>
        ))}
      </div>
      {appts.map(({ time, name, type, init }) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 9px", background: "rgba(255,255,255,0.025)", borderRadius: 7, border: "1px solid rgba(255,255,255,0.04)" }}>
          <span style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--color-text-muted)", minWidth: 36 }}>{time}</span>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--color-blue-subtle)", border: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontFamily: "var(--font-interface)", fontWeight: 700, color: "var(--color-blue-glow)", flexShrink: 0 }}>{init}</div>
          <span style={{ fontFamily: "var(--font-interface)", fontSize: 11, color: "var(--color-text)", flex: 1, fontWeight: 500 }}>{name}</span>
          <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, fontFamily: "var(--font-interface)", color: "var(--color-text-muted)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>{type}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Mini UI — Notification ──────────────────────────────── */
function MiniNotification() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "rgba(109,164,183,0.06)", borderRadius: 8, border: "var(--glass-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Icon name="users" size={13} color="var(--color-blue-glow)" />
          <span style={{ fontFamily: "var(--font-interface)", fontSize: 12, color: "var(--color-text)", fontWeight: 500 }}>Todos os pacientes ativos</span>
        </div>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 18, color: "var(--color-blue-glow)", lineHeight: 1 }}>48</span>
      </div>
      <div style={{ padding: "10px 10px", background: "rgba(255,255,255,0.025)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="label" style={{ marginBottom: 5 }}>Mensagem</div>
        <p style={{ fontFamily: "var(--font-interface)", fontSize: 12, color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
          &ldquo;Lembrete: semana de check-in de peso. Registre no app até sexta.&rdquo;
        </p>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <div style={{ flex: 1, height: 28, background: "rgba(255,255,255,0.03)", borderRadius: 7, border: "var(--glass-border)", display: "flex", alignItems: "center", padding: "0 10px" }}>
          <span style={{ fontFamily: "var(--font-interface)", fontSize: 11, color: "var(--color-text-disabled)" }}>Agendar envio...</span>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--color-blue-subtle)", border: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="send" size={12} color="var(--color-blue-glow)" />
        </div>
      </div>
    </div>
  );
}

/* ── Mini UI — Feedback ──────────────────────────────────── */
function MiniFeedback() {
  const responses = [
    { name: "João F.", text: "Semana puxada no trabalho, mas me mantive no protocolo.", mood: 3 },
    { name: "Sofia R.", text: "Me senti bem nos treinos. Dieta ok essa semana.",         mood: 5 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "rgba(109,164,183,0.06)", borderRadius: 7, border: "var(--glass-border)" }}>
        <Icon name="send" size={12} color="var(--color-blue-glow)" />
        <span style={{ fontFamily: "var(--font-interface)", fontSize: 11, color: "var(--color-text)", flex: 1, fontWeight: 500 }}>Envio automático a cada 7 dias</span>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 14, color: "var(--color-blue-glow)" }}>73%</span>
        <span style={{ fontFamily: "var(--font-interface)", fontSize: 9, color: "var(--color-text-muted)" }}>resp.</span>
      </div>
      {responses.map(({ name, text, mood }) => (
        <div key={name} style={{ padding: "9px 10px", background: "rgba(255,255,255,0.025)", borderRadius: 7, border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <span style={{ fontFamily: "var(--font-interface)", fontSize: 11, fontWeight: 500, color: "var(--color-text)" }}>{name}</span>
            <div style={{ display: "flex", gap: 2 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} style={{ width: 6, height: 6, borderRadius: "50%", background: n <= mood ? "var(--color-blue-glow)" : "rgba(255,255,255,0.1)" }} />
              ))}
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-interface)", fontSize: 11, color: "var(--color-text-muted)", margin: 0, fontStyle: "italic", lineHeight: 1.4 }}>{text}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Features Section ────────────────────────────────────── */
const cards = [
  { icon: "users",    title: "Visão total dos seus pacientes",  desc: "Dashboard com aderência, status financeiro e alertas de todos os pacientes — em tempo real.",       Mini: MiniPatientList  },
  { icon: "link",     title: "Protocolo integrado com o par",   desc: "Nutricionista e personal na mesma plataforma. Comentários internos e visão compartilhada.",          Mini: MiniProtocol     },
  { icon: "chart",    title: "Acompanhamento entre consultas",  desc: "Registros diários de refeição, treino e sono. O paciente registra; você acompanha.",                 Mini: MiniTracking     },
  { icon: "calendar", title: "Agenda integrada",                desc: "Gerencie consultas, avaliações e retornos em um calendário conectado ao perfil de cada paciente.",   Mini: MiniAgenda       },
  { icon: "bell",     title: "Notificações em massa",           desc: "Envie lembretes e avisos para todos os pacientes ativos de uma vez, com agendamento de envio.",       Mini: MiniNotification },
  { icon: "msgCircle",title: "Feedback periódico",              desc: "Solicitação automática semanal — índice de humor, dificuldades e relato livre do paciente.",          Mini: MiniFeedback     },
];

export default function Features() {
  return (
    <section id="funcionalidades" style={{ padding: "112px 0" }}>
      <div className="container">
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56, display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          <div className="label">Funcionalidades</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 700, letterSpacing: "var(--tracking-tight)", color: "var(--color-text)", maxWidth: 540, lineHeight: 1.1 }}>
            Tudo que um protocolo precisa para se manter vivo.
          </h2>
        </div>

        <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {cards.map(({ icon, title, desc, Mini }, i) => (
            <div key={title} className={`glass feat-card reveal reveal-delay-${Math.min((i % 3) + 1, 3)}`} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--color-blue-subtle)", border: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={icon} size={17} color="var(--color-blue-glow)" />
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--color-text)", letterSpacing: "var(--tracking-tight)" }}>{title}</h3>
                <p style={{ fontFamily: "var(--font-interface)", fontSize: 13, lineHeight: 1.6, color: "var(--color-text-muted)", margin: 0 }}>{desc}</p>
              </div>
              <div style={{ padding: 12, background: "rgba(5,7,11,0.55)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)", flex: 1 }}>
                <Mini />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
