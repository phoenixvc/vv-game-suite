"use client"

import { cn } from "@/lib/utils"
import { getFactionColor, getFactionSecondaryColor } from "./utils"

// Define types
export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"
export type LogoVariant = 
  | "standard" 
  | "icon-only" 
  | "wordmark" 
  | "horizontal" 
  | "vertical" 
  | "badge" 
  | "minimal"

export interface LogoVariantProps {
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

// The actual component
export default function LogoVariant({
  variant = "standard",
  size = "md",
  faction = "cybernetic-nexus",
  animated = false,
  interactive = false,
  monochrome = false,
  inverted = false,
  withTagline = false,
  className,
}: LogoVariantProps) {
  // Size classes
  const sizeClasses = {
    xs: "h-6",
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
    xl: "h-16",
    "2xl": "h-20",
    "3xl": "h-24",
    "4xl": "h-32",
    full: "h-full w-full",
  }

  // Get colors based on faction and settings
  const primaryColor = getFactionColor(faction, monochrome, inverted)
  const secondaryColor = getFactionSecondaryColor(faction)

  // Render different variants
  const renderVariant = () => {
    switch (variant) {
      case "icon-only":
        return (
          <div className="relative aspect-square">
            {/* Placeholder for icon-only logo */}
            <div 
              className="w-full h-full rounded-full" 
              style={{ backgroundColor: primaryColor }}
            />
            <div 
              className="absolute inset-1/4 rounded-full" 
              style={{ backgroundColor: secondaryColor }}
            />
          </div>
        )
      case "wordmark":
        return (
          <div className="flex items-center">
            {/* Placeholder for wordmark */}
            <div 
              className="h-4 w-32 rounded" 
              style={{ backgroundColor: primaryColor }}
            />
          </div>
        )
      case "horizontal":
        return (
          <div className="flex items-center gap-2">
            {/* Icon */}
            <div 
              className="h-full aspect-square rounded-full" 
              style={{ backgroundColor: primaryColor }}
            />
            {/* Text */}
            <div 
              className="h-3 w-24 rounded" 
              style={{ backgroundColor: secondaryColor }}
            />
          </div>
        )
      case "vertical":
        return (
          <div className="flex flex-col items-center gap-2">
            {/* Icon */}
            <div 
              className="aspect-square w-3/4 rounded-full" 
              style={{ backgroundColor: primaryColor }}
            />
            {/* Text */}
            <div 
              className="h-3 w-full rounded" 
              style={{ backgroundColor: secondaryColor }}
            />
          </div>
        )
      case "badge":
        return (
          <div 
            className="rounded-full p-2 flex items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            {/* Badge content */}
            <div 
              className="h-full aspect-square rounded-full" 
              style={{ backgroundColor: secondaryColor }}
            />
          </div>
        )
      case "minimal":
        return (
          <div className="flex items-center gap-1">
            {/* Minimal icon */}
            <div 
              className="h-full aspect-square rounded-sm" 
              style={{ backgroundColor: primaryColor }}
            />
            {/* Minimal text */}
            <div 
              className="h-2 w-16 rounded" 
              style={{ backgroundColor: secondaryColor }}
            />
          </div>
        )
      default: // standard
        return (
          <div className="flex flex-col items-center">
            {/* Standard logo */}
            <div 
              className="w-full aspect-video rounded" 
              style={{ backgroundColor: primaryColor }}
            />
            {withTagline && (
              <div 
                className="h-2 w-3/4 mt-2 rounded" 
                style={{ backgroundColor: secondaryColor }}
              />
            )}
          </div>
        )
    }
  }

  return (
    <div 
      className={cn(
        "relative transition-all duration-300",
        sizeClasses[size],
        interactive && "cursor-pointer hover:scale-105",
        animated && "animate-pulse",
        className
      )}
    >
      {renderVariant()}
    </div>
  )
}