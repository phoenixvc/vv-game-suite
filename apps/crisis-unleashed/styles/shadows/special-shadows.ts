/**
 * Special effect shadows like pixelated and 3D effects
 * These are computed lazily to reduce initial bundle size
 */
export const specialShadows = {
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
  
  get embossed() {
    return 'inset -2px -2px 5px rgba(255, 255, 255, 0.7), inset 2px 2px 5px rgba(0, 0, 0, 0.1)';
  },
  
  get pressed() {
    return 'inset 2px 2px 5px rgba(0, 0, 0, 0.2), inset -2px -2px 5px rgba(255, 255, 255, 0.7)';
  },
  
  get retro3D() {
    return '5px 5px 0px rgba(0, 0, 0, 0.8)';
  }
} as const;