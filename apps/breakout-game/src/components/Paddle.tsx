import KeyboardPaddle from './KeyboardPaddle';
import MousePaddle from './MousePaddle';

// Re-export both paddle components
export { KeyboardPaddle, MousePaddle };

// Export a default component that can be used as a drop-in replacement
// for the original Paddle component, defaulting to keyboard control
export { KeyboardPaddle as default };