"use client"

import type React from "react"
import { Component, type ReactNode } from "react"
import { AlertCircle, RefreshCw, Wifi, WifiOff, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { logError } from "@/lib/error-logger"

interface ApiErrorState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  errorType: "network" | "server" | "timeout" | "auth" | "unknown"
  retryCount: number
}

interface ApiErrorBoundaryProps {
  children: ReactNode
  endpoint?: string
  fallback?: ReactNode
  onReset?: () => void
  maxRetries?: number
  retryDelay?: number
  showDetails?: boolean
}

export class ApiErrorBoundary extends Component<ApiErrorBoundaryProps, ApiErrorState> {
  constructor(props: ApiErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: "unknown",
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ApiErrorState> {
    // Determine error type based on error message or properties
    let errorType: ApiErrorState["errorType"] = "unknown"

    if (error.message.includes("network") || error.message.includes("fetch") || error.message.includes("offline")) {
      errorType = "network"
    } else if (error.message.includes("timeout") || error.message.includes("timed out")) {
      errorType = "timeout"
    } else if (error.message.includes("401") || error.message.includes("403") || error.message.includes("auth")) {
      errorType = "auth"
    } else if (
      error.message.includes("500") ||
      error.message.includes("502") ||
      error.message.includes("503") ||
      error.message.includes("504")
    ) {
      errorType = "server"
    }

    return { hasError: true, error, errorType }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error with detailed API information
    logError({
      message: error.message,
      stack: error.stack,
      componentName: "ApiErrorBoundary",
      severity: "high",
      metadata: {
        endpoint: this.props.endpoint || "unknown",
        errorInfo: errorInfo.componentStack,
        errorType: this.state.errorType,
        retryCount: this.state.retryCount,
      },
    })
  }

  handleRetry = () => {
    const { maxRetries = 3 } = this.props
    const { retryCount } = this.state

    if (retryCount < maxRetries) {
      this.setState(
        (prevState) => ({
          retryCount: prevState.retryCount + 1,
        }),
        () => {
          // Wait for the specified delay before retrying
          setTimeout(() => {
            this.setState({
              hasError: false,
              error: null,
              errorInfo: null,
            })

            // Call the onReset prop if provided
            if (this.props.onReset) {
              this.props.onReset()
            }
          }, this.props.retryDelay || 1000)
        },
      )
    } else {
      // Log that max retries have been reached
      logError({
        message: "Maximum API retry attempts reached",
        componentName: "ApiErrorBoundary",
        severity: "medium",
        metadata: {
          endpoint: this.props.endpoint || "unknown",
          maxRetries,
          errorType: this.state.errorType,
        },
      })
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    })

    // Call the onReset prop if provided
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  renderErrorMessage() {
    const { errorType, error, retryCount } = this.state
    const { maxRetries = 3, showDetails = false } = this.props

    const getErrorIcon = () => {
      switch (errorType) {
        case "network":
          return <WifiOff className="h-6 w-6 text-red-500" />
        case "server":
          return <Server className="h-6 w-6 text-red-500" />
        case "timeout":
          return <AlertCircle className="h-6 w-6 text-amber-500" />
        case "auth":
          return <AlertCircle className="h-6 w-6 text-red-500" />
        default:
          return <AlertCircle className="h-6 w-6 text-red-500" />
      }
    }

    const getErrorTitle = () => {
      switch (errorType) {
        case "network":
          return "Network Error"
        case "server":
          return "Server Error"
        case "timeout":
          return "Request Timeout"
        case "auth":
          return "Authentication Error"
        default:
          return "API Error"
      }
    }

    const getErrorDescription = () => {
      switch (errorType) {
        case "network":
          return "Unable to connect to the server. Please check your internet connection and try again."
        case "server":
          return "The server encountered an error while processing your request. Our team has been notified."
        case "timeout":
          return "The request took too long to complete. This might be due to slow internet or high server load."
        case "auth":
          return "You don't have permission to access this resource. Please log in again or contact support."
        default:
          return "An unexpected error occurred while fetching data. Please try again later."
      }
    }

    return (
      <Card className="w-full max-w-md mx-auto border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            {getErrorIcon()}
            {getErrorTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">{getErrorDescription()}</p>

          {showDetails && error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="font-mono text-xs mt-2 max-h-24 overflow-auto">
                {error.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            {retryCount > 0 && (
              <span>
                Retry {retryCount}/{maxRetries}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {retryCount < maxRetries ? (
              <Button variant="outline" size="sm" onClick={this.handleRetry} className="gap-1">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={this.resetError} className="gap-1">
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
            )}
            <Button variant="default" size="sm" onClick={this.resetError} className="gap-1">
              <Wifi className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardFooter>
      </Card>
    )
  }

  render() {
    const { hasError } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      return fallback || this.renderErrorMessage()
    }

    return children
  }
}
