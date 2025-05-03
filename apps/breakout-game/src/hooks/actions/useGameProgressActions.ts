import { useCallback } from 'react';
import { GameState } from '../../types/game-types';

interface UseGameProgressActionsProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export function useGameProgressActions({
  gameState,
  setGameState
}: UseGameProgressActionsProps) {
  
  const updateEducationalProgress = useCallback((topic: string) => {
    setGameState((prev) => ({
      ...prev,
      educationalProgress: {
        ...prev.educationalProgress,
        [topic]: true,
      },
    }));
  }, [setGameState]);

  const updatePerformanceMetrics = useCallback((metric: string, value: number) => {
    setGameState((prev) => ({
      ...prev,
      performanceMetrics: {
        ...prev.performanceMetrics,
        [metric]: value,
      },
    }));
  }, [setGameState]);

  const trackLevel = useCallback(() => {
    // Logic to track the current level
    const completionPercentage = Math.min(100, (gameState.score / 5000) * 100);
    updatePerformanceMetrics('levelCompletion', completionPercentage);
    
    if (gameState.score > 5000 * gameState.level) {
      updateLevel(gameState.level + 1);
    }
  }, [gameState.score, gameState.level, updatePerformanceMetrics]);

  const updateLevel = useCallback((level: number) => {
    setGameState((prev) => ({
      ...prev,
      level,
    }));
  }, [setGameState]);

  const handleAchievements = useCallback(() => {
    // Logic to handle achievements
    const achievements = [
      { id: 'score_1000', condition: gameState.score >= 1000, name: 'Score 1000 points' },
      { id: 'level_5', condition: gameState.level >= 5, name: 'Reach level 5' },
      { id: 'collect_10_powerups', condition: gameState.collectedPowerUps.length >= 10, name: 'Collect 10 power-ups' }
    ];
    
    achievements.forEach(achievement => {
      if (achievement.condition) {
        // Check if achievement is already unlocked
        if (!gameState.performanceMetrics[`achievement_${achievement.id}`]) {
          // Unlock achievement
          updatePerformanceMetrics(`achievement_${achievement.id}`, 1);
          console.log(`Achievement unlocked: ${achievement.name}`);
        }
      }
    });
  }, [gameState, updatePerformanceMetrics]);

  const handleAdaptiveDifficulty = useCallback(() => {
    // Logic to handle adaptive difficulty
    const playerSkill = gameState.score / Math.max(1, gameState.level);
    
    if (playerSkill > 2000) {
      // Player is skilled, increase difficulty
      setGameState(prev => ({
        ...prev,
        angleFactor: Math.min(10, prev.angleFactor + 1)
      }));
    } else if (playerSkill < 500 && gameState.lives < 2) {
      // Player is struggling, decrease difficulty
      setGameState(prev => ({
        ...prev,
        angleFactor: Math.max(2, prev.angleFactor - 1),
        lives: prev.lives + 1
      }));
    }
  }, [gameState.score, gameState.level, gameState.lives, setGameState]);

  return {
    updateEducationalProgress,
    updatePerformanceMetrics,
    trackLevel,
    updateLevel,
    handleAchievements,
    handleAdaptiveDifficulty
  };
}