/**
 * Layout tokens: z-index and breakpoints
 */

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
} as const;

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
} as const;