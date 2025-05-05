import * as Phaser from 'phaser';
import { ErrorManager } from '../managers/ErrorManager';
import ParticleManager from './ParticleManager';
import { PhysicsManager } from './PhysicsManager';

export default class WallManager {
  private scene: Phaser.Scene;
  private physicsManager?: PhysicsManager;
  private errorManager?: ErrorManager;
  private particleManager?: ParticleManager;
  private vaultWalls: Phaser.Physics.Matter.Image[] = [];
  private soundManager?: any;
  private levelManager?: any;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    
    // Get managers from scene if available
    if ('getPhysicsManager' in scene && typeof scene.getPhysicsManager === 'function') {
      this.physicsManager = scene.getPhysicsManager();
    }
    
    if ('getErrorManager' in scene && typeof scene.getErrorManager === 'function') {
      this.errorManager = scene.getErrorManager();
    }
    
    if ('getParticleManager' in scene && typeof scene.getParticleManager === 'function') {
      this.particleManager = scene.getParticleManager();
    }
    
    if ('getSoundManager' in scene && typeof scene.getSoundManager === 'function') {
      this.soundManager = scene.getSoundManager();
    }
    
    if ('getLevelManager' in scene && typeof scene.getLevelManager === 'function') {
      this.levelManager = scene.getLevelManager();
    }
    
