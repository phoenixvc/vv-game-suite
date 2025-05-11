/**
 * VV Game Suite Design Tokens
 * 
 * This package provides design tokens and theme variables for the VV Game Suite.
 */

// Import all token modules
import { colors } from './colors';
import { spacing } from './spacing';
import { fontFamily, fontSize, fontWeight, lineHeight } from './typography';
import { borderRadius } from './borders';
import { shadows } from './shadows';
import { zIndex, breakpoints } from './layout';
import { animation } from './animation';
import { themes } from './themes';

// Re-export all individual token modules
export { colors } from './colors';
export { spacing } from './spacing';
export { fontFamily, fontSize, fontWeight, lineHeight } from './typography';
export { borderRadius } from './borders';
export { shadows } from './shadows';
export { zIndex, breakpoints } from './layout';
export { animation } from './animation';
export { themes } from './themes';

/**
 * Export all tokens as a single frozen object for complete type safety and immutability
 */
export const tokens = Object.freeze({
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
} as const);