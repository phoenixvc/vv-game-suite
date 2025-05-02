import Phaser from 'phaser';

class SignalHuntScene extends Phaser.Scene {
  private gameContext: any;

  constructor() {
    super({ key: 'SignalHuntScene' });
  }

  preload() {
    this.load.image('signal_brick', 'path/to/signal_brick.png');
  }

  create() {
    this.createSignalBricks();
  }

  createSignalBricks() {
    const signals = this.gameContext.marketSim.getSignals();

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
        onDestroy: () => this.gameContext.captureSignal()
      });
    });
  }

  createSignalAttractor(signal: any) {
    return (bodyA: any, bodyB: any) => {
      // Attraction logic based on signal data
    };
  }
}

export default SignalHuntScene;
