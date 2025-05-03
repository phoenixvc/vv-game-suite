import { Ball } from '../objects/Ball';

class BreakoutScene extends Phaser.Scene {
	private paddle!: Phaser.Physics.Arcade.Sprite;
	private ball!: Ball;
	private bricks!: Phaser.Physics.Arcade.StaticGroup;
	private score: number = 0;
	private lives: number = 3;
	private marketSim!: MarketSim;
	private scoreText!: Phaser.GameObjects.Text;
	private livesText!: Phaser.GameObjects.Text;
	private edge: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
	private angleFactor: number = 5; // Default value, will be updated from context
	private powerUps!: Phaser.Physics.Arcade.Group; // Group to hold power-ups
  
	constructor(angleFactor: number) {
	  super({ key: 'Breakout', active: true });
	  this.angleFactor = angleFactor;
	}
  
	preload() {
	  this.load.setBaseURL('/assets/games/breakout/');
	  this.load.image('ball', 'ball.png');
	  this.load.image('paddle', 'paddle.png');
	  this.load.image('paddle-vertical', 'paddle-vertical.png');
	  this.load.image('brick', 'brick.png');
	  this.load.image('powerup_extraLife', 'powerup_extraLife.png');
	  this.load.image('powerup_paddleGrow', 'powerup_paddleGrow.png');
	  // Load other power-up images here
	}
  
	create() {
	  // Initialize physics
	  this.physics.world.setBoundsCollision(true, true, true, true);
	  
	  // Create bricks using simulated market data
	  this.marketSim = new MarketSim();
	  this.createBricks(this.marketSim.getInitialSignals());
	  
	  // Set up game objects
	  this.ball = new Ball(this, 400, 500, 'ball');
	  
	  this.paddle = this.createPaddle(this.edge);
	  
	  // Collision setup
	  this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
	  this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
	  
	  // Input handling
	  this.input.keyboard?.createCursorKeys();
	  
	  // Performance monitoring
	  this.game.events.on('poststep', () => {
		PerformanceMonitor.trackFPS(this.game.loop.actualFps);
	  });
	  // Score display
	this.scoreText = this.add.text(20, 20, 'Score: 0', { 
		fontSize: '24px',
		color: '#FFFFFF',
		fontFamily: 'Arial'
	}).setScrollFactor(0);
	
	// Lives display
	this.livesText = this.add.text(this.scale.width - 160, 20, 'Lives: 3', {
		fontSize: '24px',
		color: '#FFFFFF',
		fontFamily: 'Arial' 
	}).setScrollFactor(0);

	// Create power-ups group
	this.powerUps = this.physics.add.group({
		classType: Phaser.Physics.Arcade.Image,
		runChildUpdate: true
	  });
  
	}
  
	update() {
	  // Paddle movement
	  this.controlPaddle(this.edge);
	  
	  // Ball reset logic
	  if (this.ball.y > this.scale.height) {
		this.lives--;
		this.livesText.setText(`Lives: ${this.lives}`);
		
		if(this.lives <= 0) {
		  this.gameOver();
		} else {
		  this.resetBall();
		}
	  }

	  // Check for power-up collection
	  this.physics.overlap(this.paddle, this.powerUps, this.collectPowerUp, null, this);
	}
	
	 ballLeaveScreen() {
		this.lives--;
		if (this.lives) {
		  this.livesText.setText('Lives: ' + this.lives);
		  lifeLostText.setVisible(true);
	  
		  // Reset ball and paddle position
		  this.ball.setPosition(game.config.width / 2, game.config.height - 25);
		  this.paddle.setPosition(game.config.width / 2, game.config.height - 5);
	  
		  // Wait for player input to resume
		  this.input.once('pointerdown', () => {
			lifeLostText.setVisible(false);
			this.ball.setVelocity(150, -150);
		  });
		} else {
		  alert("You lost, game over!");
		  location.reload();
		}
	  }
	  
	private createBricks(signals: MarketSignal[]) {
	  this.bricks = this.physics.add.staticGroup({
		key: 'brick',
		frameQuantity: 10,
		gridAlign: {
		  width: 10,
		  height: 6,
		  cellWidth: 64,
		  cellHeight: 32,
		  x: 112,
		  y: 100
		}
	  });
	  
	  signals.forEach(signal => {
		this.bricks.children.entries[signal.position].setData('signal', signal);
	  });
	}
  
