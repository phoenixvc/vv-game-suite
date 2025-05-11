"use client"

import { useState, useEffect } from "react"
import LogoSystem from "./logo-system"
// Update import to use the renamed type
import type { LogoVariant, LogoSize } from "./logo-variant"
import { cn } from "@/lib/utils"

export type LogoAnimationPreset =
  | "pulse"
  | "fade"
  | "rotate"
  | "bounce"
  | "glitch"
  | "grow"
  | "void-pulse"
  | "shadow"
  | "forge"
  | "shimmer"

interface LogoAnimationPresetsProps {
  variant?: LogoVariant
  size?: LogoSize
  faction?: string
  preset: LogoAnimationPreset
  speed?: number
  className?: string
  autoPlay?: boolean
  loop?: boolean
  onAnimationComplete?: () => void
}

/**
 * Renders an animated logo with configurable animation presets and playback controls.
 *
 * Displays the {@link LogoSystem} component with a selected animation preset, speed, and optional looping or auto-play behavior. The animation can be customized by variant, size, and faction, with sensible defaults based on the chosen preset. An optional callback is invoked when the animation completes.
 *
 * @param preset - The animation preset to apply to the logo.
 * @param speed - Controls the speed of the animation; higher values play the animation faster.
 * @param autoPlay - If true, the animation starts automatically.
 * @param loop - If true, the animation repeats indefinitely.
 * @param onAnimationComplete - Callback invoked when the animation completes (once per cycle if looping).
 *
 * @returns A React element displaying the animated logo.
 */
export default function LogoAnimationPresets({
  variant = "standard",
  size = "md",
  faction,
  preset,
  speed = 1,
  className,
  autoPlay = true,
  loop = true,
  onAnimationComplete,
}: LogoAnimationPresetsProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [animationClass, setAnimationClass] = useState("")

  // Map preset to faction if not provided
  const getFactionForPreset = (preset: LogoAnimationPreset): string => {
    switch (preset) {
      case "glitch":
        return "cybernetic-nexus"
      case "grow":
        return "primordial-ascendancy"
      case "void-pulse":
        return "void-harbingers"
      case "shadow":
        return "eclipsed-order"
      case "forge":
        return "titanborn"
      case "shimmer":
        return "celestial-dominion"
      default:
        return "cybernetic-nexus"
    }
  }

  const actualFaction = faction || getFactionForPreset(preset)

  // Set animation class based on preset
  useEffect(() => {
    if (!isPlaying) {
      setAnimationClass("")
      return
    }

    switch (preset) {
      case "pulse":
        setAnimationClass("animate-pulse")
        break
      case "fade":
        setAnimationClass("animate-fade")
        break
      case "rotate":
        setAnimationClass("animate-spin")
        break
      case "bounce":
        setAnimationClass("animate-bounce")
        break
      case "glitch":
        setAnimationClass("animate-glitch")
        break
      case "grow":
        setAnimationClass("animate-grow")
        break
      case "void-pulse":
        setAnimationClass("animate-void-pulse")
        break
      case "shadow":
        setAnimationClass("animate-shadow")
        break
      case "forge":
        setAnimationClass("animate-forge")
        break
      case "shimmer":
        setAnimationClass("animate-shimmer")
        break
      default:
        setAnimationClass("")
    }
  }, [preset, isPlaying])

  // Handle animation completion
  useEffect(() => {
    if (!isPlaying || !onAnimationComplete) return

    const timer = setTimeout(() => {
      if (!loop) {
        setIsPlaying(false)
      }
      onAnimationComplete()
    }, 2000 / speed) // Assuming most animations take about 2 seconds

    return () => clearTimeout(timer)
  }, [isPlaying, loop, onAnimationComplete, speed])

  return (
    <div className={className}>
      <div
        className={cn(animationClass)}
        style={{
          animationDuration: `${2 / speed}s`,
        }}
      >
        <LogoSystem variant={variant} size={size} faction={actualFaction} animated={true} />
      </div>
    </div>
  )
}