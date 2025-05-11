import { FaviconRendererProps } from "../favicon-renderer";

export function renderPrimordialAscendancy({ ctx, size, innerSize }: FaviconRendererProps) {
  // Draw a leaf-like pattern
  const centerX = size / 2;
  const centerY = size / 2;

  ctx.beginPath();
  ctx.moveTo(centerX, centerY - innerSize / 2);
  ctx.bezierCurveTo(
    centerX + innerSize / 2,
    centerY - innerSize / 4,
    centerX + innerSize / 2,
    centerY + innerSize / 4,
    centerX,
    centerY + innerSize / 2
  );
  ctx.bezierCurveTo(
    centerX - innerSize / 2,
    centerY + innerSize / 4,
    centerX - innerSize / 2,
    centerY - innerSize / 4,
    centerX,
    centerY - innerSize / 2
  );
  ctx.fill();
}