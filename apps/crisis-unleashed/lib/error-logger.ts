// This is a client-safe error logging utility
// It handles both client and server-side error logging

interface ErrorLogData {
  message: string
  source?: "client" | "server"
  componentName?: string
  stack?: string
  additionalInfo?: Record<string, any>
  timestamp?: string
  userId?: string
  sessionId?: string
  url?: string
  userAgent?: string

  // For backward compatibility with existing code
  errorMessage?: string
  errorName?: string
  stackTrace?: string
  componentStack?: string
}

/**
 * Logs an error to the appropriate destination based on environment
 */
function logError(errorData: ErrorLogData): void {
  // Normalize data for backward compatibility
  const normalizedData = {
    ...errorData,
    message: errorData.message || errorData.errorMessage || "Unknown error",
    source: errorData.source || "client",
    stack: errorData.stack || errorData.stackTrace || "",
    timestamp: errorData.timestamp || new Date().toISOString(),
  }

  // Client-side logging
  if (typeof window !== "undefined") {
    // Check if client-side logging is enabled
    const isLoggingEnabled = process.env.NEXT_PUBLIC_ENABLE_ERROR_LOGGING === "true"

    // Add browser-specific information
    normalizedData.url = normalizedData.url || window.location.href
    normalizedData.userAgent = normalizedData.userAgent || navigator.userAgent

    // Log to console in development
    if (process.env.NODE_ENV !== "production" || !isLoggingEnabled) {
      console.error("[Client Error]", normalizedData)

      // If logging is disabled, stop here
      if (!isLoggingEnabled) return
    }

    // Send to API endpoint
    const endpoint = process.env.NEXT_PUBLIC_ERROR_LOG_ENDPOINT || "/api/log-error"

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(normalizedData),
      // Use keepalive to ensure the request completes even if the page is unloading
      keepalive: true,
    }).catch((err) => {
      // Fallback logging if the API request fails
      console.error("[Error Logger] Failed to send error log:", err)
    })

    return
  }

  // Server-side logging
  if (typeof window === "undefined") {
    // Log to console
    console.error("[Server Error]", normalizedData)

    // In production, we might want to log to a file or external service
    if (process.env.NODE_ENV === "production") {
      const endpoint = process.env.ERROR_LOG_ENDPOINT || "/api/log-error"

      // If endpoint is a URL, send a request
      if (endpoint.startsWith("http")) {
        fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(normalizedData),
        }).catch((err) => {
          console.error("[Error Logger] Failed to send server error log:", err)
        })
      }
    }
  }
}

// Create the errorLogger object for backward compatibility
export const errorLogger = {
  logError: (data: ErrorLogData) => logError(data),
}

// Also export the logError function directly for new code
export { logError }

/**
 * Retrieves error logs from storage
 * @returns Array of error logs
 */
export function getErrorLogs(): ErrorLogData[] {
  if (typeof window === "undefined") {
    // Server-side: Return empty array or implement server-side log retrieval
    return []
  }

  try {
    const storedLogs = localStorage.getItem("error_logs")
    return storedLogs ? JSON.parse(storedLogs) : []
  } catch (error) {
    console.error("Failed to retrieve error logs:", error)
    return []
  }
}

/**
 * Clears all stored error logs
 */
export function clearErrorLogs(): void {
  if (typeof window === "undefined") {
    // Server-side: Implement server-side log clearing if needed
    return
  }

  try {
    localStorage.removeItem("error_logs")
  } catch (error) {
    console.error("Failed to clear error logs:", error)
  }
}
