"use client"

import { useState } from "react"
import { useApi } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, AlertCircle } from "lucide-react"

interface ApiDataDisplayProps {
  endpoint: string
  title: string
  errorProne?: boolean // For demo purposes to simulate errors
}

export function ApiDataDisplay({ endpoint, title, errorProne = false }: ApiDataDisplayProps) {
  const [errorSimulation, setErrorSimulation] = useState<string | null>(null)

  // Function to reset error simulation
  const resetErrorSimulation = () => {
    setErrorSimulation(null)
  }

  // Determine the actual endpoint to use based on error simulation
  const actualEndpoint = errorSimulation || endpoint

  // Use our custom hook for API calls
  const { data, isLoading, isError, error, refetch, clearCache } = useApi({
    url: actualEndpoint,
    autoFetch: true,
    cacheKey: `api-data-${endpoint}`,
    retries: 2,
  })

  // If there's an error, throw it to be caught by the error boundary
  if (isError && error) {
    throw error
  }

  // Function to simulate different types of API errors
  const simulateError = (errorType: string) => {
    switch (errorType) {
      case "network":
        setErrorSimulation("https://non-existent-domain-12345.com/api/data")
        break
      case "timeout":
        setErrorSimulation("https://httpstat.us/200?sleep=10000") // 10 second delay
        break
      case "server":
        setErrorSimulation("https://httpstat.us/500")
        break
      case "auth":
        setErrorSimulation("https://httpstat.us/401")
        break
      case "notFound":
        setErrorSimulation("https://httpstat.us/404")
        break
      default:
        setErrorSimulation(null)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <div>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-60 text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        {errorProne && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
              <h4 className="font-medium">Error Simulation</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Click the buttons below to simulate different API error scenarios:
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => simulateError("network")}>
                Network Error
              </Button>
              <Button size="sm" variant="outline" onClick={() => simulateError("timeout")}>
                Timeout
              </Button>
              <Button size="sm" variant="outline" onClick={() => simulateError("server")}>
                Server Error
              </Button>
              <Button size="sm" variant="outline" onClick={() => simulateError("auth")}>
                Auth Error
              </Button>
              <Button size="sm" variant="outline" onClick={() => simulateError("notFound")}>
                Not Found
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => clearCache()}>
          Clear Cache
        </Button>
        <Button variant="default" size="sm" onClick={() => refetch()} className="gap-1">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  )
}
