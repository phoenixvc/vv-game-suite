import { type AnimationConfig, type FactionAnimations, getAnimationCSS } from "./index"

export const cyberneticAnimations: FactionAnimations = {
  background: {
    dataFlow: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberDataFlow", { iterationCount: "infinite", ...config })
    },
    gridPulse: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberGridPulse", { iterationCount: "infinite", ...config })
    },
    scanLine: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberScanLine", { iterationCount: "infinite", ...config })
    },
  },
  card: {
    glitch: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberGlitch", config)
    },
    dataStream: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberDataStream", { iterationCount: "infinite", ...config })
    },
    hologram: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberHologram", { iterationCount: "infinite", ...config })
    },
  },
  button: {
    powerUp: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberPowerUp", config)
    },
    circuitConnect: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberCircuitConnect", config)
    },
    digitalPulse: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberDigitalPulse", { iterationCount: "infinite", ...config })
    },
  },
  interface: {
    bootUp: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberBootUp", config)
    },
    dataProcess: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberDataProcess", { iterationCount: "infinite", ...config })
    },
    systemScan: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberSystemScan", { iterationCount: "infinite", ...config })
    },
  },
  text: {
    codeType: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberCodeType", config)
    },
    dataScroll: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberDataScroll", { iterationCount: "infinite", ...config })
    },
    glitchText: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberGlitchText", config)
    },
  },
  icon: {
    loadingCircle: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberLoadingCircle", { iterationCount: "infinite", ...config })
    },
    dataTransfer: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberDataTransfer", { iterationCount: "infinite", ...config })
    },
    powerIcon: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberPowerIcon", { iterationCount: "infinite", ...config })
    },
  },
  loading: {
    dataLoad: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberDataLoad", { iterationCount: "infinite", ...config })
    },
    systemBoot: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberSystemBoot", config)
    },
    circuitConnect: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberCircuitConnect", config)
    },
  },
  transition: {
    digitalDissolve: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberDigitalDissolve", config)
    },
    systemTransfer: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberSystemTransfer", config)
    },
    pixelate: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberPixelate", config)
    },
  },
  effect: {
    glitchEffect: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberGlitchEffect", config)
    },
    dataBurst: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberDataBurst", config)
    },
    systemOverload: (config?: AnimationConfig): string => {
      return getAnimationCSS("cyberSystemOverload", config)
    },
  },
}
