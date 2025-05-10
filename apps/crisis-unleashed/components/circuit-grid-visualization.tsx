"use client"

import { useEffect, useRef } from "react"

/**
 * Renders an animated circuit grid visualization on a full-window canvas.
 *
 * The component displays a grid of nodes connected by lines, with dynamic connections and pulsing effects that respond to mouse movement. Nodes near the mouse pointer connect to their immediate neighbors with animated lines whose opacity and thickness vary based on distance and time.
 *
 * @returns A React element containing a fixed-position canvas covering the viewport.
 */
export function CircuitGridVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Circuit grid properties
    const gridSize = 30
    const nodeRadius = 1
    const lineWidth = 0.5
    const activeLineWidth = 1.5
    const nodeColor = "rgba(0, 150, 255, 0.5)"
    const lineColor = "rgba(0, 150, 255, 0.2)"
    const activeLineColor = "rgba(0, 200, 255, 0.8)"
    const activationRadius = 150

    // Create grid of nodes
    const nodes: { x: number; y: number }[] = []
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        nodes.push({ x, y })
      }
    }

    // Animation variables
    let mouseX = 0
    let mouseY = 0
    let frame = 0

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation function
    const animate = () => {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid lines
      ctx.strokeStyle = lineColor
      ctx.lineWidth = lineWidth

      // Draw horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Draw nodes and active connections
      nodes.forEach((node) => {
        // Calculate distance from mouse
        const dx = node.x - mouseX
        const dy = node.y - mouseY
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Draw node
        ctx.fillStyle = nodeColor
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2)
        ctx.fill()

        // Draw active connections if node is within activation radius
        if (distance < activationRadius) {
          // Find nearby nodes to connect to
          nodes.forEach((otherNode) => {
            const odx = otherNode.x - node.x
            const ody = otherNode.y - node.y
            const otherDistance = Math.sqrt(odx * odx + ody * ody)

            // Only connect to immediate neighbors
            if (otherDistance > 0 && otherDistance <= gridSize * 1.5) {
              // Calculate opacity based on distance from mouse
              const opacity = 1 - distance / activationRadius
              const pulseEffect = 0.5 + 0.5 * Math.sin(frame * 0.05 + distance * 0.01)
              const finalOpacity = opacity * pulseEffect

              ctx.strokeStyle = `rgba(0, 200, 255, ${finalOpacity})`
              ctx.lineWidth = activeLineWidth * finalOpacity

              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(otherNode.x, otherNode.y)
              ctx.stroke()
            }
          })
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />
}

export default CircuitGridVisualization
