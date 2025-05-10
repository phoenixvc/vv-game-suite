"use client"

import { ResponsiveAnimatedLogo } from "@/components/responsive-animated-logo"
import type { LogoVariant, LogoSize } from "./logo-variant"

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

function LogoSystem({
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
  return (
    <ResponsiveAnimatedLogo
      variant={variant}
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

export default LogoSystem
