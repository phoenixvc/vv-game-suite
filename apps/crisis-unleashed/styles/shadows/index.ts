/**
 * Shadow utilities for the application
 * 
 * Exports various shadow styles and utilities, with heavy shadows computed lazily
 * to reduce initial bundle size.
 */
import { baseShadows } from './base-shadows';
import { glowShadows } from './glow-shadows';
import { specialShadows } from './special-shadows';
import { factionShadows, getFactionShadow } from './faction-shadows';

// Export all shadow types
export { baseShadows, glowShadows, specialShadows, factionShadows, getFactionShadow };

// Export a combined object for convenience
export const shadows = {
  ...baseShadows,
  ...glowShadows,
  ...specialShadows,
  ...factionShadows,
  getFactionShadow
} as const;

// Default export for convenience
export default shadows;