"use client"

import type React from "react"
import ErrorBoundary from "../error-boundary"
import { Button } from "@/components/ui/button"
import { Home, Menu } from "lucide-react"
import Link from "next/link"
import { logError } from "@/lib/error-logger"

interface NavigationErrorBoundaryProps {
  children: React.ReactNode
}

export function NavigationErrorBoundary({ children }: NavigationErrorBoundaryProps) {
  const handleError = (error: Error) => {
    logError({
      message: error.message,
      stack: error.stack,
      componentName: "Navigation",
      severity: "high", // Navigation is critical for user experience
    })
  }

  const fallbackUI = (
    <div className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold flex items-center">
        <Home className="mr-2 h-5 w-5" />
        Crisis Unleashed
      </Link>

      <div className="flex items-center space-x-4">
        <span className="text-red-400 text-sm">Navigation error</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="text-white border-white hover:bg-gray-800"
        >
          <Menu className="h-4 w-4 mr-2" />
          Reload
        </Button>
      </div>
    </div>
  )

  return (
    <ErrorBoundary componentName="Navigation" onError={handleError} fallback={fallbackUI}>
      {children}
    </ErrorBoundary>
  )
}
