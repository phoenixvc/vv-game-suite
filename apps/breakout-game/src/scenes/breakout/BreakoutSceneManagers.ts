import { CollisionManager, UIManager } from '@/managers';
import { GAME_STATE } from '../../constants/GameConstants';
import BallManager from '../../managers/Ball/BallManager';
import BrickManager from '../../managers/BrickManager';
import InputManager from '../../managers/InputManager';
import LevelManager from '../../managers/LevelManager';
import ParticleManager from '../../managers/ParticleManager';
import PhysicsManager from '../../managers/PhysicsManager';
import PowerUpManager from '../../managers/PowerUpManager';
import ScoreManager from '../../managers/ScoreManager';
import { MarketSim } from '../../simulations/MarketSim';
import BreakoutScene from './BreakoutScene';

/**
 * Handles all manager-related functionality for the BreakoutScene
 */
export class BreakoutSceneManagers {
  private scene: BreakoutScene;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  // Getters and setters for managers
  public getBrickManager = (): BrickManager => {
    return this.scene['brickManager'];
  }
  
  public setBrickManager = (manager: BrickManager): void => {
    this.scene['brickManager'] = manager;
  }
  
  public setPowerUpManager = (manager: PowerUpManager): void => {
    this.scene['powerUpManager'] = manager;
  }
  
  public getPowerUpManager = (): PowerUpManager => {
    return this.scene['powerUpManager'];
  }
  
  public setUIManager = (manager: UIManager): void => {
    this.scene['uiManager'] = manager;
  }
  
  public getUIManager = (): UIManager => {
    return this.scene['uiManager'];
  }
  
  public setCollisionManager = (manager: CollisionManager): void => {
    this.scene['collisionManager'] = manager;
  }
  
  public getCollisionManager = (): CollisionManager => {
    return this.scene['collisionManager'];
  }
  
  public setBallManager = (manager: BallManager): void => {
    this.scene['ballManager'] = manager;
  }
  
  public getBallManager = (): BallManager => {
    return this.scene['ballManager'];
  }
  
  public setLevelManager = (manager: LevelManager): void => {
    this.scene['levelManager'] = manager;
  }
  
  public getLevelManager = (): LevelManager => {
    return this.scene['levelManager'];
  }
  
  public setScoreManager = (manager: ScoreManager): void => {
    this.scene['scoreManager'] = manager;
  }
  
  public getScoreManager = (): ScoreManager => {
    return this.scene['scoreManager'];
  }
  
  public setInputManager = (manager: InputManager): void => {
    this.scene['inputManager'] = manager;
  }
  
  public getInputManager = (): InputManager => {
    return this.scene['inputManager'];
  }
  
  public setParticleManager = (manager: ParticleManager): void => {
    this.scene['particleManager'] = manager;
  }
  
  public getParticleManager = (): ParticleManager => {
    return this.scene['particleManager'];
  }
  
  public setPhysicsManager = (manager: PhysicsManager): void => {
    this.scene['physicsManager'] = manager;
  }
  
  public getPhysicsManager = (): PhysicsManager => {
    return this.scene['physicsManager'];
  }
  
  public getSoundManager = (): any => {
    // This is a placeholder - you would need to implement a proper SoundManager
    return this.scene.registry.get('soundManager');
  }
  
  public getAngleFactor = (): number => {
    return this.scene.registry.get('angleFactor') || GAME_STATE.DEFAULT_ANGLE_FACTOR;
  }
  
  public setAngleFactor = (value: number): void => {
    this.scene.registry.set('angleFactor', value);
  }
  
  public setMarketSim = (marketSim: MarketSim): void => {
    this.scene['marketSim'] = marketSim;
  }
  
  public getMarketSim = (): MarketSim => {
    return this.scene['marketSim'];
  }
  
  public getMarketData = (): any => {
    return this.scene['marketData'];
  }
}