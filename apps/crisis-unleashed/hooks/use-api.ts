"use client"

import { useState, useCallback, useEffect } from "react"
import { logError } from "@/lib/error-logger"

export type ApiStatus = "idle" | "loading" | "success" | "error"

interface ApiOptions<T> {
  url: string
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  body?: any
  headers?: Record<string, string>
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  autoFetch?: boolean
  timeout?: number
  retries?: number
  retryDelay?: number
  cacheKey?: string
  cacheTTL?: number
}

interface ApiState<T> {
  data: T | null
  error: Error | null
  status: ApiStatus
  statusCode: number | null
  timestamp: number | null
}

interface ApiCache {
  [key: string]: {
    data: any
    timestamp: number
    ttl: number
  }
}

// Simple in-memory cache
const apiCache: ApiCache = {}

export function useApi<T = any>(options: ApiOptions<T>) {
  const {
    url,
    method = "GET",
    body,
    headers = {},
    onSuccess,
    onError,
    autoFetch = true,
    timeout = 30000, // 30 seconds default timeout
    retries = 2,
    retryDelay = 1000,
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minutes default cache TTL
  } = options

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    status: "idle",
    statusCode: null,
    timestamp: null,
  })

  // Check if we have cached data
  useEffect(() => {
    if (cacheKey && apiCache[cacheKey] && apiCache[cacheKey].timestamp + apiCache[cacheKey].ttl > Date.now()) {
      setState({
        data: apiCache[cacheKey].data,
        error: null,
        status: "success",
        statusCode: 200, // Assuming cached data was successful
        timestamp: apiCache[cacheKey].timestamp,
      })
    }
  }, [cacheKey])

  // Function to fetch data with retries
  const fetchWithRetries = useCallback(
    async (retriesLeft: number): Promise<T> => {
      try {
        // Create AbortController for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        // Handle HTTP error status codes
        if (!response.ok) {
          const errorText = await response.text()
          const error = new Error(
            `API request failed with status ${response.status}: ${errorText || response.statusText}`,
          )
          // Add status code to the error object
          Object.assign(error, { statusCode: response.status })
          throw error
        }

        // Parse JSON response
        const data = await response.json()

        // Cache the successful response if cacheKey is provided
        if (cacheKey) {
          apiCache[cacheKey] = {
            data,
            timestamp: Date.now(),
            ttl: cacheTTL,
          }
        }

        return data
      } catch (error: any) {
        // Handle timeout errors
        if (error.name === "AbortError") {
          throw new Error("Request timeout: The server took too long to respond")
        }

        // Handle network errors
        if (error.message.includes("fetch") || error.message.includes("network")) {
          error.message = `Network error: ${error.message}`
        }

        // Retry logic
        if (retriesLeft > 0) {
          // Wait for the retry delay
          await new Promise((resolve) => setTimeout(resolve, retryDelay))
          // Try again with one less retry
          return fetchWithRetries(retriesLeft - 1)
        }

        // No more retries, throw the error
        throw error
      }
    },
    [url, method, headers, body, timeout, cacheKey, cacheTTL, retryDelay],
  )

  // Function to execute the API request
  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, status: "loading", error: null }))

    try {
      const data = await fetchWithRetries(retries)

      setState({
        data,
        error: null,
        status: "success",
        statusCode: 200,
        timestamp: Date.now(),
      })

      if (onSuccess) {
        onSuccess(data)
      }

      return data
    } catch (error: any) {
      // Log the error
      logError({
        message: error.message,
        componentName: "useApi",
        severity: "medium",
        metadata: {
          url,
          method,
          statusCode: error.statusCode || null,
        },
      })

      setState({
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
        status: "error",
        statusCode: error.statusCode || null,
        timestamp: Date.now(),
      })

      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)))
      }

      throw error
    }
  }, [fetchWithRetries, retries, onSuccess, onError, url, method])

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && state.status === "idle") {
      fetchData()
    }
  }, [autoFetch, fetchData, state.status])

  // Function to clear cache for a specific key or all cache
  const clearCache = useCallback(
    (specificKey?: string) => {
      if (specificKey) {
        delete apiCache[specificKey]
      } else if (cacheKey) {
        delete apiCache[cacheKey]
      }
    },
    [cacheKey],
  )

  // Function to manually refetch data
  const refetch = useCallback(() => {
    // Clear cache if cacheKey is provided
    if (cacheKey) {
      delete apiCache[cacheKey]
    }
    return fetchData()
  }, [cacheKey, fetchData])

  return {
    ...state,
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    refetch,
    clearCache,
  }
}
