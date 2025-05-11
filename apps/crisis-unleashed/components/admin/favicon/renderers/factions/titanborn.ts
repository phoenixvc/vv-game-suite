import { FaviconRendererProps } from "../favicon-renderer";

/**
 * Draws a stylized mountain-shaped polygon on the provided canvas context.
 *
 * @param ctx - The canvas rendering context to draw on.
 * @param size - The total size of the canvas area.
 * @param innerSize - The size used to determine the mountain's proportions.
 *
 * @remark
 * The shape is filled using the current fill style of the canvas context.
 */
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