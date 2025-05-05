// Export all managers
export { default as BallManager } from './Ball/BallManager';
export { default as BrickManager } from './Brick/BrickManager';
export { default as CollisionManager } from './CollisionHandlers/CollisionManager';
export { default as EventManager } from './EventManager';
export { default as GameStateManager } from './GameStateManager';
export { default as InputManager } from './InputManager';
export { default as LevelManager } from './LevelManager';
export { default as PaddleManager } from './paddle/PaddleManager';
export { default as ParticleManager } from './ParticleManager';
export { default as PhysicsManager } from './Physics/PhysicsManager';
export { default as PowerUpManager } from './PowerUpManager';
export { default as ScoreManager } from './ScoreManager';
export { default as ThemeManager } from './ThemeManager';
export { default as TimeManager } from './TimeManager';
export { default as UIManager } from './UI';
// Don't export PaddleController from here to avoid confusion
