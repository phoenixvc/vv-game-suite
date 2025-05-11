"use client"

// Utility functions for the favicon generator

/**
  * Returns a color string based on the faction name and styling options.
  *
  * If {@link mono} is true, returns white if {@link invert} is true, otherwise black. If {@link mono} is false, returns a predefined color for the given {@link faction}, or a default blue if the faction is unrecognized.
  *
  * @param faction - The faction identifier.
  * @param mono - Whether to use monochrome coloring.
  * @param invert - Whether to invert the monochrome color.
  * @returns The hex color string for the specified faction and options.
  */
export function getFactionColor(faction: string, mono: boolean, invert: boolean): string {
   if (mono) return invert ? "#ffffff" : "#000000"

  const factionColors: Record<string, string> = {
    "cybernetic-nexus": "#00a8ff",
    "primordial-ascendancy": "#2ecc71",
    "void-harbingers": "#9b59b6",
    "eclipsed-order": "#34495e",
    "titanborn": "#e67e22",
    "celestial-dominion": "#f1c40f",
  };

  return factionColors[faction] || "#3498db";
 }

/**
 * Draws a filled star shape on the specified canvas context.
 *
 * @param ctx - The 2D rendering context to draw on.
 * @param centerX - The x-coordinate of the star's center.
 * @param centerY - The y-coordinate of the star's center.
 * @param spikes - The number of points (spikes) on the star.
 * @param outerRadius - The radius from the center to the tip of each spike.
 * @param innerRadius - The radius from the center to the inner vertices between spikes.
 *
 * @remark
 * The star is drawn and filled using the current fill style of the context.
 */
export function drawStar(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
) {
  let rot = (Math.PI / 2) * 3
  let x, y;
  const step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(centerX, centerY - outerRadius)
  for (let i = 0; i < spikes; i++) {
    x = centerX + Math.cos(rot) * outerRadius
    y = centerY + Math.sin(rot) * outerRadius
    ctx.lineTo(x, y)
    rot += step

    x = centerX + Math.cos(rot) * innerRadius
    y = centerY + Math.sin(rot) * innerRadius
    ctx.lineTo(x, y)
    rot += step
  }
  ctx.lineTo(centerX, centerY - outerRadius)
  ctx.closePath()
  ctx.fill()
}