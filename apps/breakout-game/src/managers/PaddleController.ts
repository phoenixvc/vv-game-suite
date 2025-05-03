import * as Phaser from 'phaser';
class PaddleController {
  private scene: Phaser.Scene;
  private paddle: Phaser.Physics.Matter.Sprite | null = null;
  private edge: 'top' | 'bottom' | 'left' | 'right';
  private speed: number;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  
  constructor(scene: Phaser.Scene, edge: 'top' | 'bottom' | 'left' | 'right', speed: number = 10) {
    this.scene = scene;
    this.edge = edge;
    this.speed = speed;
    
    // Setup keyboard controls
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }
  
  setPaddle(paddle: Phaser.Physics.Matter.Sprite): void {
    this.paddle = paddle;
  }
  
  update(): void {
    if (!this.paddle) return;
    
    // Get Matter.js body
    const body = this.paddle.body as MatterJS.BodyType;
    if (!body) return;
    
    let moveX = 0;
    let moveY = 0;
    
    // Handle movement based on edge
    switch (this.edge) {
      case 'bottom':
        if (this.cursors.left.isDown || this.keyA.isDown) {
          moveX = -this.speed;
        } else if (this.cursors.right.isDown || this.keyD.isDown) {
          moveX = this.speed;
    }
        break;
      case 'top':
        if (this.cursors.left.isDown || this.keyA.isDown) {
          moveX = -this.speed;
        } else if (this.cursors.right.isDown || this.keyD.isDown) {
          moveX = this.speed;
  }
        break;
      case 'left':
        if (this.cursors.up.isDown || this.keyW.isDown) {
          moveY = -this.speed;
        } else if (this.cursors.down.isDown || this.keyS.isDown) {
          moveY = this.speed;
        }
        break;
      case 'right':
        if (this.cursors.up.isDown || this.keyW.isDown) {
          moveY = -this.speed;
        } else if (this.cursors.down.isDown || this.keyS.isDown) {
          moveY = this.speed;
        }
        break;
    }
  
    // Apply movement
    if (moveX !== 0 || moveY !== 0) {
      // Calculate new position
      const newX = this.paddle.x + moveX;
      const newY = this.paddle.y + moveY;
      
      // Check bounds
      const halfWidth = this.paddle.displayWidth / 2;
      const halfHeight = this.paddle.displayHeight / 2;
      const boundedX = Phaser.Math.Clamp(
        newX, 
        halfWidth, 
        this.scene.scale.width - halfWidth
      );
      const boundedY = Phaser.Math.Clamp(
        newY, 
        halfHeight, 
        this.scene.scale.height - halfHeight
      );
      
      // Set position
      this.scene.matter.body.setPosition(body, {
        x: boundedX,
        y: boundedY
      });
    }
  }
}

export default PaddleController;
