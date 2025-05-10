"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ErrorBoundary from "@/components/error-boundary"
import StyledErrorPage from "@/components/styled-error-page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// This component will throw an error when the button is clicked
function ErrorThrower() {
  const [shouldThrow, setShouldThrow] = useState(false)
  const [errorType, setErrorType] = useState("basic")

  if (shouldThrow) {
    switch (errorType) {
      case "reference":
        // @ts-ignore - Intentional error
        const undefinedVariable = { property: "value" } // Declare the variable
        const nonExistentVariable = undefinedVariable.property
        break
      case "type":
        // @ts-ignore - Intentional error
        const num: number = "not a number"
        break
      case "syntax":
        // This would normally be a syntax error, but we'll simulate it
        throw new SyntaxError("Unexpected token")
      case "custom":
        throw new Error("This is a custom error with a detailed message for testing the error boundary component.")
      default:
        throw new Error("Something went wrong!")
    }
  }

  return (
    <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Error Thrower Component</h3>
      <p className="mb-4 text-gray-300">Select an error type and click the button to trigger an error:</p>

      <div className="mb-4">
        <Select value={errorType} onValueChange={setErrorType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select error type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic Error</SelectItem>
            <SelectItem value="reference">Reference Error</SelectItem>
            <SelectItem value="type">Type Error</SelectItem>
            <SelectItem value="syntax">Syntax Error</SelectItem>
            <SelectItem value="custom">Custom Detailed Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={() => setShouldThrow(true)}>Throw Error</Button>
    </div>
  )
}

export default function ErrorPageDemo() {
  const [theme, setTheme] = useState<"dark" | "light" | "game">("dark")
  const [key, setKey] = useState(0)

  const resetDemo = () => {
    setKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Styled Error Page Demo</h2>
        <p className="mb-4 text-gray-300">
          This demo showcases the StyledErrorPage component with different themes. Select a theme and trigger an error
          to see it in action.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Theme</label>
          <Select value={theme} onValueChange={(value: "dark" | "light" | "game") => setTheme(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark Theme</SelectItem>
              <SelectItem value="light">Light Theme</SelectItem>
              <SelectItem value="game">Game Theme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Button onClick={resetDemo} variant="outline">
            Reset Demo
          </Button>
        </div>
      </div>

      <ErrorBoundary
        key={key}
        fallback={({ error, resetErrorBoundary }) => (
          <StyledErrorPage error={error} resetErrorBoundary={resetErrorBoundary} theme={theme} />
        )}
      >
        <ErrorThrower />
      </ErrorBoundary>
    </div>
  )
}