	private hitBrick(ball: Phaser.GameObjects.GameObject, brick: Phaser.GameObjects.GameObject) {
		this.score += 100; // Base points per brick
		this.scoreText.setText(`Score: ${this.score}`);
		
		this.add.particles(brick.body?.position.x, brick.body?.position.y, 'star', {
			speed: 100,
			scale: { start: 1, end: 0 },
			lifespan: 500
		  });
		  
		  this.cameras.main.shake(50, 0.01);

		// Optional: Different points per brick type
		const brickType = brick.getData('type');
		if(brickType === 'special') this.score += 200;
		
		brick.destroy();

		// Randomly spawn power-ups
		if (Phaser.Math.Between(0, 100) < 20) { // 20% chance
			this.createPowerUp(brick.x, brick.y);
		  }
	  }
	  
  
	private hitPaddle(ball: Phaser.GameObjects.GameObject, paddle: Phaser.GameObjects.GameObject) {
		if (this.edge === 'bottom' || this.edge === 'top') {
			const diff = ball.x - paddle.x;
			ball.body.velocity.x = diff * this.angleFactor;
			ball.body.velocity.y *= -1;
			if (this.edge === 'top') ball.body.velocity.y = Math.abs(ball.body.velocity.y);
			else ball.body.velocity.y = -Math.abs(ball.body.velocity.y);
		  } else {
			const diff = ball.y - paddle.y;
			ball.body.velocity.y = diff * this.angleFactor;
			ball.body.velocity.x *= -1;
			if (this.edge === 'left') ball.body.velocity.x = Math.abs(ball.body.velocity.x);
			else ball.body.velocity.x = -Math.abs(ball.body.velocity.x);
		  }
	}
  
	private resetBall() {
	  this.ball.resetToPaddle(this.paddle);
	}

	private resetBallAndPaddles() {
		this.ball.setVelocity(0, 0);
		this.paddle.setPosition(game.config.width / 2, game.config.height - 50);
		this.ball.setPosition(game.config.width / 2, game.config.height - 70);
	  
		// Wait for input to launch
		this.input.once('pointerdown', () => {
		  this.ball.setVelocity(150, -150);
		});
	  }
	  
	private gameOver() {
		this.scene.pause();
		this.add.text(this.scale.width/2, this.scale.height/2, 'GAME OVER', {
		  fontSize: '48px',
		  color: '#FF0000'
		}).setOrigin(0.5);
	  }

	private createPaddle(edge: 'top' | 'bottom' | 'left' | 'right'): Phaser.Physics.Arcade.Sprite {
		let paddle: Phaser.Physics.Arcade.Sprite;
		switch (edge) {
		  case 'top':
			paddle = this.physics.add.sprite(400, 50, 'paddle')
			  .setImmovable(true)
			  .setCollideWorldBounds(true);
			break;
		  case 'bottom':
			paddle = this.physics.add.sprite(400, 550, 'paddle')
			  .setImmovable(true)
			  .setCollideWorldBounds(true);
			break;
		  case 'left':
			paddle = this.physics.add.sprite(50, 300, 'paddle-vertical')
			  .setImmovable(true)
			  .setCollideWorldBounds(true);
			break;
		  case 'right':
			paddle = this.physics.add.sprite(750, 300, 'paddle-vertical')
			  .setImmovable(true)
			  .setCollideWorldBounds(true);
			break;
		}
		return paddle;
	  }
	  
	  private controlPaddle(edge: 'top' | 'bottom' | 'left' | 'right') {
		const cursors = this.input.keyboard?.createCursorKeys();
		switch (edge) {
		  case 'top':
		  case 'bottom':
			if (cursors?.left.isDown) {
			  this.paddle.setVelocityX(-300);
			} else if (cursors?.right.isDown) {
			  this.paddle.setVelocityX(300);
			} else {
			  this.paddle.setVelocityX(0);
			}
			this.paddle.y = (edge === 'bottom') ? this.scale.height - this.paddle.height / 2 : this.paddle.height / 2;
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
			this.paddle.x = (edge === 'left') ? this.paddle.width / 2 : this.scale.width - this.paddle.width / 2;
			break;
		}
	  }

	private createPowerUp(x: number, y: number) {
		const powerUpTypes = ['extraLife', 'paddleGrow']; // Add other power-up types here
		const type = powerUpTypes[Phaser.Math.Between(0, powerUpTypes.length - 1)];
		const powerUp = this.physics.add.image(x, y, `powerup_${type}`);
		powerUp.setVelocityY(150);
		this.powerUps.add(powerUp);
	  }
	  
	  private collectPowerUp(paddle: Phaser.Physics.Arcade.Sprite, powerUp: Phaser.Physics.Arcade.Image) {
		const { collectPowerUp } = useGameContext();
		const type = powerUp.texture.key.replace('powerup_', '');
		collectPowerUp({ type, duration: 10000 }); // Example duration
		powerUp.destroy();
	  }
  }
  
  // Simulated market data class
  class MarketSim {
	getInitialSignals(): MarketSignal[] {
	  // Stub for real data integration
	  return Array(60).fill(null).map((_,i) => ({
		position: i,
		value: Phaser.Math.Between(50, 200),
		type: ['liquidity', 'price', 'volume'][i%3]
	  }));
	}
  }
  
export default BreakoutScene;
