"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  componentName?: string // Add component name for better error tracking
  logError?: boolean // Allow disabling error logging in specific cases
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Get component name for better error tracking
    const componentName = this.props.componentName || "Unknown Component"

    // Create a structured error log
    const errorLog = {
      timestamp: new Date().toISOString(),
      componentName,
      errorMessage: error.message,
      errorName: error.name,
      stackTrace: error.stack,
      componentStack: errorInfo.componentStack,
      url: typeof window !== "undefined" ? window.location.href : "",
    }

    // Log the error to console (in development) or to a service (in production)
    if (this.props.logError !== false) {
      console.error("Error caught by ErrorBoundary:", errorLog)

      // In a production environment, you would send this to your error tracking service
      // Example: sendToErrorTrackingService(errorLog)
    }

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  resetErrorBoundary = (): void => {
    // Reset the error boundary state
    this.setState({
      hasError: false,
      error: null,
    })

    // Call the onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render the fallback UI if provided, otherwise render the default fallback
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mb-2" />
          <h2 className="text-xl font-bold text-white">Something went wrong</h2>
          <p className="text-gray-400 max-w-md">
            We encountered an error while rendering this component. You can try refreshing the page or resetting the
            component.
          </p>
          {this.state.error && (
            <div className="bg-gray-900 p-4 rounded-md w-full max-w-md overflow-auto text-left">
              <p className="text-red-400 text-sm font-mono">{this.state.error.toString()}</p>
            </div>
          )}
          <Button onClick={this.resetErrorBoundary} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Component
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
