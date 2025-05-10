"use client"

import type React from "react"

import { useEffect, useRef } from "react"

export default function VoidBackground({
  children,
  intensity = 1,
  className = "",
}: {
  children?: React.ReactNode
  intensity?: number
  className?: string
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

    // Void rifts
    const rifts: {
      x: number
      y: number
      radius: number
      distortionFactor: number
      rotationSpeed: number
      pulseSpeed: number
      hue: number
      saturation: number
      lightness: number
      opacity: number
      direction: number
    }[] = []

    // Generate void rifts
    const generateRifts = () => {
      rifts.length = 0
      const riftCount = Math.floor(3 + intensity * 5)

      for (let i = 0; i < riftCount; i++) {
        rifts.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 50 + Math.random() * 150 * intensity,
          distortionFactor: 0.2 + Math.random() * 0.8 * intensity,
          rotationSpeed: (0.2 + Math.random() * 0.8) * 0.01 * intensity,
          pulseSpeed: (0.5 + Math.random() * 1.5) * 0.01,
          hue: 230 + Math.random() * 60, // Indigo to purple
          saturation: 70 + Math.random() * 30,
          lightness: 20 + Math.random() * 40,
          opacity: 0.1 + Math.random() * 0.4,
          direction: Math.random() > 0.5 ? 1 : -1,
        })
      }
    }

    generateRifts()

    // Animation variables
    let time = 0

    // Draw void rift
    const drawRift = (
      x: number,
      y: number,
      radius: number,
      distortionFactor: number,
      rotation: number,
      hue: number,
      saturation: number,
      lightness: number,
      opacity: number,
    ) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)

      // Create gradient
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
      gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity * 1.5})`)
      gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness - 10}%, ${opacity})`)
      gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness - 20}%, 0)`)

      // Draw distorted circle
      ctx.beginPath()
      const segments = 36
      const angleStep = (Math.PI * 2) / segments

      for (let i = 0; i <= segments; i++) {
        const angle = i * angleStep
        const distortionAmount = Math.sin(angle * 3 + time * 2) * distortionFactor * radius * 0.3
        const currentRadius = radius + distortionAmount

        const x = Math.cos(angle) * currentRadius
        const y = Math.sin(angle) * currentRadius

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw void tendrils
      const tendrilCount = Math.floor(5 + distortionFactor * 7)
      for (let i = 0; i < tendrilCount; i++) {
        const tendrilAngle = (i / tendrilCount) * Math.PI * 2
        const tendrilLength = radius * (0.8 + Math.sin(time + i) * 0.3)

        ctx.beginPath()
        ctx.moveTo(0, 0)

        // Create curved tendril
        const controlPoint1X = Math.cos(tendrilAngle) * tendrilLength * 0.5
        const controlPoint1Y = Math.sin(tendrilAngle) * tendrilLength * 0.5
        const controlPoint2X = Math.cos(tendrilAngle) * tendrilLength * 0.8
        const controlPoint2Y = Math.sin(tendrilAngle) * tendrilLength * 0.8
        const endX = Math.cos(tendrilAngle) * tendrilLength
        const endY = Math.sin(tendrilAngle) * tendrilLength

        ctx.bezierCurveTo(controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y, endX, endY)

        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 10}%, ${opacity * 0.7})`
        ctx.lineWidth = 1 + Math.random() * 2
        ctx.stroke()
      }

      // Draw void symbols
      if (Math.random() < 0.01) {
        const symbolSize = radius * 0.2
        const symbolX = (Math.random() - 0.5) * radius * 0.8
        const symbolY = (Math.random() - 0.5) * radius * 0.8

        ctx.save()
        ctx.translate(symbolX, symbolY)
        ctx.rotate(Math.random() * Math.PI * 2)

        // Draw random eldritch symbol
        const symbolType = Math.floor(Math.random() * 5)
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 30}%, ${opacity * 2})`
        ctx.lineWidth = 1

        switch (symbolType) {
          case 0: // Eye
            ctx.beginPath()
            ctx.ellipse(0, 0, symbolSize, symbolSize / 2, 0, 0, Math.PI * 2)
            ctx.stroke()
            ctx.beginPath()
            ctx.arc(0, 0, symbolSize / 4, 0, Math.PI * 2)
            ctx.fill()
            break
          case 1: // Spiral
            ctx.beginPath()
            for (let j = 0; j < 10; j++) {
              const spiralRadius = (j / 10) * symbolSize
              const spiralAngle = (j * Math.PI) / 2
              const spiralX = Math.cos(spiralAngle) * spiralRadius
              const spiralY = Math.sin(spiralAngle) * spiralRadius
              if (j === 0) {
                ctx.moveTo(spiralX, spiralY)
              } else {
                ctx.lineTo(spiralX, spiralY)
              }
            }
            ctx.stroke()
            break
          case 2: // Rune
            ctx.beginPath()
            ctx.moveTo(-symbolSize / 2, -symbolSize / 2)
            ctx.lineTo(symbolSize / 2, symbolSize / 2)
            ctx.moveTo(symbolSize / 2, -symbolSize / 2)
            ctx.lineTo(-symbolSize / 2, symbolSize / 2)
            ctx.moveTo(0, -symbolSize)
            ctx.lineTo(0, symbolSize)
            ctx.stroke()
            break
          case 3: // Triangle
            ctx.beginPath()
            ctx.moveTo(0, -symbolSize / 2)
            ctx.lineTo(symbolSize / 2, symbolSize / 2)
            ctx.lineTo(-symbolSize / 2, symbolSize / 2)
            ctx.closePath()
            ctx.stroke()
            break
          case 4: // Strange glyph
            ctx.beginPath()
            ctx.arc(0, 0, symbolSize / 2, 0, Math.PI * 2)
            ctx.moveTo(0, -symbolSize / 2)
            ctx.lineTo(0, symbolSize / 2)
            ctx.moveTo(-symbolSize / 2, 0)
            ctx.lineTo(symbolSize / 2, 0)
            ctx.stroke()
            break
        }

        ctx.restore()
      }

      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      time += 0.01

      // Clear canvas with dark background
      ctx.fillStyle = "#0f0f1a"
      ctx.fillRect(0, 0, width, height)

      // Add subtle noise texture
      const noiseData = new ImageData(width, height)
      for (let i = 0; i < noiseData.data.length; i += 4) {
        const value = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 10)
        noiseData.data[i] = value // R
        noiseData.data[i + 1] = value // G
        noiseData.data[i + 2] = value // B
        noiseData.data[i + 3] = 20 // A
      }
      ctx.putImageData(noiseData, 0, 0)

      // Draw void rifts
      for (const rift of rifts) {
        const pulse = Math.sin(time * rift.pulseSpeed) * 0.3 + 0.7
        const currentRadius = rift.radius * pulse
        const rotation = time * rift.rotationSpeed * rift.direction

        drawRift(
          rift.x,
          rift.y,
          currentRadius,
          rift.distortionFactor,
          rotation,
          rift.hue,
          rift.saturation,
          rift.lightness,
          rift.opacity,
        )
      }

      // Reality distortion effect
      if (intensity > 0.5) {
        // Create distortion lines
        for (let i = 0; i < 5 * intensity; i++) {
          const y = Math.random() * height
          const lineWidth = 1 + Math.random() * 3
          const speed = Math.random() * 0.5 + 0.5
          const offset = ((time * speed * 100) % (width * 2)) - width / 2

          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.strokeStyle = `rgba(100, 102, 241, ${Math.random() * 0.1})`
          ctx.lineWidth = lineWidth
          ctx.stroke()

          // Add glitch effect
          if (Math.random() < 0.2) {
            const glitchWidth = 20 + Math.random() * 100
            const glitchX = (offset + width / 2) % width
            ctx.fillStyle = `rgba(100, 102, 241, ${Math.random() * 0.2})`
            ctx.fillRect(glitchX, y - lineWidth, glitchWidth, lineWidth * 2)
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    // Handle resize
    const handleResize = () => {
      ;({ width, height } = updateSize())
      generateRifts()
    }

    window.addEventListener("resize", handleResize)
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [intensity])

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.9, mixBlendMode: "normal" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, rgba(49, 46, 129, 0.05) 50%, rgba(15, 15, 26, 0) 100%)",
          pointerEvents: "none",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}
