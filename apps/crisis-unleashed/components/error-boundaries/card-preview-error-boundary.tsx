"use client"

import type React from "react"
import ErrorBoundary from "../error-boundary"
import { Button } from "@/components/ui/button"
import { FileWarning, RefreshCw } from "lucide-react"
import { logError } from "@/lib/error-logger"
import type { CardData } from "@/lib/card-data"

interface CardPreviewErrorBoundaryProps {
  children: React.ReactNode
  cardData?: CardData
  onReset?: () => void
}

/**
 * Wraps child components with an error boundary for card preview rendering, displaying a fallback UI and logging error details if a rendering error occurs.
 *
 * If an error is caught, logs contextual information including card type, ID, and name (if available), and displays a user-friendly error message with an option to retry.
 *
 * @param children - The React nodes to render within the error boundary.
 * @param cardData - Optional card data used for error logging and fallback display.
 * @param onReset - Optional callback invoked when the user clicks "Retry"; if not provided, the page reloads.
 */
export function CardPreviewErrorBoundary({ children, cardData, onReset }: CardPreviewErrorBoundaryProps) {
  const handleError = (error: Error) => {
    logError({
      message: error.message,
      stack: error.stack,
      componentName: "CardPreview",
      severity: "medium",
      metadata: {
        cardType: cardData?.type || cardData?.cardType || "Unknown",
        cardId: cardData?.id || "Unknown",
        cardName: cardData?.name || "Unknown",
      },
    })
  }

  const fallbackUI = (
    <div className="relative flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md text-center space-y-3 min-h-[300px] min-w-[220px]">
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-50 rounded-lg"></div>

      <div className="relative z-10 flex flex-col items-center">
        <FileWarning className="h-12 w-12 text-amber-500 mb-2" />
        <h3 className="text-lg font-semibold">Card Preview Error</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs mb-3">
          We couldn't render this card preview. The card data may be corrupted.
        </p>

        {cardData && (
          <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-xs text-left mb-3 max-w-full overflow-hidden">
            <p className="truncate">
              <strong>Name:</strong> {cardData.name || "Unknown"}
            </p>
            <p className="truncate">
              <strong>Type:</strong> {cardData.type || cardData.cardType || "Unknown"}
            </p>
          </div>
        )}

        <Button
          size="sm"
          variant="outline"
          className="flex items-center"
          onClick={onReset || (() => window.location.reload())}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </div>
    </div>
  )

  return (
    <ErrorBoundary componentName="CardPreview" onError={handleError} fallback={fallbackUI} onReset={onReset}>
      {children}
    </ErrorBoundary>
  )
}
