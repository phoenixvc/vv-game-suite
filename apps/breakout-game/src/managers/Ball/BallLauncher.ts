import * as Phaser from 'phaser';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import BallPositioner from './BallPositioner';

/**
 * Handles ball launching mechanics
 */
class BallLauncher {
  private scene: BreakoutScene;
  private ballPositioner: BallPositioner;
  private initialBallSpeed: number = 5;
  
  constructor(scene: BreakoutScene, ballPositioner: BallPositioner) {
    this.scene = scene;
    this.ballPositioner = ballPositioner;
  }
  
  /**
   * Launch a ball with the appropriate velocity
   */
  public launchBall(
    ball: Phaser.Physics.Matter.Sprite, 
    paddle?: Phaser.Physics.Matter.Sprite
  ): void {
    if (!ball || !ball.body) {
      console.error('Cannot launch ball: invalid ball object');
      return;
    }
    
    // Calculate launch angle based on paddle position
    const angle = this.ballPositioner.calculateLaunchAngle(paddle);
    
    // Calculate velocity components
    const speed = this.initialBallSpeed;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    
    console.log(`Setting ball velocity to: ${vx}, ${vy}`);
    
    // Set ball velocity
    if (ball.body && typeof ball.setVelocity === 'function') {
      ball.setVelocity(vx, vy);
    } else if (ball.body) {
      // Direct Matter.js velocity setting - use any to bypass type checking
      this.scene.matter.body.setVelocity(ball.body as any, { x: vx, y: vy });
    }
    
    // Emit event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('ballLaunched', { ball, velocity: { x: vx, y: vy } });
    }
    
    console.log('Ball launch complete, velocity:', ball.body ? ball.body.velocity : 'unknown');
  }
  
  /**
   * Set the initial ball speed
   */
  public setInitialBallSpeed(speed: number): void {
    this.initialBallSpeed = speed;
  }
  
  /**
   * Get the initial ball speed
   */
  public getInitialBallSpeed(): number {
    return this.initialBallSpeed;
  }
}

export default BallLauncher;