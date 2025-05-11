"use client"

import { ResponsiveAnimatedLogo } from "@/components/responsive-animated-logo"
import type { LogoSize, LogoVariant } from "./logo-variant"

export interface LogoSystemProps {
  variant?: LogoVariant
  size?: LogoSize
  faction?: string
  animated?: boolean
  interactive?: boolean
  monochrome?: boolean
  inverted?: boolean
  withTagline?: boolean
  className?: string
}

// Map LogoVariant to ResponsiveAnimatedLogo variant
const mapVariantToResponsiveVariant = (
  variant: LogoVariant
): "standard" | "icon-only" | "horizontal" | "vertical" | "animated" | "compact" | "text-only" | "footer" | "mobile" | "print" | "watermark" => {
  switch (variant) {
    case "standard":
      return "standard"
    case "icon-only":
      return "icon-only"
    case "horizontal":
      return "horizontal"
    case "vertical":
      return "vertical"
    case "wordmark":
      return "text-only"
    case "badge":
      return "icon-only" // Best match
    case "minimal":
      return "compact" // Best match
    default:
      return "standard"
  }
}

export default function LogoSystem({
  variant = "standard",
  size = "md",
  faction = "cybernetic-nexus",
  animated = false,
  interactive = false,
  monochrome = false,
  inverted = false,
  withTagline = false,
  className,
}: LogoSystemProps) {
  // Map the variant to a compatible ResponsiveAnimatedLogo variant
  const responsiveVariant = mapVariantToResponsiveVariant(variant)
  
  return (
    <ResponsiveAnimatedLogo
      variant={responsiveVariant}
      size={size}
      faction={faction}
      interactive={interactive}
      monochrome={monochrome}
      inverted={inverted}
      withTagline={withTagline}
      className={className}
      animated={animated}
      useSvg={true}
    />
  )
}