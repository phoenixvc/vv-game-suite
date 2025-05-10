"use client"

import { useState, useCallback } from "react"
import { parseApiError, type ApiErrorDetails } from "@/lib/api-error-handler"
import { logError } from "@/lib/error-logger"

interface FormApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: ApiErrorDetails) => void
  onValidationError?: (errors: Record<string, string[]>) => void
}

export function useFormApi<T = any>(options: FormApiOptions<T> = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<ApiErrorDetails | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [data, setData] = useState<T | null>(null)

  const submitForm = useCallback(
    async (
      apiCall: () => Promise<T>,
      formData?: any, // Optional form data for logging purposes
    ) => {
      setIsSubmitting(true)
      setApiError(null)
      setValidationErrors({})

      try {
        const result = await apiCall()
        setData(result)
        setIsSubmitting(false)

        if (options.onSuccess) {
          options.onSuccess(result)
        }

        return result
      } catch (error: any) {
        const parsedError = parseApiError(error)
        setApiError(parsedError)
        setIsSubmitting(false)

        // Log the error
        logError({
          message: parsedError.message,
          componentName: "useFormApi",
          severity: parsedError.type === "validation" ? "low" : "medium",
          metadata: {
            errorType: parsedError.type,
            statusCode: parsedError.statusCode,
            formData: formData ? JSON.stringify(formData).substring(0, 500) : undefined,
          },
        })

        // Handle validation errors specially
        if (parsedError.type === "validation" && parsedError.data) {
          setValidationErrors(parsedError.data.errors || {})

          if (options.onValidationError) {
            options.onValidationError(parsedError.data.errors || {})
          }
        }

        // Call the general error handler
        if (options.onError) {
          options.onError(parsedError)
        }

        throw parsedError
      }
    },
    [options],
  )

  const clearErrors = useCallback(() => {
    setApiError(null)
    setValidationErrors({})
  }, [])

  return {
    submitForm,
    isSubmitting,
    apiError,
    validationErrors,
    data,
    clearErrors,
  }
}
