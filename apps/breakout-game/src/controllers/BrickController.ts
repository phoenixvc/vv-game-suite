import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';

/**
 * Controls individual brick behavior
 */
class BrickController {
  private scene: BreakoutScene;
  private brick: Phaser.Physics.Matter.Sprite;
  private health: number;
  private initialHealth: number;
  private points: number;
  private special: boolean = false;
  private specialType?: string;
  private isActive: boolean = true;
  private neighbors: BrickController[] = [];
  
  constructor(scene: BreakoutScene, brick: Phaser.Physics.Matter.Sprite, health: number, points: number) {
    this.scene = scene;
    this.brick = brick;
    this.health = health;
    this.initialHealth = health;
    this.points = points;
    
    // Store data on the brick for collision handling
    this.brick.setData('controller', this);
    this.brick.setData('initialHealth', health);
    
    // Initialize brick appearance
    this.updateAppearance();
  }
  
  /**
   * Set brick as special with a specific type
   */
  setSpecial(type: string): void {
    this.special = true;
    this.specialType = type;
    // Update appearance based on special type
    switch (type) {
      case 'explosive':
        this.brick.setTint(0xff0000);
        break;
      case 'reinforced':
        this.brick.setTint(0x888888);
        this.health *= 2;
        this.initialHealth = this.health;
        break;
      case 'powerup':
        this.brick.setTint(0x00ff00);
        break;
      case 'indestructible':
        this.brick.setTint(0x444444);
        this.health = Infinity;
        break;
    }
  }
  
  /**
   * Set neighboring bricks
   */
  setNeighbors(neighbors: BrickController[]): void {
    this.neighbors = neighbors;
  }
  
  /**
   * Handle hit from ball
   */
  hit(damage: number = 1, fromExplosion: boolean = false): boolean {
    if (this.specialType === 'indestructible' && !fromExplosion) {
      // Indestructible bricks can't be destroyed by normal hits
      this.playHitEffect();
      return false;
    }
    
    this.health -= damage;
    
    // Play hit effect
    this.playHitEffect();
    
    if (this.health <= 0) {
      // Brick destroyed
      this.destroy();
      return true;
    } else {
      // Brick damaged but not destroyed
      this.updateAppearance();
      
      // Emit brick damaged event
      this.scene['eventManager']?.emit('brickDamaged', {
        brick: this.brick,
        health: this.health,
        initialHealth: this.initialHealth
      });
      
      return false;
    }
  }
  
  /**
   * Play visual/audio effect when brick is hit
   */
  private playHitEffect(): void {
    // Flash brick
    this.scene.tweens.add({
      targets: this.brick,
      alpha: 0.5,
      duration: 50,
      yoyo: true,
      repeat: 0
    });
    
    var particleManager = this.scene.getParticleManager();
    // Create particle effect using ParticleManager
    if (particleManager) {
      // Get the brick color for the particles
      let color = this.brick.tintTopLeft || 0xffffff;
      
      // Use the createBrickHitEffect method instead of createParticles
      particleManager.createBrickHitEffect(this.brick, color);
    }
    // Play sound if available
    // this.scene.sound.play('brickHit');
  }
  /**
   * Update brick appearance based on health
   */
  updateAppearance(): void {
    if (!this.isActive) return;
    
    // Skip for special bricks that have fixed appearance
    if (this.special && this.specialType !== 'reinforced') return;
    
    // Change tint based on health percentage
    const healthPercent = this.health / this.initialHealth;
    
    if (healthPercent < 0.33) {
      this.brick.setTint(0xff0000); // Red for low health
    } else if (healthPercent < 0.66) {
      this.brick.setTint(0xffff00); // Yellow for medium health
    } else {
      // Default color or special color
      if (this.special && this.specialType === 'reinforced') {
        this.brick.setTint(0x888888);
      } else {
        this.brick.clearTint();
      }
    }
  }
  
  /**
   * Activate special effect when brick is destroyed
   */
  activateSpecialEffect(): void {
    if (!this.special || !this.specialType) return;
    
    switch (this.specialType) {
      case 'explosive':
        this.explode();
        break;
      case 'reinforced':
        // Already handled by increased health
        break;
      case 'powerup':
        this.guaranteePowerUp();
        break;
      case 'indestructible':
        // Should not be destroyed normally
        break;
    }
  }
  
