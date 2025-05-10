"use client"

import { useEffect, useRef } from "react"

interface GeneratedLogoProps {
  width: number
  height: number
  text?: string
  className?: string
}

export function GeneratedLogo({ width, height, text = "CU", className = "" }: GeneratedLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = width
    canvas.height = height

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "#3b82f6") // blue-500
    gradient.addColorStop(1, "#06b6d4") // cyan-500

    // Draw circular background
    ctx.fillStyle = "#0f172a" // slate-900
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, width / 2.2, 0, Math.PI * 2)
    ctx.fill()

    // Draw border
    ctx.strokeStyle = gradient
    ctx.lineWidth = width / 20
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, width / 2.5, 0, Math.PI * 2)
    ctx.stroke()

    // Draw text
    ctx.fillStyle = gradient
    ctx.font = `bold ${width / 3}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, width / 2, height / 2)

    // Draw some decorative elements
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const x1 = width / 2 + Math.cos(angle) * (width / 3)
      const y1 = height / 2 + Math.sin(angle) * (height / 3)
      const x2 = width / 2 + Math.cos(angle) * (width / 2.3)
      const y2 = height / 2 + Math.sin(angle) * (height / 2.3)

      ctx.strokeStyle = gradient
      ctx.lineWidth = width / 60
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    // Save the generated logo as a PNG
    try {
      const dataUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = "crisis-unleashed-logo.png"
      link.href = dataUrl

      // Store in localStorage for potential future use
      localStorage.setItem("generatedLogo", dataUrl)

      console.log(
        'Generated logo created successfully. Right-click on the logo and select "Save image as..." to download it.',
      )
    } catch (error) {
      console.error("Error saving generated logo:", error)
    }
  }, [width, height, text])

  return <canvas ref={canvasRef} className={`${className}`} style={{ width, height }} />
}
