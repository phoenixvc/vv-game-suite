import { FaviconRendererProps } from "../favicon-renderer";

/**
 * Renders a crescent moon shape onto a canvas, suitable for use as a favicon.
 *
 * Draws a filled circle at the center of the canvas, then subtracts a second, offset circle to create a crescent effect.
 *
 * @param ctx - The 2D rendering context for the target canvas.
 * @param size - The total size of the canvas area.
 * @param innerSize - The diameter of the main circle used to form the crescent.
 */
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