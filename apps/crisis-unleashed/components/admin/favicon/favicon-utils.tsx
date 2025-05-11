"use client"

// Utility functions for the favicon generator

/**
 * Gets the color for a faction
 */
export function getFactionColor(faction: string, mono: boolean, invert: boolean): string {
  if (mono) return invert ? "#ffffff" : "#000000"

  switch (faction) {
    case "cybernetic-nexus":
      return "#00a8ff"
    case "primordial-ascendancy":
      return "#2ecc71"
    case "void-harbingers":
      return "#9b59b6"
    case "eclipsed-order":
      return "#34495e"
    case "titanborn":
      return "#e67e22"
    case "celestial-dominion":
      return "#f1c40f"
    default:
      return "#3498db"
  }
}

/**
 * Draws a star shape on a canvas context
 */
export function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
) {
  let rot = (Math.PI / 2) * 3
  let x = cx
  let y = cy
  const step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius
    y = cy + Math.sin(rot) * outerRadius
    ctx.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    ctx.lineTo(x, y)
    rot += step
  }
  ctx.lineTo(cx, cy - outerRadius)
  ctx.closePath()
  ctx.fill()
}