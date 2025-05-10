"use client"

import { useEffect, useRef } from "react"

export default function CyberneticBackground({
  className = "",
  color = "#0ea5e9",
  density = 1,
}: {
  className?: string
  color?: string
  density?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const updateSize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
      return { width, height }
    }

    let { width, height } = updateSize()

    // Circuit elements
    const circuits: {
      x: number
      y: number
      width: number
      height: number
      type: "horizontal" | "vertical" | "corner" | "node"
      direction?: "tl" | "tr" | "bl" | "br"
      active: boolean
      pulseSpeed: number
      pulseOffset: number
    }[] = []

    // Generate circuit layout
    const generateCircuits = () => {
      circuits.length = 0
      const gridSize = 40
      const nodeChance = 0.3 * density
      const lineChance = 0.6 * density

      // Create grid of nodes
      for (let x = gridSize; x < width; x += gridSize) {
        for (let y = gridSize; y < height; y += gridSize) {
          if (Math.random() < nodeChance) {
            circuits.push({
              x,
              y,
              width: 6,
              height: 6,
              type: "node",
              active: Math.random() < 0.5,
              pulseSpeed: Math.random() * 0.02 + 0.01,
              pulseOffset: Math.random() * Math.PI * 2,
            })

            // Add horizontal line
            if (Math.random() < lineChance && x + gridSize < width) {
              circuits.push({
                x: x + 3,
                y,
                width: gridSize - 6,
                height: 2,
                type: "horizontal",
                active: Math.random() < 0.3,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulseOffset: Math.random() * Math.PI * 2,
              })
            }

            // Add vertical line
            if (Math.random() < lineChance && y + gridSize < height) {
              circuits.push({
                x,
                y: y + 3,
                width: 2,
                height: gridSize - 6,
                type: "vertical",
                active: Math.random() < 0.3,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulseOffset: Math.random() * Math.PI * 2,
              })
            }

            // Add corner
            if (Math.random() < lineChance * 0.5) {
              const direction = ["tl", "tr", "bl", "br"][Math.floor(Math.random() * 4)] as "tl" | "tr" | "bl" | "br"
              circuits.push({
                x,
                y,
                width: gridSize / 2,
                height: gridSize / 2,
                type: "corner",
                direction,
                active: Math.random() < 0.3,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulseOffset: Math.random() * Math.PI * 2,
              })
            }
          }
        }
      }
    }

    generateCircuits()

    // Animation variables
    let time = 0
    const baseColor = hexToRgb(color)

    // Animation loop
    const animate = () => {
      time += 0.01

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, "#0f172a")
      gradient.addColorStop(1, "#1e293b")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Draw circuits
      for (const circuit of circuits) {
        const pulse = Math.sin(time * circuit.pulseSpeed + circuit.pulseOffset) * 0.5 + 0.5
        const alpha = circuit.active ? 0.3 + pulse * 0.7 : 0.1 + pulse * 0.2
        ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha})`

        if (circuit.type === "node") {
          ctx.beginPath()
          ctx.arc(circuit.x, circuit.y, circuit.width / 2, 0, Math.PI * 2)
          ctx.fill()

          // Add glow for active nodes
          if (circuit.active && pulse > 0.7) {
            ctx.beginPath()
            ctx.arc(circuit.x, circuit.y, circuit.width / 2 + 2 + pulse * 3, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${pulse * 0.2})`
            ctx.fill()
          }
        } else if (circuit.type === "horizontal" || circuit.type === "vertical") {
          ctx.fillRect(circuit.x, circuit.y, circuit.width, circuit.height)

          // Add data pulse animation for active lines
          if (circuit.active && Math.random() < 0.05) {
            const pulseWidth = circuit.type === "horizontal" ? 10 : circuit.width
            const pulseHeight = circuit.type === "vertical" ? 10 : circuit.height
            const pulseX =
              circuit.type === "horizontal" ? circuit.x + ((time * 100) % circuit.width) - pulseWidth : circuit.x
            const pulseY =
              circuit.type === "vertical" ? circuit.y + ((time * 100) % circuit.height) - pulseHeight : circuit.y

            ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.8)`
            ctx.fillRect(pulseX, pulseY, pulseWidth, pulseHeight)
          }
        } else if (circuit.type === "corner") {
          ctx.beginPath()
          if (circuit.direction === "tl") {
            ctx.moveTo(circuit.x, circuit.y)
            ctx.lineTo(circuit.x, circuit.y + circuit.height)
            ctx.lineTo(circuit.x + circuit.width, circuit.y)
            ctx.closePath()
          } else if (circuit.direction === "tr") {
            ctx.moveTo(circuit.x, circuit.y)
            ctx.lineTo(circuit.x + circuit.width, circuit.y)
            ctx.lineTo(circuit.x + circuit.width, circuit.y + circuit.height)
            ctx.closePath()
          } else if (circuit.direction === "bl") {
            ctx.moveTo(circuit.x, circuit.y)
            ctx.lineTo(circuit.x, circuit.y + circuit.height)
            ctx.lineTo(circuit.x + circuit.width, circuit.y + circuit.height)
            ctx.closePath()
          } else if (circuit.direction === "br") {
            ctx.moveTo(circuit.x + circuit.width, circuit.y)
            ctx.lineTo(circuit.x + circuit.width, circuit.y + circuit.height)
            ctx.lineTo(circuit.x, circuit.y + circuit.height)
            ctx.closePath()
          }
          ctx.fill()
        }
      }

      // Add scan line effect
      const scanLineY = (height * (time % 1)) % height
      ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.1)`
      ctx.fillRect(0, scanLineY, width, 2)

      animationRef.current = requestAnimationFrame(animate)
    }

    // Handle resize
    const handleResize = () => {
      ;({ width, height } = updateSize())
      generateCircuits()
    }

    window.addEventListener("resize", handleResize)
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [color, density])

  // Helper function to convert hex to rgb
  const hexToRgb = (hex: string) => {
    // Remove # if present
    hex = hex.replace("#", "")

    // Parse hex values
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)

    return { r, g, b }
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
