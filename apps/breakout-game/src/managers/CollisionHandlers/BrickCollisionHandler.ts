import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';

export class BrickCollisionHandler implements CollisionHandlerInterface {
  private scene: BreakoutScene;
  private bricks: Phaser.GameObjects.Group;
  
  constructor(scene: BreakoutScene, bricks: Phaser.GameObjects.Group) {
    this.scene = scene;
    this.bricks = bricks;
  }
  
  /**
   * Handle collision between physics bodies
   * @param bodyA First body in the collision
   * @param bodyB Second body in the collision
   * @param stage Collision stage (start, active, end)
   * @returns True if the collision was handled, false otherwise
   */
  public handleCollision(
    bodyA: MatterJS.BodyType,
    bodyB: MatterJS.BodyType,
    stage: 'start' | 'active' | 'end' = 'start'
  ): boolean {
    // Only handle collision start events by default
    if (stage !== 'start') return false;
    
    // Check if either body is a brick
    const isBrickA = this.isBrick(bodyA);
    const isBrickB = this.isBrick(bodyB);
    
    if (!isBrickA && !isBrickB) return false;
    
    // Get the brick and the other object
    const brick = isBrickA ? bodyA.gameObject : bodyB.gameObject;
    const otherObject = isBrickA ? bodyB.gameObject : bodyA.gameObject;
    
    if (!brick || !otherObject) return false;
    
    // Process the brick collision
    this.processBrickCollision(brick, otherObject);
    
    return true;
  }
  
  /**
   * Handle collision between game objects
   * @param objectA First game object in the collision
   * @param objectB Second game object in the collision
   * @returns True if the collision was handled, false otherwise
   */
  public handleGameObjectCollision(
    objectA: Phaser.GameObjects.GameObject,
    objectB: Phaser.GameObjects.GameObject
  ): boolean {
    // Check if either object is a brick
    const isBrickA = this.isGameObjectBrick(objectA);
    const isBrickB = this.isGameObjectBrick(objectB);
    
    if (!isBrickA && !isBrickB) return false;
    
    // Get the brick and the other object
    const brick = isBrickA ? objectA : objectB;
    const otherObject = isBrickA ? objectB : objectA;
    
    // Process the brick collision
    this.processBrickCollision(brick, otherObject);
    
    return true;
  }
  
  /**
   * Process a collision with a brick
   * @param brick The brick GameObject
   * @param otherObject The other GameObject involved in the collision
   */
  private processBrickCollision(
    brick: Phaser.GameObjects.GameObject,
    otherObject: Phaser.GameObjects.GameObject
  ): void {
    // Get the brick health
    const health = brick.getData('health') || 1;
    const value = brick.getData('value') || 100;
    
    // Reduce brick health
    if (health > 1) {
      // Brick still has health, reduce it
      brick.setData('health', health - 1);
      
      // Update brick appearance based on damage
      this.updateBrickAppearance(brick);
      
      // Emit brick damaged event
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('brickDamaged', { brick, health: health - 1 });
      }
    } else {
      // Brick is destroyed
      this.destroyBrick(brick, value);
    }
  }
  
  /**
   * Update brick appearance based on current health
   * @param brick The brick to update
   */
  private updateBrickAppearance(brick: Phaser.GameObjects.GameObject): void {
    const health = brick.getData('health') || 0;
    const maxHealth = brick.getData('maxHealth') || 1;
    
    // Calculate damage percentage
    const damagePercent = 1 - (health / maxHealth);
    
    // Apply visual effects based on damage
    if (brick instanceof Phaser.GameObjects.Sprite) {
      // Darken the brick based on damage
      const tint = brick.tintTopLeft;
      const darkenFactor = 1 - (damagePercent * 0.5);
      
      // Create a darker version of the current tint
      const r = ((tint >> 16) & 0xFF) * darkenFactor;
      const g = ((tint >> 8) & 0xFF) * darkenFactor;
      const b = (tint & 0xFF) * darkenFactor;
      
      const newTint = (Math.floor(r) << 16) + (Math.floor(g) << 8) + Math.floor(b);
      brick.setTint(newTint);
      
      // Add a crack overlay or animation if available
      if (damagePercent > 0.5) {
        brick.setData('cracked', true);
  }
    }
  }
  
  /**
   * Destroy a brick and handle scoring
   * @param brick The brick to destroy
   * @param value The point value of the brick
   */
  private destroyBrick(brick: Phaser.GameObjects.GameObject, value: number): void {
    // Add score
    const scoreManager = this.scene.getScoreManager();
    if (scoreManager) {
      scoreManager.addScore(value);
    }
    
    // Play destroy animation/effect
    this.playDestroyEffect(brick);
    
    // Check for power-up spawn
    this.checkPowerUpSpawn(brick);
    
    // Emit brick destroyed event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('brickDestroyed', { brick, value });
  }
    
    // Remove the brick from the game
    brick.destroy();
}
  
