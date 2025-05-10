"use client"

import { useTheme } from "@/contexts/theme-context"
import type { AnimationCategory, AnimationConfig } from "@/lib/animations"
import { useMemo } from "react"
import { useAnimation } from "@/lib/animations"

export function useFactionAnimations() {
  const { currentTheme } = useTheme()

  const animationStyles = useMemo(
    () => (category: AnimationCategory, animationName: string, config?: AnimationConfig) => {
      return useAnimation(currentTheme, category, animationName, config)
    },
    [currentTheme],
  )

  return {
    getAnimationStyle: animationStyles,
  }
}
