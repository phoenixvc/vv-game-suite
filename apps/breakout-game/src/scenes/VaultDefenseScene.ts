import * as Phaser from 'phaser';

// Define a custom interface for the collision event data
interface MatterCollisionEvent {
  pairs: {
    bodyA: {
      label: string;
    };
    bodyB: {
      label: string;
    };
  }[];
}

// Add a custom interface to extend Phaser.Scene with gameContext
interface SceneWithGameContext extends Phaser.Scene {
  gameContext?: {
    gameState: {
      vaultHP: number;
    };
    defendVault: () => void;
  };
}

class VaultDefenseScene extends Phaser.Scene {
  private vaultHealthBar!: Phaser.GameObjects.Rectangle;
  // Add the gameContext property to the class
  public gameContext?: {
    gameState: {
      vaultHP: number;
    };
    defendVault: () => void;
  };

  constructor() {
    super({ key: 'VaultDefenseScene' });
  }

  preload() {
    // Load assets if any
  }

  create() {
    this.updateVaultHealth();

    // Use the custom interface for the collision event
    this.matter.world.on('collisionstart', (event: MatterCollisionEvent) => {
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
    // Check if gameContext exists before accessing it
    if (this.gameContext && this.gameContext.gameState) {
      this.vaultHealthBar = this.add.rectangle(
        400, 50,
        this.gameContext.gameState.vaultHP * 4, 30,
        0x00ff00
      );
    } else {
      // Default value if gameContext is not available
      this.vaultHealthBar = this.add.rectangle(
        400, 50,
        100, 30,
        0xffff00
      );
    }
  }

  /**
   * Defends the vault by calling the defendVault method in the game context.
   */
  defendVault() {
    // Check if gameContext exists before calling methods on it
    if (this.gameContext && this.gameContext.defendVault) {
      this.gameContext.defendVault();
    }
  }
}

export default VaultDefenseScene;