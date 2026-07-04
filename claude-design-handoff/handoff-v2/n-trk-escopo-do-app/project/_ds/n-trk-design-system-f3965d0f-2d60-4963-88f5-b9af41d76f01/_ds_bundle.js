/* @ds-bundle: {"format":4,"namespace":"NTrkDesignSystem_f3965d","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"MeshAura","sourcePath":"components/core/MeshAura.jsx"},{"name":"Stat","sourcePath":"components/core/Stat.jsx"},{"name":"StreakRing","sourcePath":"components/core/StreakRing.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"e31f65701907","components/core/Button.jsx":"8afd944bd69e","components/core/Card.jsx":"ea148d81a578","components/core/Input.jsx":"cc6c3f8b8547","components/core/MeshAura.jsx":"652b87df99a2","components/core/Stat.jsx":"874c761f2fe6","components/core/StreakRing.jsx":"8698fa02b0c3","components/core/Tag.jsx":"3620722c5537"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NTrkDesignSystem_f3965d = window.NTrkDesignSystem_f3965d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
const {
  useState
} = React;

/**
 * Pílula de status. Sentence case (sem all-caps). accent (laranja) para
 * destaque · warm para ritual/streak · cool para contexto profissional.
 */
function Badge({
  children,
  variant = 'accent',
  dot = false,
  size = 'md'
}) {
  const sizes = {
    sm: {
      fontSize: '11px',
      padding: '2px 8px',
      height: '20px',
      gap: '5px'
    },
    md: {
      fontSize: '12px',
      padding: '3px 10px',
      height: '24px',
      gap: '6px'
    },
    lg: {
      fontSize: '13px',
      padding: '4px 13px',
      height: '28px',
      gap: '6px'
    }
  };
  const variants = {
    accent: {
      background: 'var(--color-orange-subtle)',
      color: 'var(--color-orange)',
      border: '1px solid var(--color-orange-dim)',
      dot: 'var(--color-orange)'
    },
    warm: {
      background: 'rgba(254,175,76,0.14)',
      color: '#c67518',
      border: '1px solid rgba(254,175,76,0.30)',
      dot: 'var(--warm-amber)'
    },
    cool: {
      background: 'rgba(173,183,247,0.18)',
      color: '#5a63c4',
      border: '1px solid rgba(173,183,247,0.40)',
      dot: 'var(--cool-lav)'
    },
    neutral: {
      background: 'var(--color-surface)',
      color: 'var(--color-text-secondary)',
      border: '1px solid var(--color-border-strong)',
      dot: 'var(--color-text-muted)'
    },
    success: {
      background: 'rgba(47,158,107,0.12)',
      color: '#2f9e6b',
      border: '1px solid rgba(47,158,107,0.28)',
      dot: '#2f9e6b'
    },
    error: {
      background: 'rgba(239,68,68,0.10)',
      color: '#ef4444',
      border: '1px solid rgba(239,68,68,0.24)',
      dot: '#ef4444'
    }
  };
  const v = variants[variant] || variants.neutral;
  const s = sizes[size];
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      fontSize: s.fontSize,
      fontFamily: 'var(--font-interface)',
      fontWeight: 500,
      letterSpacing: '-0.005em',
      borderRadius: 'var(--radius-full)',
      whiteSpace: 'nowrap',
      background: v.background,
      color: v.color,
      border: v.border
    }
  }, dot && React.createElement('span', {
    style: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: v.dot,
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const {
  useState
} = React;

/**
 * Controle interativo principal. `variant="primary"` (laranja) é o CTA.
 * `variant="warm"` para gesto de ritual/consistência. `variant="glass"`
 * para botões flutuando sobre mesh. Botões são pill (radius 40). Sentence case.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  type = 'button',
  icon,
  iconRight,
  onClick
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const sizes = {
    sm: {
      height: '32px',
      padding: '0 16px',
      fontSize: 'var(--text-sm)',
      gap: '6px'
    },
    md: {
      height: '40px',
      padding: '0 22px',
      fontSize: 'var(--text-base)',
      gap: '8px'
    },
    lg: {
      height: '48px',
      padding: '0 28px',
      fontSize: 'var(--text-lg)',
      gap: '10px'
    }
  };
  const variants = {
    primary: {
      background: hovered ? 'var(--color-orange-deep)' : 'var(--color-orange)',
      color: '#fff',
      border: 'none',
      boxShadow: hovered ? 'var(--halo-orange)' : '0 2px 8px rgba(254,95,51,0.18)'
    },
    gradient: {
      background: 'linear-gradient(90deg, #fe5f33, #feaf4c)',
      color: '#fff',
      border: 'none',
      boxShadow: hovered ? 'var(--halo-orange)' : '0 2px 8px rgba(254,95,51,0.18)'
    },
    secondary: {
      background: hovered ? 'var(--color-surface)' : 'var(--color-surface-elevated)',
      color: 'var(--color-text)',
      border: '1px solid var(--color-border-strong)',
      boxShadow: hovered ? 'var(--shadow-sm)' : 'none'
    },
    ghost: {
      background: hovered ? 'var(--color-orange-subtle)' : 'transparent',
      color: hovered ? 'var(--color-orange)' : 'var(--color-text-secondary)',
      border: '1px solid transparent'
    },
    warm: {
      background: hovered ? '#fdbf6a' : 'var(--warm-amber)',
      color: 'var(--color-text)',
      border: 'none',
      boxShadow: hovered ? 'var(--halo-warm)' : '0 2px 8px rgba(254,175,76,0.20)'
    },
    glass: {
      background: 'var(--glass-bg)',
      color: 'var(--color-text)',
      border: 'var(--glass-border)',
      boxShadow: 'var(--glass-shadow)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)'
    }
  };
  const scale = pressed ? 'scale(0.97)' : 'scale(1)';
  return React.createElement('button', {
    type,
    disabled,
    onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => {
      setHovered(false);
      setPressed(false);
    },
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: sizes[size].gap,
      height: sizes[size].height,
      padding: sizes[size].padding,
      fontSize: sizes[size].fontSize,
      fontFamily: 'var(--font-interface)',
      fontWeight: 600,
      letterSpacing: '-0.005em',
      borderRadius: 'var(--radius-pill)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      width: fullWidth ? '100%' : 'auto',
      transition: 'all var(--transition-fast)',
      transform: scale,
      outline: 'none',
      whiteSpace: 'nowrap',
      textDecoration: 'none',
      ...variants[variant]
    }
  }, icon && React.createElement('span', {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0
    }
  }, icon), children, iconRight && React.createElement('span', {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
/**
 * Container de superfície. Fundo claro, radius soft ~10px, sombra leve —
 * o gradiente faz a profundidade. `variant="glass"` = liquid glass (sobre mesh).
 * `variant="mesh"` = superfície de aura saturada com texto branco (fechamento).
 */
function Card({
  children,
  variant = 'base',
  temp = 'warm',
  padding = 'md',
  radius = 'md',
  style: extraStyle,
  onClick
}) {
  const paddings = {
    sm: '14px',
    md: '20px',
    lg: '28px',
    none: '0'
  };
  const radii = {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)'
  };
  const meshes = {
    warm: 'var(--mesh-warm)',
    cool: 'var(--mesh-cool)',
    mist: 'var(--mesh-mist)',
    fresh: 'var(--mesh-fresh)'
  };
  const variants = {
    base: {
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-card)'
    },
    elevated: {
      background: 'var(--color-surface-elevated)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-elevated)'
    },
    glass: {
      background: 'var(--glass-bg)',
      border: 'var(--glass-border)',
      boxShadow: 'var(--glass-shadow)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)'
    },
    mesh: {
      background: meshes[temp] || meshes.warm,
      border: 'none',
      boxShadow: 'var(--shadow-card)',
      color: 'var(--color-text-on-mesh)',
      overflow: 'hidden'
    }
  };
  return React.createElement('div', {
    onClick,
    style: {
      borderRadius: radii[radius] || radius,
      padding: paddings[padding] || padding,
      cursor: onClick ? 'pointer' : 'default',
      ...variants[variant],
      ...extraStyle
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
const {
  useState
} = React;

/**
 * Campo de texto. Superfície clara, foco com anel laranja suave.
 * Label em sentence case (sem all-caps).
 */
function Input({
  label,
  placeholder = '',
  value,
  onChange,
  type = 'text',
  error,
  hint,
  disabled = false,
  icon,
  unit,
  size = 'md'
}) {
  const [focused, setFocused] = useState(false);
  const sizes = {
    sm: {
      height: '36px',
      fontSize: 'var(--text-sm)',
      padding: '0 12px'
    },
    md: {
      height: '44px',
      fontSize: 'var(--text-base)',
      padding: '0 14px'
    },
    lg: {
      height: '52px',
      fontSize: 'var(--text-lg)',
      padding: '0 16px'
    }
  };
  const s = sizes[size];
  const borderColor = error ? 'rgba(239,68,68,0.55)' : focused ? 'var(--color-orange)' : 'var(--color-border-strong)';
  const boxShadow = error ? '0 0 0 3px rgba(239,68,68,0.12)' : focused ? '0 0 0 3px var(--color-orange-subtle)' : 'none';
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '7px',
      width: '100%'
    }
  }, label && React.createElement('label', {
    style: {
      fontSize: '13px',
      fontFamily: 'var(--font-interface)',
      fontWeight: 500,
      color: 'var(--color-text-secondary)',
      letterSpacing: '-0.005em'
    }
  }, label), React.createElement('div', {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: s.height,
      background: 'var(--color-surface-elevated)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      boxShadow,
      transition: 'all var(--transition-fast)',
      opacity: disabled ? 0.5 : 1
    }
  }, icon && React.createElement('span', {
    style: {
      position: 'absolute',
      left: '13px',
      color: 'var(--color-text-muted)',
      display: 'flex',
      pointerEvents: 'none'
    }
  }, icon), React.createElement('input', {
    type,
    value,
    onChange,
    placeholder,
    disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      flex: 1,
      height: '100%',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      fontSize: s.fontSize,
      fontFamily: 'var(--font-interface)',
      color: 'var(--color-text)',
      padding: s.padding,
      paddingLeft: icon ? '38px' : s.padding.split(' ')[1],
      paddingRight: unit ? '38px' : s.padding.split(' ')[1]
    }
  }), unit && React.createElement('span', {
    style: {
      position: 'absolute',
      right: '13px',
      fontSize: '13px',
      fontFamily: 'var(--font-data)',
      color: 'var(--color-text-muted)'
    }
  }, unit)), (error || hint) && React.createElement('div', {
    style: {
      fontSize: '12px',
      fontFamily: 'var(--font-interface)',
      color: error ? '#ef4444' : 'var(--color-text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/MeshAura.jsx
try { (() => {
/**
 * MeshAura — a assinatura visual da Nūtrk.
 * Aura de mesh gradient radial. Flutua como decoração atrás do conteúdo
 * (float) ou serve de superfície saturada com texto branco (as card/cover).
 * Cor fixa por temperatura — não é interativa.
 *   warm  → paciente   ·   cool  → nutri/profissional   ·   mist / fresh → coringa
 */
function MeshAura({
  temp = 'warm',
  shape = 'blob',
  size = 240,
  float = false,
  children,
  style: extraStyle,
  className
}) {
  const meshes = {
    warm: 'var(--mesh-warm)',
    cool: 'var(--mesh-cool)',
    mist: 'var(--mesh-mist)',
    fresh: 'var(--mesh-fresh)'
  };
  const radii = {
    blob: 'var(--radius-xl)',
    card: 'var(--radius-md)',
    circle: '50%',
    pill: 'var(--radius-pill)'
  };
  const dim = typeof size === 'number' ? `${size}px` : size;
  const base = {
    background: meshes[temp] || meshes.warm,
    borderRadius: radii[shape] || shape,
    width: dim,
    height: shape === 'circle' ? dim : children ? 'auto' : dim
  };
  const floatStyle = float ? {
    filter: 'blur(28px)',
    opacity: 0.55,
    pointerEvents: 'none',
    position: extraStyle && extraStyle.position ? extraStyle.position : 'absolute'
  } : {
    boxShadow: 'var(--shadow-card)',
    position: 'relative',
    overflow: 'hidden'
  };
  return React.createElement('div', {
    className,
    style: {
      ...base,
      ...floatStyle,
      ...extraStyle
    }
  }, !float && children);
}
Object.assign(__ds_scope, { MeshAura });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/MeshAura.jsx", error: String((e && e.message) || e) }); }

// components/core/Stat.jsx
try { (() => {
/**
 * Bloco de métrica — número em Satoshi, label em sentence case.
 * ⚠️ Marca de saúde: nunca para caloria, grama, macro ou meta de peso.
 * Use para consistência (dias, semanas), ritmo, contagem não-prescritiva.
 */
function Stat({
  value,
  unit,
  label,
  delta,
  deltaDirection,
  variant = 'default',
  size = 'md'
}) {
  const sizes = {
    sm: {
      value: '22px',
      unit: '13px',
      label: '12px',
      delta: '11px'
    },
    md: {
      value: '34px',
      unit: '15px',
      label: '13px',
      delta: '12px'
    },
    lg: {
      value: '52px',
      unit: '20px',
      label: '14px',
      delta: '13px'
    }
  };
  const s = sizes[size];
  const variants = {
    default: {
      color: 'var(--color-text)'
    },
    accent: {
      color: 'var(--color-orange)'
    },
    warm: {
      color: '#c67518'
    },
    muted: {
      color: 'var(--color-text-muted)'
    }
  };
  const deltaColor = deltaDirection === 'up' ? '#2f9e6b' : deltaDirection === 'down' ? '#ef4444' : 'var(--color-text-muted)';
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '5px'
    }
  }, React.createElement('span', {
    style: {
      fontSize: s.value,
      fontFamily: 'var(--font-data)',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1,
      ...variants[variant]
    }
  }, value), unit && React.createElement('span', {
    style: {
      fontSize: s.unit,
      fontFamily: 'var(--font-data)',
      fontWeight: 500,
      color: 'var(--color-text-muted)',
      lineHeight: 1
    }
  }, unit)), label && React.createElement('div', {
    style: {
      fontSize: s.label,
      fontFamily: 'var(--font-interface)',
      fontWeight: 500,
      color: 'var(--color-text-secondary)',
      letterSpacing: '-0.005em'
    }
  }, label), delta && React.createElement('div', {
    style: {
      fontSize: s.delta,
      fontFamily: 'var(--font-data)',
      fontWeight: 500,
      color: deltaColor
    }
  }, (deltaDirection === 'up' ? '↑ ' : deltaDirection === 'down' ? '↓ ' : '') + delta));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stat.jsx", error: String((e && e.message) || e) }); }

// components/core/StreakRing.jsx
try { (() => {
/**
 * StreakRing — o elemento de ritual/consistência da Nūtrk.
 * Anel de dias seguidos, gradiente warm sobre trilha clara. Sentence case.
 * Use SÓ para consistência (dias seguidos) — nunca para peso, caloria ou meta.
 */
function StreakRing({
  days = 0,
  max = 30,
  size = 160,
  showLabel = true,
  label = 'dias seguidos'
}) {
  const cx = size / 2;
  const cy = size / 2;
  const strokeW = size * 0.05;
  const r = size / 2 - strokeW * 1.6;
  const circumference = 2 * Math.PI * r;
  const progress = Math.min(days / max, 1);
  const dashArray = circumference * progress;
  const dashOffset = circumference * 0.25; // start at top

  return React.createElement('div', {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flexShrink: 0
    }
  }, React.createElement('svg', {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    style: {
      position: 'absolute',
      inset: 0
    }
  }, React.createElement('defs', null, React.createElement('linearGradient', {
    id: `ntrk-ring-${size}`,
    x1: '0%',
    y1: '0%',
    x2: '100%',
    y2: '100%'
  }, React.createElement('stop', {
    offset: '0%',
    stopColor: '#fe5f33'
  }), React.createElement('stop', {
    offset: '100%',
    stopColor: '#feaf4c'
  }))),
  // Trilha clara
  React.createElement('circle', {
    cx,
    cy,
    r,
    fill: 'none',
    stroke: 'rgba(254,95,51,0.12)',
    strokeWidth: strokeW
  }),
  // Arco de progresso
  progress > 0 && React.createElement('circle', {
    cx,
    cy,
    r,
    fill: 'none',
    stroke: `url(#ntrk-ring-${size})`,
    strokeWidth: strokeW,
    strokeLinecap: 'round',
    strokeDasharray: `${dashArray} ${circumference}`,
    strokeDashoffset: dashOffset,
    transform: `rotate(-90 ${cx} ${cy})`
  })), React.createElement('div', {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: size * 0.012
    }
  }, React.createElement('svg', {
    width: size * 0.16,
    height: size * 0.16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'var(--color-orange)',
    strokeWidth: '1.6',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }, React.createElement('path', {
    d: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'
  })), React.createElement('span', {
    style: {
      fontSize: size * 0.24,
      fontFamily: 'var(--font-data)',
      fontWeight: 700,
      color: 'var(--color-orange)',
      lineHeight: 1,
      letterSpacing: '-0.03em'
    }
  }, days), showLabel && React.createElement('span', {
    style: {
      fontSize: size * 0.078,
      fontFamily: 'var(--font-interface)',
      fontWeight: 500,
      color: 'var(--color-text-secondary)',
      letterSpacing: '-0.005em'
    }
  }, label)));
}
Object.assign(__ds_scope, { StreakRing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StreakRing.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
/**
 * Chip inline pequeno. Categorias, grupos, tags. Sentence case, radius soft.
 */
function Tag({
  children,
  variant = 'neutral',
  onRemove
}) {
  const variants = {
    accent: {
      background: 'var(--color-orange-subtle)',
      color: 'var(--color-orange)',
      border: '1px solid var(--color-orange-dim)'
    },
    warm: {
      background: 'rgba(254,175,76,0.14)',
      color: '#c67518',
      border: '1px solid rgba(254,175,76,0.30)'
    },
    cool: {
      background: 'rgba(173,183,247,0.18)',
      color: '#5a63c4',
      border: '1px solid rgba(173,183,247,0.40)'
    },
    neutral: {
      background: 'var(--color-surface)',
      color: 'var(--color-text-secondary)',
      border: '1px solid var(--color-border-strong)'
    }
  };
  const v = variants[variant] || variants.neutral;
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      height: '26px',
      padding: '0 10px',
      fontSize: '12px',
      fontFamily: 'var(--font-interface)',
      fontWeight: 500,
      letterSpacing: '-0.005em',
      borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
      background: v.background,
      color: v.color,
      border: v.border
    }
  }, children, onRemove && React.createElement('button', {
    onClick: onRemove,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
      padding: '0',
      cursor: 'pointer',
      color: 'inherit',
      opacity: 0.55,
      marginLeft: '2px',
      lineHeight: 1,
      fontSize: '13px'
    }
  }, '×'));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.MeshAura = __ds_scope.MeshAura;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.StreakRing = __ds_scope.StreakRing;

__ds_ns.Tag = __ds_scope.Tag;

})();
