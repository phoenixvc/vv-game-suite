"use client"

import { useEffect, useState } from "react"
import LogoSystem from "./logo-system"
// Update import to use the renamed type
import { cn } from "@/lib/utils"
import type { LogoSize, LogoVariant } from "./logo-variant"

interface LogoLoadingProps {
  variant?: LogoVariant
  size?: LogoSize
  faction?: string
  className?: string
  text?: string
  loadingType?: "pulse" | "spin" | "bounce" | "fade"
}

/**
 * Displays a loading animation with an animated logo and optional loading text.
 *
 * Renders a logo with configurable style, size, and animation type, along with a loading message. If the loading text contains an ellipsis ("..."), the component animates the dots to indicate ongoing activity.
 *
 * @param variant - The visual style of the logo.
 * @param size - The size of the logo.
 * @param faction - The logo's faction or theme.
 * @param className - Additional CSS classes for the container.
 * @param text - The loading message to display. If it contains "...", the dots will animate.
 * @param loadingType - The animation style applied to the logo ("pulse", "spin", "bounce", or "fade").
 *
 * @returns A React element displaying the animated logo and loading text.
 */
export function LogoLoading({
  variant = "standard",
  size = "lg",
  faction = "cybernetic-nexus",
  className,
  text = "Loading...",
  loadingType = "pulse",
}: LogoLoadingProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (text.includes("...")) {
      const interval = setInterval(() => {
        setDots((prev) => {
          if (prev.length >= 3) return ""
          return prev + "."
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [text])

  const displayText = text.includes("...") ? text.replace("...", "") + dots : text

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div
        className={cn("transition-all", {
          "animate-pulse": loadingType === "pulse",
          "animate-spin": loadingType === "spin",
          "animate-bounce": loadingType === "bounce",
          "animate-fade": loadingType === "fade",
        })}
      >
        <LogoSystem variant={variant} size={size} faction={faction} animated={true} />
      </div>

      {displayText && <p className="text-muted-foreground text-sm">{displayText}</p>}
    </div>
  )
}

export default LogoLoading