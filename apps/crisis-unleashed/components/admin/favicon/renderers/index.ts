import { StandardFaviconRenderer } from "./standard-favicon-renderer";
import { LetterFaviconRenderer } from "./letter-favicon-renderer";
import { IconFaviconRenderer } from "./icon-favicon-renderer";
import { FaviconRenderer } from "./favicon-renderer";

export type { FaviconRendererProps } from "./favicon-renderer";

export const FaviconRenderers: Record<string, FaviconRenderer> = {
  standard: StandardFaviconRenderer,
  letter: LetterFaviconRenderer,
  icon: IconFaviconRenderer,
};