/**
 * Faction-specific shadow utilities
 */

/**
 * Generates a shadow effect based on a faction color
 * 
 * @param factionColor - Hex color code (e.g., '#00a8ff')
 * @param intensity - Shadow intensity: 'low', 'medium', or 'high'
 * @returns CSS box-shadow string
 */
export function getFactionShadow(factionColor: string, intensity: 'low' | 'medium' | 'high' = 'medium'): string {
  // Convert hex to rgb components
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16)
    };
  };
  
  const rgb = hexToRgb(factionColor);
  const rgbaBase = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}`;
  
  switch (intensity) {
    case 'low':
      return `0 0 10px ${rgbaBase}, 0.3)`;
    case 'high':
      return `0 0 10px ${rgbaBase}, 0.7), 0 0 20px ${rgbaBase}, 0.5), 0 0 30px ${rgbaBase}, 0.3)`;
    case 'medium':
    default:
      return `0 0 15px ${rgbaBase}, 0.5), 0 0 25px ${rgbaBase}, 0.3)`;
  }
}

/**
 * Pre-defined faction shadows for common factions
 * These are computed lazily to reduce initial bundle size
 */
export const factionShadows = {
  get cyberneticNexus() {
    return getFactionShadow('#00a8ff', 'medium');
  },
  
  get primordialAscendancy() {
    return getFactionShadow('#2ecc71', 'medium');
  },
  
  get voidHarbingers() {
    return getFactionShadow('#9b59b6', 'medium');
  },
  
  get eclipsedOrder() {
    return getFactionShadow('#34495e', 'medium');
  },
  
  get titanborn() {
    return getFactionShadow('#e67e22', 'medium');
  },
  
  get celestialDominion() {
    return getFactionShadow('#f1c40f', 'medium');
  }
} as const;