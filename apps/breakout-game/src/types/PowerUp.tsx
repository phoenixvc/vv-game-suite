export interface PowerUp {
  type: string;
  duration: number;
  effect: (ball: Ball) => void;
}
