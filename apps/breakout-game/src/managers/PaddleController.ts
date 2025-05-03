import BreakoutScene from '../scenes/BreakoutScene';

export class PaddleController {
  private scene: BreakoutScene;
  private paddle: Phaser.Physics.Arcade.Sprite;
  private edge: 'top' | 'bottom' | 'left' | 'right';
  
  constructor(scene: BreakoutScene, edge: 'top' | 'bottom' | 'left' | 'right') {
    this.scene = scene;
    this.edge = edge;
    this.paddle = this.createPaddle(edge);
  }
  
  public getPaddle(): Phaser.Physics.Arcade.Sprite {
    return this.paddle;
  }
  
  public controlPaddle(): void {
    const cursors = this.scene.input.keyboard?.createCursorKeys();
    switch (this.edge) {
      case 'top':
      case 'bottom':
        if (cursors?.left.isDown) {
          this.paddle.setVelocityX(-300);
        } else if (cursors?.right.isDown) {
          this.paddle.setVelocityX(300);
        } else {
          this.paddle.setVelocityX(0);
        }
        this.paddle.y = (this.edge === 'bottom') ? 
          this.scene.scale.height - this.paddle.height / 2 : 
          this.paddle.height / 2;
        break;
      case 'left':
      case 'right':
        if (cursors?.up.isDown) {
          this.paddle.setVelocityY(-300);
        } else if (cursors?.down.isDown) {
          this.paddle.setVelocityY(300);
        } else {
          this.paddle.setVelocityY(0);
        }
        this.paddle.x = (this.edge === 'left') ? 
          this.paddle.width / 2 : 
          this.scene.scale.width - this.paddle.width / 2;
        break;
    }
  }
  
  private createPaddle(edge: 'top' | 'bottom' | 'left' | 'right'): Phaser.Physics.Arcade.Sprite {
    let paddle: Phaser.Physics.Arcade.Sprite;
    switch (edge) {
      case 'top':
        paddle = this.scene.physics.add.sprite(400, 50, 'paddle')
          .setImmovable(true)
          .setCollideWorldBounds(true);
        break;
      case 'bottom':
        paddle = this.scene.physics.add.sprite(400, 550, 'paddle')
          .setImmovable(true)
          .setCollideWorldBounds(true);
        break;
      case 'left':
        paddle = this.scene.physics.add.sprite(50, 300, 'paddle-vertical')
          .setImmovable(true)
          .setCollideWorldBounds(true);
        break;
      case 'right':
        paddle = this.scene.physics.add.sprite(750, 300, 'paddle-vertical')
          .setImmovable(true)
          .setCollideWorldBounds(true);
        break;
    }
    return paddle;
  }
}