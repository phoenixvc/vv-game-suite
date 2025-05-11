import { FaviconRendererProps } from "../favicon-renderer";

export function renderTitanborn({ ctx, size, innerSize }: FaviconRendererProps) {
  // Draw a mountain-like shape
  const centerX = size / 2;
  const centerY = size / 2;
  const baseY = centerY + innerSize / 2;

  ctx.beginPath();
  ctx.moveTo(centerX - innerSize / 2, baseY);
  ctx.lineTo(centerX - innerSize / 6, centerY - innerSize / 3);
  ctx.lineTo(centerX + innerSize / 6, centerY - innerSize / 2);
  ctx.lineTo(centerX + innerSize / 2, baseY);
  ctx.closePath();
  ctx.fill();
}