import Phaser from 'phaser';
import { useEffect, useRef } from 'react';

/**
 * A custom hook for initializing and managing a Phaser game instance
 */
export function usePhaser(config: Phaser.Types.Core.GameConfig, dependencies: any[] = []) {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // Initialize the game
    gameRef.current = new Phaser.Game(config);

    // Cleanup function
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, dependencies);

  return gameRef;
}

export default usePhaser;