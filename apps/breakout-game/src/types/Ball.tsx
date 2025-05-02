export interface Ball {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  powerUpEffects: {
    speedMultiplier?: number;
    sizeMultiplier?: number;
    specialEffect?: string;
  };
}
