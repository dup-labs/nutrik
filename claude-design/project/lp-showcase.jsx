// lp-showcase.jsx — Icon system + Animated Product Showcase
// Exports: Icon, AnimatedProductShowcase → window

/* ── Icon paths (Lucide) ─────────────────────────────────── */
const PATHS = {
  layout:     `<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>`,
  users:      `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  calendar:   `<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>`,
  list:       `<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>`,
  chart:      `<line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>`,
  bell:       `<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>`,
  check:      `<path d="M20 6 9 17l-5-5"/>`,
  xmark:      `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
  flame:      `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/>`,
  arrowR:     `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`,
  link:       `<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="11" x2="13" y1="12" y2="12"/>`,
  utensils:   `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>`,
  activity:   `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
  moon:       `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`,
  msgCircle:  `<path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>`,
  smartphone: `<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>`,
  send:       `<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>`,
  zap:        `<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>`,
  search:     `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>`,
  pill:       `<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>`,
};

function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline-block', flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: PATHS[name] || '' }}
    />
  );
}

/* ── Section label helper ────────────────────────────────── */
function SL({ children, style = {} }) {
  return (
    <div style={{
      fontFamily: 'var(--font-interface)', fontSize: 9, fontWeight: 500,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      color: 'var(--color-text-muted)', ...style,
    }}>{children}</div>
  );
}

/* ── App top bar ─────────────────────────────────────────── */
function AppTopBar({ title }) {
  return (
    <div style={{
      height: 48, flexShrink: 0,
      background: 'rgba(5,7,11,0.55)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px',
    }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--color-text)', letterSpacing: 'var(--tracking-tight)' }}>{title}</span>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: 'var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '5px 10px', display: 'flex', gap: 6, alignItems: 'center', width: 148 }}>
          <Icon name="search" size={11} color="var(--color-text-disabled)" />
          <span style={{ fontFamily: 'var(--font-interface)', fontSize: 11, color: 'var(--color-text-disabled)' }}>Buscar...</span>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-blue-subtle)', border: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-interface)', fontSize: 9, fontWeight: 700, color: 'var(--color-blue-glow)' }}>BS</div>
      </div>
    </div>
  );
}

/* ── Screens ─────────────────────────────────────────────── */

function ShowDashboard() {
  const pts = [
    { i: 'JF', n: 'João Ferreira', s: 'ativo',   p: 87 },
    { i: 'AC', n: 'Ana Costa',     s: 'ativo',   p: 72, d: true },
    { i: 'PL', n: 'Pedro Lima',    s: 'ativo',   p: 91 },
    { i: 'CS', n: 'Carla Souza',   s: 'pausado', p: 45 },
    { i: 'LM', n: 'Lucas Mendes',  s: 'ativo',   p: 68, d: true },
    { i: 'SR', n: 'Sofia Rocha',   s: 'ativo',   p: 95 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppTopBar title="Dashboard" />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '14px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 12 }}>
          {[['48','Pacientes Ativos'],['7','Agendamentos Hoje'],['3','Alertas'],['2','Inadimplentes']].map(([n, l]) => (
            <div key={l} style={{ background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: 'var(--glass-border)', padding: '10px 12px' }}>
              <SL style={{ marginBottom: 5 }}>{l}</SL>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: 26, color: 'var(--color-text)', lineHeight: 1 }}>{n}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: 'var(--glass-border)', overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SL>Pacientes</SL>
            <div style={{ display: 'flex', gap: 4 }}>
              {['Todos','Ativos','Pausados'].map((f, j) => (
                <span key={f} style={{ padding: '2px 7px', fontSize: 9, fontFamily: 'var(--font-interface)', fontWeight: j === 0 ? 500 : 400, borderRadius: 'var(--radius-full)', border: j === 0 ? 'var(--glass-border)' : '1px solid rgba(255,255,255,0.06)', background: j === 0 ? 'var(--color-blue-subtle)' : 'transparent', color: j === 0 ? 'var(--color-blue-glow)' : 'var(--color-text-muted)' }}>{f}</span>
              ))}
            </div>
          </div>
          {pts.map(p => (
            <div key={p.n} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-blue-subtle)', border: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontFamily: 'var(--font-interface)', fontWeight: 600, color: 'var(--color-blue-glow)', flexShrink: 0 }}>{p.i}</div>
              <span style={{ fontFamily: 'var(--font-interface)', fontSize: 12, fontWeight: 500, color: 'var(--color-text)', flex: 1 }}>{p.n}</span>
              <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-interface)', fontWeight: 500, background: p.s === 'ativo' ? 'rgba(109,164,183,0.12)' : 'rgba(255,255,255,0.06)', border: p.s === 'ativo' ? 'var(--glass-border)' : '1px solid rgba(255,255,255,0.06)', color: p.s === 'ativo' ? 'var(--color-blue-glow)' : 'var(--color-text-muted)' }}>{p.s.toUpperCase()}</span>
              <div style={{ width: 60 }}><div style={{ height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 9999 }}><div style={{ width: `${p.p}%`, height: '100%', background: p.p >= 85 ? 'var(--color-blue-glow)' : p.p >= 65 ? '#4a8fa0' : 'var(--color-error)', borderRadius: 9999 }}/></div></div>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--color-text-muted)', minWidth: 24, textAlign: 'right' }}>{p.p}%</span>
              {p.d && <span style={{ fontSize: 8, fontFamily: 'var(--font-interface)', color: 'var(--color-error)', background: 'rgba(255,75,75,0.1)', border: '1px solid rgba(255,75,75,0.2)', borderRadius: 4, padding: '1px 5px', fontWeight: 500 }}>ATRASO</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShowPaciente() {
  const { StreakRing } = window.NTrkDesignSystem_f3965d;
  const scores = [
    { l: 'Aderência Dieta', v: 84, c: '#0DB9D7',               icon: 'utensils' },
    { l: 'Treino',          v: 91, c: 'var(--color-blue-glow)', icon: 'activity' },
    { l: 'Sono',            v: 72, c: '#9B59B6',               icon: 'moon'     },
    { l: 'Engajamento',     v: 88, c: 'var(--color-amber)',     icon: 'zap'      },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppTopBar title="Pacientes" />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '12px 20px' }}>
        <div style={{ fontFamily: 'var(--font-interface)', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10 }}>Pacientes <span style={{ color: 'var(--color-text)' }}>› João Ferreira</span></div>
        <div style={{ background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: 'var(--glass-border)', padding: '12px 14px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-blue-subtle)', border: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-interface)', fontWeight: 700, fontSize: 14, color: 'var(--color-blue-glow)', flexShrink: 0 }}>JF</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--color-text)', letterSpacing: 'var(--tracking-tight)' }}>João Ferreira</span>
              <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-interface)', fontWeight: 500, background: 'rgba(109,164,183,0.12)', border: 'var(--glass-border)', color: 'var(--color-blue-glow)' }}>ATIVO</span>
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              {['Musculação','Emagrecimento','26 anos','84 kg'].map(t => (
                <span key={t} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', fontFamily: 'var(--font-interface)', color: 'var(--color-text-muted)' }}>{t}</span>
              ))}
            </div>
          </div>
          <StreakRing days={12} size={52} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 10 }}>
          {scores.map(({ l, v, c, icon }) => (
            <div key={l} style={{ background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: 'var(--glass-border)', padding: '9px 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}><SL>{l}</SL><Icon name={icon} size={11} color={c} /></div>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: 18, color: c, lineHeight: 1, marginBottom: 5 }}>{v}%</div>
              <div style={{ height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 9999 }}><div style={{ width: `${v}%`, height: '100%', background: c, borderRadius: 9999 }}/></div>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: 'var(--glass-border)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {['Protocolo','Histórico','Resultados','Dúvidas'].map((t, j) => (
              <div key={t} style={{ padding: '8px 14px', fontSize: 11, fontFamily: 'var(--font-interface)', fontWeight: j === 0 ? 500 : 400, color: j === 0 ? 'var(--color-text)' : 'var(--color-text-muted)', borderBottom: j === 0 ? '2px solid var(--color-blue-glow)' : '2px solid transparent', marginBottom: -1 }}>{t}</div>
            ))}
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', gap: 8 }}>
            {[{type:'Protocolo Alimentar',proto:'Cutting Q2 2026',icon:'utensils'},{type:'Protocolo de Treino',proto:'Hipertrofia — Fase 2',icon:'activity'}].map(({ type, proto, icon }) => (
              <div key={type} style={{ flex: 1, background: 'rgba(109,164,183,0.05)', borderRadius: 'var(--radius-md)', border: 'var(--glass-border)', padding: '10px 12px' }}>
                <SL style={{ marginBottom: 4 }}>{type}</SL>
                <div style={{ fontFamily: 'var(--font-interface)', fontSize: 12, fontWeight: 500, color: 'var(--color-text)', marginBottom: 6 }}>{proto}</div>
                <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-interface)', fontWeight: 500, background: 'var(--color-blue-subtle)', border: 'var(--glass-border)', color: 'var(--color-blue-glow)' }}>ATIVO</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowAgenda() {
  const wk = [{ d:'Seg',n:9 },{ d:'Ter',n:10 },{ d:'Qua',n:11,a:true },{ d:'Qui',n:12 },{ d:'Sex',n:13 },{ d:'Sáb',n:14 }];
  const appts = [
    { t:'09:00', n:'Sofia Rocha',    tp:'Retorno',     i:'SR' },
    { t:'10:30', n:'Pedro Lima',     tp:'Avaliação',   i:'PL' },
    { t:'13:30', n:'João Ferreira',  tp:'Consulta',    i:'JF' },
    { t:'15:00', n:'Ana Costa',      tp:'Retorno',     i:'AC' },
    { t:'16:30', n:'Lucas Mendes',   tp:'1ª Consulta', i:'LM' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppTopBar title="Agenda" />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '14px 20px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: 'var(--glass-border)', padding: '8px 10px' }}>
          {wk.map(({ d, n, a }) => (
            <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '5px 4px', borderRadius: 'var(--radius-sm)', background: a ? 'var(--color-blue-subtle)' : 'transparent', border: a ? 'var(--glass-border)' : '1px solid transparent' }}>
              <span style={{ fontFamily: 'var(--font-interface)', fontSize: 8, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: a ? 'var(--color-blue-glow)' : 'var(--color-text-muted)' }}>{d}</span>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 13, color: a ? 'var(--color-text)' : 'var(--color-text-muted)' }}>{n}</span>
              {a && <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-blue-glow)' }}/>}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {appts.map(({ t, n, tp, i }) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 14px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: 'var(--glass-border)' }}>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 12, color: 'var(--color-text-muted)', minWidth: 42 }}>{t}</span>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-blue-subtle)', border: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontFamily: 'var(--font-interface)', fontWeight: 700, color: 'var(--color-blue-glow)', flexShrink: 0 }}>{i}</div>
              <span style={{ fontFamily: 'var(--font-interface)', fontSize: 13, fontWeight: 500, color: 'var(--color-text)', flex: 1 }}>{n}</span>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--font-interface)', color: 'var(--color-text-muted)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>{tp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShowProtocolo() {
  const [day, setDay] = React.useState(0);
  const days = ['SEG','TER','QUA','QUI','SEX','SÁB'];
  const names = ['Peito + Tríceps','Costas + Bíceps','Descanso','Pernas','Ombros','Cardio'];
  const exs = [
    { n:'Supino Reto',       s:'4', r:'10–12', l:'80 kg' },
    { n:'Supino Inclinado',  s:'3', r:'12',    l:'60 kg' },
    { n:'Crucifixo',         s:'3', r:'15',    l:'20 kg' },
    { n:'Tríceps Pulley',    s:'4', r:'12',    l:'35 kg' },
    { n:'Tríceps Testa',     s:'3', r:'12',    l:'25 kg' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppTopBar title="Protocolos" />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '12px 20px' }}>
        <div style={{ fontFamily: 'var(--font-interface)', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10 }}>Protocolos <span style={{ color: 'var(--color-text)' }}>› João Ferreira</span></div>
        <div style={{ background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: 'var(--glass-border)', padding: '10px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--color-text)', letterSpacing: 'var(--tracking-tight)' }}>Hipertrofia — Fase 2</div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>01 Jun — 01 Jul 2026 · {names[day]}</div>
          </div>
          <span style={{ fontSize: 8, padding: '2px 7px', borderRadius: 4, fontFamily: 'var(--font-interface)', fontWeight: 500, background: 'var(--color-blue-subtle)', border: 'var(--glass-border)', color: 'var(--color-blue-glow)' }}>ATIVO</span>
        </div>
        <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
          {days.map((d, i) => (
            <button key={d} onClick={() => setDay(i)} style={{ padding: '5px 12px', borderRadius: 'var(--radius-md)', border: day === i ? 'var(--glass-border-elevated)' : '1px solid rgba(255,255,255,0.07)', background: day === i ? 'var(--color-blue-subtle)' : 'var(--color-surface)', color: day === i ? 'var(--color-blue-glow)' : 'var(--color-text-muted)', fontSize: 11, fontFamily: 'var(--font-data)', cursor: 'pointer' }}>{d}</button>
          ))}
        </div>
        <div style={{ background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: 'var(--glass-border)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 44px 60px 70px', gap: 8, padding: '7px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            {['EXERCÍCIO','SÉR','REPS','CARGA'].map(h => <SL key={h}>{h}</SL>)}
          </div>
          {day === 2
            ? <div style={{ padding: '20px 14px', fontFamily: 'var(--font-interface)', fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center' }}>Dia de descanso.</div>
            : exs.map(({ n, s, r, l }) => (
                <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr 44px 60px 70px', gap: 8, padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ fontFamily: 'var(--font-interface)', fontSize: 12, fontWeight: 500, color: 'var(--color-text)' }}>{n}</span>
                  <span style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: 'var(--color-text-muted)' }}>{s}</span>
                  <span style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: 'var(--color-text-muted)' }}>{r}</span>
                  <span style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: 'var(--color-blue-glow)' }}>{l}</span>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}

/* ── Nav items + screens array ───────────────────────────── */
const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',    icon: 'layout'   },
  { id: 'pacientes',    label: 'Pacientes',    icon: 'users'    },
  { id: 'agenda',       label: 'Agenda',       icon: 'calendar' },
  { id: 'protocolos',   label: 'Protocolos',   icon: 'list'     },
  { id: 'resultados',   label: 'Resultados',   icon: 'chart'    },
  { id: 'notificacoes', label: 'Notificações', icon: 'bell'     },
];

const SCREENS = [ShowDashboard, ShowPaciente, ShowAgenda, ShowProtocolo];

/* ── Animated Product Showcase ───────────────────────────── */
function AnimatedProductShowcase() {
  const [screenIdx, setScreenIdx] = React.useState(0);
  const [fading,    setFading   ] = React.useState(false);
  const [clicking,  setClicking ] = React.useState(false);
  const [cursorPos, setCursorPos] = React.useState({ x: -100, y: -100 });
  const navRefs     = React.useRef([]);
  const containerRef= React.useRef(null);

  const getPos = (idx) => {
    const el = navRefs.current[idx];
    const cEl= containerRef.current;
    if (!el || !cEl) return null;
    const eR = el.getBoundingClientRect();
    const cR = cEl.getBoundingClientRect();
    return { x: eR.left - cR.left + eR.width / 2, y: eR.top - cR.top + eR.height / 2 };
  };

  React.useEffect(() => {
    const t0 = setTimeout(() => { const p = getPos(0); if (p) setCursorPos(p); }, 500);
    let step = 0;
    const timers = [t0];
    const advance = () => {
      step = (step + 1) % 4;
      const p = getPos(step);
      if (p) setCursorPos(p);
      const t1 = setTimeout(() => {
        setClicking(true);
        const t2 = setTimeout(() => {
          setClicking(false);
          setFading(true);
          const t3 = setTimeout(() => { setScreenIdx(step); setFading(false); }, 200);
          timers.push(t3);
        }, 230);
        timers.push(t2);
      }, 540);
      timers.push(t1);
    };
    const interval = setInterval(advance, 3600);
    return () => { timers.forEach(clearTimeout); clearInterval(interval); };
  }, []);

  const ActiveScreen = SCREENS[screenIdx];

  return (
    <div ref={containerRef} className="app-frame" style={{ display: 'flex', flexDirection: 'column', height: 530, position: 'relative', overflow: 'hidden' }}>
      {/* Browser chrome */}
      <div className="frame-chrome">
        <div className="frame-dots">{['#FF5F57','#FFBD2E','#28CA41'].map(c => <div key={c} className="frame-dot" style={{ background: c }}/>)}</div>
        <div className="frame-url">app.nutrk.com/{NAV_ITEMS[screenIdx].id}</div>
      </div>

      {/* App body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{ width: 196, flexShrink: 0, background: 'var(--color-surface)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <img src="assets/nutrk-logo.svg" alt="Nūtrk" style={{ height: 14, marginBottom: 18, marginLeft: 8, opacity: 0.9 }}/>
          <div style={{ fontFamily: 'var(--font-interface)', fontSize: 9, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 3, marginLeft: 8 }}>Menu</div>
          {NAV_ITEMS.map((item, i) => (
            <div key={item.id} ref={el => navRefs.current[i] = el}
              style={{ padding: '6px 9px', borderRadius: 'var(--radius-md)', background: screenIdx === i ? 'var(--color-blue-subtle)' : 'transparent', color: screenIdx === i ? 'var(--color-text)' : 'var(--color-text-muted)', fontFamily: 'var(--font-interface)', fontSize: 12, fontWeight: screenIdx === i ? 500 : 400, display: 'flex', alignItems: 'center', gap: 7, transition: 'all var(--transition-fast)', borderLeft: screenIdx === i ? '2px solid var(--color-blue-glow)' : '2px solid transparent' }}>
              <Icon name={item.icon} size={13} color={screenIdx === i ? 'var(--color-blue-glow)' : 'var(--color-text-muted)'}/>
              {item.label}
            </div>
          ))}
          {/* User profile */}
          <div style={{ marginTop: 'auto', padding: '8px 9px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-blue-subtle)', border: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontFamily: 'var(--font-interface)', fontWeight: 700, color: 'var(--color-blue-glow)', flexShrink: 0 }}>BS</div>
            <div>
              <div style={{ fontFamily: 'var(--font-interface)', fontSize: 11, fontWeight: 500, color: 'var(--color-text)' }}>Dr. Bruno Silva</div>
              <div style={{ fontFamily: 'var(--font-interface)', fontSize: 9, color: 'var(--color-text-muted)' }}>Nutricionista</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', opacity: fading ? 0 : 1, transition: 'opacity 0.2s ease' }}>
          <ActiveScreen />
        </div>
      </div>

      {/* Cursor */}
      <div style={{
        position: 'absolute', left: cursorPos.x, top: cursorPos.y,
        transform: `translate(-3px,-2px) scale(${clicking ? 0.7 : 1})`,
        transition: `left 0.52s cubic-bezier(0.2,0,0,1), top 0.52s cubic-bezier(0.2,0,0,1), transform ${clicking ? '0.1s' : '0.18s'}`,
        pointerEvents: 'none', zIndex: 30,
        filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.7))',
      }}>
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
          <path d="M1.5 1.5 13 10.5 8 12 5.5 17.5Z" fill="white" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        {clicking && <div style={{ position: 'absolute', top: 2, left: 2, width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', animation: 'ripple 0.35s ease-out forwards' }}/>}
      </div>
    </div>
  );
}

Object.assign(window, { Icon, AnimatedProductShowcase });
