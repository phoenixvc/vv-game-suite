import { useCallback } from 'react';
import { GameState } from '../../types/game-types';
import { PowerUp, PowerUpType } from '../../types/PowerUp';
import { Paddle } from '../../types/Paddle';

interface UsePowerUpActionsProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  paddlesRef: React.MutableRefObject<Paddle[]>;
  powerUpsRef: React.MutableRefObject<PowerUp[]>;
}

export function usePowerUpActions({
  gameState,
  setGameState,
  paddlesRef,
  powerUpsRef
}: UsePowerUpActionsProps) {
  
  const spawnPowerUp = useCallback((x: number, y: number, type: string) => {
    // Convert string type to PowerUpType enum if possible
    let powerUpType: PowerUpType;
    
    switch (type) {
      case 'extraLife':
        powerUpType = PowerUpType.EXTRA_LIFE;
        break;
      case 'paddleGrow':
        powerUpType = PowerUpType.PADDLE_GROW;
        break;
      case 'paddleShrink':
        powerUpType = PowerUpType.PADDLE_SHRINK;
        break;
      case 'multiBall':
        powerUpType = PowerUpType.MULTI_BALL;
        break;
      case 'speedUp':
        powerUpType = PowerUpType.SPEED_UP;
        break;
      case 'sticky':
        powerUpType = PowerUpType.STICKY;
        break;
      case 'laser':
        powerUpType = PowerUpType.LASER;
        break;
      case 'shield':
        powerUpType = PowerUpType.SHIELD;
        break;
      case 'scoreMultiplier':
        powerUpType = PowerUpType.SCORE_MULTIPLIER;
        break;
      default:
        powerUpType = PowerUpType.EXTRA_LIFE; // Default fallback
    }
    
    // Create a partial PowerUp since we can't create a full Phaser.Physics.Arcade.Sprite here
    const newPowerUp = { 
      x, 
      y, 
      type: powerUpType, 
      duration: 10000 
    } as unknown as PowerUp;
    
    powerUpsRef.current.push(newPowerUp);
  }, [powerUpsRef]);

  const collectPowerUp = useCallback((powerUp: Partial<PowerUp>) => {
    // Add to collected power-ups in game state
    setGameState((prev) => ({
      ...prev,
      collectedPowerUps: [...prev.collectedPowerUps, powerUp as PowerUp],
    }));
    
    // Apply the power-up effect immediately
    if (powerUp.type) {
      applyPowerUpEffect(powerUp as PowerUp);
    }
    
    // Set a timer to remove the effect after the duration
    if (powerUp.duration) {
      setTimeout(() => {
        removePowerUpEffect(powerUp as PowerUp);
      }, powerUp.duration);
    }
  }, [setGameState]);

  const applyPowerUpEffect = useCallback((powerUp: PowerUp) => {
    const powerUpType = powerUp.type as unknown as PowerUpType;
    
    switch (powerUpType) {
      case PowerUpType.EXTRA_LIFE:
        setGameState((prev) => ({
          ...prev,
          lives: prev.lives + 1,
        }));
        break;
      case PowerUpType.PADDLE_GROW:
        paddlesRef.current.forEach((paddle) => {
          paddle.width *= 1.5;
        });
        break;
      case PowerUpType.SCORE_MULTIPLIER:
        setGameState((prev) => ({
          ...prev,
          scoreMultiplier: prev.scoreMultiplier * 2,
        }));
        break;
      case PowerUpType.SHIELD:
        // Implement shield logic
        setGameState(prev => ({
          ...prev,
          performanceMetrics: {
            ...prev.performanceMetrics,
            shieldActive: 1
          }
        }));
        break;
      // Add other power-up effects here
    }
  }, [setGameState, paddlesRef]);

  const removePowerUpEffect = useCallback((powerUp: PowerUp) => {
    const powerUpType = powerUp.type as unknown as PowerUpType;
    
    switch (powerUpType) {
      case PowerUpType.PADDLE_GROW:
        paddlesRef.current.forEach((paddle) => {
          paddle.width /= 1.5;
        });
        break;
      case PowerUpType.SCORE_MULTIPLIER:
        setGameState((prev) => ({
          ...prev,
          scoreMultiplier: prev.scoreMultiplier / 2,
        }));
        break;
      case PowerUpType.SHIELD:
        setGameState(prev => ({
          ...prev,
          performanceMetrics: {
            ...prev.performanceMetrics,
            shieldActive: 0
          }
        }));
        break;
      // Add other power-up expiration logic here
    }
  }, [setGameState, paddlesRef]);

  return {
    spawnPowerUp,
    collectPowerUp,
    applyPowerUpEffect,
    removePowerUpEffect
  };
}