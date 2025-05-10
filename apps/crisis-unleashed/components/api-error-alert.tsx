"use client"

import { AlertCircle, RefreshCw, WifiOff, Server, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { parseApiError, type ApiErrorType } from "@/lib/api-error-handler"

interface ApiErrorAlertProps {
  error: Error
  onRetry?: () => void
  className?: string
}

/**
 * Displays an alert UI for an API error, showing an icon, title, and message based on the error type.
 *
 * If the error is retryable and a retry handler is provided, a retry button is displayed.
 *
 * @param error - The API error to display.
 * @param onRetry - Optional callback to retry the failed operation.
 * @param className - Optional additional CSS classes for the alert.
 */
export function ApiErrorAlert({ error, onRetry, className = "" }: ApiErrorAlertProps) {
  const errorDetails = parseApiError(error)

  const getIcon = (type: ApiErrorType) => {
    switch (type) {
      case "network":
        return <WifiOff className="h-4 w-4" />
      case "timeout":
        return <Clock className="h-4 w-4" />
      case "server":
        return <Server className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getTitle = (type: ApiErrorType) => {
    switch (type) {
      case "network":
        return "Network Error"
      case "timeout":
        return "Request Timeout"
      case "server":
        return "Server Error"
      case "auth":
        return "Authentication Error"
      case "validation":
        return "Validation Error"
      case "notFound":
        return "Not Found"
      case "rateLimit":
        return "Rate Limit Exceeded"
      case "forbidden":
        return "Access Denied"
      default:
        return "Error"
    }
  }

  return (
    <Alert variant="destructive" className={className}>
      {getIcon(errorDetails.type)}
      <AlertTitle>{getTitle(errorDetails.type)}</AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <span>{errorDetails.message}</span>
        {errorDetails.retryable && onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry} className="ml-2 gap-1">
            <RefreshCw className="h-3 w-3" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
