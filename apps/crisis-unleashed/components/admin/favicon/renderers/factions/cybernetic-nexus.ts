import { FaviconRendererProps } from "../favicon-renderer";

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