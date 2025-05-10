"use client"

import { cn } from "@/lib/utils"
import { getFactionColor, formatFactionName } from "@/lib/logo-system"

export type LogoVariant =
  | "standard"
  | "compact"
  | "horizontal"
  | "vertical"
  | "icon-only"
  | "text-only"
  | "footer"
  | "mobile"
  | "print"
  | "watermark"
  | "animated"

export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

interface LogoVariantProps {
  variant?: LogoVariant
  size?: LogoSize
  faction?: string
  interactive?: boolean
  monochrome?: boolean
  inverted?: boolean
  withTagline?: boolean
  className?: string
  onClick?: () => void
}

// Size mapping
const sizeClasses = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
  "2xl": "h-24 w-24",
}

export function LogoVariant({
  variant = "standard",
  size = "md",
  faction = "cybernetic-nexus",
  interactive = false,
  monochrome = false,
  inverted = false,
  withTagline = false,
  className,
  onClick,
}: LogoVariantProps) {
  // Base styles for the logo container
  const containerClasses = cn(
    "inline-flex items-center transition-all duration-300",
    interactive && "cursor-pointer hover:scale-105",
    className,
  )

  // Render different variants
  const renderLogo = () => {
    const color = getFactionColor(faction, monochrome, inverted)
    const textColor = inverted ? "text-white" : "text-slate-900 dark:text-white"
    const iconClass = sizeClasses[size]

    switch (variant) {
      case "icon-only":
        return (
          <div className={containerClasses}>
            <div
              className={cn("rounded-full flex items-center justify-center", iconClass)}
              style={{ backgroundColor: color }}
            >
              <span className="font-bold text-white text-xs">CU</span>
            </div>
          </div>
        )

      case "text-only":
        return (
          <div className={cn(containerClasses, textColor)}>
            <span className="font-bold">CRISIS UNLEASHED</span>
            {withTagline && <span className="text-xs ml-2 opacity-70">Card Combat System</span>}
          </div>
        )

      case "compact":
        return (
          <div className={cn(containerClasses, "space-x-1")}>
            <div
              className={cn("rounded-full flex items-center justify-center", iconClass)}
              style={{ backgroundColor: color }}
            >
              <span className="font-bold text-white text-xs">CU</span>
            </div>
            <span className={cn("font-bold", textColor)}>CU</span>
          </div>
        )

      case "horizontal":
        return (
          <div className={cn(containerClasses, "space-x-2")}>
            <div
              className={cn("rounded-full flex items-center justify-center", iconClass)}
              style={{ backgroundColor: color }}
            >
              <span className="font-bold text-white text-xs">CU</span>
            </div>
            <div className="flex flex-col">
              <span className={cn("font-bold", textColor)}>CRISIS UNLEASHED</span>
              {withTagline && <span className="text-xs opacity-70">Card Combat System</span>}
            </div>
          </div>
        )

      case "vertical":
        return (
          <div className={cn(containerClasses, "flex-col space-y-2")}>
            <div
              className={cn("rounded-full flex items-center justify-center", iconClass)}
              style={{ backgroundColor: color }}
            >
              <span className="font-bold text-white text-xs">CU</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={cn("font-bold", textColor)}>CRISIS UNLEASHED</span>
              {withTagline && <span className="text-xs opacity-70">Card Combat System</span>}
            </div>
          </div>
        )

      default: // standard
        return (
          <div className={cn(containerClasses, "space-x-2")}>
            <div
              className={cn("rounded-full flex items-center justify-center", iconClass)}
              style={{ backgroundColor: color }}
            >
              <span className="font-bold text-white text-xs">CU</span>
            </div>
            <div className="flex flex-col">
              <span className={cn("font-bold", textColor)}>CRISIS UNLEASHED</span>
              {withTagline && <span className="text-xs opacity-70">Card Combat System</span>}
            </div>
            {faction !== "cybernetic-nexus" && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800">
                {formatFactionName(faction)}
              </span>
            )}
          </div>
        )
    }
  }

  return (
    <div onClick={onClick} role={onClick ? "button" : undefined}>
      {renderLogo()}
    </div>
  )
}

export default LogoVariant
