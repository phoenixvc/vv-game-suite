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