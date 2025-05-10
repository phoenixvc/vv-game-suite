"use client"

import type React from "react"
import { useState } from "react"
import styles from "../../styles/animations.module.css"

interface TitanbornButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline" | "danger"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
}

export function TitanbornButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  icon,
}: TitanbornButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  // Variant styles
  const variantStyles = {
    primary: {
      base: "bg-amber-800 border-amber-600 text-amber-100 hover:bg-amber-700",
      pressed: "bg-amber-900",
      disabled: "bg-stone-700 border-stone-600 text-stone-400",
    },
    secondary: {
      base: "bg-stone-700 border-stone-600 text-stone-200 hover:bg-stone-600",
      pressed: "bg-stone-800",
      disabled: "bg-stone-800 border-stone-700 text-stone-500",
    },
    outline: {
      base: "bg-transparent border-amber-700 text-amber-300 hover:bg-amber-900/20",
      pressed: "bg-amber-900/30",
      disabled: "bg-transparent border-stone-700 text-stone-500",
    },
    danger: {
      base: "bg-red-800 border-red-600 text-red-100 hover:bg-red-700",
      pressed: "bg-red-900",
      disabled: "bg-stone-700 border-stone-600 text-stone-400",
    },
  }

  // Size styles
  const sizeStyles = {
    sm: "text-xs py-1 px-2",
    md: "text-sm py-2 px-4",
    lg: "text-base py-3 px-6",
  }

  // Get current styles based on state
  const getCurrentStyles = () => {
    if (disabled) return variantStyles[variant].disabled
    if (isPressed) return variantStyles[variant].pressed
    return variantStyles[variant].base
  }

  return (
    <button
      className={`
        relative overflow-hidden
        border-2 rounded
        font-bold transition-all duration-200
        ${sizeStyles[size]}
        ${getCurrentStyles()}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{
        transform: isPressed && !disabled ? "translateY(2px)" : "translateY(0)",
      }}
    >
      {/* Stone texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='0.2' fillRule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Metal shine effect */}
      <div
        className={`absolute inset-0 pointer-events-none ${styles.metalShine}`}
        style={{ opacity: disabled ? 0 : 0.1 }}
      />

      {/* Button content */}
      <div className="relative flex items-center justify-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </div>

      {/* Forge glow effect on press */}
      {isPressed && !disabled && (
        <div
          className={`absolute inset-0 bg-gradient-to-t from-orange-500/30 to-transparent pointer-events-none ${styles.forgeGlow}`}
        />
      )}

      {/* Metal rivets in corners */}
      <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-amber-500 opacity-70" />
      <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-amber-500 opacity-70" />
      <div className="absolute bottom-0.5 left-0.5 w-1 h-1 rounded-full bg-amber-500 opacity-70" />
      <div className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-amber-500 opacity-70" />
    </button>
  )
}

export default TitanbornButton
