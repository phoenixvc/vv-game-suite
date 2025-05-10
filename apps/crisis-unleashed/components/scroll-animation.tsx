"use client"

import { useRef, useEffect, type ReactNode } from "react"
import { motion, useAnimation } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface ScrollAnimationProps {
  children: ReactNode
  threshold?: number
  delay?: number
  duration?: number
  once?: boolean
}

export function ScrollAnimation({
  children,
  threshold = 0.1,
  delay = 0,
  duration = 0.5,
  once = true,
}: ScrollAnimationProps) {
  const controls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useScrollAnimation(ref, { threshold, once })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    } else if (!once) {
      controls.start("hidden")
    }
  }, [controls, isInView, once])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            delay,
            ease: "easeOut",
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollAnimation
