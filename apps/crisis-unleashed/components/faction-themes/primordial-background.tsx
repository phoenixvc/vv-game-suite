"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface PrimordialBackgroundProps {
  children?: React.ReactNode
  className?: string
}

export const PrimordialBackground: React.FC<PrimordialBackgroundProps> = ({ children, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Vine parameters
    const vines: Vine[] = []
    const numVines = 8

    // Create vines
    for (let i = 0; i < numVines; i++) {
      vines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 50 + Math.random() * 150,
        angle: Math.random() * Math.PI * 2,
        width: 1 + Math.random() * 3,
        growthSpeed: 0.5 + Math.random() * 1.5,
        maxSegments: 10 + Math.floor(Math.random() * 20),
        segments: [],
        hue: 100 + Math.random() * 40, // Green hues
        completed: false,
      })
    }

    // Animation loop
    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw vines
      vines.forEach((vine, index) => {
        if (vine.segments.length < vine.maxSegments && !vine.completed) {
          // Add new segment
          const lastSegment =
            vine.segments.length > 0
              ? vine.segments[vine.segments.length - 1]
              : { x: vine.x, y: vine.y, angle: vine.angle }

          // Add some natural variation to growth
          const angleVariation = (Math.random() - 0.5) * 0.5
          const newAngle = lastSegment.angle + angleVariation

          const newX = lastSegment.x + Math.cos(newAngle) * vine.growthSpeed
          const newY = lastSegment.y + Math.sin(newAngle) * vine.growthSpeed

          vine.segments.push({
            x: newX,
            y: newY,
            angle: newAngle,
          })
        } else if (!vine.completed) {
          vine.completed = true

          // Create a new vine when one is completed
          setTimeout(() => {
            vines[index] = {
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              length: 50 + Math.random() * 150,
              angle: Math.random() * Math.PI * 2,
              width: 1 + Math.random() * 3,
              growthSpeed: 0.5 + Math.random() * 1.5,
              maxSegments: 10 + Math.floor(Math.random() * 20),
              segments: [],
              hue: 100 + Math.random() * 40,
              completed: false,
            }
          }, Math.random() * 5000)
        }

        // Draw vine
        if (vine.segments.length > 0) {
          ctx.beginPath()
          ctx.moveTo(vine.x, vine.y)

          vine.segments.forEach((segment, i) => {
            ctx.lineTo(segment.x, segment.y)

            // Draw leaves occasionally
            if (i > 0 && i % 3 === 0 && Math.random() > 0.7) {
              drawLeaf(ctx, segment.x, segment.y, segment.angle, vine.hue)
            }
          })

          // Style and draw the vine
          ctx.strokeStyle = `hsla(${vine.hue}, 80%, 30%, 0.6)`
          ctx.lineWidth = vine.width
          ctx.lineCap = "round"
          ctx.lineJoin = "round"
          ctx.stroke()
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Draw a leaf
    function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, hue: number) {
      const leafSize = 5 + Math.random() * 10

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle + Math.PI / 2)

      // Draw leaf shape
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(leafSize / 2, leafSize / 2, leafSize, leafSize / 2, leafSize, leafSize * 2)
      ctx.bezierCurveTo(leafSize / 2, leafSize * 1.5, -leafSize / 2, leafSize * 1.5, -leafSize, leafSize * 2)
      ctx.bezierCurveTo(-leafSize, leafSize / 2, -leafSize / 2, leafSize / 2, 0, 0)

      // Fill with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, leafSize * 2)
      gradient.addColorStop(0, `hsla(${hue}, 80%, 40%, 0.7)`)
      gradient.addColorStop(1, `hsla(${hue + 10}, 70%, 30%, 0.5)`)
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw leaf veins
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(0, leafSize * 1.5)
      ctx.strokeStyle = `hsla(${hue - 10}, 60%, 30%, 0.5)`
      ctx.lineWidth = 0.5
      ctx.stroke()

      ctx.restore()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{
          background: "linear-gradient(to bottom, #0f1b0e, #1a2f1c)",
          opacity: 0.8,
        }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  )
}

// Types
interface Vine {
  x: number
  y: number
  length: number
  angle: number
  width: number
  growthSpeed: number
  maxSegments: number
  segments: VineSegment[]
  hue: number
  completed: boolean
}

interface VineSegment {
  x: number
  y: number
  angle: number
}

export default PrimordialBackground
