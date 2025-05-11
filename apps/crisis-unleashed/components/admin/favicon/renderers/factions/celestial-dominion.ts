import { FaviconRendererProps } from "../favicon-renderer";

/**
 * Renders an 8-pointed star centered on a canvas, representing the Celestial Dominion faction.
 *
 * @param ctx - The canvas rendering context where the star will be drawn.
 * @param size - The total size of the canvas.
 * @param innerSize - The diameter used to determine the star's outer radius.
 *
 * @remarks
 * The star is constructed by alternating between outer and inner radii to create sharp points, and is filled after the path is closed.
 */
export function renderCelestialDominion({ ctx, size, innerSize }: FaviconRendererProps) {
  // Draw a star
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = innerSize / 2;
  const innerRadius = outerRadius * 0.4;
  const spikes = 8;

  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI * i) / spikes;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();
}