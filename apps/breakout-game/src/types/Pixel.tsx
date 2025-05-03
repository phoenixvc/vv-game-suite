export interface Pixel {
  x: number;
  y: number;
  color: string;
  size: number;
  velocity?: {
    x: number;
    y: number;
  };
  opacity?: number;
  lifetime?: number;
}

export default Pixel;