/**
 * Play destroy effect for a brick
 * @param brick The brick being destroyed
 */
private playDestroyEffect(brick: Phaser.GameObjects.GameObject): void {
  // Get the particle manager from the scene
  const particleManager = this.scene.getParticleManager?.();
  
  if (particleManager) {
    // Check if the brick is a Matter.js sprite specifically
    if (brick instanceof Phaser.Physics.Matter.Sprite) {
      // Use the specialized method for Matter.js sprites
      particleManager.createBrickDestroyEffect(brick);
    } else {
      // For regular sprites or other GameObjects, extract position and color
      let x = 0, y = 0, color = 0xffffff;
      
      // Try to get position from brick
      if ('x' in brick && typeof brick.x === 'number') x = brick.x;
      if ('y' in brick && typeof brick.y === 'number') y = brick.y;
      
      // Try to get color from brick if it's a sprite
      if (brick instanceof Phaser.GameObjects.Sprite && 'tintTopLeft' in brick) {
        color = brick.tintTopLeft;
      }
      
      // Create particles at the position
      particleManager.createParticles(x, y, {
        texture: 'square',
        color,
        count: 15,
        speed: { min: 50, max: 150 },
        scale: { start: 0.5, end: 0 },
        lifespan: 600,
        duration: 600
      });
    }
  } else {
    // Fallback to direct particle creation if no particle manager is available
    if (brick instanceof Phaser.GameObjects.Sprite) {
      const x = brick.x;
      const y = brick.y;
      const color = brick.tintTopLeft;
      
      // Create basic particles directly
      const particles = this.scene.add.particles(x, y, 'particle', {
        speed: { min: 50, max: 150 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        blendMode: Phaser.BlendModes.ADD,
        lifespan: 300,
        tint: color
      });
      
      // Clean up particles after they're done
      this.scene.time.delayedCall(600, () => {
        if (particles && particles.active) {
          particles.destroy();
        }
      });
    }
  }
}
  
  /**
   * Check if a power-up should spawn from a destroyed brick
   * @param brick The destroyed brick
   */
  private checkPowerUpSpawn(brick: Phaser.GameObjects.GameObject): void {
    // Random chance to spawn power-up
    const spawnChance = 0.2; // 20% chance
    
    if (Math.random() < spawnChance) {
      // Get power-up manager
      const powerUpManager = this.scene.getPowerUpManager();
      if (powerUpManager && typeof powerUpManager.createPowerUp === 'function') {
        // Get brick position
        let x = 0, y = 0;
        if (brick instanceof Phaser.GameObjects.Sprite) {
          x = brick.x;
          y = brick.y;
        }
        
        // Spawn a power-up at the brick's position
        powerUpManager.createPowerUp(x, y);
      }
    }
  }
  
  /**
   * Check if a body is a brick
   * @param body The physics body to check
   * @returns True if the body is a brick
   */
  private isBrick(body: MatterJS.BodyType): boolean {
    // Check the body label
    if (body.label === 'brick' || body.label === 'bossBrick') return true;
    
    // Check if the body has a gameObject with brick data
    if (body.gameObject) {
      return this.isGameObjectBrick(body.gameObject);
    }
    
    return false;
  }
  
  /**
   * Check if a game object is a brick
   * @param gameObject The game object to check
   * @returns True if the game object is a brick
   */
  private isGameObjectBrick(gameObject: Phaser.GameObjects.GameObject): boolean {
    // Check for brick data
    if (gameObject.getData('type') && gameObject.getData('health')) return true;
    
    // Check for brick name or type
    if (gameObject.name && gameObject.name.includes('brick')) return true;
    
    // Check if it's in the bricks group
    if (this.bricks.contains(gameObject)) return true;
    
    return false;
  }
}