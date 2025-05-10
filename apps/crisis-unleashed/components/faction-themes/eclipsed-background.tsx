"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface EclipsedBackgroundProps {
  children: React.ReactNode
  shadowIntensity?: "low" | "medium" | "high"
  showDaggers?: boolean
  ambientShadows?: boolean
}

export function EclipsedBackground({
  children,
  shadowIntensity = "medium",
  showDaggers = true,
  ambientShadows = true,
}: EclipsedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Shadow intensity values
  const shadowValues = {
    low: { opacity: 0.3, count: 5, speed: 0.5 },
    medium: { opacity: 0.5, count: 10, speed: 1 },
    high: { opacity: 0.7, count: 15, speed: 1.5 },
  }

  // Shadow animation
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const container = containerRef.current

    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // Create shadow elements
    const { count, opacity, speed } = shadowValues[shadowIntensity]
    const shadows = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 100 + 50,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      opacity: Math.random() * opacity,
    }))

    // Create dagger elements if enabled
    const daggers = showDaggers
      ? Array.from({ length: 5 }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          rotation: Math.random() * Math.PI * 2,
          size: Math.random() * 20 + 10,
          visible: false,
          appearTime: Math.random() * 10000,
          disappearTime: Math.random() * 5000 + 5000,
        }))
      : []

    let lastTime = 0
    let totalTime = 0

    // Animation loop
    const animate = (time: number) => {
      if (!ctx || !canvas) return

      const deltaTime = time - lastTime
      lastTime = time
      totalTime += deltaTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw ambient shadows
      if (ambientShadows) {
        shadows.forEach((shadow) => {
          // Update position
          shadow.x += shadow.vx
          shadow.y += shadow.vy

          // Bounce off edges
          if (shadow.x < 0 || shadow.x > canvas.width) shadow.vx *= -1
          if (shadow.y < 0 || shadow.y > canvas.height) shadow.vy *= -1

          // Draw shadow
          const gradient = ctx.createRadialGradient(shadow.x, shadow.y, 0, shadow.x, shadow.y, shadow.size)

          gradient.addColorStop(0, `rgba(0, 0, 0, ${shadow.opacity})`)
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(shadow.x, shadow.y, shadow.size, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      // Draw daggers
      if (showDaggers) {
        daggers.forEach((dagger) => {
          // Check if dagger should be visible
          const timeInCycle = totalTime % (dagger.appearTime + dagger.disappearTime)
          dagger.visible = timeInCycle > dagger.appearTime

          if (dagger.visible) {
            // Draw dagger silhouette
            ctx.save()
            ctx.translate(dagger.x, dagger.y)
            ctx.rotate(dagger.rotation)

            // Dagger handle
            ctx.fillStyle = "rgba(20, 20, 20, 0.8)"
            ctx.fillRect(-dagger.size / 4, -dagger.size / 2, dagger.size / 2, dagger.size / 2)

            // Dagger blade
            ctx.fillStyle = "rgba(40, 40, 40, 0.8)"
            ctx.beginPath()
            ctx.moveTo(-dagger.size / 4, -dagger.size / 2)
            ctx.lineTo(dagger.size / 4, -dagger.size / 2)
            ctx.lineTo(0, -dagger.size * 1.5)
            ctx.closePath()
            ctx.fill()

            // Dagger guard
            ctx.fillStyle = "rgba(60, 60, 60, 0.8)"
            ctx.fillRect(-dagger.size / 2, -dagger.size / 2, dagger.size, dagger.size / 8)

            ctx.restore()
          }
        })
      }

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      cancelAnimationFrame(animationId)
    }
  }, [shadowIntensity, showDaggers, ambientShadows])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Ambient shadow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-0"></div>

      {/* Content container */}
      <div className="relative z-10 w-full h-full">{children}</div>

      {/* Corner shadow accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
    </div>
  )
}

export default EclipsedBackground
