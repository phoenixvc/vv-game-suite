import { type AnimationConfig, type FactionAnimations, getAnimationCSS } from "./index"

export const voidAnimations: FactionAnimations = {
  background: {
    voidRipple: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidRipple", { iterationCount: "infinite", ...config })
    },
    realityWarp: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidRealityWarp", { iterationCount: "infinite", ...config })
    },
    dimensionalTear: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidDimensionalTear", config)
    },
  },
  card: {
    voidGlitch: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidGlitch", { iterationCount: "infinite", ...config })
    },
    entropyDecay: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidEntropyDecay", config)
    },
    dimensionalShift: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidDimensionalShift", { iterationCount: "infinite", ...config })
    },
  },
  button: {
    voidPulse: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidPulse", { iterationCount: "infinite", ...config })
    },
    realityBreak: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidRealityBreak", config)
    },
    chaosFlicker: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidChaosFlicker", { iterationCount: "infinite", ...config })
    },
  },
  interface: {
    voidExpand: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidExpand", config)
    },
    realityDistort: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidRealityDistort", { iterationCount: "infinite", ...config })
    },
    entropyFlow: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidEntropyFlow", { iterationCount: "infinite", ...config })
    },
  },
  text: {
    voidTextGlitch: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidTextGlitch", { iterationCount: "infinite", ...config })
    },
    entropyWrite: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidEntropyWrite", config)
    },
    dimensionalEcho: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidDimensionalEcho", config)
    },
  },
  icon: {
    voidRotate: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidRotate", { iterationCount: "infinite", ...config })
    },
    voidSymbolAppear: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidSymbolAppear", config)
    },
    chaosEnergy: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidChaosEnergy", { iterationCount: "infinite", ...config })
    },
  },
  loading: {
    voidPortal: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidPortal", { iterationCount: "infinite", ...config })
    },
    realityUnravel: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidRealityUnravel", config)
    },
    entropyGather: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidEntropyGather", { iterationCount: "infinite", ...config })
    },
  },
  transition: {
    voidTear: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidTear", config)
    },
    dimensionalFold: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidDimensionalFold", config)
    },
    realityShatter: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidRealityShatter", config)
    },
  },
  effect: {
    voidImplosion: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidImplosion", config)
    },
    entropyBurst: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidEntropyBurst", config)
    },
    realityCrack: (config?: AnimationConfig): string => {
      return getAnimationCSS("voidRealityCrack", config)
    },
  },
}
