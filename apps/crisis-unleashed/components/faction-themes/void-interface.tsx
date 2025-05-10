"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import styles from "@/styles/animations.module.css"

interface VoidInterfaceProps {
  children?: React.ReactNode
  title?: string
  className?: string
  unstable?: boolean
}

export default function VoidInterface({
  children,
  title = "Void Interface",
  className = "",
  unstable = false,
}: VoidInterfaceProps) {
  const [loaded, setLoaded] = useState(false)
  const [stabilityLevel, setStabilityLevel] = useState(unstable ? 30 : 70)
  const [isGlitching, setIsGlitching] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate stability level fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setStabilityLevel((prev) => {
        // More unstable fluctuations if unstable prop is true
        const fluctuation = unstable ? 15 : 5
        const newValue = prev + (Math.random() * 2 - 1) * fluctuation
        return Math.max(10, Math.min(90, newValue))
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [unstable])

  // Trigger random glitch effects
  useEffect(() => {
    const triggerRandomGlitch = () => {
      // Higher chance of glitching if unstable
      if (Math.random() < (unstable ? 0.4 : 0.15)) {
        setIsGlitching(true)

        if (glitchTimeoutRef.current) {
          clearTimeout(glitchTimeoutRef.current)
        }

        glitchTimeoutRef.current = setTimeout(
          () => {
            setIsGlitching(false)
          },
          200 + Math.random() * 300,
        )
      }

      const nextGlitch = unstable ? 2000 + Math.random() * 3000 : 5000 + Math.random() * 5000
      setTimeout(triggerRandomGlitch, nextGlitch)
    }

    const timeout = setTimeout(triggerRandomGlitch, 2000)

    return () => {
      clearTimeout(timeout)
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current)
      }
    }
  }, [unstable])

  // Simulate loading sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Create dimensional tear effect
  useEffect(() => {
    if (!containerRef.current || !loaded) return

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()

    // Create void tear
    const createVoidTear = () => {
      if (!container) return
      if (Math.random() > (unstable ? 0.3 : 0.1)) return

      const tear = document.createElement("div")
      tear.className = "absolute rounded-full pointer-events-none z-10"

      // Random size and position
      const size = 10 + Math.random() * 30
      tear.style.width = `${size}px`
      tear.style.height = `${size}px`

      const x = Math.random() * containerRect.width
      const y = Math.random() * containerRect.height
      tear.style.left = `${x}px`
      tear.style.top = `${y}px`

      // Void tear appearance
      tear.style.background =
        "radial-gradient(circle, rgba(99, 102, 241, 0.7) 0%, rgba(79, 70, 229, 0.3) 70%, transparent 100%)"
      tear.style.boxShadow = "0 0 10px rgba(99, 102, 241, 0.5)"

      // Add to container
      container.appendChild(tear)

      // Animate
      const duration = 2000 + Math.random() * 3000

      let startTime: number | null = null

      const animateTear = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = elapsed / duration

        if (progress < 1) {
          // Grow and fade
          const scale = 1 + progress * 3
          const opacity = 1 - progress

          tear.style.transform = `scale(${scale})`
          tear.style.opacity = opacity.toString()

          requestAnimationFrame(animateTear)
        } else {
          // Remove tear when animation completes
          if (container.contains(tear)) {
            container.removeChild(tear)
          }
        }
      }

      requestAnimationFrame(animateTear)
    }

    // Create tears periodically
    const tearInterval = setInterval(createVoidTear, 2000)

    return () => {
      clearInterval(tearInterval)
      // Clean up any remaining tears
      if (container) {
        const tears = container.querySelectorAll("div.pointer-events-none")
        tears.forEach((tear) => {
          if (container.contains(tear)) {
            container.removeChild(tear)
          }
        })
      }
    }
  }, [loaded, unstable])

  return (
    <div
      ref={containerRef}
      className={`relative rounded-lg overflow-hidden ${className} ${isGlitching ? styles.voidGlitch : ""}`}
      style={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #1e1b4b 100%)",
        boxShadow: "0 10px 25px rgba(67, 56, 202, 0.2), inset 0 0 20px rgba(99, 102, 241, 0.2)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Void border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
          opacity: 0.7,
        }}
      />

      {/* Void symbols decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top left symbol */}
        <div
          className={`absolute top-0 left-0 w-24 h-24 opacity-30 ${styles.voidRotate}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='rgba(99, 102, 241, 0.8)' fill='none' strokeWidth='2'/%3E%3Ccircle cx='50' cy='50' r='25' stroke='rgba(99, 102, 241, 0.6)' fill='none' strokeWidth='1'/%3E%3Cpath d='M30,50 L70,50 M50,30 L50,70' stroke='rgba(99, 102, 241, 0.8)' strokeWidth='1'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            animationDuration: "20s",
          }}
        />

        {/* Bottom right symbol */}
        <div
          className={`absolute bottom-0 right-0 w-24 h-24 opacity-30 ${styles.voidRotateReverse}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='50,10 90,50 50,90 10,50' stroke='rgba(99, 102, 241, 0.8)' fill='none' strokeWidth='2'/%3E%3Cpolygon points='50,30 70,50 50,70 30,50' stroke='rgba(99, 102, 241, 0.6)' fill='none' strokeWidth='1'/%3E%3Ccircle cx='50' cy='50' r='10' stroke='rgba(99, 102, 241, 0.8)' fill='none' strokeWidth='1'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            animationDuration: "25s",
          }}
        />
      </div>

      {/* Interface header */}
      <div
        className="relative z-10 p-4 border-b border-indigo-700"
        style={{
          background: "linear-gradient(to right, rgba(67, 56, 202, 0.8), rgba(67, 56, 202, 0.4))",
        }}
      >
        <div className="flex justify-between items-center">
          <h2
            className="text-xl font-semibold text-indigo-100"
            style={{
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              filter: isGlitching ? "blur(2px)" : "none",
              transition: "filter 0.2s ease",
            }}
          >
            {title}
            {isGlitching && (
              <span className="absolute ml-1 text-purple-300" style={{ opacity: 0.7 }}>
                {title}
              </span>
            )}
          </h2>

          {/* Stability indicator */}
          <div className="flex items-center space-x-2">
            <div className="text-xs text-indigo-200">Stability</div>
            <div
              className="w-24 h-3 bg-indigo-900 rounded-full overflow-hidden"
              style={{ border: "1px solid rgba(99, 102, 241, 0.5)" }}
            >
              <div
                className="h-full transition-all duration-1000 ease-in-out"
                style={{
                  width: `${stabilityLevel}%`,
                  background: `linear-gradient(to right, ${
                    stabilityLevel < 30 ? "#ef4444" : stabilityLevel < 60 ? "#eab308" : "#6366f1"
                  }, ${stabilityLevel < 30 ? "#b91c1c" : stabilityLevel < 60 ? "#a16207" : "#4f46e5"})`,
                  boxShadow: stabilityLevel > 70 ? "0 0 10px rgba(99, 102, 241, 0.5)" : "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loading animation */}
      {!loaded ? (
        <div className="flex flex-col items-center justify-center p-8 h-64">
          <div
            className="w-16 h-16 mb-4"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%236366f1' strokeWidth='2'%3E%3Ccircle cx='32' cy='32' r='24'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 32 32' to='360 32 32' dur='3s' repeatCount='indefinite'/%3E%3C/circle%3E%3Ccircle cx='32' cy='32' r='16' strokeDasharray='50.26 50.26'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 32 32' to='-360 32 32' dur='2s' repeatCount='indefinite'/%3E%3C/circle%3E%3Cpath d='M32,8 L32,16 M32,48 L32,56 M8,32 L16,32 M48,32 L56,32'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 32 32' to='360 32 32' dur='4s' repeatCount='indefinite'/%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="text-indigo-300 text-sm">Stabilizing dimensional connection...</div>
        </div>
      ) : (
        <div className="relative z-10 p-4">
          {/* Content wrapper */}
          <div
            className={`relative ${isGlitching ? styles.voidContentGlitch : ""}`}
            style={{
              filter: isGlitching ? "hue-rotate(10deg)" : "none",
              transition: "filter 0.2s ease",
            }}
          >
            {children}
          </div>
        </div>
      )}

      {/* Interface footer */}
      <div
        className="relative z-10 p-3 border-t border-indigo-700 flex justify-between items-center text-xs text-indigo-300"
        style={{
          background: "linear-gradient(to right, rgba(67, 56, 202, 0.4), rgba(67, 56, 202, 0.8))",
        }}
      >
        <div>Void Harbingers</div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              stabilityLevel > 60 ? "bg-indigo-400" : stabilityLevel > 30 ? "bg-yellow-400" : "bg-red-400"
            }`}
            style={{
              boxShadow: `0 0 5px ${
                stabilityLevel > 60
                  ? "rgba(99, 102, 241, 0.8)"
                  : stabilityLevel > 30
                    ? "rgba(234, 179, 8, 0.8)"
                    : "rgba(239, 68, 68, 0.8)"
              }`,
            }}
          />
          <div>Reality Anchor: {stabilityLevel > 70 ? "Stable" : stabilityLevel > 30 ? "Fluctuating" : "Critical"}</div>
        </div>
      </div>
    </div>
  )
}
