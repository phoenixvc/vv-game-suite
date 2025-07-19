"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface EnhancedLoadingProps {
  isLoading?: boolean
  error?: string | null
  retry?: () => void
  loadingText?: string
  className?: string
  variant?: "spinner" | "skeleton" | "pulse" | "dots"
  size?: "sm" | "md" | "lg"
}

export function EnhancedLoading({
  isLoading = true,
  error = null,
  retry,
  loadingText = "Loading...",
  className,
  variant = "spinner",
  size = "md"
}: EnhancedLoadingProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (!isLoading || variant !== "dots") return

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isLoading, variant])

  const sizeClasses = {
    sm: {
      spinner: "h-4 w-4",
      skeleton: "h-4",
      text: "text-sm",
      container: "p-2"
    },
    md: {
      spinner: "h-8 w-8",
      skeleton: "h-8",
      text: "text-base",
      container: "p-4"
    },
    lg: {
      spinner: "h-12 w-12",
      skeleton: "h-12",
      text: "text-lg",
      container: "p-6"
    }
  }

  if (error) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center gap-4",
        sizeClasses[size].container,
        className
      )}>
        <div className="error-state">
          <svg 
            className="h-5 w-5 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <div>
            <h3 className="font-medium">Loading Error</h3>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
        {retry && (
          <button
            onClick={retry}
            className="btn-primary"
            aria-label="Retry loading"
          >
            <svg 
              className="h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            Try Again
          </button>
        )}
      </div>
    )
  }

  if (!isLoading) return null

  const renderLoadingVariant = () => {
    switch (variant) {
      case "spinner":
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <div 
              className={cn(
                "loading-spinner border-2 border-blue-500/30 border-t-blue-500",
                sizeClasses[size].spinner
              )}
              role="status"
              aria-label="Loading"
            />
            <span className={cn(sizeClasses[size].text, "text-gray-300")}>
              {loadingText}
            </span>
          </div>
        )

      case "skeleton":
        return (
          <div className="space-y-4 w-full">
            <div className={cn("loading-skeleton w-3/4", sizeClasses[size].skeleton)} />
            <div className={cn("loading-skeleton w-1/2", sizeClasses[size].skeleton)} />
            <div className={cn("loading-skeleton w-full", sizeClasses[size].skeleton)} />
            <div className={cn("loading-skeleton w-2/3", sizeClasses[size].skeleton)} />
          </div>
        )

      case "pulse":
        return (
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full bg-blue-500",
                  sizeClasses[size].spinner,
                  "animate-pulse"
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s"
                }}
              />
            ))}
          </div>
        )

      case "dots":
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full bg-blue-500",
                    "animate-bounce"
                  )}
                  style={{
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            <span className={cn(sizeClasses[size].text, "text-gray-300")}>
              {loadingText}{dots}
            </span>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div 
      className={cn(
        "flex items-center justify-center",
        sizeClasses[size].container,
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={loadingText}
    >
      {renderLoadingVariant()}
    </div>
  )
}

// Skeleton loading component for specific content types
export function ContentSkeleton({ 
  type = "text",
  lines = 3,
  className 
}: {
  type?: "text" | "card" | "avatar" | "image"
  lines?: number
  className?: string
}) {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className="space-y-4">
            <div className="loading-skeleton h-48 w-full" />
            <div className="space-y-2">
              <div className="loading-skeleton h-6 w-3/4" />
              <div className="loading-skeleton h-4 w-1/2" />
              <div className="loading-skeleton h-4 w-full" />
            </div>
          </div>
        )

      case "avatar":
        return (
          <div className="flex items-center space-x-4">
            <div className="loading-skeleton h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="loading-skeleton h-4 w-1/3" />
              <div className="loading-skeleton h-3 w-1/2" />
            </div>
          </div>
        )

      case "image":
        return <div className="loading-skeleton h-64 w-full" />

      default:
        return (
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "loading-skeleton h-4",
                  i === lines - 1 ? "w-2/3" : "w-full"
                )}
              />
            ))}
          </div>
        )
    }
  }

  return (
    <div className={cn("animate-pulse", className)}>
      {renderSkeleton()}
    </div>
  )
}

// Hook for managing loading states with error handling
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState)
  const [error, setError] = useState<string | null>(null)

  const startLoading = () => {
    setIsLoading(true)
    setError(null)
  }

  const stopLoading = () => {
    setIsLoading(false)
  }

  const setLoadingError = (errorMessage: string) => {
    setError(errorMessage)
    setIsLoading(false)
  }

  const retry = () => {
    setError(null)
    setIsLoading(true)
  }

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    retry
  }
}