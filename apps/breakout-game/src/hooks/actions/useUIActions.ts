import { useCallback } from 'react';
import { GameState } from '../../types/game-types';
import { Paddle } from '../../types/Paddle';

interface UseUIActionsProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  paddlesRef: React.MutableRefObject<Paddle[]>;
}

export function useUIActions({
  gameState,
  setGameState,
  paddlesRef
}: UseUIActionsProps) {
  
  const customizePaddles = useCallback(() => {
    // Logic to customize paddles
    const paddleStyles = ['normal', 'wide', 'narrow', 'fast', 'sticky'];
    const selectedStyle = paddleStyles[Math.floor(Math.random() * paddleStyles.length)];
    
    paddlesRef.current.forEach(paddle => {
      switch (selectedStyle) {
        case 'wide':
          paddle.width = paddle.width * 1.5;
          break;
        case 'narrow':
          paddle.width = paddle.width * 0.8;
          break;
        case 'fast':
          paddle.player = (paddle.player || 1) * 1.5; // Using player field to store speed multiplier
          break;
        case 'sticky':
          paddle.color = '#00FF00'; // Green for sticky paddles
          break;
        default:
          // Reset to normal
          paddle.width = 100;
          paddle.player = paddle.player || 1;
          paddle.color = '#FFFFFF';
      }
    });
  }, [paddlesRef]);

  const customizeBalls = useCallback(() => {
    // Logic to customize balls
    // This would modify the ball properties in the game
    console.log("Ball customization not implemented yet");
  }, []);

  const handleSoundEffects = useCallback(() => {
    // Logic to handle sound effects
    console.log("Sound effects handling not implemented yet");
  }, []);

  const handleBackgroundMusic = useCallback(() => {
    // Logic to handle background music
    console.log("Background music handling not implemented yet");
  }, []);

  const handleTutorial = useCallback(() => {
    // Logic to handle tutorial
    setGameState(prev => ({
      ...prev,
      showLandingPage: true,
      demoMode: true
    }));
  }, [setGameState]);

  const handleHelpSection = useCallback(() => {
    // Logic to handle help section
    setGameState(prev => ({
      ...prev,
      isOverlayVisible: true
    }));
  }, [setGameState]);

  const handleLeaderboards = useCallback(() => {
    // Logic to handle leaderboards
    console.log("Leaderboards handling not implemented yet");
  }, []);

  return {
    customizePaddles,
    customizeBalls,
    handleSoundEffects,
    handleBackgroundMusic,
    handleTutorial,
    handleHelpSection,
    handleLeaderboards
  };
}