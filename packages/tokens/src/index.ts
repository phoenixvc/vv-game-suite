/**
 * VV Game Suite Design Tokens
 * 
 * This package provides design tokens and theme variables for the VV Game Suite.
 */

/**
 * Color palette
 */
export const colors = {
  // Primary colors
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  
  // Secondary colors
  secondary: {
    50: '#f3e5f5',
    100: '#e1bee7',
    200: '#ce93d8',
    300: '#ba68c8',
    400: '#ab47bc',
    500: '#9c27b0',
    600: '#8e24aa',
    700: '#7b1fa2',
    800: '#6a1b9a',
    900: '#4a148c',
  },
  
  // Accent colors
  accent: {
    50: '#fff3e0',
    100: '#ffe0b2',
    200: '#ffcc80',
    300: '#ffb74d',
    400: '#ffa726',
    500: '#ff9800',
    600: '#fb8c00',
    700: '#f57c00',
    800: '#ef6c00',
    900: '#e65100',
  },
  
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Semantic colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  // Game-specific colors
  health: '#ff5252',
  mana: '#2979ff',
  experience: '#ffeb3b',
  gold: '#ffc107',
  
  // Common colors
  black: '#000000',
  white: '#ffffff',
  transparent: 'transparent',
};

/**
 * Spacing scale
 */
export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem',  // 8px
  3: '0.75rem', // 12px
  4: '1rem',    // 16px
  5: '1.25rem', // 20px
  6: '1.5rem',  // 24px
  8: '2rem',    // 32px
  10: '2.5rem', // 40px
  12: '3rem',   // 48px
  16: '4rem',   // 64px
  20: '5rem',   // 80px
  24: '6rem',   // 96px
  32: '8rem',   // 128px
  40: '10rem',  // 160px
  48: '12rem',  // 192px
  56: '14rem',  // 224px
  64: '16rem',  // 256px
};

/**
 * Font families
 */
export const fontFamily = {
  sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  game: '"Press Start 2P", cursive',
  display: '"Audiowide", cursive',
};

/**
 * Font sizes
 */
export const fontSize = {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px
  lg: '1.125rem',    // 18px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px
  '7xl': '4.5rem',   // 72px
  '8xl': '6rem',     // 96px
  '9xl': '8rem',     // 128px
};

/**
 * Font weights
 */
export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

/**
 * Line heights
 */
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
};

/**
 * Border radius
 */
export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  default: '0.25rem', // 4px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px
  xl: '0.75rem',      // 12px
  '2xl': '1rem',      // 16px
  '3xl': '1.5rem',    // 24px
  full: '9999px',
};

/**
 * Shadows
 */
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
  
  // Game-specific shadows
  glow: '0 0 10px rgba(33, 150, 243, 0.6)',
  neon: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6',
  pixel: '4px 4px 0px rgba(0, 0, 0, 0.8)',
};

/**
 * Z-index values
 */
export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  auto: 'auto',
  
  // Game-specific z-index values
  background: '-10',
  game: '1',
  ui: '100',
  hud: '200',
  modal: '300',
  overlay: '400',
  toast: '500',
  popup: '600',
  menu: '700',
  dialog: '800',
};

/**
 * Breakpoints
 */
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/**
 * Animation timings
 */
export const animation = {
  durations: {
    fastest: '100ms',
    faster: '200ms',
    fast: '300ms',
    normal: '400ms',
    slow: '500ms',
    slower: '600ms',
    slowest: '800ms',
  },
  easings: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
    easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    easeInBounce: 'cubic-bezier(0.6, 0.28, 0.735, 0.045)',
    easeOutBounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
};

/**
 * Game-specific themes
 */
export const themes = {
  // Default dark theme
  dark: {
    background: colors.neutral[900],
    foreground: colors.neutral[100],
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    accent: colors.accent[500],
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  },
  
  // Light theme
  light: {
    background: colors.neutral[100],
    foreground: colors.neutral[900],
    primary: colors.primary[600],
    secondary: colors.secondary[600],
    accent: colors.accent[600],
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  },
  
  // Cyberpunk theme
  cyberpunk: {
    background: '#0c0c14',
    foreground: '#e8f0ff',
    primary: '#00f0ff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    success: '#00ff9f',
    warning: '#ff9f00',
    error: '#ff0050',
    info: '#0090ff',
  },
  
  // Retro theme
  retro: {
    background: '#222222',
    foreground: '#f0f0f0',
    primary: '#ff5555',
    secondary: '#55ff55',
    accent: '#5555ff',
    success: '#55ff55',
    warning: '#ffff55',
    error: '#ff5555',
    info: '#55ffff',
  },
  
  // Fantasy theme
  fantasy: {
    background: '#1a0d2c',
    foreground: '#f0e6ff',
    primary: '#9c59d1',
    secondary: '#2c698d',
    accent: '#d1a459',
    success: '#59d17f',
    warning: '#d1b359',
    error: '#d15959',
    info: '#5987d1',
  },
};

/**
 * Export all tokens as a single object
 */
export const tokens = {
  colors,
  spacing,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  borderRadius,
  shadows,
  zIndex,
  breakpoints,
  animation,
  themes,
};