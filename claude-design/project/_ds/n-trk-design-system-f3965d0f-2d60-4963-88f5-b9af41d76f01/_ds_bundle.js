/* @ds-bundle: {"format":3,"namespace":"NTrkDesignSystem_f3965d","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Stat","sourcePath":"components/core/Stat.jsx"},{"name":"StreakRing","sourcePath":"components/core/StreakRing.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"f7419f9007f9","components/core/Button.jsx":"13ef7c4d5fa2","components/core/Card.jsx":"fbed84f0debf","components/core/Input.jsx":"d71aa2ce8525","components/core/Stat.jsx":"61f1f78caef2","components/core/StreakRing.jsx":"7cc1e0d4e8b3","components/core/Tag.jsx":"8866db9e5cae"},"inlinedExternals":[],"unexposedExports":[]} */

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
 * Status indicator pill. Blue for system states, amber for streaks/rewards only.
 */
function Badge({
  children,
  variant = 'blue',
  dot = false,
  size = 'md'
}) {
  const sizes = {
    sm: {
      fontSize: '10px',
      padding: '2px 7px',
      height: '18px',
      gap: '4px'
    },
    md: {
      fontSize: '11px',
      padding: '3px 9px',
      height: '22px',
      gap: '5px'
    },
    lg: {
      fontSize: '12px',
      padding: '4px 12px',
      height: '26px',
      gap: '6px'
    }
  };
  const variants = {
    blue: {
      background: 'var(--color-blue-subtle)',
      color: 'var(--color-blue-glow)',
      border: '1px solid var(--color-blue-dim)',
      dot: 'var(--color-blue-core)'
    },
    amber: {
      background: 'var(--color-amber-subtle)',
      color: 'var(--color-amber)',
      border: '1px solid var(--color-amber-dim)',
      dot: 'var(--color-amber)'
    },
    neutral: {
      background: 'var(--color-surface-elevated)',
      color: 'var(--color-text-muted)',
      border: '1px solid rgba(255,255,255,0.07)',
      dot: 'var(--color-text-muted)'
    },
    success: {
      background: 'rgba(46,204,113,0.10)',
      color: '#2ECC71',
      border: '1px solid rgba(46,204,113,0.20)',
      dot: '#2ECC71'
    },
    error: {
      background: 'rgba(255,75,75,0.10)',
      color: '#FF4B4B',
      border: '1px solid rgba(255,75,75,0.20)',
      dot: '#FF4B4B'
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
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      borderRadius: 'var(--radius-full)',
      whiteSpace: 'nowrap',
      ...v
    }
  }, dot && React.createElement('span', {
    style: {
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      background: v.dot,
      flexShrink: 0,
      boxShadow: `0 0 6px ${v.dot}`
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
 * Primary interactive control. Use `variant="primary"` for system
 * actions, `variant="amber"` exclusively for streak/reward actions.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  type = 'button',
  icon,
  onClick
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const sizes = {
    sm: {
      height: '28px',
      padding: '0 12px',
      fontSize: 'var(--text-sm)',
      gap: '6px'
    },
    md: {
      height: '36px',
      padding: '0 16px',
      fontSize: 'var(--text-base)',
      gap: '8px'
    },
    lg: {
      height: '44px',
      padding: '0 24px',
      fontSize: 'var(--text-lg)',
      gap: '10px'
    }
  };
  const variants = {
    primary: {
      background: hovered ? 'var(--color-blue-glow)' : 'var(--color-blue-core)',
      color: '#fff',
      border: 'none',
      boxShadow: hovered ? 'var(--glow-blue)' : 'none'
    },
    secondary: {
      background: hovered ? 'var(--color-surface-elevated)' : 'var(--color-surface)',
      color: 'var(--color-text)',
      border: 'var(--glass-border)',
      boxShadow: hovered ? 'var(--shadow-card)' : 'none'
    },
    ghost: {
      background: hovered ? 'var(--color-blue-subtle)' : 'transparent',
      color: hovered ? 'var(--color-text)' : 'var(--color-text-muted)',
      border: '1px solid transparent'
    },
    amber: {
      background: hovered ? '#FFBE5A' : 'var(--color-amber)',
      color: 'var(--color-base)',
      border: 'none',
      boxShadow: hovered ? 'var(--glow-amber)' : 'none'
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
      fontWeight: 500,
      letterSpacing: '-0.01em',
      borderRadius: 'var(--radius-md)',
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
  }, icon), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
/**
 * Surface container. Three variants matching glass token system.
 * Never use white backgrounds inside cards.
 */
function Card({
  children,
  variant = 'base',
  padding = 'md',
  radius = 'lg',
  glass = false,
  style: extraStyle,
  onClick
}) {
  const paddings = {
    sm: '12px',
    md: '20px',
    lg: '28px',
    none: '0'
  };
  const radii = {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)'
  };
  const variants = {
    base: {
      background: glass ? 'var(--glass-bg)' : 'var(--color-surface)',
      border: 'var(--glass-border)',
      boxShadow: 'var(--shadow-card)',
      backdropFilter: glass ? 'var(--glass-blur)' : 'none',
      WebkitBackdropFilter: glass ? 'var(--glass-blur)' : 'none'
    },
    elevated: {
      background: glass ? 'var(--glass-bg-elevated)' : 'var(--color-surface-elevated)',
      border: 'var(--glass-border-elevated)',
      boxShadow: 'var(--shadow-elevated)',
      backdropFilter: glass ? 'var(--glass-blur-elevated)' : 'none',
      WebkitBackdropFilter: glass ? 'var(--glass-blur-elevated)' : 'none'
    },
    streak: {
      background: glass ? 'var(--glass-bg-streak)' : 'rgba(20,12,4,0.90)',
      border: 'var(--glass-border-streak)',
      boxShadow: 'var(--glow-amber)',
      backdropFilter: glass ? 'var(--glass-blur)' : 'none',
      WebkitBackdropFilter: glass ? 'var(--glass-blur)' : 'none'
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
  useState,
  useRef
} = React;

/**
 * Text input with glass styling. Use for all user text entry.
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
      height: '32px',
      fontSize: 'var(--text-sm)',
      padding: '0 10px'
    },
    md: {
      height: '40px',
      fontSize: 'var(--text-base)',
      padding: '0 14px'
    },
    lg: {
      height: '48px',
      fontSize: 'var(--text-lg)',
      padding: '0 16px'
    }
  };
  const s = sizes[size];
  const borderColor = error ? 'rgba(255,75,75,0.40)' : focused ? 'rgba(109,164,183,0.50)' : 'rgba(109,164,183,0.15)';
  const boxShadow = error ? '0 0 0 3px rgba(255,75,75,0.10)' : focused ? '0 0 0 3px var(--color-blue-subtle)' : 'none';
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      width: '100%'
    }
  }, label && React.createElement('label', {
    style: {
      fontSize: '12px',
      fontFamily: 'var(--font-interface)',
      fontWeight: 500,
      color: 'var(--color-text-muted)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase'
    }
  }, label), React.createElement('div', {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: s.height,
      background: focused ? 'rgba(18,26,48,0.90)' : 'var(--color-surface)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      boxShadow,
      transition: 'all var(--transition-fast)',
      opacity: disabled ? 0.5 : 1
    }
  }, icon && React.createElement('span', {
    style: {
      position: 'absolute',
      left: '12px',
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
      paddingLeft: icon ? '36px' : s.padding.split(' ')[1],
      paddingRight: unit ? '36px' : s.padding.split(' ')[1]
    }
  }), unit && React.createElement('span', {
    style: {
      position: 'absolute',
      right: '12px',
      fontSize: '13px',
      fontFamily: 'var(--font-data)',
      color: 'var(--color-text-muted)'
    }
  }, unit)), (error || hint) && React.createElement('div', {
    style: {
      fontSize: '12px',
      fontFamily: 'var(--font-interface)',
      color: error ? '#FF4B4B' : 'var(--color-text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Stat.jsx
try { (() => {
/**
 * Metric display block — number in DM Mono, label in Inter caps.
 * Use for nutritional values, workout metrics, progress data.
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
      value: '20px',
      unit: '12px',
      label: '10px',
      delta: '10px'
    },
    md: {
      value: '32px',
      unit: '14px',
      label: '11px',
      delta: '11px'
    },
    lg: {
      value: '48px',
      unit: '18px',
      label: '12px',
      delta: '12px'
    }
  };
  const s = sizes[size];
  const variants = {
    default: {
      color: 'var(--color-text)'
    },
    accent: {
      color: 'var(--color-blue-glow)'
    },
    amber: {
      color: 'var(--color-amber)'
    },
    muted: {
      color: 'var(--color-text-muted)'
    }
  };
  const deltaColor = deltaDirection === 'up' ? '#2ECC71' : deltaDirection === 'down' ? '#FF4B4B' : 'var(--color-text-muted)';
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '4px'
    }
  }, React.createElement('span', {
    style: {
      fontSize: s.value,
      fontFamily: 'var(--font-data)',
      fontWeight: 400,
      letterSpacing: '-0.03em',
      lineHeight: 1,
      ...variants[variant]
    }
  }, value), unit && React.createElement('span', {
    style: {
      fontSize: s.unit,
      fontFamily: 'var(--font-data)',
      color: 'var(--color-text-muted)',
      lineHeight: 1
    }
  }, unit)), label && React.createElement('div', {
    style: {
      fontSize: s.label,
      fontFamily: 'var(--font-interface)',
      fontWeight: 500,
      color: 'var(--color-text-muted)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase'
    }
  }, label), delta && React.createElement('div', {
    style: {
      fontSize: s.delta,
      fontFamily: 'var(--font-data)',
      color: deltaColor
    }
  }, (deltaDirection === 'up' ? '↑ ' : deltaDirection === 'down' ? '↓ ' : '') + delta));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stat.jsx", error: String((e && e.message) || e) }); }

// components/core/StreakRing.jsx
try { (() => {
/**
 * Amber streak ring — the signature achievement element.
 * Use ONLY for streak/consecutive-day displays. Never for progress bars or generic charts.
 */
function StreakRing({
  days = 0,
  max = 30,
  size = 160,
  showLabel = true
}) {
  const cx = size / 2;
  const cy = size / 2;
  const strokeW = size * 0.038;
  const r = size / 2 - strokeW * 1.8;
  const circumference = 2 * Math.PI * r;
  const progress = Math.min(days / max, 1);
  const dashArray = circumference * progress;
  const dashOffset = circumference * 0.25; // start at top

  const innerSize = size * 0.5;
  return React.createElement('div', {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flexShrink: 0
    }
  },
  // SVG ring
  React.createElement('svg', {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    style: {
      position: 'absolute',
      inset: 0
    }
  }, React.createElement('defs', null, React.createElement('linearGradient', {
    id: `ag-${size}`,
    x1: '0%',
    y1: '0%',
    x2: '100%',
    y2: '0%'
  }, React.createElement('stop', {
    offset: '0%',
    stopColor: '#FF8A00'
  }), React.createElement('stop', {
    offset: '100%',
    stopColor: '#FFD080'
  })), React.createElement('filter', {
    id: `glow-${size}`
  }, React.createElement('feGaussianBlur', {
    stdDeviation: '3',
    result: 'blur'
  }), React.createElement('feMerge', null, React.createElement('feMergeNode', {
    in: 'blur'
  }), React.createElement('feMergeNode', {
    in: 'SourceGraphic'
  })))),
  // Track
  React.createElement('circle', {
    cx,
    cy,
    r,
    fill: 'none',
    stroke: 'rgba(255,178,58,0.10)',
    strokeWidth: strokeW
  }),
  // Outer ambient ring
  React.createElement('circle', {
    cx,
    cy,
    r: r + strokeW * 1.2,
    fill: 'none',
    stroke: 'rgba(255,178,58,0.05)',
    strokeWidth: strokeW * 0.5
  }),
  // Progress arc
  progress > 0 && React.createElement('circle', {
    cx,
    cy,
    r,
    fill: 'none',
    stroke: `url(#ag-${size})`,
    strokeWidth: strokeW,
    strokeLinecap: 'round',
    strokeDasharray: `${dashArray} ${circumference}`,
    strokeDashoffset: dashOffset,
    filter: `url(#glow-${size})`,
    transform: `rotate(-90 ${cx} ${cy})`
  })),
  // Inner content
  React.createElement('div', {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: size * 0.01
    }
  }, React.createElement('svg', {
    width: size * 0.175,
    height: size * 0.175,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'var(--color-amber)',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }, React.createElement('path', {
    d: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'
  })), React.createElement('span', {
    style: {
      fontSize: size * 0.225,
      fontFamily: 'var(--font-data)',
      color: 'var(--color-amber)',
      lineHeight: 1,
      letterSpacing: '-0.03em'
    }
  }, days), showLabel && React.createElement('span', {
    style: {
      fontSize: size * 0.072,
      fontFamily: 'var(--font-interface)',
      color: 'var(--color-text-muted)',
      letterSpacing: '0.04em'
    }
  }, 'dias seguidos')));
}
Object.assign(__ds_scope, { StreakRing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StreakRing.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
/**
 * Small inline label chip. Use for categories, food groups, tags on log entries.
 */
function Tag({
  children,
  variant = 'neutral',
  onRemove
}) {
  const [hovered, setHovered] = React.useState(false);
  const variants = {
    blue: {
      background: 'var(--color-blue-subtle)',
      color: 'var(--color-blue-glow)',
      border: '1px solid var(--color-blue-dim)'
    },
    amber: {
      background: 'var(--color-amber-subtle)',
      color: 'var(--color-amber)',
      border: '1px solid var(--color-amber-dim)'
    },
    neutral: {
      background: 'var(--color-surface-elevated)',
      color: 'var(--color-text-muted)',
      border: '1px solid rgba(255,255,255,0.07)'
    },
    surface: {
      background: 'rgba(255,255,255,0.05)',
      color: 'var(--color-text-muted)',
      border: '1px solid rgba(255,255,255,0.08)'
    }
  };
  const v = variants[variant] || variants.neutral;
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      height: '22px',
      padding: '0 8px',
      fontSize: '11px',
      fontFamily: 'var(--font-interface)',
      fontWeight: 500,
      letterSpacing: '0.03em',
      borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
      ...v
    }
  }, children, onRemove && React.createElement('button', {
    onClick: onRemove,
    onMouseEnter: () => {},
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
      padding: '0',
      cursor: 'pointer',
      color: 'inherit',
      opacity: 0.6,
      marginLeft: '2px',
      lineHeight: 1,
      fontSize: '12px'
    }
  }, '×'));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.StreakRing = __ds_scope.StreakRing;

__ds_ns.Tag = __ds_scope.Tag;

})();
