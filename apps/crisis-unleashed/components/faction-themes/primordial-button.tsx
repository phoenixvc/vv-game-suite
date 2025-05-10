"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface PrimordialButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
  fullWidth?: boolean
  icon?: React.ReactNode
}

export const PrimordialButton: React.FC<PrimordialButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  fullWidth = false,
  icon,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const rippleRef = useRef<HTMLDivElement>(null)

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
        background: "rgba(22, 101, 52, 0.3)",
        border: "1px solid rgba(34, 197, 94, 0.3)",
        color: "rgba(167, 243, 208, 0.5)",
        boxShadow: "none",
      }
    }

    switch (variant) {
      case "primary":
        return {
          background: isPressed
            ? "linear-gradient(to bottom, #166534, #14532d)"
            : isHovered
              ? "linear-gradient(to bottom, #22c55e, #16a34a)"
              : "linear-gradient(to bottom, #16a34a, #166534)",
          border: "1px solid rgba(34, 197, 94, 0.8)",
          color: "#ecfdf5",
          boxShadow: isHovered
            ? "0 4px 12px rgba(22, 101, 52, 0.5), 0 0 0 2px rgba(34, 197, 94, 0.2)"
            : "0 2px 6px rgba(22, 101, 52, 0.3)",
        }
      case "secondary":
        return {
          background: isPressed
            ? "rgba(22, 101, 52, 0.3)"
            : isHovered
              ? "rgba(22, 101, 52, 0.4)"
              : "rgba(22, 101, 52, 0.2)",
          border: "1px solid rgba(34, 197, 94, 0.5)",
          color: "#a7f3d0",
          boxShadow: isHovered
            ? "0 4px 12px rgba(22, 101, 52, 0.3), 0 0 0 2px rgba(34, 197, 94, 0.1)"
            : "0 2px 6px rgba(22, 101, 52, 0.2)",
        }
      case "outline":
        return {
          background: isPressed ? "rgba(22, 101, 52, 0.1)" : isHovered ? "rgba(22, 101, 52, 0.05)" : "transparent",
          border: "1px solid rgba(34, 197, 94, 0.7)",
          color: "#22c55e",
          boxShadow: isHovered ? "0 0 0 2px rgba(34, 197, 94, 0.2)" : "none",
        }
      default:
        return {}
    }
  }

  // Create ripple effect
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !rippleRef.current || !buttonRef.current) return

    const button = buttonRef.current
    const rippleContainer = rippleRef.current

    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const radius = diameter / 2

    // Clear existing ripples
    rippleContainer.innerHTML = ""

    const ripple = document.createElement("span")
    ripple.style.width = ripple.style.height = `${diameter}px`

    const rect = button.getBoundingClientRect()
    const left = event.clientX - rect.left - radius
    const top = event.clientY - rect.top - radius

    ripple.style.left = `${left}px`
    ripple.style.top = `${top}px`

    ripple.className = "absolute rounded-full pointer-events-none"
    ripple.style.backgroundColor = "rgba(167, 243, 208, 0.3)"
    ripple.style.transform = "scale(0)"
    ripple.style.animation = "ripple 600ms linear"

    rippleContainer.appendChild(ripple)

    // Add keyframes for ripple animation if not already added
    if (!document.querySelector("#primordial-ripple-keyframes")) {
      const style = document.createElement("style")
      style.id = "primordial-ripple-keyframes"
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `
      document.head.appendChild(style)
    }

    setTimeout(() => {
      if (rippleContainer.contains(ripple)) {
        rippleContainer.removeChild(ripple)
      }
    }, 600)
  }

  // Add leaf particles on hover
  useEffect(() => {
    if (!isHovered || !buttonRef.current) return

    const button = buttonRef.current
    const buttonRect = button.getBoundingClientRect()

    const createLeafParticle = () => {
      if (!button) return

      const particle = document.createElement("span")
      particle.className = "absolute pointer-events-none"

      // Random leaf shape
      const leafType = Math.floor(Math.random() * 3)
      const size = 4 + Math.random() * 6

      particle.style.width = `${size}px`
      particle.style.height = `${size}px`

      if (leafType === 0) {
        particle.style.borderRadius = "50% 50% 50% 0"
        particle.style.backgroundColor = "rgba(167, 243, 208, 0.6)"
      } else if (leafType === 1) {
        particle.style.borderRadius = "50% 0"
        particle.style.backgroundColor = "rgba(134, 239, 172, 0.6)"
      } else {
        particle.style.borderRadius = "50%"
        particle.style.backgroundColor = "rgba(74, 222, 128, 0.6)"
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
    const particleInterval = setInterval(createLeafParticle, 200)

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
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onMouseDown={(e) => {
        setIsPressed(true)
        createRipple(e)
      }}
      onMouseUp={() => setIsPressed(false)}
      className={`
        relative overflow-hidden rounded-md transition-all duration-300
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      style={{
        ...getVariantStyles(),
        transform: isPressed ? "translateY(1px)" : "translateY(0)",
        transition: "all 0.2s ease",
      }}
    >
      {/* Leaf border decoration */}
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
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 Q6,2 6,6 Q2,6 0,0 Z' fill='rgba(167, 243, 208, 0.6)'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="absolute top-0 right-0 w-3 h-3"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12,0 Q6,2 6,6 Q10,6 12,0 Z' fill='rgba(167, 243, 208, 0.6)'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-3 h-3"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,12 Q6,10 6,6 Q2,6 0,12 Z' fill='rgba(167, 243, 208, 0.6)'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-3 h-3"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12,12 Q6,10 6,6 Q10,6 12,12 Z' fill='rgba(167, 243, 208, 0.6)'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      {/* Ripple container */}
      <div ref={rippleRef} className="absolute inset-0 overflow-hidden pointer-events-none" />

      {/* Button content */}
      <div className="relative flex items-center justify-center space-x-2">
        {icon && <span className="button-icon">{icon}</span>}
        <span className="button-text">{children}</span>
      </div>

      {/* Glow effect on hover */}
      {!disabled && variant === "primary" && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle at center, rgba(74, 222, 128, 0.3) 0%, transparent 70%)",
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}
    </button>
  )
}

export default PrimordialButton
