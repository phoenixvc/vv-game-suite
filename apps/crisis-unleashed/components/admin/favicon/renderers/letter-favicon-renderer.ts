import { FaviconRenderer, FaviconRendererProps } from "./favicon-renderer";

export const LetterFaviconRenderer: FaviconRenderer = {
  render: ({ ctx, size, innerSize, factionColor, selectedFaction }: FaviconRendererProps) => {
    // Draw first letter of faction name
    ctx.fillStyle = factionColor;
    const letter = selectedFaction.charAt(0).toUpperCase();
    const fontSize = Math.floor(innerSize * 0.8);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letter, size / 2, size / 2);
  }
};