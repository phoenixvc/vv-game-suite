import { FaviconRendererProps } from "../favicon-renderer";

export function renderEclipsedOrder({ ctx, size, innerSize }: FaviconRendererProps) {
  // Draw a crescent moon
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = innerSize / 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(centerX + radius / 2, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}