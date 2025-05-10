"use client"

import { useEffect, useRef } from "react"

export default function SimpleCircuitBackground({
  className = "",
  lineColor = "rgba(66, 153, 225, 0.3)",
  nodeColor = "rgba(66, 153, 225, 0.5)",
  backgroundColor = "transparent",
  density = 1,
  speed = 1,
}: {
  className?: string
  lineColor?: string
  nodeColor?: string
  backgroundColor?: string
  density?: number
  speed?: number
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

    // Create circuit nodes
    const nodeCount = Math.floor(30 * density)
    const nodes: {
      x: number
      y: number
      connections: number[]
      size: number
      pulseSpeed: number
      pulseOffset: number
    }[] = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        connections: [],
        size: Math.random() * 2 + 1,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      })
    }

    // Connect nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const possibleConnections = []

      for (let j = 0; j < nodes.length; j++) {
        if (i !== j) {
          const otherNode = nodes[j]
          const distance = Math.sqrt(Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2))
          if (distance < 200) {
            possibleConnections.push({ index: j, distance })
          }
        }
      }

      // Sort by distance and take closest 1-3 connections
      possibleConnections.sort((a, b) => a.distance - b.distance)
      const connectionCount = Math.min(Math.floor(Math.random() * 3) + 1, possibleConnections.length)

      for (let k = 0; k < connectionCount; k++) {
        node.connections.push(possibleConnections[k].index)
      }
    }

    // Animation variables
    let time = 0

    // Animation loop
    const animate = () => {
      time += 0.01 * speed

      // Clear canvas
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, width, height)

      // Draw connections
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 1

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        for (const connectionIndex of node.connections) {
          const connectedNode = nodes[connectionIndex]

          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(connectedNode.x, connectedNode.y)
          ctx.stroke()
        }
      }

      // Draw nodes with pulsing effect
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const pulse = Math.sin(time * node.pulseSpeed + node.pulseOffset) * 0.5 + 0.5

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size * (1 + pulse * 0.5), 0, Math.PI * 2)
        ctx.fillStyle = nodeColor
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    // Handle resize
    const handleResize = () => {
      ;({ width, height } = updateSize())

      // Reposition nodes
      for (const node of nodes) {
        node.x = Math.random() * width
        node.y = Math.random() * height
      }
    }

    window.addEventListener("resize", handleResize)
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [backgroundColor, lineColor, nodeColor, density, speed])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
