import { FaviconRenderer, FaviconRendererProps } from "./favicon-renderer";
import {
  renderCyberneticNexus,
  renderVoidHarbingers,
  renderPrimordialAscendancy,
  renderEclipsedOrder,
  renderTitanborn,
  renderCelestialDominion
} from "./factions";

export const StandardFaviconRenderer: FaviconRenderer = {
  render: (props: FaviconRendererProps) => {
    const { ctx, factionColor, selectedFaction } = props;
    
    // Set the fill style for all faction renderers
    ctx.fillStyle = factionColor;

    // Call the appropriate faction renderer based on the selected faction
    switch (selectedFaction) {
      case "cybernetic-nexus":
        renderCyberneticNexus(props);
        break;
      case "void-harbingers":
        renderVoidHarbingers(props);
        break;
      case "primordial-ascendancy":
        renderPrimordialAscendancy(props);
        break;
      case "eclipsed-order":
        renderEclipsedOrder(props);
        break;
      case "titanborn":
        renderTitanborn(props);
        break;
      case "celestial-dominion":
        renderCelestialDominion(props);
        break;
      default:
        // Default fallback - draw a simple circle
        const { size, innerSize } = props;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, innerSize / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }
};