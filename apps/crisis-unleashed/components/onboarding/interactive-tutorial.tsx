"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, RefreshCw } from "lucide-react"
import { useAccessibility } from "@/contexts/accessibility-context"
import { motion, AnimatePresence } from "framer-motion"

interface TutorialStep {
  title: string
  content: React.ReactNode
  interaction?: React.ReactNode
}

interface InteractiveTutorialProps {
  steps: TutorialStep[]
  title: string
  className?: string
}

export function InteractiveTutorial({ steps, title, className = "" }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const { reducedMotion } = useAccessibility()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setCompleted(false)
  }

  return (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-cyan-400">{title}</h3>
        <div className="text-sm text-gray-400">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!completed ? (
          <motion.div
            key={`step-${currentStep}`}
            initial={reducedMotion ? {} : { opacity: 0 }}
            animate={reducedMotion ? {} : { opacity: 1 }}
            exit={reducedMotion ? {} : { opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            className="p-6"
          >
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3">{steps[currentStep].title}</h4>
              <div className="text-gray-300">{steps[currentStep].content}</div>
            </div>

            {steps[currentStep].interaction && (
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-6">
                {steps[currentStep].interaction}
              </div>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-gray-600"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep ? "bg-cyan-500" : "bg-gray-600"
                    } transition-colors`}
                  />
                ))}
              </div>
              <Button onClick={handleNext} className="bg-cyan-600 hover:bg-cyan-700">
                {currentStep === steps.length - 1 ? "Complete" : "Next"}
                {currentStep !== steps.length - 1 ? (
                  <ChevronRight className="h-4 w-4 ml-1" />
                ) : (
                  <Play className="h-4 w-4 ml-1" />
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="completed"
            initial={reducedMotion ? {} : { opacity: 0 }}
            animate={reducedMotion ? {} : { opacity: 1 }}
            className="p-6 text-center"
          >
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h4 className="text-lg font-medium mb-2 text-cyan-400">Tutorial Completed!</h4>
            <p className="text-gray-300 mb-6">
              You've completed the {title} tutorial. You can now apply these concepts in the game.
            </p>
            <Button onClick={handleRestart} variant="outline" className="border-gray-600">
              <RefreshCw className="h-4 w-4 mr-1" />
              Restart Tutorial
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