  /**
   * Create explosion that damages nearby bricks
   */
  explode(): void {
    
    var particleManager = this.scene.getParticleManager();
    // Create explosion effect using ParticleManager's dedicated method
    if (particleManager) {
      particleManager.createExplosion(
        this.brick.x, 
        this.brick.y, 
        0xff8800, 
        30
      );
    } else {
      // If ParticleManager is not available, use camera shake as a minimal effect
      if (this.scene['cameraController']) {
        this.scene['cameraController'].shake(0.02, 300);
      }
    }
    
    // Damage neighboring bricks
    this.neighbors.forEach(neighbor => {
      if (neighbor && neighbor.isActive) {
        neighbor.hit(2, true);
      }
    });
    
    // Emit explosion event
    this.scene['eventManager']?.emit('brickExploded', {
      x: this.brick.x,
      y: this.brick.y
    });
  }
    
  /**
   * Guarantee a power-up spawn
   */
  guaranteePowerUp(): void {
    // Create power-up particle effect using the dedicated method
    var particleManager = this.scene.getParticleManager();
    if (particleManager) {
      particleManager.createPowerUpEffect(this.brick.x, this.brick.y, 0x00ff00);
    }
  
    this.scene['powerUpManager']?.createPowerUp(this.brick.x, this.brick.y);
  }
  /**
   * Reinforce neighboring bricks
   */
  reinforceNeighbors(): void {
    this.neighbors.forEach(neighbor => {
      if (neighbor && neighbor.isActive) {
        neighbor.health += 1;
        neighbor.updateAppearance();
      }
    });
  }
  
  /**
   * Destroy the brick
   */
  destroy(): void {
    if (!this.isActive) return;
    this.isActive = false;
    
    var particleManager = this.scene.getParticleManager();
    // Award points
    this.scene['scoreManager']?.increaseScore(this.points);
    
    // Create brick destroy particle effect using the dedicated method
    if (particleManager) {
      // Get the brick color for the particles
      let color = this.brick.tintTopLeft || 0xffffff;
      
      // Use the createBrickDestroyEffect method
      particleManager.createBrickDestroyEffect(this.brick, color);
    }
    // Special effects when destroyed
    if (this.special) {
      this.activateSpecialEffect();
    } else {
      // Regular bricks have chance to spawn power-up
      if (Math.random() < 0.2) {
        this.scene['powerUpManager']?.createPowerUp(this.brick.x, this.brick.y);
      }
    }

    // Emit brick destroyed event
    this.scene['eventManager']?.emit('brickDestroyed', {
      x: this.brick.x,
      y: this.brick.y,
      points: this.points,
      special: this.special,
      specialType: this.specialType
    });
    
    // Remove from physics world
    if (this.brick.body) {
      this.scene.matter.world.remove(this.brick.body as MatterJS.BodyType);
    }
    
    // Destroy the sprite
    this.brick.destroy();
    
    // Check if level is complete using BrickManager
    if (this.scene['brickManager']) {
      // Use a safer approach with indexed access
      const brickManager = this.scene['brickManager'];
      // Emit an event that the brick manager can listen to
      this.scene['eventManager']?.emit('brickDestroyedByController', {
        x: this.brick.x,
        y: this.brick.y
      });
    }
    
    // Also notify the level manager about progress
    if (this.scene['levelManager']) {
      // Check if the level is complete after a brick is destroyed
      this.scene['eventManager']?.emit('checkLevelProgress');
    }
  }
  /**
   * Get the brick game object
   */
  getBrick(): Phaser.Physics.Matter.Sprite {
    return this.brick;
  }
  
  /**
   * Check if brick is active
   */
  getIsActive(): boolean {
    return this.isActive;
  }
  
  /**
   * Get brick health
   */
  getHealth(): number {
    return this.health;
  }
  
  /**
   * Get brick position
   */
  getPosition(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.brick.x, this.brick.y);
  }
}

export default BrickController;