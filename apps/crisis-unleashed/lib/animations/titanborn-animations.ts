import { type AnimationConfig, type FactionAnimations, getAnimationCSS } from "./index"

export const titanbornAnimations: FactionAnimations = {
  background: {
    forgeGlow: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornForgeGlow", { iterationCount: "infinite", ...config })
    },
    emberRise: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornEmberRise", config)
    },
    stoneRumble: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornStoneRumble", { iterationCount: "infinite", ...config })
    },
  },
  card: {
    metalShine: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornMetalShine", { iterationCount: "infinite", ...config })
    },
    runeGlow: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornRuneGlow", { iterationCount: "infinite", ...config })
    },
    forgeHeat: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornForgeHeat", { iterationCount: "infinite", ...config })
    },
  },
  button: {
    hammerStrike: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornHammerStrike", config)
    },
    metalClang: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornMetalClang", config)
    },
    forgePulse: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornForgePulse", { iterationCount: "infinite", ...config })
    },
  },
  interface: {
    stoneSlide: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornStoneSlide", config)
    },
    anvilRing: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornAnvilRing", config)
    },
    mountainRise: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornMountainRise", config)
    },
  },
  text: {
    runeCarve: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornRuneCarve", config)
    },
    stoneChisel: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornStoneChisel", config)
    },
    forgeText: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornForgeText", { iterationCount: "infinite", ...config })
    },
  },
  icon: {
    hammerSwing: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornHammerSwing", { iterationCount: "infinite", ...config })
    },
    anvilStrike: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornAnvilStrike", config)
    },
    runeActivate: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornRuneActivate", config)
    },
  },
  loading: {
    forgeProgress: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornForgeProgress", config)
    },
    stoneForm: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornStoneForm", config)
    },
    emberCircle: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornEmberCircle", { iterationCount: "infinite", ...config })
    },
  },
  transition: {
    stoneCrumble: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornStoneCrumble", config)
    },
    forgeCurtain: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornForgeCurtain", config)
    },
    mountainSlide: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornMountainSlide", config)
    },
  },
  effect: {
    titanStomp: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornTitanStomp", config)
    },
    forgeBurst: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornForgeBurst", config)
    },
    mountainShatter: (config?: AnimationConfig): string => {
      return getAnimationCSS("titanbornMountainShatter", config)
    },
  },
}
