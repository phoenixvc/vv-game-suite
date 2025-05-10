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
