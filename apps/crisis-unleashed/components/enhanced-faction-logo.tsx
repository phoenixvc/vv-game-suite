"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ResponsiveAnimatedLogo } from "@/components/responsive-animated-logo"

interface EnhancedFactionLogoProps {
  faction?: string
  width?: number
  height?: number
  animationDuration?: number
  interactive?: boolean
  showText?: boolean
  className?: string
}

/**
 * Displays an animated faction logo with optional interactivity and text label.
 *
 * Renders a skeleton placeholder until the component is mounted to prevent hydration mismatches. When mounted, shows an animated logo for the specified faction, with optional scaling on hover if interactivity is enabled. Optionally displays the formatted faction name below the logo.
 *
 * @param faction - The faction identifier to display. Defaults to "cybernetic-nexus".
 * @param width - The width of the logo in pixels. Defaults to 64.
 * @param height - The height of the logo in pixels. Defaults to 64.
 * @param animationDuration - Duration of the logo animation in seconds. Defaults to 0.8.
 * @param interactive - Enables hover scaling and pointer cursor if true. Defaults to false.
 * @param showText - If true, displays the formatted faction name below the logo. Defaults to false.
 * @param className - Additional CSS classes for the container.
 *
 * @returns A React element displaying the animated faction logo and optional text.
 *
 * @remark The component only renders its content after mounting to avoid hydration issues in server-side rendering environments.
 */
export function EnhancedFactionLogo({
  faction = "cybernetic-nexus",
  width = 64,
  height = 64,
  animationDuration = 0.8,
  interactive = false,
  showText = false,
  className,
}: EnhancedFactionLogoProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only render after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={cn("skeleton", className)} style={{ width, height }} />
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center transition-all duration-300",
        interactive && "cursor-pointer",
        className,
      )}
      style={{
        width,
        height,
        transform: isHovered && interactive ? "scale(1.05)" : "scale(1)",
      }}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      <ResponsiveAnimatedLogo
        variant="icon-only"
        size="2xl"
        faction={faction}
        interactive={interactive}
        animated={true}
        className="w-full h-full"
      />

      {showText && (
        <div className="mt-2 text-center font-bold text-sm">
          {faction
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </div>
      )}
    </div>
  )
}

export default EnhancedFactionLogo
