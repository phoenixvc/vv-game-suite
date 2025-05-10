"use client"

import React from "react"
import ErrorBoundary from "../error-boundary"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { logError } from "@/lib/error-logger"

interface AnimationErrorBoundaryProps {
  children: React.ReactNode
  animationName?: string
  fallbackStatic?: React.ReactNode
}

export function AnimationErrorBoundary({
  children,
  animationName = "Animation",
  fallbackStatic,
}: AnimationErrorBoundaryProps) {
  const [isPaused, setIsPaused] = React.useState(true)

  const handleError = (error: Error) => {
    logError({
      message: error.message,
      stack: error.stack,
      componentName: `${animationName}Animation`,
      severity: "low",
      metadata: {
        animationName,
        browserInfo: navigator.userAgent,
      },
    })
  }

  const fallbackUI = (
    <div className="relative">
      {fallbackStatic ? (
        // If a static fallback is provided, show it
        <div className="relative">
          {fallbackStatic}
          <div className="absolute bottom-2 right-2 bg-gray-800/70 rounded-full p-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-white"
              onClick={() => window.location.reload()}
              title="Reload animation"
            >
              <Play className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        // Default fallback
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center space-y-2 min-h-[100px]">
          <p className="text-sm text-gray-600 dark:text-gray-300">Animation disabled</p>
          <Button size="sm" variant="outline" className="flex items-center" onClick={() => window.location.reload()}>
            <Play className="h-3 w-3 mr-1" />
            Reload animation
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <ErrorBoundary componentName={`${animationName}Animation`} onError={handleError} fallback={fallbackUI}>
      {children}
    </ErrorBoundary>
  )
}
