"use client"

import { useCallback } from "react"

interface ErrorTestingOptions {
  componentName?: string
}

export function useErrorTesting(options: ErrorTestingOptions = {}) {
  const { componentName = "TestComponent" } = options

  const triggerError = useCallback(
    (message = "Test error triggered") => {
      throw new Error(`[${componentName}] ${message}`)
    },
    [componentName],
  )

  const triggerAsyncError = useCallback(
    async (message = "Async test error triggered") => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`[${componentName}] ${message}`))
        }, 100)
      })
    },
    [componentName],
  )

  return {
    triggerError,
    triggerAsyncError,
  }
}
