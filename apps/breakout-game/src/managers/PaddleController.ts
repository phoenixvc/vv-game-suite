import Phaser from 'phaser';
export class PaddleController {
  private scene: Phaser.Scene;
  private edge: 'top' | 'bottom' | 'left' | 'right';
  private paddle: Phaser.Physics.Arcade.Sprite | null = null;
  private speed: number = 300;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasdKeys: any = null;
  
  constructor(scene: Phaser.Scene, edge: 'top' | 'bottom' | 'left' | 'right', speed: number = 300) {
    this.scene = scene;
    this.edge = edge;
    this.speed = speed;
    
    // Initialize input
    this.cursors = this.scene.input.keyboard?.createCursorKeys() || null;
    this.wasdKeys = this.scene.input.keyboard?.addKeys('W,A,S,D') || null;
  }
  
  setPaddle(paddle: Phaser.Physics.Arcade.Sprite): void {
    this.paddle = paddle;
  }
  
  getPaddle(): Phaser.Physics.Arcade.Sprite | null {
    return this.paddle;
  }
  
  update(): void {
    if (!this.paddle) return;
    switch (this.edge) {
      case 'top':
        this.updateTopPaddle();
        break;
      case 'bottom':
        this.updateBottomPaddle();
        break;
      case 'left':
        this.updateLeftPaddle();
        break;
      case 'right':
        this.updateRightPaddle();
        break;
    }
  }
  
  private updateTopPaddle(): void {
    if (!this.paddle || !this.wasdKeys) return;
    
    if (this.wasdKeys.A.isDown) {
      this.paddle.setVelocityX(-this.speed);
    } else if (this.wasdKeys.D.isDown) {
      this.paddle.setVelocityX(this.speed);
    } else {
      this.paddle.setVelocityX(0);
}
    
    // Keep paddle at the top
    this.paddle.y = this.paddle.height / 2;
  }
  
  private updateBottomPaddle(): void {
    if (!this.paddle || !this.cursors) return;
    
    if (this.cursors.left.isDown) {
      this.paddle.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown) {
      this.paddle.setVelocityX(this.speed);
    } else {
      this.paddle.setVelocityX(0);
    }
    
    // Keep paddle at the bottom
    this.paddle.y = this.scene.scale.height - this.paddle.height / 2;
  }
  
  private updateLeftPaddle(): void {
    if (!this.paddle || !this.cursors) return;
    
    if (this.cursors.up.isDown) {
      this.paddle.setVelocityY(-this.speed);
    } else if (this.cursors.down.isDown) {
      this.paddle.setVelocityY(this.speed);
    } else {
      this.paddle.setVelocityY(0);
    }
    
    // Keep paddle at the left
    this.paddle.x = this.paddle.width / 2;
  }
  
  private updateRightPaddle(): void {
    if (!this.paddle || !this.wasdKeys) return;
    
    if (this.wasdKeys.W.isDown) {
      this.paddle.setVelocityY(-this.speed);
    } else if (this.wasdKeys.S.isDown) {
      this.paddle.setVelocityY(this.speed);
    } else {
      this.paddle.setVelocityY(0);
    }
    
    // Keep paddle at the right
    this.paddle.x = this.scene.scale.width - this.paddle.width / 2;
  }
}