import { cyberneticAnimations } from "./cybernetic-animations"
import { primordialAnimations } from "./primordial-animations"
import { eclipsedAnimations } from "./eclipsed-animations"
import { celestialAnimations } from "./celestial-animations"
import { titanbornAnimations } from "./titanborn-animations"
import { voidAnimations } from "./void-animations"
import { commonAnimations } from "./common-animations"

// Animation categories
export type AnimationCategory =
  | "background"
  | "card"
  | "button"
  | "interface"
  | "text"
  | "icon"
  | "loading"
  | "transition"
  | "effect"

// Animation intensity levels
export type AnimationIntensity = "subtle" | "medium" | "intense"

// Animation duration presets
export type AnimationDuration = "fast" | "normal" | "slow" | "very-slow"

// Animation timing functions
export type AnimationTiming = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "bounce" | "elastic"

// Animation direction
export type AnimationDirection = "normal" | "reverse" | "alternate" | "alternate-reverse"

// Animation fill mode
export type AnimationFillMode = "none" | "forwards" | "backwards" | "both"

// Animation play state
export type AnimationPlayState = "running" | "paused"

// Animation configuration
export interface AnimationConfig {
  duration?: AnimationDuration | number
  timing?: AnimationTiming
  delay?: number
  iterationCount?: number | "infinite"
  direction?: AnimationDirection
  fillMode?: AnimationFillMode
  playState?: AnimationPlayState
  intensity?: AnimationIntensity
}

// Animation function type
export type AnimationFunction = (config?: AnimationConfig) => string

// Faction animations collection
export interface FactionAnimations {
  background: Record<string, AnimationFunction>
  card: Record<string, AnimationFunction>
  button: Record<string, AnimationFunction>
  interface: Record<string, AnimationFunction>
  text: Record<string, AnimationFunction>
  icon: Record<string, AnimationFunction>
  loading: Record<string, AnimationFunction>
  transition: Record<string, AnimationFunction>
  effect: Record<string, AnimationFunction>
}

// Map faction IDs to their animation collections
export const factionAnimationsMap: Record<string, FactionAnimations> = {
  "cybernetic-nexus": cyberneticAnimations,
  "primordial-ascendancy": primordialAnimations,
  "eclipsed-order": eclipsedAnimations,
  "celestial-dominion": celestialAnimations,
  titanborn: titanbornAnimations,
  "void-harbingers": voidAnimations,
}

// Get duration in milliseconds
export function getDuration(duration: AnimationDuration | number): number {
  if (typeof duration === "number") return duration

  switch (duration) {
    case "fast":
      return 300
    case "normal":
      return 500
    case "slow":
      return 1000
    case "very-slow":
      return 2000
    default:
      return 500
  }
}

// Get timing function
export function getTimingFunction(timing: AnimationTiming): string {
  switch (timing) {
    case "linear":
      return "linear"
    case "ease":
      return "ease"
    case "ease-in":
      return "ease-in"
    case "ease-out":
      return "ease-out"
    case "ease-in-out":
      return "ease-in-out"
    case "bounce":
      return "cubic-bezier(0.68, -0.55, 0.27, 1.55)"
    case "elastic":
      return "cubic-bezier(0.68, -0.6, 0.32, 1.6)"
    default:
      return "ease"
  }
}

// Get animation CSS based on configuration
export function getAnimationCSS(
  name: string,
  {
    duration = "normal",
    timing = "ease",
    delay = 0,
    iterationCount = 1,
    direction = "normal",
    fillMode = "forwards",
    playState = "running",
  }: AnimationConfig = {},
): string {
  const durationMs = getDuration(duration)
  const timingFunction = getTimingFunction(timing)

  return `${name} ${durationMs}ms ${timingFunction} ${delay}ms ${iterationCount} ${direction} ${fillMode} ${playState}`
}

// Get animation for current faction
export function getAnimation(
  factionId: string,
  category: AnimationCategory,
  animationName: string,
  config?: AnimationConfig,
): string {
  // Use common animation if faction doesn't have this specific animation
  if (!factionAnimationsMap[factionId] || !factionAnimationsMap[factionId][category][animationName]) {
    return commonAnimations[category][animationName] ? commonAnimations[category][animationName](config) : ""
  }

  return factionAnimationsMap[factionId][category][animationName](config)
}

// Apply animation based on current theme
export function useAnimation(
  factionId: string,
  category: AnimationCategory,
  animationName: string,
  config?: AnimationConfig,
): { animation: string } {
  const animation = getAnimation(factionId, category, animationName, config)
  return { animation }
}
