// lp-extra.jsx — Gamification + Mobile sections
// Requires: lp-showcase.jsx (window.Icon), NTrkDesignSystem_f3965d

const { Button, StreakRing } = window.NTrkDesignSystem_f3965d;
const Icon = window.Icon;

/* ── Patient phone content ───────────────────────────────── */
function PatientPhoneContent() {
  const items = [
    { label: 'Café da manhã', icon: 'utensils', done: true  },
    { label: 'Almoço',        icon: 'utensils', done: true  },
    { label: 'Pré-treino',    icon: 'utensils', done: true  },
    { label: 'Jantar',        icon: 'utensils', done: false },
    { label: 'Treino',        icon: 'activity', done: true  },
    { label: 'Sono (7h20)',   icon: 'moon',     done: true  },
  ];
  return (
    <div style={{ background: 'var(--color-base)', padding: '14px', display: 'flex', flexDirection: 'column', gap: 11 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src="assets/nutrk-logo.svg" alt="Nūtrk" style={{ height: 13 }} />
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: 'var(--color-amber)' }}>12 dias</span>
      </div>

      {/* Streak ring */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <StreakRing days={12} size={96} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--color-text)', letterSpacing: 'var(--tracking-tight)' }}>12 dias de ofensiva</div>
          <div style={{ fontFamily: 'var(--font-interface)', fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>Recorde pessoal: 18 dias</div>
        </div>
      </div>

      {/* Today */}
      <div>
        <div style={{ fontFamily: 'var(--font-interface)', fontSize: 9, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 6 }}>Hoje</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {items.map(({ label, icon, done }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 9px', background: done ? 'rgba(109,164,183,0.06)' : 'rgba(255,178,58,0.06)', borderRadius: 8, border: done ? 'var(--glass-border)' : 'var(--glass-border-streak)' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: done ? 'var(--color-blue-subtle)' : 'var(--color-amber-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={done ? 'check' : icon} size={9} color={done ? 'var(--color-blue-glow)' : 'var(--color-amber)'} />
              </div>
              <span style={{ fontFamily: 'var(--font-interface)', fontSize: 11, color: done ? 'var(--color-text)' : 'var(--color-amber)', flex: 1 }}>{label}</span>
              {!done && <span style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: 'var(--color-amber)', letterSpacing: '0.04em' }}>PENDENTE</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Streak message */}
      <div style={{ padding: '9px 11px', background: 'var(--glass-bg-streak)', border: 'var(--glass-border-streak)', borderRadius: 8, backdropFilter: 'var(--glass-blur)' }}>
        <p style={{ fontFamily: 'var(--font-interface)', fontSize: 11, color: 'var(--color-amber)', margin: 0, lineHeight: 1.5 }}>
          Continue. Você está a 6 dias do seu recorde pessoal.
        </p>
      </div>
    </div>
  );
}

/* ── Gamification section ────────────────────────────────── */
function GamificationSection({ onCTA }) {
  return (
    <section style={{ padding: '80px 0 112px', position: 'relative', overflow: 'hidden' }}>
      {/* Amber atmospheric glow */}
      <div style={{ position: 'absolute', bottom: '-15%', right: '5%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,178,58,0.09) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,178,58,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div className="container">
        <div className="gami-grid reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>

          {/* Left: copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ fontFamily: 'var(--font-interface)', fontSize: 11, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-amber)' }}>Gamificação</div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 50px)', fontWeight: 800, letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text)', lineHeight: 1.05, margin: 0 }}>
              Seu paciente não consulta você todo dia.{' '}
              <span style={{ color: 'var(--color-blue-glow)' }}>O app, sim.</span>
            </h2>

            <p style={{ fontFamily: 'var(--font-interface)', fontSize: 16, lineHeight: 1.65, color: 'var(--color-text-muted)', maxWidth: 440, margin: 0 }}>
              O paciente tem um aplicativo com sistema de gamificação e ofensiva — cada refeição, treino e hora de sono registrados constroem a sequência que maximiza a aderência ao protocolo.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Ofensiva diária — streak de aderência ao protocolo completo',
                'Metas por refeição, treino e sono registradas pelo paciente',
                'Notificações de incentivo automáticas nos momentos certos',
                'Conquistas desbloqueadas por consistência, não por perfeição',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--color-amber-subtle)', border: 'var(--glass-border-streak)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <Icon name="check" size={9} color="var(--color-amber)" />
                  </div>
                  <span style={{ fontFamily: 'var(--font-interface)', fontSize: 14, color: 'var(--color-text)', lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>

            <div>
              <Button variant="primary" size="md" onClick={onCTA}>Solicitar acesso antecipado</Button>
            </div>
          </div>

          {/* Right: phone mockup */}
          <div className="phone-side reveal reveal-delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 256, borderRadius: 34, background: 'var(--color-base)', border: '6px solid rgba(255,255,255,0.10)', boxShadow: 'var(--glow-amber), var(--shadow-elevated), 0 0 0 1px rgba(255,178,58,0.15)', overflow: 'hidden' }}>
              {/* Status bar */}
              <div style={{ background: 'var(--color-surface)', padding: '7px 16px 5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: 'var(--color-text-muted)' }}>9:41</span>
                <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
                  {[10,12,14,16].map((h, i) => (
                    <div key={i} style={{ width: 3, height: h, background: i < 3 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)', borderRadius: 1 }} />
                  ))}
                  <div style={{ width: 16, height: 8, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, marginLeft: 4, display: 'flex', padding: '1px', alignItems: 'center' }}>
                    <div style={{ height: '100%', width: '80%', background: 'var(--color-success)', borderRadius: 1 }} />
                  </div>
                </div>
              </div>
              <PatientPhoneContent />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Mobile section ──────────────────────────────────────── */
function MobileSection() {
  return (
    <section style={{ padding: '0 0 80px' }}>
      <div className="container">
        <div className="glass reveal" style={{ padding: '36px 40px', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'var(--color-blue-subtle)', border: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="smartphone" size={26} color="var(--color-blue-glow)" />
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontFamily: 'var(--font-interface)', fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 8 }}>App mobile — nutricionista</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text)', marginBottom: 8, margin: '0 0 8px' }}>
              Acompanhe seus pacientes de qualquer lugar.
            </h3>
            <p style={{ fontFamily: 'var(--font-interface)', fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted)', margin: 0, maxWidth: 500 }}>
              Dashboard completo no celular — alertas de aderência, atualizações de protocolo e mensagens de pacientes onde você estiver.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
            {[
              { icon: 'bell',      text: 'Alertas em tempo real' },
              { icon: 'users',     text: 'Lista de pacientes' },
              { icon: 'msgCircle', text: 'Feedback e dúvidas' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name={icon} size={14} color="var(--color-blue-glow)" />
                <span style={{ fontFamily: 'var(--font-interface)', fontSize: 13, color: 'var(--color-text-muted)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { GamificationSection, MobileSection });
