"use client"

import type React from "react"
import ErrorBoundary from "../error-boundary"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import { logError } from "@/lib/error-logger"

interface CardCollectionErrorBoundaryProps {
  children: React.ReactNode
  collectionName?: string
  onReset?: () => void
}

export function CardCollectionErrorBoundary({
  children,
  collectionName = "Card Collection",
  onReset,
}: CardCollectionErrorBoundaryProps) {
  const handleError = (error: Error) => {
    logError({
      message: error.message,
      stack: error.stack,
      componentName: `${collectionName}Collection`,
      severity: "high",
      metadata: {
        collectionName,
      },
    })
  }

  const fallbackUI = (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md text-center space-y-4 min-h-[400px]">
      <AlertCircle className="h-16 w-16 text-amber-500" />
      <h2 className="text-2xl font-bold">Collection Unavailable</h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-md">
        We're having trouble loading your card collection. This could be due to corrupted data or a temporary system
        issue.
      </p>
      <div className="flex space-x-4 mt-4">
        <Button variant="outline" onClick={onReset || (() => window.location.reload())} className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reload Collection
        </Button>
        <Button
          variant="default"
          onClick={() => {
            // Clear local storage cache for collections if present
            try {
              const keys = Object.keys(localStorage)
              const collectionKeys = keys.filter((key) => key.includes("collection") || key.includes("cards"))
              collectionKeys.forEach((key) => localStorage.removeItem(key))
              window.location.reload()
            } catch (e) {
              window.location.reload()
            }
          }}
        >
          Reset Cache & Reload
        </Button>
      </div>
    </div>
  )

  return (
    <ErrorBoundary
      componentName={`${collectionName}Collection`}
      onError={handleError}
      fallback={fallbackUI}
      onReset={onReset}
    >
      {children}
    </ErrorBoundary>
  )
}
