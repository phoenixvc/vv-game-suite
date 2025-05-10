"use client"

import type React from "react"

import { useState } from "react"
import styles from "@/styles/animations.module.css"

export default function CyberneticButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  disabled = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "primary" | "secondary" | "danger"
  disabled?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // Determine colors based on variant
  const getColors = () => {
    switch (variant) {
      case "primary":
        return {
          bg: "bg-cyan-900",
          border: "border-cyan-700",
          text: "text-cyan-300",
          hover: "hover:bg-cyan-800",
          glow: "shadow-cyan-500/20",
        }
      case "secondary":
        return {
          bg: "bg-slate-800",
          border: "border-slate-700",
          text: "text-slate-300",
          hover: "hover:bg-slate-700",
          glow: "shadow-slate-500/10",
        }
      case "danger":
        return {
          bg: "bg-red-900",
          border: "border-red-700",
          text: "text-red-300",
          hover: "hover:bg-red-800",
          glow: "shadow-red-500/20",
        }
      default:
        return {
          bg: "bg-cyan-900",
          border: "border-cyan-700",
          text: "text-cyan-300",
          hover: "hover:bg-cyan-800",
          glow: "shadow-cyan-500/20",
        }
    }
  }

  const colors = getColors()

  return (
    <button
      className={`relative ${colors.bg} ${colors.border} ${colors.text} ${
        !disabled ? colors.hover : "opacity-50 cursor-not-allowed"
      } border rounded-md px-4 py-2 font-mono transition-all duration-200 overflow-hidden ${
        isHovered && !disabled ? `shadow-lg ${colors.glow}` : ""
      } ${isPressed && !disabled ? "scale-95" : ""} ${className}`}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={disabled}
    >
      {/* Button Content */}
      <div className="relative z-10 flex items-center justify-center gap-2">{children}</div>

      {/* Animated Border */}
      {isHovered && !disabled && (
        <>
          <div
            className={`absolute top-0 left-0 w-full h-0.5 ${
              variant === "primary" ? "bg-cyan-400" : variant === "danger" ? "bg-red-400" : "bg-slate-400"
            } ${styles.slideInRight}`}
          ></div>
          <div
            className={`absolute top-0 right-0 w-0.5 h-full ${
              variant === "primary" ? "bg-cyan-400" : variant === "danger" ? "bg-red-400" : "bg-slate-400"
            } ${styles.slideInRight}`}
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className={`absolute bottom-0 right-0 w-full h-0.5 ${
              variant === "primary" ? "bg-cyan-400" : variant === "danger" ? "bg-red-400" : "bg-slate-400"
            } ${styles.slideInLeft}`}
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className={`absolute bottom-0 left-0 w-0.5 h-full ${
              variant === "primary" ? "bg-cyan-400" : variant === "danger" ? "bg-red-400" : "bg-slate-400"
            } ${styles.slideInLeft}`}
            style={{ animationDelay: "0.3s" }}
          ></div>
        </>
      )}

      {/* Scan Line Effect */}
      {isHovered && !disabled && (
        <div
          className={`absolute inset-0 bg-gradient-to-b from-transparent via-${
            variant === "primary" ? "cyan" : variant === "danger" ? "red" : "slate"
          }-400/10 to-transparent ${styles.securityScan}`}
        ></div>
      )}
    </button>
  )
}
