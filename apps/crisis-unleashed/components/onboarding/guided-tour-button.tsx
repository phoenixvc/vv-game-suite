"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAccessibility } from "@/contexts/accessibility-context"

interface GuidedTourButtonProps {
  isFirstVisit?: boolean
}

export function GuidedTourButton({ isFirstVisit = false }: GuidedTourButtonProps) {
  const [showPulse, setShowPulse] = useState(isFirstVisit)
  const [showLabel, setShowLabel] = useState(isFirstVisit)
  const { reducedMotion } = useAccessibility()

  useEffect(() => {
    // Listen for custom event to open guided tour
    const handleOpenGuidedTour = () => {
      // This would trigger the guided tour to open
      document.dispatchEvent(new CustomEvent("open-guided-tour"))
    }

    window.addEventListener("open-guided-tour", handleOpenGuidedTour)
    return () => {
      window.removeEventListener("open-guided-tour", handleOpenGuidedTour)
    }
  }, [])

  useEffect(() => {
    if (isFirstVisit) {
      // Keep pulse animation for 30 seconds for first-time visitors
      const timer = setTimeout(() => {
        setShowPulse(false)
      }, 30000)
      return () => clearTimeout(timer)
    }
  }, [isFirstVisit])

  const handleClick = () => {
    // Trigger the guided tour to open
    document.dispatchEvent(new CustomEvent("open-guided-tour"))
    setShowPulse(false)
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap"
          >
            <div className="bg-gray-800 text-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium">
              Take the guided tour
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={handleClick}
        className={`relative rounded-full ${
          isFirstVisit
            ? "bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white"
            : "bg-gray-800 hover:bg-gray-700 text-gray-200"
        } shadow-lg`}
        size="icon"
        aria-label="Open guided tour"
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => !isFirstVisit && setShowLabel(false)}
      >
        {showPulse && !reducedMotion && (
          <span className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-75"></span>
        )}
        <BookOpen className="h-5 w-5" />
      </Button>
    </div>
  )
}

export default GuidedTourButton
