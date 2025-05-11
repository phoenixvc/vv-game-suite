import { FactionId } from "@/components/logo-system/utils";

export interface FaviconRendererProps {
  ctx: CanvasRenderingContext2D;
  size: number;
  innerSize: number;
  padding: number;
  backgroundColor: string;
  factionColor: string;
  selectedFaction: FactionId;
}

export interface FaviconRenderer {
  render: (props: FaviconRendererProps) => void;
}