import { FaviconRenderer } from "./favicon-renderer";
import { IconFaviconRenderer } from "./icon-favicon-renderer";
import { LetterFaviconRenderer } from "./letter-favicon-renderer";
import { StandardFaviconRenderer } from "./standard-favicon-renderer";

export type { FaviconRendererProps } from "./favicon-renderer";

export const FaviconRenderers: Record<'standard' | 'letter' | 'icon', FaviconRenderer> = {
  standard: StandardFaviconRenderer,
  letter: LetterFaviconRenderer,
  icon: IconFaviconRenderer,
};