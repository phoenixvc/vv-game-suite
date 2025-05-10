"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import styles from "@/styles/animations.module.css"

interface VoidButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline" | "danger"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
  fullWidth?: boolean
  icon?: React.ReactNode
  unstable?: boolean
}

export default function VoidButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  fullWidth = false,
  icon,
  unstable = false,
}: VoidButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Size classes
  const sizeClasses = {
    sm: "text-xs py-1 px-3",
    md: "text-sm py-2 px-4",
    lg: "text-base py-3 px-6",
  }

  // Variant styles
  const getVariantStyles = () => {
    if (disabled) {
      return {
        background: "rgba(67, 56, 202, 0.3)",
        border: "1px solid rgba(99, 102, 241, 0.3)",
        color: "rgba(199, 210, 254, 0.5)",
        boxShadow: "none",
      }
    }

    switch (variant) {
      case "primary":
        return {
          background: isPressed
            ? "linear-gradient(to bottom, #4338ca, #3730a3)"
            : isHovered
              ? "linear-gradient(to bottom, #6366f1, #4f46e5)"
              : "linear-gradient(to bottom, #4f46e5, #4338ca)",
          border: "1px solid rgba(99, 102, 241, 0.8)",
          color: "#e0e7ff",
          boxShadow: isHovered
            ? "0 4px 12px rgba(67, 56, 202, 0.5), 0 0 0 2px rgba(99, 102, 241, 0.2)"
            : "0 2px 6px rgba(67, 56, 202, 0.3)",
        }
      case "secondary":
        return {
          background: isPressed
            ? "rgba(67, 56, 202, 0.3)"
            : isHovered
              ? "rgba(67, 56, 202, 0.4)"
              : "rgba(67, 56, 202, 0.2)",
          border: "1px solid rgba(99, 102, 241, 0.5)",
          color: "#c7d2fe",
          boxShadow: isHovered
            ? "0 4px 12px rgba(67, 56, 202, 0.3), 0 0 0 2px rgba(99, 102, 241, 0.1)"
            : "0 2px 6px rgba(67, 56, 202, 0.2)",
        }
      case "outline":
        return {
          background: isPressed ? "rgba(67, 56, 202, 0.1)" : isHovered ? "rgba(67, 56, 202, 0.05)" : "transparent",
          border: "1px solid rgba(99, 102, 241, 0.7)",
          color: "#6366f1",
          boxShadow: isHovered ? "0 0 0 2px rgba(99, 102, 241, 0.2)" : "none",
        }
      case "danger":
        return {
          background: isPressed
            ? "linear-gradient(to bottom, #b91c1c, #991b1b)"
            : isHovered
              ? "linear-gradient(to bottom, #ef4444, #dc2626)"
              : "linear-gradient(to bottom, #dc2626, #b91c1c)",
          border: "1px solid rgba(239, 68, 68, 0.8)",
          color: "#fee2e2",
          boxShadow: isHovered
            ? "0 4px 12px rgba(185, 28, 28, 0.5), 0 0 0 2px rgba(239, 68, 68, 0.2)"
            : "0 2px 6px rgba(185, 28, 28, 0.3)",
        }
      default:
        return {}
    }
  }

  // Trigger random glitch effects
  useEffect(() => {
    if (!isHovered || !unstable) return

    const triggerRandomGlitch = () => {
      if (Math.random() < 0.3) {
        setIsGlitching(true)

        if (glitchTimeoutRef.current) {
          clearTimeout(glitchTimeoutRef.current)
        }

        glitchTimeoutRef.current = setTimeout(
          () => {
            setIsGlitching(false)
          },
          100 + Math.random() * 300,
        )
      }

      const nextGlitch = 500 + Math.random() * 2000
      setTimeout(triggerRandomGlitch, nextGlitch)
    }

    const timeout = setTimeout(triggerRandomGlitch, 300)

    return () => {
      clearTimeout(timeout)
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current)
      }
    }
  }, [isHovered, unstable])

  // Create void tear effect
  const createVoidTear = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return

    const button = buttonRef.current
    const rect = button.getBoundingClientRect()

    // Create tear at click position
    const tear = document.createElement("div")
    tear.className = "absolute rounded-full pointer-events-none"

    const size = 5 + Math.random() * 20
    tear.style.width = `${size}px`
    tear.style.height = `${size}px`

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    tear.style.left = `${x - size / 2}px`
    tear.style.top = `${y - size / 2}px`

    // Void tear appearance
    tear.style.background =
      "radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, rgba(79, 70, 229, 0.4) 70%, transparent 100%)"
    tear.style.boxShadow = "0 0 10px rgba(99, 102, 241, 0.5)"

    // Add to button
    button.appendChild(tear)

    // Animate
    const duration = 1000

    let startTime: number | null = null

    const animateTear = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = elapsed / duration

      if (progress < 1) {
        // Grow and fade
        const scale = 1 + progress * 5
        const opacity = 1 - progress

        tear.style.transform = `scale(${scale})`
        tear.style.opacity = opacity.toString()

        requestAnimationFrame(animateTear)
      } else {
        // Remove tear when animation completes
        if (button.contains(tear)) {
          button.removeChild(tear)
        }
      }
    }

    requestAnimationFrame(animateTear)
  }

  // Add void particles on hover
  useEffect(() => {
    if (!isHovered || !buttonRef.current) return

    const button = buttonRef.current
    const buttonRect = button.getBoundingClientRect()

    const createVoidParticle = () => {
      if (!button) return

      const particle = document.createElement("span")
      particle.className = "absolute pointer-events-none"

      // Random particle shape
      const particleType = Math.floor(Math.random() * 3)
      const size = 2 + Math.random() * 4

      particle.style.width = `${size}px`
      particle.style.height = `${size}px`

      if (particleType === 0) {
        particle.style.borderRadius = "50%"
        particle.style.backgroundColor = "rgba(129, 140, 248, 0.7)"
      } else if (particleType === 1) {
        particle.style.borderRadius = "2px"
        particle.style.backgroundColor = "rgba(99, 102, 241, 0.7)"
      } else {
        particle.style.width = `${size * 1.5}px`
        particle.style.height = `${size * 0.5}px`
        particle.style.backgroundColor = "rgba(79, 70, 229, 0.7)"
      }

      // Position at random point on button edge
      const side = Math.floor(Math.random() * 4)
      let x, y

      switch (side) {
        case 0: // top
          x = Math.random() * buttonRect.width
          y = 0
          break
        case 1: // right
          x = buttonRect.width
          y = Math.random() * buttonRect.height
          break
        case 2: // bottom
          x = Math.random() * buttonRect.width
          y = buttonRect.height
          break
        case 3: // left
          x = 0
          y = Math.random() * buttonRect.height
          break
        default:
          x = 0
          y = 0
      }

      particle.style.left = `${x}px`
      particle.style.top = `${y}px`

      // Add to button
      button.appendChild(particle)

      // Animate
      const angle = Math.random() * Math.PI * 2
      const distance = 20 + Math.random() * 30
      const duration = 1000 + Math.random() * 1000

      let startTime: number | null = null

      const animateParticle = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = elapsed / duration

        if (progress < 1) {
          const easeOutProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic

          // Move outward
          const currentDistance = distance * easeOutProgress
          const newX = x + Math.cos(angle) * currentDistance
          const newY = y + Math.sin(angle) * currentDistance

          // Fade out
          const opacity = 1 - easeOutProgress

          particle.style.transform = `translate(${newX - x}px, ${newY - y}px) rotate(${progress * 360}deg)`
          particle.style.opacity = opacity.toString()

          requestAnimationFrame(animateParticle)
        } else {
          // Remove particle when animation completes
          if (button.contains(particle)) {
            button.removeChild(particle)
          }
        }
      }

      requestAnimationFrame(animateParticle)
    }

    // Create particles periodically
    const particleInterval = setInterval(createVoidParticle, 100)

    return () => {
      clearInterval(particleInterval)
      // Clean up any remaining particles
      if (button) {
        const particles = button.querySelectorAll("span:not(.button-text)")
        particles.forEach((particle) => {
          if (button.contains(particle)) {
            button.removeChild(particle)
          }
        })
      }
    }
  }, [isHovered])

  return (
    <button
      ref={buttonRef}
      onClick={(e) => {
        if (!disabled) {
          createVoidTear(e)
          if (onClick) onClick()
        }
      }}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
        setIsGlitching(false)
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`
        relative overflow-hidden rounded-md transition-all duration-300
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${isGlitching ? styles.voidGlitch : ""}
        ${className}
      `}
      style={{
        ...getVariantStyles(),
        transform: isPressed
          ? "translateY(1px)"
          : isGlitching
            ? `translateX(${Math.random() * 4 - 2}px)`
            : "translateY(0)",
        transition: "all 0.2s ease",
      }}
    >
      {/* Void border decoration */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          opacity: isHovered ? 0.8 : 0.4,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          className="absolute top-0 left-0 w-3 h-3"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 Q6,2 6,6 Q2,6 0,0 Z' fill='rgba(129, 140, 248, 0.6)'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="absolute top-0 right-0 w-3 h-3"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12,0 Q6,2 6,6 Q10,6 12,0 Z' fill='rgba(129, 140, 248, 0.6)'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-3 h-3"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,12 Q6,10 6,6 Q2,6 0,12 Z' fill='rgba(129, 140, 248, 0.6)'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-3 h-3"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12,12 Q6,10 6,6 Q10,6 12,12 Z' fill='rgba(129, 140, 248, 0.6)'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      {/* Button content */}
      <div className="relative flex items-center justify-center space-x-2">
        {icon && <span className="button-icon">{icon}</span>}
        <span className="button-text">{children}</span>
      </div>

      {/* Void energy effect on hover */}
      {!disabled && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}

      {/* Dimensional tear lines */}
      {isHovered && !disabled && (
        <>
          <div
            className={`absolute top-0 left-0 w-full h-0.5 bg-indigo-400 ${styles.voidTearAppear}`}
            style={{ opacity: 0.7 }}
          ></div>
          <div
            className={`absolute top-0 right-0 w-0.5 h-full bg-indigo-400 ${styles.voidTearAppear}`}
            style={{ animationDelay: "0.1s", opacity: 0.7 }}
          ></div>
          <div
            className={`absolute bottom-0 right-0 w-full h-0.5 bg-indigo-400 ${styles.voidTearAppear}`}
            style={{ animationDelay: "0.2s", opacity: 0.7 }}
          ></div>
          <div
            className={`absolute bottom-0 left-0 w-0.5 h-full bg-indigo-400 ${styles.voidTearAppear}`}
            style={{ animationDelay: "0.3s", opacity: 0.7 }}
          ></div>
        </>
      )}
    </button>
  )
}
