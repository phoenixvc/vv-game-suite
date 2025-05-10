"use client"

import { useRef, useEffect, type ReactNode } from "react"
import styles from "@/styles/animations.module.css"

interface ParallaxElementProps {
  children: ReactNode
  speed?: number
  direction?: "normal" | "reverse"
  className?: string
}

export default function ParallaxElement({
  children,
  speed = 0.1,
  direction = "normal",
  className = "",
}: ParallaxElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const speedFactor = direction === "normal" ? speed : -speed

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return

      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      const xPos = (clientX / innerWidth - 0.5) * 2 // -1 to 1
      const yPos = (clientY / innerHeight - 0.5) * 2 // -1 to 1

      const translateX = xPos * 30 * speedFactor
      const translateY = yPos * 30 * speedFactor

      elementRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [speedFactor])

  return (
    <div ref={elementRef} className={`${styles.parallax} ${className}`}>
      {children}
    </div>
  )
}
