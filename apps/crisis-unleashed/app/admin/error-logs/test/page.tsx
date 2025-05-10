"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { logError } from "@/lib/error-logger"

/**
 * React component for testing and demonstrating error logging functionality.
 *
 * Renders a UI with controls to trigger and log both client-side and server-side errors, display the most recent error, and provide usage instructions for the error logging system.
 */
export default function ErrorLogTester() {
  const [lastError, setLastError] = useState<string | null>(null)

  const triggerClientError = () => {
    try {
      // Intentionally cause an error
      const obj: any = null
      obj.nonExistentMethod()
    } catch (error) {
      if (error instanceof Error) {
        logError({
          message: error.message,
          source: "client",
          componentName: "ErrorLogTester",
          stack: error.stack,
          additionalInfo: { triggered: "manually", test: true },
        })
        setLastError(error.message)
      }
    }
  }

  const triggerLogoError = () => {
    logError({
      message: "Logo failed to render properly",
      source: "client",
      componentName: "LogoVariant",
      additionalInfo: { logoType: "animated", theme: "dark" },
    })
    setLastError("Logo failed to render properly")
  }

  const triggerServerError = async () => {
    try {
      const response = await fetch("/api/trigger-error", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Server error triggered successfully")
      }
    } catch (error) {
      if (error instanceof Error) {
        setLastError(error.message)
      }
    }
  }

  const checkErrorLogStatus = async () => {
    try {
      const response = await fetch("/api/log-error")
      const data = await response.json()
      alert(`Error logging system status: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      if (error instanceof Error) {
        setLastError(`Failed to check status: ${error.message}`)
      }
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Error Logging Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Client-Side Errors</h2>
          <div className="space-y-4">
            <Button onClick={triggerClientError} variant="destructive">
              Trigger JavaScript Error
            </Button>
            <Button onClick={triggerLogoError} variant="destructive">
              Simulate Logo Error
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Server-Side Errors</h2>
          <div className="space-y-4">
            <Button onClick={triggerServerError} variant="destructive">
              Trigger Server Error
            </Button>
            <Button onClick={checkErrorLogStatus} variant="outline">
              Check Error Logger Status
            </Button>
          </div>
        </Card>
      </div>

      {lastError && (
        <Card className="p-4 bg-red-50 border-red-200">
          <h3 className="font-medium mb-2">Last Error Triggered:</h3>
          <p className="text-red-700">{lastError}</p>
          <p className="mt-2 text-sm text-gray-600">
            This error has been logged. Check the error logs viewer to see it.
          </p>
        </Card>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">How to Use Error Logging</h2>
        <Card className="p-4 bg-blue-50">
          <p className="mb-2">Import the error logger in your components:</p>
          <pre className="bg-gray-800 text-white p-3 rounded text-sm mb-4">
            {`import { logError } from '@/lib/error-logger';`}
          </pre>

          <p className="mb-2">Log errors in catch blocks:</p>
          <pre className="bg-gray-800 text-white p-3 rounded text-sm">
            {`try {
  // Your code
} catch (error) {
  if (error instanceof Error) {
    logError({
      message: error.message,
      source: 'client',
      componentName: 'YourComponent',
      stack: error.stack
    });
  }
}`}
          </pre>
        </Card>
      </div>
    </div>
  )
}
