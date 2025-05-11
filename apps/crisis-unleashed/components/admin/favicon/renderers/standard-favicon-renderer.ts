import { FaviconRenderer, FaviconRendererProps } from "./favicon-renderer";

export const StandardFaviconRenderer: FaviconRenderer = {
  render: ({ ctx, size, innerSize, padding, backgroundColor, factionColor, selectedFaction }: FaviconRendererProps) => {
    ctx.fillStyle = factionColor;

    if (selectedFaction === "cybernetic-nexus") {
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
    } else if (selectedFaction === "void-harbingers") {
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
  const idx = (i * 2) % 5;           // skip one vertex each time
  const { x, y } = points[idx];
  i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
}
ctx.closePath();
ctx.fill();
    } else if (selectedFaction === "primordial-ascendancy") {
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
    } else if (selectedFaction === "eclipsed-order") {
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
    } else if (selectedFaction === "titanborn") {
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
    } else if (selectedFaction === "celestial-dominion") {
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
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
};