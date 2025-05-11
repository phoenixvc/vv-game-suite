"use client"

// Utility functions for the favicon generator

/**
 * Gets the color for a faction
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
 * Draws a star shape on a canvas context
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