import { drawStar } from "../favicon-utils";
import { FaviconRenderer, FaviconRendererProps } from "./favicon-renderer";

export const IconFaviconRenderer: FaviconRenderer = {
  render: ({ ctx, size, innerSize, padding, backgroundColor, factionColor, selectedFaction }: FaviconRendererProps) => {
    ctx.fillStyle = factionColor;
    
    if (selectedFaction === "cybernetic-nexus") {
      // Circuit pattern
      const lineWidth = Math.max(1, size / 32);
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(padding + innerSize * 0.2, padding + innerSize * 0.2);
      ctx.lineTo(padding + innerSize * 0.8, padding + innerSize * 0.2);
      ctx.lineTo(padding + innerSize * 0.8, padding + innerSize * 0.8);
      ctx.lineTo(padding + innerSize * 0.2, padding + innerSize * 0.8);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(size / 2, size / 2, innerSize / 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedFaction === "void-harbingers") {
      // Eye symbol
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, innerSize / 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = backgroundColor;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, innerSize / 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedFaction === "primordial-ascendancy") {
      // Tree symbol
      ctx.fillRect(size / 2 - innerSize / 10, size / 2, innerSize / 5, innerSize / 2);

      ctx.beginPath();
      ctx.arc(size / 2 - innerSize / 6, size / 2 - innerSize / 6, innerSize / 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedFaction === "eclipsed-order") {
      // Sun and moon
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, innerSize / 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = backgroundColor;
      ctx.beginPath();
      ctx.arc(size / 2 + innerSize / 6, size / 2, innerSize / 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedFaction === "titanborn") {
      // Hammer symbol
      ctx.fillRect(size / 2 - innerSize / 10, size / 2 - innerSize / 3, innerSize / 5, innerSize / 2);

      ctx.beginPath();
      ctx.moveTo(size / 2 - innerSize / 3, size / 2 - innerSize / 3);
      ctx.lineTo(size / 2 + innerSize / 3, size / 2 - innerSize / 3);
      ctx.lineTo(size / 2 + innerSize / 3, size / 2 - innerSize / 6);
      ctx.lineTo(size / 2 - innerSize / 3, size / 2 - innerSize / 6);
      ctx.closePath();
      ctx.fill();
    } else if (selectedFaction === "celestial-dominion") {
      // Star
      drawStar(ctx, size / 2, size / 2, 5, innerSize / 3, innerSize / 6);
    }
  }
};