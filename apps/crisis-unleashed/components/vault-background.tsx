"use client"

import { useEffect, useState } from "react"
import { CircuitGridVisualization } from "./circuit-grid-visualization"

export default function VaultBackground() {
  const [scrollY, setScrollY] = useState(0)

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className="fixed inset-0 w-full h-full z-[-1] overflow-hidden"
      style={{
        transform: `translateY(${scrollY * 0.1}px)`,
        pointerEvents: "none", // Ensures clicks pass through to content
      }}
    >
      <div className="absolute inset-0 bg-black/80 z-[-1]"></div>
      <CircuitGridVisualization />
    </div>
  )
}
