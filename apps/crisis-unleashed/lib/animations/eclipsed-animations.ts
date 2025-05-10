import { type AnimationConfig, type FactionAnimations, getAnimationCSS } from "./index"

export const eclipsedAnimations: FactionAnimations = {
  background: {
    shadowMove: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedShadowMove", { iterationCount: "infinite", ...config })
    },
    darkMist: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedDarkMist", { iterationCount: "infinite", ...config })
    },
    bloodRipple: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedBloodRipple", { iterationCount: "infinite", ...config })
    },
  },
  card: {
    shadowReveal: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedShadowReveal", config)
    },
    bloodDrip: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedBloodDrip", config)
    },
    daggerSpin: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedDaggerSpin", { iterationCount: "infinite", ...config })
    },
  },
  button: {
    shadowPulse: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedShadowPulse", { iterationCount: "infinite", ...config })
    },
    daggerStrike: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedDaggerStrike", config)
    },
    bloodSplatter: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedBloodSplatter", config)
    },
  },
  interface: {
    shadowExpand: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedShadowExpand", config)
    },
    stealthReveal: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedStealthReveal", config)
    },
    darkPulse: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedDarkPulse", { iterationCount: "infinite", ...config })
    },
  },
  text: {
    shadowText: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedShadowText", { iterationCount: "infinite", ...config })
    },
    bloodWrite: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedBloodWrite", config)
    },
    fadeWhisper: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedFadeWhisper", config)
    },
  },
  icon: {
    daggerThrow: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedDaggerThrow", config)
    },
    shadowFlicker: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedShadowFlicker", { iterationCount: "infinite", ...config })
    },
    poisonDrip: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedPoisonDrip", { iterationCount: "infinite", ...config })
    },
  },
  loading: {
    shadowGather: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedShadowGather", { iterationCount: "infinite", ...config })
    },
    bloodFill: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedBloodFill", config)
    },
    daggerCircle: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedDaggerCircle", { iterationCount: "infinite", ...config })
    },
  },
  transition: {
    shadowVeil: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedShadowVeil", config)
    },
    bloodCurtain: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedBloodCurtain", config)
    },
    stealthFade: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedStealthFade", config)
    },
  },
  effect: {
    assassinateSlash: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedAssassinateSlash", config)
    },
    shadowBurst: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedShadowBurst", config)
    },
    poisonCloud: (config?: AnimationConfig): string => {
      return getAnimationCSS("eclipsedPoisonCloud", config)
    },
  },
}