    // Set up collision handlers
    this.setupWallCollisions();
  }

  /**
   * Create vault walls and roof for the game area
   * These walls will bounce the ball back with increased velocity
   */
  public createVaultWalls(): void {
    try {
      console.log('Creating vault walls and roof for the level');
      
      // Get the current level
      const currentLevel = this.levelManager ? this.levelManager.getCurrentLevel() : 1;
      
      // Only create walls for the first level
      if (currentLevel !== 1) {
        console.log('Skipping vault walls creation for level', currentLevel);
        return;
      }
      
      // Get game dimensions
      const width = this.scene.scale.width;
      const height = this.scene.scale.height;
      
      // Wall thickness
      const wallThickness = 20;
      
      // Check if vault-wall texture exists, otherwise use fallback
      const textureKey = this.scene.textures.exists('vault-wall') ? 'vault-wall' : 'vault-wall-fallback';
      console.log(`Using texture ${textureKey} for vault walls`);
      
      // Create left wall with rectangle physics body
      const leftWall = this.scene.matter.add.image(
        wallThickness / 2,
        height / 2,
        textureKey,
        undefined,
        {
          isStatic: true,
          label: 'leftVaultWall'
        }
      );
      
      // Set up physics properties for left wall
      leftWall.setDisplaySize(wallThickness, height);
      leftWall.setTint(0x3355ff);
      leftWall.setRectangle(wallThickness, height);
      leftWall.setFriction(0.01);
      leftWall.setBounce(1.2);
      leftWall.setData('edge', 'left'); // Add edge data for collision handling
      
      // Create right wall with rectangle physics body
      const rightWall = this.scene.matter.add.image(
        width - wallThickness / 2,
        height / 2,
        textureKey,
        undefined,
        {
          isStatic: true,
          label: 'rightVaultWall'
        }
      );
      
      // Set up physics properties for right wall
      rightWall.setDisplaySize(wallThickness, height);
      rightWall.setFlipX(true);
      rightWall.setTint(0x3355ff);
      rightWall.setRectangle(wallThickness, height);
      rightWall.setFriction(0.01);
      rightWall.setBounce(1.2);
      rightWall.setData('edge', 'right'); // Add edge data for collision handling
      
      // Create roof with rectangle physics body - moved up by 5px as requested
      const roof = this.scene.matter.add.image(
        width / 2,
        (wallThickness / 2) - 5, // Moved up by 5px
        textureKey,
        undefined,
        {
          isStatic: true,
          label: 'roofVaultWall'
        }
      );
      
      // Set up physics properties for roof
      roof.setDisplaySize(width, wallThickness);
      roof.setTint(0x33ff55);
      roof.setRectangle(width, wallThickness);
      roof.setFriction(0.01);
      roof.setBounce(1.3);
      roof.setData('edge', 'top'); // Add edge data for collision handling
      
      // Add glow effects if postFX is available
      try {
        if (leftWall.postFX) {
          leftWall.postFX.addGlow(0x0066ff, 4, 0, false, 0.1, 16);
          rightWall.postFX.addGlow(0x0066ff, 4, 0, false, 0.1, 16);
          roof.postFX.addGlow(0x00ff66, 4, 0, false, 0.1, 16);
        }
      } catch (error) {
        console.warn('Failed to add glow effects to walls:', error);
      }
      
      // Store references to the walls
      this.vaultWalls.push(leftWall, rightWall, roof);
      
      // Set up collision categories if physics manager is available
      if (this.physicsManager) {
        const wallCategory = this.physicsManager.wallCategory;
        const ballCategory = this.physicsManager.ballCategory;
        const paddleCategory = this.physicsManager.paddleCategory;
        
        // Set collision categories for walls
        leftWall.setCollisionCategory(wallCategory);
        leftWall.setCollidesWith([ballCategory, paddleCategory]); // Allow paddle collisions
        
        rightWall.setCollisionCategory(wallCategory);
        rightWall.setCollidesWith([ballCategory, paddleCategory]); // Allow paddle collisions
        
        roof.setCollisionCategory(wallCategory);
        roof.setCollidesWith([ballCategory, paddleCategory]); // Allow paddle collisions
      } else {
        console.warn('Physics manager not available, skipping collision category setup for walls');
      }
      
      console.log('Vault walls and roof created successfully');
    } catch (error) {
      console.error('Error creating vault walls:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to create vault walls', error instanceof Error ? error.stack : undefined);
      }
    }
  }

  /**
   * Remove the vault walls and roof (used when progressing to later levels)
   */
  public removeVaultWalls(): void {
    try {
      console.log('Removing vault walls and roof');
      
      // Remove all vault walls
      this.vaultWalls.forEach(wall => {
        if (wall && wall.body) {
          // Remove physics body and destroy game object
          wall.destroy();
        }
      });
      
      // Clear the array
      this.vaultWalls = [];
      
      console.log('Vault walls and roof removed successfully');
    } catch (error) {
      console.error('Error removing vault walls:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to remove vault walls', error instanceof Error ? error.stack : undefined);
      }
    }
  }

  /**
   * Set up collision handling for walls
   */
  private setupWallCollisions(): void {
    try {
      // Listen for collisions between balls and walls
      this.scene.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
        const pairs = event.pairs;
        
        for (let i = 0; i < pairs.length; i++) {
          const bodyA = pairs[i].bodyA;
          const bodyB = pairs[i].bodyB;
          
          // Use type assertion to access the label property
          const bodyALabel = (bodyA as any).label;
          const bodyBLabel = (bodyB as any).label;
          
          // Check if one body is a ball and the other is a vault wall
          const isWallCollision = 
            (bodyALabel === 'ball' && (bodyBLabel === 'leftVaultWall' || bodyBLabel === 'rightVaultWall' || bodyBLabel === 'roofVaultWall')) ||
            (bodyBLabel === 'ball' && (bodyALabel === 'leftVaultWall' || bodyALabel === 'rightVaultWall' || bodyALabel === 'roofVaultWall'));
          
          if (isWallCollision) {
            // Get the ball body
            const ballBody = bodyALabel === 'ball' ? bodyA : bodyB;
            // Get the wall body
            const wallBody = bodyALabel === 'ball' ? bodyB : bodyA;
            
            console.log(`Ball collision with ${(wallBody as any).label} detected`);
            
            // Increase ball velocity by 15%
            const vx = ballBody.velocity.x * 1.15;
            const vy = ballBody.velocity.y * 1.15;
            
            // Apply the new velocity
            this.scene.matter.body.setVelocity(ballBody, { x: vx, y: vy });
            
            // Play bounce sound if available
            if (this.soundManager && typeof this.soundManager.playSound === 'function') {
              this.soundManager.playSound('bounce');
            }
            
            // Create particle effect at collision point
            if (this.particleManager) {
              // Determine color based on which wall was hit
              let color = 0x4444ff; // Default blue
              const wallLabel = (wallBody as any).label;
              if (wallLabel === 'roofVaultWall') {
                color = 0x44ff44; // Green for roof
              } else if (wallLabel === 'leftVaultWall') {
                color = 0xff4444; // Red for left wall
              } else if (wallLabel === 'rightVaultWall') {
                color = 0xffff44; // Yellow for right wall
              }
              
              this.particleManager.createBounceEffect(
                ballBody.position.x,
                ballBody.position.y,
                color
              );
            }
            
            // Add a flash effect to the wall that was hit
            const hitWall = this.vaultWalls.find(wall => wall.body === wallBody);
            
            if (hitWall) {
              // Store the original tint
              const originalTint = hitWall.tintTopLeft;
              
              // Flash the wall white
              hitWall.setTint(0xffffff);
              
              // Reset tint after a short delay
              this.scene.time.delayedCall(100, () => {
                hitWall.setTint(originalTint);
              });
            }
          }
          
          // Check for paddle-wall collisions to prevent paddle from entering walls
          const isPaddleWallCollision = 
            (bodyALabel === 'paddle' && (bodyBLabel === 'leftVaultWall' || bodyBLabel === 'rightVaultWall' || bodyBLabel === 'roofVaultWall')) ||
            (bodyBLabel === 'paddle' && (bodyALabel === 'leftVaultWall' || bodyALabel === 'rightVaultWall' || bodyALabel === 'roofVaultWall'));
          
          if (isPaddleWallCollision) {
            // Get the paddle body and game object
            const paddleBody = bodyALabel === 'paddle' ? bodyA : bodyB;
            const wallBody = bodyALabel === 'paddle' ? bodyB : bodyA;
            
            if (paddleBody.gameObject && wallBody.gameObject) {
              const paddle = paddleBody.gameObject;
              const wall = wallBody.gameObject;
              
              // Get the wall edge
              const wallLabel = (wallBody as any).label;
              let edge = wall.getData('edge');
              
              if (!edge) {
                if (wallLabel === 'leftVaultWall') edge = 'left';
                else if (wallLabel === 'rightVaultWall') edge = 'right';
                else if (wallLabel === 'roofVaultWall') edge = 'top';
              }
              
              // Emit a paddle-wall collision event
              const eventManager = (this.scene as any).getEventManager?.();
              if (eventManager) {
                eventManager.emit('paddleWallCollision', { 
                  paddle, 
                  wall,
                  edge
                });
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error setting up wall collisions:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to set up wall collisions', error instanceof Error ? error.stack : undefined);
      }
    }
  }

  /**
   * Get all vault walls
   */
  public getVaultWalls(): Phaser.Physics.Matter.Image[] {
    return this.vaultWalls;
  }
}