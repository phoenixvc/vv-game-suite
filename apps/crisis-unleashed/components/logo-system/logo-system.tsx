"use client"

import { ResponsiveAnimatedLogo } from "@/components/responsive-animated-logo"
import { useMemo } from "react"
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
const variantMap = {
  standard:  "standard",
  "icon-only": "icon-only",
  horizontal: "horizontal",
  vertical:   "vertical",
  wordmark:   "text-only",
  badge:      "icon-only",
  minimal:    "compact",
} as const

type ResponsiveVariant = typeof variantMap[keyof typeof variantMap]

const mapVariantToResponsiveVariant = (v: LogoVariant): ResponsiveVariant =>
  variantMap[v] ?? "standard";

/**
 * Renders a responsive, animated logo with configurable appearance and behavior.
 *
 * Maps the provided logo variant to a supported variant for the underlying {@link ResponsiveAnimatedLogo} component, ensuring consistent rendering across different variant options.
 */
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
  
const responsiveVariant = useMemo(
  () => mapVariantToResponsiveVariant(variant),
  [variant],
)
  
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