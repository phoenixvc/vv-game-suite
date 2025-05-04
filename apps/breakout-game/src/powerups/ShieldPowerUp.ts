import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { PowerUpType } from '../types/PowerUp';
import { PowerUpHandler } from './PowerUpHandler';

export class ShieldPowerUp implements PowerUpHandler {
  type = PowerUpType.SHIELD;
  private shield: boolean = false;
  private shieldTimer: Phaser.Time.TimerEvent | null = null;
  private shieldIndicator: Phaser.GameObjects.Text | null = null;
  private ballShieldEffect: Phaser.GameObjects.Arc | null = null;
  private shieldUpdateListener: Function | null = null;

  apply(scene: BreakoutScene, paddle: Phaser.Physics.Arcade.Sprite, duration: number): void {
    this.shield = true;
    
    // Create shield indicator if it doesn't exist
    if (!this.shieldIndicator) {
      this.shieldIndicator = scene.add.text(scene.scale.width - 160, 50, 'Shield: Active', {
        fontSize: '24px',
        color: '#61AEEE',
        fontFamily: 'Arial'
      }).setScrollFactor(0);
    }
    
    this.shieldIndicator.setVisible(true);
    
    // Create a visual effect around the ball to indicate shield is active
    const ball = scene['ball'];
    this.ballShieldEffect = scene.add.circle(
      ball.x,
      ball.y,
      ball.width * 0.75,
      0x61AEEE,
      0.5
    );
    
    // Make the shield effect follow the ball
    // Store the listener function so we can remove it later
    this.shieldUpdateListener = () => {
      if (this.shield && this.ballShieldEffect) {
        const ball = scene['ball'];
        this.ballShieldEffect.setPosition(ball.x, ball.y);
      }
    };
    
    scene.events.on('update', this.shieldUpdateListener);
    
    // Set a timer for the shield duration
    if (this.shieldTimer) {
      this.shieldTimer.remove();
    }
    
    this.shieldTimer = scene.time.delayedCall(duration, () => {
      this.remove(scene);
    });
    
    // Add a visual feedback
    scene.cameras.main.flash(500, 0, 100, 255); // Flash blue
  }
  
  remove(scene: BreakoutScene): void {
    this.shield = false;
    
    if (this.shieldIndicator) {
      this.shieldIndicator.setVisible(false);
    }
    
    if (this.ballShieldEffect) {
      this.ballShieldEffect.destroy();
      this.ballShieldEffect = null;
    }
    
    // Remove the update listener to prevent memory leaks
    if (this.shieldUpdateListener) {
      scene.events.off('update', this.shieldUpdateListener);
      this.shieldUpdateListener = null;
    }
    
    if (this.shieldTimer) {
      this.shieldTimer.remove();
      this.shieldTimer = null;
    }
  }
  
  isActive(): boolean {
    return this.shield;
  }
}