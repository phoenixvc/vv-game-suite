import { type AnimationConfig, type FactionAnimations, getAnimationCSS } from "./index"

// Common animations that can be used by any faction
export const commonAnimations: FactionAnimations = {
  background: {
    fadeIn: (config?: AnimationConfig): string => {
      return getAnimationCSS("fadeIn", config)
    },
    pulse: (config?: AnimationConfig): string => {
      return getAnimationCSS("pulse", { iterationCount: "infinite", ...config })
    },
  },
  card: {
    flip: (config?: AnimationConfig): string => {
      return getAnimationCSS("flip", config)
    },
    hover: (config?: AnimationConfig): string => {
      return getAnimationCSS("cardHover", config)
    },
    reveal: (config?: AnimationConfig): string => {
      return getAnimationCSS("cardReveal", config)
    },
  },
  button: {
    press: (config?: AnimationConfig): string => {
      return getAnimationCSS("buttonPress", config)
    },
    hover: (config?: AnimationConfig): string => {
      return getAnimationCSS("buttonHover", config)
    },
  },
  interface: {
    slideIn: (config?: AnimationConfig): string => {
      return getAnimationCSS("slideIn", config)
    },
    expand: (config?: AnimationConfig): string => {
      return getAnimationCSS("expand", config)
    },
  },
  text: {
    typewriter: (config?: AnimationConfig): string => {
      return getAnimationCSS("typewriter", config)
    },
    fadeIn: (config?: AnimationConfig): string => {
      return getAnimationCSS("textFadeIn", config)
    },
  },
  icon: {
    spin: (config?: AnimationConfig): string => {
      return getAnimationCSS("spin", { iterationCount: "infinite", ...config })
    },
    pulse: (config?: AnimationConfig): string => {
      return getAnimationCSS("iconPulse", { iterationCount: "infinite", ...config })
    },
  },
  loading: {
    spinner: (config?: AnimationConfig): string => {
      return getAnimationCSS("spinner", { iterationCount: "infinite", ...config })
    },
    progress: (config?: AnimationConfig): string => {
      return getAnimationCSS("progress", config)
    },
  },
  transition: {
    fade: (config?: AnimationConfig): string => {
      return getAnimationCSS("fade", config)
    },
    slide: (config?: AnimationConfig): string => {
      return getAnimationCSS("slide", config)
    },
  },
  effect: {
    shake: (config?: AnimationConfig): string => {
      return getAnimationCSS("shake", config)
    },
    bounce: (config?: AnimationConfig): string => {
      return getAnimationCSS("bounce", config)
    },
  },
}
