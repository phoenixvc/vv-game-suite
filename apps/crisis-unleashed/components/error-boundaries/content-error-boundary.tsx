"use client"

import type React from "react"
import ErrorBoundary from "../error-boundary"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { logError } from "@/lib/error-logger"

interface ContentErrorBoundaryProps {
  children: React.ReactNode
  contentName?: string
}

/**
 * Wraps child components with an error boundary that logs errors and displays a fallback UI if rendering fails.
 *
 * @param children - The React nodes to render within the error boundary.
 * @param contentName - Optional name for the content section; used in error logging and fallback UI.
 *
 * @remark
 * When an error occurs in the children, the error is logged with a severity of "medium" and a user-friendly fallback UI is shown, offering options to reload the page or go back.
 */
export function ContentErrorBoundary({ children, contentName = "Content" }: ContentErrorBoundaryProps) {
  const handleError = (error: Error) => {
    logError({
      message: error.message,
      stack: error.stack,
      componentName: `${contentName}Section`,
      severity: "medium",
    })
  }

  const fallbackUI = (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md text-center space-y-4 min-h-[300px]">
      <AlertTriangle className="h-16 w-16 text-amber-500" />
      <h2 className="text-2xl font-bold">Content Unavailable</h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-md">
        We're having trouble displaying this content. Our team has been notified of the issue.
      </p>
      <div className="flex space-x-4 mt-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
        <Button variant="default" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  )

  return (
    <ErrorBoundary componentName={contentName} onError={handleError} fallback={fallbackUI}>
      {children}
    </ErrorBoundary>
  )
}
