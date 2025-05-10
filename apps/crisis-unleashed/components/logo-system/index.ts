// Export components
export { default as LogoVariant } from "./logo-variant"
export { default as LogoSystem } from "./logo-system"
export { default as LogoAnimationPresets } from "./logo-animation-presets"
export { default as LogoLoading } from "./logo-loading"
export { default as LogoError } from "./logo-error"
export { ResponsiveAnimatedLogo } from "../responsive-animated-logo"

// Export types
export type { LogoSize } from "./logo-variant"
export type { LogoVariant } from "./logo-variant"

// Export utilities from lib/logo-system.ts
export {
  getFactionColor,
  getFactionSecondaryColor,
  getFactionName,
  getAllFactions,
  getFactionFaviconUrl,
  formatFactionName,
} from "../../lib/logo-system"
