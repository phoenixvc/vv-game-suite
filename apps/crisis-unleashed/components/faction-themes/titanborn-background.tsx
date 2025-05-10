"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import styles from "../../styles/animations.module.css"

interface TitanbornBackgroundProps {
  children?: React.ReactNode
  intensity?: "low" | "medium" | "high"
  showForgeElements?: boolean
}

export function TitanbornBackground({
  children,
  intensity = "medium",
  showForgeElements = true,
}: TitanbornBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Intensity factors
  const particleCount = intensity === "low" ? 15 : intensity === "medium" ? 30 : 50
  const particleSize = intensity === "low" ? 2 : intensity === "medium" ? 3 : 4
  const particleSpeed = intensity === "low" ? 0.5 : intensity === "medium" ? 1 : 1.5

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const { width, height } = canvasRef.current.parentElement.getBoundingClientRect()
        setDimensions({ width, height })
        canvasRef.current.width = width
        canvasRef.current.height = height
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create ember particles
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      life: number
      maxLife: number
      color: string
    }[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * dimensions.width,
        y: dimensions.height - Math.random() * 100,
        size: Math.random() * particleSize + 1,
        speedX: (Math.random() - 0.5) * particleSpeed,
        speedY: -Math.random() * particleSpeed * 2 - 1,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100,
        color: `rgba(${200 + Math.random() * 55}, ${100 + Math.random() * 50}, ${Math.random() * 50}, ${0.5 + Math.random() * 0.5})`,
      })
    }

    // Animation loop
    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Draw particles
      particles.forEach((particle, index) => {
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Update particle position
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.life += 1

        // Reset particle if it goes off screen or exceeds life
        if (
          particle.y < -10 ||
          particle.x < -10 ||
          particle.x > dimensions.width + 10 ||
          particle.life > particle.maxLife
        ) {
          particles[index] = {
            x: Math.random() * dimensions.width,
            y: dimensions.height - Math.random() * 20,
            size: Math.random() * particleSize + 1,
            speedX: (Math.random() - 0.5) * particleSpeed,
            speedY: -Math.random() * particleSpeed * 2 - 1,
            life: 0,
            maxLife: 100 + Math.random() * 100,
            color: `rgba(${200 + Math.random() * 55}, ${100 + Math.random() * 50}, ${Math.random() * 50}, ${0.5 + Math.random() * 0.5})`,
          }
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [dimensions, particleCount, particleSize, particleSpeed])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-b from-stone-800 via-stone-700 to-stone-900"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='0.05' fillRule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      {showForgeElements && (
        <>
          {/* Forge glow at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-orange-600/30 to-transparent" />

          {/* Anvil silhouette */}
          <div
            className={`absolute bottom-10 right-10 w-20 h-16 opacity-30 ${styles.forgeGlow}`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 80'%3E%3Cpath d='M10,60 L90,60 L90,70 L10,70 Z M30,30 L70,30 L70,60 L30,60 Z M40,10 L60,10 L60,30 L40,30 Z' fill='%23000000'/%3E%3C/svg%3E")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />

          {/* Hammer silhouette */}
          <div
            className={`absolute bottom-20 left-10 w-16 h-16 opacity-30 ${styles.hammerSwing}`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M30,20 L50,20 L50,80 L30,80 Z M50,10 L70,30 L50,30 Z' fill='%23000000'/%3E%3C/svg%3E")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              transformOrigin: "bottom right",
            }}
          />
        </>
      )}

      {/* Stone border elements */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-8 border-l-8 border-stone-600 opacity-50" />
      <div className="absolute top-0 right-0 w-20 h-20 border-t-8 border-r-8 border-stone-600 opacity-50" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-8 border-l-8 border-stone-600 opacity-50" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-8 border-r-8 border-stone-600 opacity-50" />

      {/* Ember particles canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.7 }} />

      {/* Content container */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  )
}

export default TitanbornBackground
