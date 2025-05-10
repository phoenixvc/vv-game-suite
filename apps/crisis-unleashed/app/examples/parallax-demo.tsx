"use client"

import ParallaxElement from "@/components/parallax-element"

export default function ParallaxDemo() {
  return (
    <>
      <ParallaxElement speed={0.05} className="absolute top-10 left-10">
        <div className="w-20 h-20 bg-blue-500 rounded-lg"></div>
      </ParallaxElement>

      <ParallaxElement speed={0.1} className="absolute top-20 right-20">
        <div className="w-16 h-16 bg-green-500 rounded-full"></div>
      </ParallaxElement>

      <ParallaxElement speed={0.15} direction="reverse" className="absolute bottom-20 left-20">
        <div className="w-24 h-24 bg-purple-500 rounded-lg rotate-45"></div>
      </ParallaxElement>

      <ParallaxElement speed={0.2} direction="reverse" className="absolute bottom-10 right-10">
        <div className="w-12 h-12 bg-yellow-500 rounded-full"></div>
      </ParallaxElement>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className="text-white text-lg font-medium">Move your mouse to see the parallax effect</p>
      </div>
    </>
  )
}
