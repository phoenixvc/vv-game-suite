export interface PointLossIndicator {
  x: number;
  y: number;
  value: number;
  opacity: number;
  velocity: {
    x: number;
    y: number;
  };
  lifetime: number;
}

export default PointLossIndicator;