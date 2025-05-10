// Types of API errors we want to handle specifically
export type ApiErrorType =
  | "network"
  | "timeout"
  | "server"
  | "auth"
  | "validation"
  | "notFound"
  | "rateLimit"
  | "forbidden"
  | "unknown"

// Interface for API error details
export interface ApiErrorDetails {
  type: ApiErrorType
  message: string
  statusCode?: number
  retryable: boolean
  originalError?: Error
  data?: any
}

/**
 * Parses an error and returns structured API error details
 */
export function parseApiError(error: any): ApiErrorDetails {
  // Default error details
  const defaultError: ApiErrorDetails = {
    type: "unknown",
    message: "An unexpected error occurred",
    retryable: true,
  }

  // If it's not an error object, convert it to one
  if (!(error instanceof Error)) {
    return {
      ...defaultError,
      message: String(error),
    }
  }

  // Extract status code if available
  const statusCode =
    error.statusCode ||
    (error.message.match(/status (\d+)/) ? Number.parseInt(error.message.match(/status (\d+)/)[1]) : undefined)

  // Network errors
  if (
    error.message.includes("network") ||
    error.message.includes("fetch") ||
    error.message.includes("offline") ||
    error.name === "NetworkError"
  ) {
    return {
      type: "network",
      message: "Unable to connect to the server. Please check your internet connection.",
      retryable: true,
      statusCode,
      originalError: error,
    }
  }

  // Timeout errors
  if (error.message.includes("timeout") || error.message.includes("timed out") || error.name === "AbortError") {
    return {
      type: "timeout",
      message: "The request took too long to complete. Please try again.",
      retryable: true,
      statusCode,
      originalError: error,
    }
  }

  // Handle based on status code if available
  if (statusCode) {
    // Authentication errors
    if (statusCode === 401) {
      return {
        type: "auth",
        message: "Your session has expired. Please log in again.",
        statusCode,
        retryable: false,
        originalError: error,
      }
    }

    // Forbidden errors
    if (statusCode === 403) {
      return {
        type: "forbidden",
        message: "You don't have permission to access this resource.",
        statusCode,
        retryable: false,
        originalError: error,
      }
    }

    // Not found errors
    if (statusCode === 404) {
      return {
        type: "notFound",
        message: "The requested resource was not found.",
        statusCode,
        retryable: false,
        originalError: error,
      }
    }

    // Validation errors
    if (statusCode === 422 || statusCode === 400) {
      return {
        type: "validation",
        message: "The submitted data is invalid. Please check your inputs and try again.",
        statusCode,
        retryable: false,
        originalError: error,
        data: error.data || undefined,
      }
    }

    // Rate limit errors
    if (statusCode === 429) {
      return {
        type: "rateLimit",
        message: "Too many requests. Please try again later.",
        statusCode,
        retryable: true,
        originalError: error,
      }
    }

    // Server errors
    if (statusCode >= 500) {
      return {
        type: "server",
        message: "The server encountered an error. Our team has been notified.",
        statusCode,
        retryable: true,
        originalError: error,
      }
    }
  }

  // Default case for unrecognized errors
  return {
    ...defaultError,
    message: error.message || defaultError.message,
    originalError: error,
  }
}

/**
 * Determines if an API error should be automatically retried
 */
export function shouldRetryApiError(error: ApiErrorDetails): boolean {
  // Don't retry auth, validation, or forbidden errors
  if (["auth", "validation", "forbidden", "notFound"].includes(error.type)) {
    return false
  }

  // Always retry network and timeout errors
  if (["network", "timeout"].includes(error.type)) {
    return true
  }

  // For server errors, retry based on status code
  if (error.type === "server") {
    // Don't retry 501 Not Implemented
    if (error.statusCode === 501) {
      return false
    }
    // Retry other server errors
    return true
  }

  // For rate limit errors, retry with exponential backoff
  if (error.type === "rateLimit") {
    return true
  }

  // Default to the retryable flag
  return error.retryable
}

/**
 * Gets a user-friendly error message based on the API error
 */
export function getUserFriendlyErrorMessage(error: ApiErrorDetails): string {
  switch (error.type) {
    case "network":
      return "Unable to connect to the server. Please check your internet connection and try again."
    case "timeout":
      return "The request took too long to complete. This might be due to slow internet or high server load."
    case "server":
      return "The server encountered an error while processing your request. Our team has been notified."
    case "auth":
      return "Your session has expired. Please log in again to continue."
    case "validation":
      return "The information you provided is invalid. Please check your inputs and try again."
    case "notFound":
      return "The requested resource could not be found. It may have been moved or deleted."
    case "rateLimit":
      return "You've made too many requests. Please wait a moment before trying again."
    case "forbidden":
      return "You don't have permission to access this resource. Please contact support if you believe this is an error."
    default:
      return error.message || "An unexpected error occurred. Please try again later."
  }
}
