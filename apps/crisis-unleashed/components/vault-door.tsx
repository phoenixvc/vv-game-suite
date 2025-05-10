"use client"

import { useEffect, useRef } from "react"
import styles from "@/styles/animations.module.css"

export default function VaultDoor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Animation variables
    let rotation = 0
    let isOpening = false
    let doorOpenAmount = 0

    // Set canvas dimensions
    const updateCanvasSize = () => {
      const size = Math.min(300, window.innerWidth * 0.3)
      canvas.width = size
      canvas.height = size
      drawVaultDoor(ctx, size)
    }

    window.addEventListener("resize", updateCanvasSize)
    updateCanvasSize()

    // Draw the vault door
    function drawVaultDoor(ctx: CanvasRenderingContext2D, size: number) {
      ctx.clearRect(0, 0, size, size)

      const centerX = size / 2
      const centerY = size / 2
      const radius = size * 0.45

      // Draw outer ring
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.lineWidth = size * 0.03
      ctx.strokeStyle = "#94a3b8"
      ctx.stroke()

      // Draw door background
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.95, 0, Math.PI * 2)
      ctx.fillStyle = "#1e293b"
      ctx.fill()

      // Draw inner ring
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.9, 0, Math.PI * 2)
      ctx.lineWidth = size * 0.01
      ctx.strokeStyle = "#94a3b8"
      ctx.stroke()

      // Save context for rotating dial
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)

      // Draw dial markings
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2
        const innerRadius = radius * 0.7
        const outerRadius = radius * 0.85

        ctx.beginPath()
        ctx.moveTo(innerRadius * Math.cos(angle), innerRadius * Math.sin(angle))
        ctx.lineTo(outerRadius * Math.cos(angle), outerRadius * Math.sin(angle))

        ctx.lineWidth = i % 6 === 0 ? size * 0.02 : size * 0.01
        ctx.strokeStyle = i % 6 === 0 ? "#eab308" : "#94a3b8"
        ctx.stroke()
      }

      // Draw center mechanism
      ctx.beginPath()
      ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2)
      ctx.fillStyle = "#334155"
      ctx.fill()

      ctx.beginPath()
      ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2)
      ctx.fillStyle = "#eab308"
      ctx.fill()

      // Draw handle
      ctx.beginPath()
      ctx.moveTo(0, -radius * 0.15)
      ctx.lineTo(0, -radius * 0.5)
      ctx.lineWidth = size * 0.04
      ctx.strokeStyle = "#eab308"
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(0, -radius * 0.5, radius * 0.08, 0, Math.PI * 2)
      ctx.fillStyle = "#eab308"
      ctx.fill()

      // Restore context
      ctx.restore()

      // Draw door opening effect if active
      if (doorOpenAmount > 0) {
        // Draw shadow for 3D effect
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius * 0.95, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(
          centerX + radius * 0.1,
          centerY + radius * 0.1,
          0,
          centerX,
          centerY,
          radius,
        )
        gradient.addColorStop(0, "rgba(0, 0, 0, 0.7)")
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw opening
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius * 0.95 * doorOpenAmount, 0, Math.PI * 2)
        ctx.fillStyle = "#0f172a"
        ctx.fill()

        // Draw inner glow
        if (doorOpenAmount > 0.5) {
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius * 0.95 * doorOpenAmount * 0.8, 0, Math.PI * 2)
          const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * doorOpenAmount)
          glowGradient.addColorStop(0, "rgba(234, 179, 8, 0.3)")
          glowGradient.addColorStop(1, "rgba(234, 179, 8, 0)")
          ctx.fillStyle = glowGradient
          ctx.fill()
        }
      }
    }

    // Animation loop
    function animate() {
      if (isOpening) {
        rotation += 0.03
        doorOpenAmount = Math.min(1, doorOpenAmount + 0.01)
      } else {
        rotation += 0.005
      }

      drawVaultDoor(ctx, canvas.width)
      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Add interaction
    canvas.addEventListener("click", () => {
      isOpening = !isOpening
      if (!isOpening && doorOpenAmount > 0) {
        doorOpenAmount = 0
      }
    })

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [])

  return (
    <div className="relative">
      <canvas ref={canvasRef} className={`${styles.float} cursor-pointer`} title="Click to open/close the vault" />
    </div>
  )
}
