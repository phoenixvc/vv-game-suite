import { drawStar } from "../favicon-utils";
import { FaviconRenderer, FaviconRendererProps } from "./favicon-renderer";
import type { FactionId } from "@/components/logo-system/utils";

export const IconFaviconRenderer: FaviconRenderer = {
  render: ({ ctx, size, innerSize, padding, backgroundColor, factionColor, selectedFaction }: FaviconRendererProps) => {
    // Save the current canvas state to isolate renderer side-effects
    ctx.save();
    
    // Set the default fill style for the icon
    ctx.fillStyle = factionColor;
    
    switch (selectedFaction as FactionId) {
      case "cybernetic-nexus": {
        // Circuit pattern
        const lineWidth = Math.max(1, size / 32);
        ctx.strokeStyle = factionColor;
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
        break;
      }
      
      case "void-harbingers": {
        // Eye symbol - outer circle
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, innerSize / 3, 0, Math.PI * 2);
        ctx.fill();

        // Inner pupil
        ctx.fillStyle = backgroundColor;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, innerSize / 6, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      
      case "primordial-ascendancy": {
        // Tree symbol - trunk
        ctx.fillRect(size / 2 - innerSize / 10, size / 2, innerSize / 5, innerSize / 2);

        // Foliage
        ctx.beginPath();
        ctx.arc(size / 2 - innerSize / 6, size / 2 - innerSize / 6, innerSize / 3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      
      case "eclipsed-order": {
        // Sun and moon - sun
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, innerSize / 3, 0, Math.PI * 2);
        ctx.fill();

        // Moon overlay
        ctx.fillStyle = backgroundColor;
        ctx.beginPath();
        ctx.arc(size / 2 + innerSize / 6, size / 2, innerSize / 3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      
      case "titanborn": {
        // Hammer symbol - handle
        ctx.fillRect(size / 2 - innerSize / 10, size / 2 - innerSize / 3, innerSize / 5, innerSize / 2);

        // Hammer head
        ctx.beginPath();
        ctx.moveTo(size / 2 - innerSize / 3, size / 2 - innerSize / 3);
        ctx.lineTo(size / 2 + innerSize / 3, size / 2 - innerSize / 3);
        ctx.lineTo(size / 2 + innerSize / 3, size / 2 - innerSize / 6);
        ctx.lineTo(size / 2 - innerSize / 3, size / 2 - innerSize / 6);
        ctx.closePath();
        ctx.fill();
        break;
      }
      
      case "celestial-dominion": {
        // Star
        drawStar(ctx, size / 2, size / 2, 5, innerSize / 3, innerSize / 6);
        break;
      }
      
      default: {
        // Fallback icon - simple circle
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, innerSize / 3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }
    
    // Restore the canvas state to prevent style leakage
    ctx.restore();
  }
};