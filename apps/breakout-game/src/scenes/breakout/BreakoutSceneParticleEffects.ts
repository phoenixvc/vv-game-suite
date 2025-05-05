import { getParticleConfig } from '../../config/ParticleEffectsConfig';
import { PowerUpType } from '../../types/PowerUpType';
import BreakoutScene from './BreakoutScene';

/**
 * Handles particle effects for the Breakout scene
 */
class BreakoutSceneParticleEffects {
  private scene: BreakoutScene;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Set up event listeners for particle effects
   */
  public setupParticleEffects(): void {
    const eventManager = this.scene.getEventManager();
    const particleManager = this.scene.getParticleManager();
    
    if (!eventManager || !particleManager) return;
    
    // Ball hits brick effect
    eventManager.on('brickDamaged', (data: { brick: Phaser.Physics.Matter.Sprite }) => {
      particleManager.createBrickHitEffect(data.brick);
    });
    
    // Brick destroyed effect
    eventManager.on('brickDestroyed', (data: { x: number, y: number, special: boolean, specialType?: string }) => {
      let configPath = 'BRICK.DESTROY.default';
      
      if (data.special && data.specialType) {
        switch (data.specialType) {
          case 'explosive': configPath = 'BRICK.DESTROY.explosive'; break;
          case 'reinforced': configPath = 'BRICK.DESTROY.reinforced'; break;
          case 'powerup': configPath = 'BRICK.DESTROY.powerup'; break;
          case 'indestructible': configPath = 'BRICK.DESTROY.indestructible'; break;
        }
      }
      
      const particleConfig = getParticleConfig(configPath);
      particleManager.createParticles(data.x, data.y, particleConfig);
    });
    
    // Power-up collected effect
    eventManager.on('powerUpCollected', (data: { x: number, y: number, type: PowerUpType, paddleId?: string }) => {
      let configPath = 'POWERUP.COLLECT.default';
      
      switch (data.type) {
        case PowerUpType.MULTI_BALL: configPath = 'POWERUP.COLLECT.MULTIBALL'; break;
        case PowerUpType.PADDLE_GROW: configPath = 'POWERUP.COLLECT.EXPAND'; break;
        case PowerUpType.LASER: configPath = 'POWERUP.COLLECT.LASER'; break;
        case PowerUpType.SPEED_DOWN: configPath = 'POWERUP.COLLECT.SLOW'; break;
        case PowerUpType.EXTRA_LIFE: configPath = 'POWERUP.COLLECT.EXTRALIFE'; break;
      }
      
      const particleConfig = getParticleConfig(configPath);
      particleManager.createExplosion(data.x, data.y, particleConfig.color, particleConfig.count);
      
      // If we have a paddleId, create additional effect on that paddle
      if (data.paddleId) {
        const paddle = this.getPaddleById(data.paddleId);
        if (paddle) {
          particleManager.createParticles(paddle.x, paddle.y, {
            ...particleConfig,
            count: Math.floor(particleConfig.count / 2),
            duration: 300
          });
        }
      }
    });

    // Ball launched effect
    eventManager.on('ballLaunched', (data: { ball: Phaser.Physics.Matter.Sprite, paddleId?: string }) => {
      const ball = data.ball || this.scene.getBallManager().getActiveBall();
      if (ball) {
        const particleConfig = getParticleConfig('BALL.LAUNCH');
        particleManager.createParticles(ball.x, ball.y, particleConfig);
        
        // If we have a paddleId, create additional effect on that paddle
        if (data.paddleId) {
          const paddle = this.getPaddleById(data.paddleId);
          if (paddle) {
            particleManager.createParticles(paddle.x, paddle.y, {
              ...particleConfig,
              count: Math.floor(particleConfig.count / 2),
              duration: 200
            });
          }
        }
      }
    });
    
    // Paddle hit effect
    eventManager.on('ballPaddleCollision', (data: { 
      ball: Phaser.Physics.Matter.Sprite, 
      paddle: Phaser.Physics.Matter.Sprite,
      paddleId?: string,
      edge?: string
    }) => {
      const particleConfig = getParticleConfig('PADDLE.HIT');
      
      // Create effect at collision point
      particleManager.createParticles(data.ball.x, data.ball.y, particleConfig);
      
      // Get the paddle that was hit (either from paddleId or directly from the event data)
      const paddle = data.paddleId ? this.getPaddleById(data.paddleId) : data.paddle;
      
      if (paddle) {
        // Adjust particle direction based on which edge of the paddle was hit
        let angle = 0;
        switch (data.edge) {
          case 'top': angle = -90; break;
          case 'bottom': angle = 90; break;
          case 'left': angle = 180; break;
          case 'right': angle = 0; break;
        }
        
        // Create a directional effect based on the edge that was hit
        particleManager.createParticles(data.ball.x, data.ball.y, {
          ...particleConfig,
          angle: { min: angle - 30, max: angle + 30 },
          speed: { min: 40, max: 80 },
          count: Math.floor(particleConfig.count * 1.5)
        });
      }
    });
    
    // Power-up expired effect
    eventManager.on('powerUpExpired', (data: { type: PowerUpType, paddleId?: string }) => {
      const particleConfig = getParticleConfig('POWERUP.EXPIRE');
      
      // If we have a specific paddleId, use that paddle
      if (data.paddleId) {
        const paddle = this.getPaddleById(data.paddleId);
        if (paddle) {
          particleManager.createParticles(paddle.x, paddle.y, particleConfig);
        }
      } else {
        // Otherwise use all active paddles
        const paddles = this.getAllPaddles();
        paddles.forEach(paddle => {
          particleManager.createParticles(paddle.x, paddle.y, {
            ...particleConfig,
            count: Math.floor(particleConfig.count / paddles.length)
          });
        });
      }
    });
    
    // Wall hit effect
    eventManager.on('ballWallCollision', (data: { ball: Phaser.Physics.Matter.Sprite, wall: Phaser.Physics.Matter.Sprite }) => {
      const particleConfig = getParticleConfig('WALL.HIT');
      particleManager.createParticles(data.ball.x, data.ball.y, particleConfig);
    });
  }
  
