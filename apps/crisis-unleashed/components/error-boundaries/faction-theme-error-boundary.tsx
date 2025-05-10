"use client"

import type React from "react"
import ErrorBoundary from "../error-boundary"
import { Button } from "@/components/ui/button"
import { Palette, RefreshCw } from "lucide-react"
import { logError } from "@/lib/error-logger"
import { useTheme } from "@/contexts/theme-context"

interface FactionThemeErrorBoundaryProps {
  children: React.ReactNode
  themeName?: string
  fallbackToDefault?: boolean
}

/**
 * Provides an error boundary for theme-related errors, logging issues and optionally reverting to the default theme with a user-friendly fallback UI.
 *
 * Wraps child components to catch and handle errors that occur during theme loading or rendering. If an error is detected, it logs the error details, optionally switches to the default theme, and displays a fallback interface allowing users to retry or manually switch themes.
 *
 * @param children - React nodes to render within the error boundary.
 * @param themeName - Optional name of the theme associated with this boundary.
 * @param fallbackToDefault - Whether to automatically switch to the default theme on error (default: true).
 */
export function FactionThemeErrorBoundary({
  children,
  themeName,
  fallbackToDefault = true,
}: FactionThemeErrorBoundaryProps) {
  const { setCurrentTheme, currentTheme } = useTheme()

  const actualThemeName = themeName || currentTheme || "unknown"

  const handleError = (error: Error) => {
    logError({
      message: error.message,
      stack: error.stack,
      componentName: `${actualThemeName}Theme`,
      severity: "medium",
      metadata: {
        themeName: actualThemeName,
      },
    })

    // If fallbackToDefault is true, automatically switch to default theme
    if (fallbackToDefault && currentTheme !== "default") {
      setCurrentTheme("default")
    }
  }

  const fallbackUI = (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md text-center space-y-3">
      <Palette className="h-12 w-12 text-amber-500" />
      <h3 className="text-xl font-bold">Theme Error</h3>
      <p className="text-gray-600 dark:text-gray-300 max-w-md">
        The "{actualThemeName}" theme couldn't be loaded correctly. We've switched to a default theme.
      </p>
      <div className="flex space-x-3 mt-2">
        <Button variant="outline" onClick={() => window.location.reload()} className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
        {currentTheme !== "default" && (
          <Button variant="default" onClick={() => setCurrentTheme("default")}>
            Use Default Theme
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <ErrorBoundary componentName={`${actualThemeName}Theme`} onError={handleError} fallback={fallbackUI}>
      {children}
    </ErrorBoundary>
  )
}
