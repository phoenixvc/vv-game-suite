import { FaviconRendererProps } from "../favicon-renderer";

/**
 * Renders the Cybernetic Nexus faction favicon onto a canvas.
 *
 * Draws a filled central circle with two intersecting lines to create a technological emblem. The stroke color is chosen for contrast based on the background color, and line width scales with the overall size.
 *
 * @param ctx - Canvas 2D rendering context.
 * @param size - Overall size of the canvas.
 * @param innerSize - Diameter of the central circle and lines.
 * @param backgroundColor - Background color used to determine stroke contrast.
 */
export function renderCyberneticNexus({ ctx, size, innerSize, backgroundColor }: FaviconRendererProps) {
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, innerSize / 2, 0, Math.PI * 2);
  ctx.fill();

  // Add some details to make it look technological
  ctx.strokeStyle = backgroundColor === "#ffffff" ? "#000000" : "#ffffff";
  ctx.lineWidth = Math.max(1, size / 16);
  ctx.beginPath();
  ctx.moveTo(size / 2 - innerSize / 4, size / 2);
  ctx.lineTo(size / 2 + innerSize / 4, size / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(size / 2, size / 2 - innerSize / 4);
  ctx.lineTo(size / 2, size / 2 + innerSize / 4);
  ctx.stroke();
}