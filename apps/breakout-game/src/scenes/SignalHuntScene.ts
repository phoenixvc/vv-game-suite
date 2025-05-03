import * as Phaser from 'phaser';

class SignalHuntScene extends Phaser.Scene {
  private gameContext: any;

  constructor() {
    super({ key: 'SignalHuntScene' });
  }

  preload() {
    this.load.image('signal_brick', 'path/to/signal_brick.svg');
  }

  create() {
    this.createSignalBricks();
  }

  /**
   * Creates signal bricks based on the signals from the game context's market simulation.
   * Each brick is placed at a random position and has an attractor based on the signal data.
   */
  createSignalBricks() {
    const signals = this.gameContext?.marketSim?.getSignals() || [];

    signals.forEach(signal => {
      const x = Phaser.Math.Between(100, 700);
      const y = Phaser.Math.Between(100, 500);

      const brick = this.matter.add.sprite(x, y, 'signal_brick', null, {
        isStatic: true,
        plugin: {
          attractors: [this.createSignalAttractor(signal)]
        }
      });

      brick.setData({
        type: signal.category,
        value: signal.strength,
        onDestroy: () => {
          if (this.gameContext && typeof this.gameContext.captureSignal === 'function') {
            this.gameContext.captureSignal();
          }
        }
      });
    });
  }

  /**
   * Creates an attractor function for a signal.
   * @param signal - The signal data used to create the attractor.
   * @returns A function that defines the attraction logic based on the signal data.
   */
  createSignalAttractor(signal: any) {
    return (bodyA: any, bodyB: any) => {
      // Calculate attraction force based on signal strength
      const strength = signal.strength || 1;
      const maxDistance = 150; // Maximum distance for attraction effect
      const minDistance = 20;  // Minimum distance to prevent extreme forces
      
      // Get the position of both bodies
      const positionA = bodyA.position;
      const positionB = bodyB.position;
      
      // Calculate the distance between the bodies
      const dx = positionA.x - positionB.x;
      const dy = positionA.y - positionB.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only apply force if within range
      if (distance < maxDistance && distance > minDistance) {
        // Normalize the direction vector
        const nx = dx / distance;
        const ny = dy / distance;
        
        // Calculate force magnitude (stronger when closer)
        const forceMagnitude = 0.001 * strength * (1 - distance / maxDistance);
        
        // Return the force vector
        return {
          x: nx * forceMagnitude,
          y: ny * forceMagnitude
        };
      }
      
      // Return zero force if out of range
      return { x: 0, y: 0 };
    };
  }
}

export default SignalHuntScene;