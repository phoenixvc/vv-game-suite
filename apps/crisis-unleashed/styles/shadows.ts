/**
 * CSS shadow definitions with lazy computation for heavy shadows
 * 
 * Heavy shadows (like neon, complex drop shadows, etc.) are computed only when accessed,
 * reducing initial bundle size and improving performance.
 */

import { getFactionShadow, factionShadows } from './shadows/faction-shadows';

export const shadows = {
  // Light shadows defined eagerly since they're commonly used
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  
  // Heavy shadows computed lazily
  get neon() {
    return '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6, 0 0 25px #0073e6, 0 0 30px #0073e6, 0 0 35px #0073e6';
  },
  
  get neonRed() {
    return '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff0000, 0 0 20px #ff0000, 0 0 25px #ff0000, 0 0 30px #ff0000, 0 0 35px #ff0000';
  },
  
  get pixelated() {
    return [
      '1px 0 0 0 rgba(0, 0, 0, 0.2)',
      '-1px 0 0 0 rgba(0, 0, 0, 0.2)',
      '0 1px 0 0 rgba(0, 0, 0, 0.2)',
      '0 -1px 0 0 rgba(0, 0, 0, 0.2)',
      '1px 1px 0 0 rgba(0, 0, 0, 0.2)',
      '-1px -1px 0 0 rgba(0, 0, 0, 0.2)',
      '1px -1px 0 0 rgba(0, 0, 0, 0.2)',
      '-1px 1px 0 0 rgba(0, 0, 0, 0.2)'
    ].join(', ');
  },
  
  get factionGlow() {
    // This could be a complex shadow based on faction colors
    return '0 0 10px rgba(0, 168, 255, 0.7), 0 0 20px rgba(0, 168, 255, 0.5), 0 0 30px rgba(0, 168, 255, 0.3)';
  },
  
  // Re-export faction shadow function
  getFactionShadow,
  
  // Re-export faction shadows
  ...factionShadows
} as const;

// Export the faction shadows and function directly for more explicit imports
export { getFactionShadow, factionShadows };

// Usage example:
// import { shadows } from '@/styles/shadows';
//
// const Component = () => {
//   return <div style={{ boxShadow: shadows.neon }}>Neon glow!</div>;
// };
//
// // For faction-specific shadows:
// const FactionComponent = ({ factionColor }) => {
//   return <div style={{ boxShadow: shadows.getFactionShadow(factionColor, 'high') }}>Faction glow!</div>;
// };