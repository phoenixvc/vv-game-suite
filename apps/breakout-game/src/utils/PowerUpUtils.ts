import { PowerUpColors } from "@/types/PowerUpColors";
import { PowerUpDurations } from "@/types/PowerUpDurations";
import { PowerUpProbabilities } from "@/types/PowerUpProbabilities";
import { PowerUpType } from "@/types/PowerUpType";


export class PowerUpUtils {
  static getRandomType(): PowerUpType {
    const totalWeight = Object.values(PowerUpProbabilities).reduce((sum, w) => sum + w, 0);
    const randomValue = Math.random() * totalWeight;
    let cumulative = 0;
    for (const type of Object.values(PowerUpType)) {
      cumulative += PowerUpProbabilities[type];
      if (randomValue <= cumulative) return type;
    }
    return PowerUpType.PADDLE_GROW;
  }

  static getColor(type: PowerUpType): string {
    return PowerUpColors[type] || '#FFFFFF';
  }

  static getDuration(type: PowerUpType): number {
    return PowerUpDurations[type] || 0;
  }

  static isTemporary(type: PowerUpType): boolean {
    return PowerUpDurations[type] > 0;
  }
}