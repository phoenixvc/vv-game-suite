"use client"

import { useEffect, useState, type RefObject } from "react"

export function useScrollAnimation(ref: RefObject<HTMLElement>, threshold = 0.1, once = true): boolean {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    // Validate threshold to ensure it's a finite number between 0 and 1
    const validThreshold =
      typeof threshold === "number" && isFinite(threshold) ? Math.min(Math.max(threshold, 0), 1) : 0.1 // Default to 0.1 if invalid

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when element enters viewport
        if (entry.isIntersecting) {
          setIsVisible(true)

          // If once is true, unobserve after becoming visible
          if (once) {
            observer.unobserve(entry.target)
          }
        } else if (!once) {
          // If once is false, update state when element leaves viewport
          setIsVisible(false)
        }
      },
      {
        root: null, // viewport
        rootMargin: "0px",
        threshold: validThreshold, // Use validated threshold
      },
    )

    observer.observe(ref.current)

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [ref, threshold, once])

  return isVisible
}
