import 'phaser';
import BreakoutScene from '../scenes/BreakoutScene';
import SignalHuntScene from '../scenes/SignalHuntScene';
import VaultDefenseScene from '../scenes/VaultDefenseScene';

// Create a simple placeholder for StrategyScene until it's implemented
class StrategyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StrategyScene' });
  }
  
  create() {
    this.add.text(400, 300, 'Strategy Scene', {
      fontSize: '32px',
      color: '#fff'
    }).setOrigin(0.5);
  }
}
const config: Phaser.Types.Core.GameConfig = {
    title: "New Game",
    version: '1.0',
    width: 1280,
    height: 720,
    type: Phaser.AUTO,
    parent: 'game', // needs a div as id="game"
    scene: [
      BreakoutScene,
      SignalHuntScene,
      VaultDefenseScene,
      StrategyScene
    ],
    input: {
      keyboard: true
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0, x: 0 }, // Fix: Add x property to gravity
        debug: false
      }
    },
    backgroundColor: '#221e30',
    render: { pixelArt: true, antialias: true }
  };

export default config;
