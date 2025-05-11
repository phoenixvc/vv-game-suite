import { FaviconRendererProps } from "../favicon-renderer";

/**
 * Renders a symmetrical leaf-like shape centered on a canvas.
 *
 * Draws and fills a stylized leaf pattern using Bézier curves, based on the provided size and innerSize.
 *
 * @param ctx - The 2D rendering context of the target canvas.
 * @param size - The total width and height of the canvas area.
 * @param innerSize - The diameter of the leaf shape to be drawn.
 */
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