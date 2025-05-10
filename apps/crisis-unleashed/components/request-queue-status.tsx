"use client"

import { useState } from "react"
import { useRequestQueue } from "@/hooks/use-request-queue"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Wifi, WifiOff, RefreshCw, Trash2, XCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function RequestQueueStatus() {
  const {
    queue,
    stats,
    retryRequest,
    removeRequest,
    clearFailedRequests,
    clearQueue,
    startProcessing,
    stopProcessing,
  } = useRequestQueue()
  const [isExpanded, setIsExpanded] = useState(false)

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "retrying":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Retrying
          </Badge>
        )
      case "succeeded":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Succeeded
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Format the request method with color
  const getMethodBadge = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            GET
          </Badge>
        )
      case "POST":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            POST
          </Badge>
        )
      case "PUT":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            PUT
          </Badge>
        )
      case "DELETE":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            DELETE
          </Badge>
        )
      case "PATCH":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            PATCH
          </Badge>
        )
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  // If there are no queued requests, show a minimal component
  if (stats.total === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white shadow-md">
              {stats.isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="ml-2">No Pending Requests</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Request Queue</h4>
              <p className="text-sm text-gray-500">
                {stats.isOnline
                  ? "You're online. API requests will be sent immediately."
                  : "You're offline. API requests will be queued and sent when you're back online."}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center gap-2">
              {stats.isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              Request Queue
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
          <CardDescription>
            {stats.pending > 0 && <span className="text-yellow-600 font-medium">{stats.pending} pending</span>}
            {stats.retrying > 0 && <span className="text-blue-600 font-medium ml-2">{stats.retrying} retrying</span>}
            {stats.failed > 0 && <span className="text-red-600 font-medium ml-2">{stats.failed} failed</span>}
          </CardDescription>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pb-2">
            <div className="max-h-60 overflow-y-auto space-y-2">
              {queue.map((request) => (
                <div key={request.id} className="border rounded-md p-2 text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1">
                      {getMethodBadge(request.method)}
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(request.timestamp, { addSuffix: true })}
                    </div>
                  </div>

                  <div className="truncate text-xs text-gray-700 mb-1">{request.url}</div>

                  {request.errorMessage && <div className="text-xs text-red-600 mb-1">{request.errorMessage}</div>}

                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs text-gray-500">
                      {request.retryCount > 0 && (
                        <span>
                          Retries: {request.retryCount}/{request.maxRetries}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {request.status === "failed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => retryRequest(request.id)}
                          title="Retry request"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500"
                        onClick={() => removeRequest(request.id)}
                        title="Remove request"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}

        <CardFooter className="pt-2 flex justify-between">
          <div className="flex gap-1">
            {stats.isProcessing ? (
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={stopProcessing}>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Pause
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={startProcessing}
                disabled={!stats.isOnline || stats.pending === 0}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Process
              </Button>
            )}

            {stats.failed > 0 && (
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={clearFailedRequests}>
                <XCircle className="h-3 w-3 mr-1" />
                Clear Failed
              </Button>
            )}
          </div>

          <Button variant="ghost" size="sm" className="h-8 text-xs text-red-500" onClick={clearQueue}>
            <Trash2 className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
