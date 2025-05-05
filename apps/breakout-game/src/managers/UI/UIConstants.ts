/**
 * UI Constants - Defines positioning and dimensions for UI elements
 */

// Define UI constants with positions and dimensions
const UIConstants = {
  SCORE: {
    X: 20,
    Y: 10  // Moved up from 20
  },
  LIVES: {
    X: 780, // Assuming 800px width game
    Y: 10  // Moved up from 20
  },
  LEVEL: {
    Y: 10  // Moved up from 20
  },
  THEME: {
    X: 400, // Center of screen (assuming 800px width)
    Y: 30  // Moved up from 50
  },
  HUD_HEIGHT: 40, // Match GameHUD height
  PADDING: 10,
  POWER_UP: {
    INDICATOR_SIZE: 25,
    SPACING: 60,
    BASE_X: 50,
    Y: 30 // From bottom of screen
  },
  SPEED_METER: {
    WIDTH: 100,
    HEIGHT: 15,
    BAR_HEIGHT: 13,
    X_OFFSET: 120, // From right edge
    Y_OFFSET: 30   // From bottom edge
  },
  MESSAGE: {
    Y_OFFSET: 50   // From center
  },
  COLORS: {
    DEFAULT: '#ffff00',
    NIGHT: '#8080ff',
    RETRO: '#00ff00',
    FUTURE: '#00ffff',
    NEON: '#ff00ff',
    NEURAL_LIQUID: {
      PRIMARY_BLUE: '#4682ff',
      PRIMARY_PURPLE: '#9370ff',
      ACCENT_CYAN: '#00e2ff',
      TEXT_LIGHT: '#e0e6ff',
      TEXT_WHITE: '#ffffff',
      PANEL_BG: '#111527',
      BORDER_COLOR: '#1e2642'
    }
  }
};

export default UIConstants;