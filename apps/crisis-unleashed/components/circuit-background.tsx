"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  pathIndex: number
  progress: number
  alpha: number
  glowing: boolean
}

interface Path {
  points: { x: number; y: number }[]
  width: number
}

/**
 * Renders an animated circuit board background using an HTML canvas, with customizable colors and particle effects.
 *
 * The component generates a dynamic network of circuit paths and animates particles moving along them, creating a visually engaging background. Particle count, colors, glow strength, and background color can be customized via props.
 *
 * @param className - Optional additional CSS classes for the container.
 * @param particleCount - Number of animated particles to display.
 * @param particleColor - Color of the moving particles.
 * @param lineColor - Color of the circuit lines and nodes.
 * @param glowColor - Color of the particle glow effect.
 * @param glowStrength - Intensity of the glow effect for glowing particles.
 * @param backgroundColor - Background color of the canvas.
 *
 * @returns A React element rendering the animated circuit background.
 */
export default function CircuitBackground({
  className = "",
  particleCount = 50,
  particleColor = "#4299e1",
  lineColor = "#1a365d",
  glowColor = "#63b3ed",
  glowStrength = 10,
  backgroundColor = "#001233",
}: {
  className?: string
  particleCount?: number
  particleColor?: string
  lineColor?: string
  glowColor?: string
  glowStrength?: number
  backgroundColor?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const particlesRef = useRef<Particle[]>([])
  const pathsRef = useRef<Path[]>([])
  const animationRef = useRef<number>(0)
  const { resolvedTheme } = useTheme()

  // Adjust colors based on theme if needed
  const actualBackgroundColor = backgroundColor
  const actualLineColor = lineColor
  const actualParticleColor = particleColor
  const actualGlowColor = glowColor

  // Initialize canvas and particles
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const { width, height } = canvas.getBoundingClientRect()

        // Set canvas dimensions with device pixel ratio for sharpness
        const dpr = window.devicePixelRatio || 1
        canvas.width = width * dpr
        canvas.height = height * dpr

        // Store dimensions for other calculations
        setDimensions({ width, height })

        // Generate new paths when size changes
        generatePaths(width, height)

        // Reset particles
        particlesRef.current = createParticles(particleCount, width, height)
      }
    }

    // Generate circuit board paths
    const generatePaths = (width: number, height: number) => {
      const paths: Path[] = []
      const gridSize = 40
      const nodeChance = 0.3

      // Create a grid of potential nodes
      const nodes: { x: number; y: number; active: boolean }[] = []

      for (let x = gridSize; x < width; x += gridSize) {
        for (let y = gridSize; y < height; y += gridSize) {
          if (Math.random() < nodeChance) {
            nodes.push({ x, y, active: true })
          }
        }
      }

      // Create paths between nodes
      nodes.forEach((startNode) => {
        if (!startNode.active) return

        // Find closest nodes to connect to
        const closestNodes = nodes
          .filter(
            (node) =>
              node !== startNode &&
              node.active &&
              Math.sqrt(Math.pow(node.x - startNode.x, 2) + Math.pow(node.y - startNode.y, 2)) < gridSize * 3,
          )
          .sort((a, b) => {
            const distA = Math.sqrt(Math.pow(a.x - startNode.x, 2) + Math.pow(a.y - startNode.y, 2))
            const distB = Math.sqrt(Math.pow(b.x - startNode.x, 2) + Math.pow(b.y - startNode.y, 2))
            return distA - distB
          })
          .slice(0, Math.floor(Math.random() * 3) + 1) // Connect to 1-3 closest nodes

        closestNodes.forEach((endNode) => {
          // Create a path with some randomness
          const points = [{ x: startNode.x, y: startNode.y }]

          // Decide if path should have a bend
          if (Math.random() > 0.5) {
            // Add a midpoint with some randomness
            if (Math.random() > 0.5) {
              points.push({ x: startNode.x, y: endNode.y })
            } else {
              points.push({ x: endNode.x, y: startNode.y })
            }
          }

          // Add end point
          points.push({ x: endNode.x, y: endNode.y })

          // Add path with random width
          paths.push({
            points,
            width: Math.random() * 2 + 1,
          })
        })
      })

      pathsRef.current = paths
    }

    // Create initial particles
    const createParticles = (count: number, width: number, height: number): Particle[] => {
      const particles: Particle[] = []

      for (let i = 0; i < count; i++) {
        // Assign each particle to a random path
        const pathIndex = Math.floor(Math.random() * pathsRef.current.length)

        particles.push({
          x: 0,
          y: 0,
          size: Math.random() * 3 + 2,
          speedX: 0,
          speedY: 0,
          pathIndex,
          progress: Math.random(), // Random progress along the path
          alpha: Math.random() * 0.5 + 0.5,
          glowing: Math.random() > 0.7, // Some particles glow more than others
        })
      }

      return particles
    }

    // Set up resize listener
    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [particleCount])

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    const animate = () => {
      if (!ctx) return

      // Clear canvas
      ctx.fillStyle = actualBackgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw circuit paths
      ctx.lineWidth = 1 * dpr
      ctx.strokeStyle = actualLineColor

      pathsRef.current.forEach((path) => {
        if (path.points.length < 2) return

        ctx.beginPath()
        ctx.moveTo(path.points[0].x * dpr, path.points[0].y * dpr)

        for (let i = 1; i < path.points.length; i++) {
          ctx.lineTo(path.points[i].x * dpr, path.points[i].y * dpr)
        }

        ctx.stroke()

        // Draw nodes at endpoints
        path.points.forEach((point) => {
          ctx.beginPath()
          ctx.arc(point.x * dpr, point.y * dpr, 3 * dpr, 0, Math.PI * 2)
          ctx.fillStyle = actualLineColor
          ctx.fill()
        })
      })

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        const path = pathsRef.current[particle.pathIndex]

        if (!path || path.points.length < 2) return

        // Move particle along its path
        particle.progress += 0.002 * (particle.size / 2)

        if (particle.progress >= 1) {
          // Reset particle to beginning of path or assign a new path
          particle.progress = 0
          particle.pathIndex = Math.floor(Math.random() * pathsRef.current.length)
          particle.glowing = Math.random() > 0.7
        }

        // Calculate position along the path
        const currentPointIndex = Math.floor(particle.progress * (path.points.length - 1))
        const nextPointIndex = Math.min(currentPointIndex + 1, path.points.length - 1)

        const currentPoint = path.points[currentPointIndex]
        const nextPoint = path.points[nextPointIndex]

        const segmentProgress = (particle.progress * (path.points.length - 1)) % 1

        particle.x = currentPoint.x + (nextPoint.x - currentPoint.x) * segmentProgress
        particle.y = currentPoint.y + (nextPoint.y - currentPoint.y) * segmentProgress

        // Draw particle
        ctx.beginPath()

        // Add glow effect for some particles
        if (particle.glowing) {
          ctx.shadowBlur = glowStrength * dpr
          ctx.shadowColor = actualGlowColor
        } else {
          ctx.shadowBlur = 0
        }

        ctx.arc(particle.x * dpr, particle.y * dpr, particle.size * dpr, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${hexToRgb(actualParticleColor)}, ${particle.alpha})`
        ctx.fill()

        // Reset shadow
        ctx.shadowBlur = 0
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [dimensions, actualBackgroundColor, actualLineColor, actualParticleColor, actualGlowColor, glowStrength])

  // Helper function to convert hex to rgb
  const hexToRgb = (hex: string): string => {
    // Remove # if present
    hex = hex.replace("#", "")

    // Parse hex values
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)

    return `${r}, ${g}, ${b}`
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
