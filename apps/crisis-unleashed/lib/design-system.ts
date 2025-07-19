// Comprehensive Design System for Crisis Unleashed

export const colors = {
  // Primary brand colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Primary blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },

  // Secondary accent colors
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd', 
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Cyan accent
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49'
  },

  // Success states
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Success green
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },

  // Warning states
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24', // Warning amber
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03'
  },

  // Error/danger states
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Error red
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  },

  // Neutral grays (dark theme optimized)
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617'
  },

  // Game-specific faction colors
  factions: {
    celestial: {
      primary: '#fbbf24', // Gold
      secondary: '#f59e0b',
      accent: '#d97706'
    },
    cybernetic: {
      primary: '#06b6d4', // Cyan
      secondary: '#0891b2',
      accent: '#0e7490'
    },
    eclipsed: {
      primary: '#8b5cf6', // Violet
      secondary: '#7c3aed',
      accent: '#6d28d9'
    },
    primordial: {
      primary: '#22c55e', // Green
      secondary: '#16a34a',
      accent: '#15803d'
    },
    titanborn: {
      primary: '#f97316', // Orange
      secondary: '#ea580c',
      accent: '#c2410c'
    },
    void: {
      primary: '#ec4899', // Pink
      secondary: '#db2777',
      accent: '#be185d'
    }
  }
} as const

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem'
} as const

export const typography = {
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem'
  },
  lineHeights: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },
  fontWeights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  }
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: '0 0 #0000',
  
  // Colored shadows for interactive elements
  colored: {
    primary: '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
    secondary: '0 10px 15px -3px rgba(14, 165, 233, 0.4)',
    success: '0 10px 15px -3px rgba(34, 197, 94, 0.4)',
    warning: '0 10px 15px -3px rgba(251, 191, 36, 0.4)',
    error: '0 10px 15px -3px rgba(239, 68, 68, 0.4)'
  }
} as const

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px'
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const

// Animation presets
export const animations = {
  durations: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms'
  },
  easings: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const

// Accessibility helpers
export const accessibility = {
  focusRing: '2px solid rgb(59, 130, 246)', // Primary color
  minTouchTarget: '44px', // WCAG minimum touch target
  contrastRatios: {
    AA: 4.5,
    AAA: 7.0
  }
} as const

// Design tokens for consistent usage
export const tokens = {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  breakpoints,
  animations,
  accessibility
} as const

// Utility functions for design system
export function getColorValue(colorPath: string): string {
  const parts = colorPath.split('.')
  let result: any = colors
  
  for (const part of parts) {
    result = result?.[part]
  }
  
  return result || colorPath
}

export function getSpacingValue(spacing: keyof typeof spacing): string {
  return spacing[spacing] || '0'
}

// Theme configuration for different contexts
export const themes = {
  dark: {
    background: colors.neutral[950],
    surface: colors.neutral[900],
    surfaceVariant: colors.neutral[800],
    text: {
      primary: colors.neutral[50],
      secondary: colors.neutral[200],
      muted: colors.neutral[400]
    },
    border: colors.neutral[700]
  },
  light: {
    background: colors.neutral[50],
    surface: colors.neutral[100],
    surfaceVariant: colors.neutral[200],
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[700],
      muted: colors.neutral[500]
    },
    border: colors.neutral[300]
  }
} as const

export default tokens