import { FaviconRendererProps } from "../favicon-renderer";

/**
 * Renders a filled pentagram (five-pointed star) centered on a canvas.
 *
 * @param ctx - The canvas rendering context to draw on.
 * @param size - The total size of the canvas area.
 * @param innerSize - The diameter of the circle in which the pentagram is inscribed.
 */
export function renderVoidHarbingers({ ctx, size, innerSize }: FaviconRendererProps) {
  // Draw a pentagram
  const radius = innerSize / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  const points: Array<{x: number; y: number}> = [];
  for (let i = 0; i < 5; i++) {
    points.push({
      x: centerX + radius * Math.cos(Math.PI / 2 + (i * 2 * Math.PI) / 5),
      y: centerY - radius * Math.sin(Math.PI / 2 + (i * 2 * Math.PI) / 5),
    });
  }

  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const idx = (i * 2) % 5;  // skip one vertex each time
    const { x, y } = points[idx];
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}