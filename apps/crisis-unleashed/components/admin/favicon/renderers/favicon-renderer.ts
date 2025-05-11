export interface FaviconRendererProps {
  ctx: CanvasRenderingContext2D;
  size: number;
  innerSize: number;
  padding: number;
  backgroundColor: string;
  factionColor: string;
  selectedFaction: string;
}

export interface FaviconRenderer {
  render: (props: FaviconRendererProps) => void;
}