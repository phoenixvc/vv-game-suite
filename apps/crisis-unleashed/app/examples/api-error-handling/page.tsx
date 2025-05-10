"use client"

import { useState } from "react"
import { ApiErrorBoundary } from "@/components/error-boundaries/api-error-boundary"
import { ApiDataDisplay } from "@/components/api-data-display"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * Displays an interactive demonstration of API error handling using the `ApiErrorBoundary` component.
 *
 * Renders a UI with tabs to showcase both basic and advanced examples of handling API errors, including successful and failed requests, retry logic, and error simulation. Also provides usage instructions and code examples for integrating `ApiErrorBoundary` in other components.
 */
export default function ApiErrorHandlingDemo() {
  const [key, setKey] = useState(0)

  // Function to reset the error boundary
  const handleReset = () => {
    setKey((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">API Error Handling Demo</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        This page demonstrates how the API Error Boundary handles different types of API failures.
      </p>

      <Tabs defaultValue="basic">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="basic">Basic Example</TabsTrigger>
          <TabsTrigger value="advanced">Error Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Working API Request</CardTitle>
                <CardDescription>This example shows a successful API request</CardDescription>
              </CardHeader>
              <CardContent>
                <ApiErrorBoundary endpoint="https://jsonplaceholder.typicode.com/todos/1" key={`success-${key}`}>
                  <ApiDataDisplay endpoint="https://jsonplaceholder.typicode.com/todos/1" title="Todo Item" />
                </ApiErrorBoundary>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Failed API Request</CardTitle>
                <CardDescription>This example shows how errors are handled</CardDescription>
              </CardHeader>
              <CardContent>
                <ApiErrorBoundary
                  endpoint="https://jsonplaceholder.typicode.com/non-existent"
                  key={`error-${key}`}
                  onReset={handleReset}
                >
                  <ApiDataDisplay
                    endpoint="https://jsonplaceholder.typicode.com/non-existent"
                    title="Non-existent Resource"
                  />
                </ApiErrorBoundary>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Error Simulation</CardTitle>
                <CardDescription>Test how the API Error Boundary handles different types of errors</CardDescription>
              </CardHeader>
              <CardContent>
                <ApiErrorBoundary
                  endpoint="https://jsonplaceholder.typicode.com/users/1"
                  key={`simulation-${key}`}
                  onReset={handleReset}
                  maxRetries={3}
                  retryDelay={1500}
                  showDetails={true}
                >
                  <ApiDataDisplay
                    endpoint="https://jsonplaceholder.typicode.com/users/1"
                    title="User Data with Error Simulation"
                    errorProne={true}
                  />
                </ApiErrorBoundary>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to Use the API Error Boundary</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Basic Usage</h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto mt-2 text-sm">
              {`<ApiErrorBoundary endpoint="/api/data">
  <YourComponent />
</ApiErrorBoundary>`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium">With Custom Options</h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto mt-2 text-sm">
              {`<ApiErrorBoundary 
  endpoint="/api/data"
  maxRetries={3}
  retryDelay={1000}
  onReset={() => refetchData()}
  showDetails={process.env.NODE_ENV === 'development'}
>
  <YourComponent />
</ApiErrorBoundary>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
