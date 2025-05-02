import Phaser from 'phaser';

class VaultDefenseScene extends Phaser.Scene {
  private vaultHealthBar!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: 'VaultDefenseScene' });
  }

  preload() {
    // Load assets if any
  }

  create() {
    this.updateVaultHealth();

    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach(pair => {
        if (pair.bodyB.label === 'vault_gate') {
          this.defendVault();
        }
      });
    });
  }

  /**
   * Updates the vault health bar based on the current vault HP in the game state.
   */
  updateVaultHealth() {
    this.vaultHealthBar = this.add.rectangle(
      400, 50,
      this.gameContext.gameState.vaultHP * 4, 30,
      0x00ff00
    );
  }

  /**
   * Defends the vault by calling the defendVault method in the game context.
   */
  defendVault() {
    this.gameContext.defendVault();
  }
}

export default VaultDefenseScene;
