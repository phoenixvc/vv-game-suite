export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  player?: number;
  edge?: 'top' | 'bottom' | 'left' | 'right';
}

export default Paddle;