"use client"

import type React from "react"

import { useState } from "react"
import styles from "../../styles/animations.module.css"

interface EclipsedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline" | "danger"
  size?: "sm" | "md" | "lg"
  className?: string
  disabled?: boolean
  showShadowEffect?: boolean
}

/**
 * Renders a customizable button with multiple visual variants, sizes, and interactive effects.
 *
 * The button supports primary, secondary, outline, and danger variants, as well as small, medium, and large sizes. It provides visual feedback for hover, press, and click states, including optional shadow and accent effects. When hovered, corner accents appear, and for the primary variant, a decorative dagger icon is shown. The button can be disabled to prevent interaction.
 *
 * @param children - Content to display inside the button.
 * @param onClick - Function to call when the button is clicked.
 * @param variant - Visual style of the button; defaults to "primary".
 * @param size - Size of the button; defaults to "md".
 * @param className - Additional CSS classes to apply.
 * @param disabled - Whether the button is disabled; defaults to false.
 * @param showShadowEffect - Whether to enable the shadow effect; defaults to true.
 *
 * @returns A styled button element with interactive visual effects.
 */
export function EclipsedButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  showShadowEffect = true,
}: EclipsedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [showShadow, setShowShadow] = useState(false)

  // Variant styles
  const variantStyles = {
    primary: "bg-gray-800 hover:bg-gray-700 text-gray-100 border-gray-600",
    secondary: "bg-gray-900 hover:bg-gray-800 text-gray-300 border-gray-700",
    outline: "bg-transparent hover:bg-gray-800 text-gray-300 border-gray-600",
    danger: "bg-red-900 hover:bg-red-800 text-gray-100 border-red-700",
  }

  // Size styles
  const sizeStyles = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-2",
    lg: "text-base px-4 py-2",
  }

  // Handle mouse events
  const handleMouseEnter = () => {
    if (disabled) return
    setIsHovered(true)
    if (showShadowEffect) {
      setTimeout(() => setShowShadow(true), 200)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsPressed(false)
    setShowShadow(false)
  }

  const handleMouseDown = () => {
    if (disabled) return
    setIsPressed(true)
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  const handleClick = () => {
    if (disabled || !onClick) return
    onClick()

    // Show shadow effect on click
    if (showShadowEffect) {
      setShowShadow(true)
      setTimeout(() => setShowShadow(false), 500)
    }
  }

  return (
    <button
      className={`
        relative overflow-hidden rounded border transition-all duration-200
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
        ${className}
      `}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        transform: isPressed ? "translateY(1px)" : "none",
      }}
    >
      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center">{children}</div>

      {/* Shadow effect */}
      {showShadow && showShadowEffect && (
        <div className={`absolute inset-0 bg-black bg-opacity-30 ${styles.shadowReveal}`}></div>
      )}

      {/* Corner accents that appear on hover */}
      {isHovered && (
        <>
          <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-gray-400"></div>
          <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-gray-400"></div>
          <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-gray-400"></div>
          <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-gray-400"></div>
        </>
      )}

      {/* Dagger icon that appears on hover for primary variant */}
      {isHovered && variant === "primary" && (
        <div
          className={`absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-6 ${styles.shadowAppear}`}
          style={{
            clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
            background: "rgba(255, 255, 255, 0.1)",
            transform: "translateY(-50%) rotate(90deg)",
          }}
        ></div>
      )}
    </button>
  )
}

export default EclipsedButton
