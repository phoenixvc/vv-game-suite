// Export components
export { default as LogoAnimationPresets } from "./logo-animation-presets"
export { default as LogoError } from "./logo-error"
export { default as LogoLoading } from "./logo-loading"
export { default as LogoSystem } from "./logo-system"
export { default as LogoVariant } from "./logo-variant"

// Export types
export type { LogoAnimationPreset } from "./logo-animation-presets"
export type { LogoSystemProps } from "./logo-system"
// Fix: Rename the exported type to avoid conflict with component name
export type { LogoSize, LogoVariant as LogoVariantType } from "./logo-variant"

// Export utilities
export {
  // Faction name utilities
  formatFactionName,
  // Faction data accessors
  getAllFactions,
  getFactionColor, getFactionDescription,
  // URL utilities
  getFactionFaviconUrl, getFactionFont,
  getFactionGradient,
  getFactionIconName,
  getFactionKeywords, getFactionName, getFactionSecondaryColor
} from "./utils"

