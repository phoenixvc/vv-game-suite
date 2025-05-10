"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import ErrorBoundary from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import { logError } from "@/lib/error-logger"
import Link from "next/link"

interface ErrorBoundaryContextType {
  logComponentError: (error: Error, componentName: string) => void
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextType | undefined>(undefined)

export function useErrorBoundary() {
  const context = useContext(ErrorBoundaryContext)
  if (context === undefined) {
    throw new Error("useErrorBoundary must be used within an ErrorBoundaryProvider")
  }
  return context
}

interface ErrorBoundaryProviderProps {
  children: React.ReactNode
}

export function ErrorBoundaryProvider({ children }: ErrorBoundaryProviderProps) {
  const [globalError, setGlobalError] = useState<Error | null>(null)

  const logComponentError = (error: Error, componentName: string) => {
    logError({
      message: error.message,
      stack: error.stack,
      componentName,
      severity: "high",
    })
  }

  const handleGlobalError = (error: Error) => {
    setGlobalError(error)
    logError({
      message: error.message,
      stack: error.stack,
      componentName: "GlobalApp",
      severity: "critical",
    })
  }

  const resetGlobalError = () => {
    setGlobalError(null)
  }

  const globalFallbackUI = (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-lg">
        <div className="container mx-auto">
          <Link href="/" className="text-xl font-bold">
            Crisis Unleashed
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl text-center">
          <AlertTriangle className="h-20 w-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Application Error</h1>
          <p className="text-gray-300 mb-6">
            We've encountered an unexpected error. Our team has been notified and is working to fix the issue.
          </p>

          {globalError && (
            <div className="bg-gray-900 p-4 rounded-md mb-6 text-left overflow-auto max-h-40">
              <p className="text-red-400 text-sm font-mono">{globalError.toString()}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => window.location.reload()} className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Application
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 p-4 text-center text-gray-400">
        <p>© Crisis Unleashed. All rights reserved.</p>
      </footer>
    </div>
  )

  return (
    <ErrorBoundaryContext.Provider value={{ logComponentError }}>
      <ErrorBoundary
        componentName="GlobalApp"
        onError={handleGlobalError}
        onReset={resetGlobalError}
        fallback={globalFallbackUI}
      >
        {children}
      </ErrorBoundary>
    </ErrorBoundaryContext.Provider>
  )
}
