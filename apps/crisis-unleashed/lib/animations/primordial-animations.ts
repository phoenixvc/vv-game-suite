import { type AnimationConfig, type FactionAnimations, getAnimationCSS } from "./index"

export const primordialAnimations: FactionAnimations = {
  background: {
    leafRustle: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialLeafRustle", { iterationCount: "infinite", ...config })
    },
    vineGrow: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialVineGrow", config)
    },
    natureCycle: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialNatureCycle", { iterationCount: "infinite", ...config })
    },
  },
  card: {
    bloomEffect: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialBloom", config)
    },
    leafUnfold: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialLeafUnfold", config)
    },
    naturalShimmer: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialNaturalShimmer", { iterationCount: "infinite", ...config })
    },
  },
  button: {
    growthPulse: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialGrowthPulse", { iterationCount: "infinite", ...config })
    },
    seedSprout: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialSeedSprout", config)
    },
    leafWave: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialLeafWave", { iterationCount: "infinite", ...config })
    },
  },
  interface: {
    organicExpand: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialOrganicExpand", config)
    },
    rootSpread: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialRootSpread", config)
    },
    naturalFlow: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialNaturalFlow", { iterationCount: "infinite", ...config })
    },
  },
  text: {
    organicType: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialOrganicType", config)
    },
    leafReveal: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialLeafReveal", config)
    },
    naturalPulse: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialNaturalPulse", { iterationCount: "infinite", ...config })
    },
  },
  icon: {
    leafSpin: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialLeafSpin", { iterationCount: "infinite", ...config })
    },
    seedGrow: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialSeedGrow", config)
    },
    flowerBloom: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialFlowerBloom", config)
    },
  },
  loading: {
    growthRing: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialGrowthRing", { iterationCount: "infinite", ...config })
    },
    seedGerminate: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialSeedGerminate", config)
    },
    leafCycle: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialLeafCycle", { iterationCount: "infinite", ...config })
    },
  },
  transition: {
    organicDissolve: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialOrganicDissolve", config)
    },
    leafCurtain: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialLeafCurtain", config)
    },
    naturalBlend: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialNaturalBlend", config)
    },
  },
  effect: {
    natureBurst: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialNatureBurst", config)
    },
    leafStorm: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialLeafStorm", config)
    },
    rootEruption: (config?: AnimationConfig): string => {
      return getAnimationCSS("primordialRootEruption", config)
    },
  },
}
