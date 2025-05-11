/**
 * VV Game Suite Configuration
 * 
 * This package provides shared configuration settings for the VV Game Suite.
 */

/**
 * Game configuration defaults
 */
export const gameDefaults = {
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  fps: 60,
  debug: false
};

/**
 * Theme configuration
 */
export const themeConfig = {
  defaultTheme: 'dark',
  themes: {
    dark: {
      primary: '#121212',
      secondary: '#1f1f1f',
      text: '#ffffff',
      accent: '#6200ee'
    },
    light: {
      primary: '#ffffff',
      secondary: '#f5f5f5',
      text: '#121212',
      accent: '#6200ee'
    }
  }
};

/**
 * Physics configuration
 */
export const physicsConfig = {
  default: 'matter',
  matter: {
    gravity: { y: 0.5 },
    debug: false
  }
};

/**
 * Returns the configuration object for a given game ID.
 *
 * If a specific configuration exists for the provided {@link gameId}, a deep-cloned copy is returned; otherwise, the default game configuration is returned.
 *
 * @param gameId - The unique identifier of the game.
 * @returns The configuration object for the specified game, or the default configuration if not found.
 */
export function getGameConfig(gameId: string) {
  const configs: Record<string, any> = {
    'breakout': structuredClone({
      ...gameDefaults,
       title: 'Breakout Game',
       physics: {
         ...physicsConfig,
         matter: {
           ...physicsConfig.matter,
           gravity: { y: 0.2 }
         }
       }
    }),
  };
  
  return configs[gameId] || gameDefaults;
}