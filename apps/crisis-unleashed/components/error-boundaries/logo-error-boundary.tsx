"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { errorLogger } from "@/lib/error-logger"

interface LogoErrorBoundaryProps {
  children: ReactNode
  fallbackClassName?: string
  showRetry?: boolean
  showError?: boolean
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  variant?: "standard" | "compact" | "minimal"
}

interface LogoErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class LogoErrorBoundary extends Component<LogoErrorBoundaryProps, LogoErrorBoundaryState> {
  constructor(props: LogoErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): LogoErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    errorLogger.logError({
      message: error.message,
      source: "client",
      componentName: "LogoComponent",
      stack: error.stack,
      additionalInfo: {
        componentStack: errorInfo.componentStack,
        url: typeof window !== "undefined" ? window.location.href : "",
      },
    })

    this.setState({
      errorInfo,
    })
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): ReactNode {
    const { hasError, error } = this.state
    const {
      children,
      fallbackClassName,
      showRetry = true,
      showError = false,
      size = "md",
      variant = "standard",
    } = this.props

    if (hasError) {
      // Size mappings for the fallback UI
      const sizeMap = {
        xs: { width: 16, height: 16, fontSize: "text-xs" },
        sm: { width: 24, height: 24, fontSize: "text-sm" },
        md: { width: 32, height: 32, fontSize: "text-base" },
        lg: { width: 48, height: 48, fontSize: "text-lg" },
        xl: { width: 64, height: 64, fontSize: "text-xl" },
        "2xl": { width: 96, height: 96, fontSize: "text-2xl" },
      }

      const { width, height, fontSize } = sizeMap[size]

      // Variant styles
      const variantStyles = {
        standard: "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2",
        compact: "bg-gray-100 dark:bg-gray-800 rounded-md",
        minimal: "",
      }

      return (
        <div
          className={cn("flex flex-col items-center justify-center", variantStyles[variant], fallbackClassName)}
          style={{
            width: variant !== "minimal" ? width * 3 : width,
            height: height * (variant === "minimal" ? 1 : 1.5),
          }}
          role="alert"
          aria-live="assertive"
        >
          {variant !== "minimal" && (
            <div className="flex items-center justify-center mb-1">
              <AlertTriangle className="text-amber-500" size={width * 0.6} />
            </div>
          )}

          <div className={cn("font-bold", fontSize, variant === "minimal" && "sr-only")}>
            {variant === "compact" ? "CU" : "Crisis Unleashed"}
          </div>

          {showError && error && (
            <div className="text-xs text-red-500 mt-1 max-w-full overflow-hidden text-ellipsis">{error.message}</div>
          )}

          {showRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleRetry}
              className={cn("mt-2", variant === "minimal" && "sr-only")}
            >
              Retry
            </Button>
          )}
        </div>
      )
    }

    return children
  }
}

export default LogoErrorBoundary
