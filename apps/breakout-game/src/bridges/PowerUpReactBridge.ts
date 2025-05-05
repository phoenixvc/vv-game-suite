// File: PowerUpReactBridge.ts

import { PowerUp } from "@/objects/PowerUp";
import { PowerUpType } from "@/types/PowerUpType";


interface UsePowerUpActionsAPI {
  applyPowerUpReactEffect?: (type: PowerUpType) => void;
  removePowerUpReactEffect?: (type: PowerUpType) => void;
}

export class PowerUpReactBridge {
  static useActions?: UsePowerUpActionsAPI;

  static register(actions: UsePowerUpActionsAPI) {
    PowerUpReactBridge.useActions = actions;
  }

  static applyToReact(powerUp: PowerUp) {
    if (!PowerUpReactBridge.useActions) return;
    const type = powerUp.getType();
    PowerUpReactBridge.useActions.applyPowerUpReactEffect?.(type as PowerUpType);
  }

  static removeFromReact(powerUp: PowerUp) {
    if (!PowerUpReactBridge.useActions) return;
    const type = powerUp.getType();
    PowerUpReactBridge.useActions.removePowerUpReactEffect?.(type as PowerUpType);
  }
}
