import { type AnimationConfig, type FactionAnimations, getAnimationCSS } from "./index"

export const celestialAnimations: FactionAnimations = {
  background: {
    starField: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialStarField", { iterationCount: "infinite", ...config })
    },
    cosmicNebula: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialCosmicNebula", { iterationCount: "infinite", ...config })
    },
    timeRipple: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialTimeRipple", { iterationCount: "infinite", ...config })
    },
  },
  card: {
    starReveal: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialStarReveal", config)
    },
    constellationForm: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialConstellationForm", config)
    },
    cosmicGlow: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialCosmicGlow", { iterationCount: "infinite", ...config })
    },
  },
  button: {
    starBurst: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialStarBurst", config)
    },
    portalOpen: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialPortalOpen", config)
    },
    cosmicPulse: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialCosmicPulse", { iterationCount: "infinite", ...config })
    },
  },
  interface: {
    dimensionalShift: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialDimensionalShift", { iterationCount: "infinite", ...config })
    },
    timeFlow: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialTimeFlow", { iterationCount: "infinite", ...config })
    },
    cosmicExpand: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialCosmicExpand", config)
    },
  },
  text: {
    starScript: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialStarScript", config)
    },
    cosmicText: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialCosmicText", { iterationCount: "infinite", ...config })
    },
    timeEcho: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialTimeEcho", config)
    },
  },
  icon: {
    starTwinkle: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialStarTwinkle", { iterationCount: "infinite", ...config })
    },
    cosmicSpin: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialCosmicSpin", { iterationCount: "infinite", ...config })
    },
    timeReverse: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialTimeReverse", { iterationCount: "infinite", ...config })
    },
  },
  loading: {
    cosmicOrbit: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialCosmicOrbit", { iterationCount: "infinite", ...config })
    },
    starFormation: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialStarFormation", config)
    },
    timeLoop: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialTimeLoop", { iterationCount: "infinite", ...config })
    },
  },
  transition: {
    dimensionalPortal: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialDimensionalPortal", config)
    },
    starCurtain: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialStarCurtain", config)
    },
    timeWarp: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialTimeWarp", config)
    },
  },
  effect: {
    cosmicBurst: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialCosmicBurst", config)
    },
    starShower: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialStarShower", config)
    },
    timeFreeze: (config?: AnimationConfig): string => {
      return getAnimationCSS("celestialTimeFreeze", config)
    },
  },
}
