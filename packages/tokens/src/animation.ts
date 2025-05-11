/**
 * Animation tokens
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
} as const;