  /**
   * Create a trail effect for a ball
   * @param ball The ball to create a trail for
   */
  public createBallTrail(ball: Phaser.Physics.Matter.Sprite): void {
    const particleManager = this.scene.getParticleManager();
    if (particleManager && ball) {
      const trailConfig = getParticleConfig('BALL.TRAIL');
      particleManager.createTrail(ball, trailConfig.color);
    }
  }
  
  /**
   * Get a paddle by its ID
   * @param paddleId The ID of the paddle to get
   * @returns The paddle sprite or undefined if not found
   */
  private getPaddleById(paddleId: string): Phaser.Physics.Matter.Sprite | undefined {
    // Try to get the paddle controller for this ID
    const paddleController = this.scene.getPaddleControllerById(paddleId);
    if (paddleController) {
      // Try getPaddle first (single paddle)
      if (paddleController.getPaddle && typeof paddleController.getPaddle === 'function') {
        return paddleController.getPaddle();
      }
    }
    
    // If we can't find a specific controller, try the paddle manager
    const paddleManager = this.scene.getPaddleManager();
    if (paddleManager) {
      return paddleManager.getPaddleByEdge(paddleId);
    }
    
    return undefined;
  }
  
  /**
   * Get all active paddles in the scene
   * @returns Array of paddle sprites
   */
  private getAllPaddles(): Phaser.Physics.Matter.Sprite[] {
    // Use scene's getAllPaddles method if available
    if (this.scene.getAllPaddles && typeof this.scene.getAllPaddles === 'function') {
      return this.scene.getAllPaddles();
    }
    
    // Otherwise get paddles from the paddle manager
    const paddleManager = this.scene.getPaddleManager();
    if (paddleManager) {
      return paddleManager.getPaddles();
    }
    
    return [];
  }
}

export default BreakoutSceneParticleEffects;