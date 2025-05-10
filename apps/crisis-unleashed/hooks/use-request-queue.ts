"use client"

import { useState, useEffect, useCallback } from "react"
import { requestQueue, type QueuedRequest } from "@/lib/request-queue-manager"

interface RequestQueueStats {
  total: number
  pending: number
  retrying: number
  succeeded: number
  failed: number
  isOnline: boolean
  isProcessing: boolean
}

export function useRequestQueue() {
  const [queue, setQueue] = useState<QueuedRequest[]>(requestQueue.getQueue())
  const [stats, setStats] = useState<RequestQueueStats>(requestQueue.getStats())

  useEffect(() => {
    // Update state when queue changes
    const unsubscribe = requestQueue.addEventListener((event) => {
      if (event.type === "queue-updated") {
        setQueue(event.payload.queue)
        setStats(requestQueue.getStats())
      } else if (event.type === "connectivity-changed") {
        setStats(requestQueue.getStats())
      } else if (["processing-started", "processing-stopped"].includes(event.type)) {
        setStats(requestQueue.getStats())
      }
    })

    return unsubscribe
  }, [])

  const enqueueRequest = useCallback(
    (
      url: string,
      method: string,
      body?: any,
      headers?: Record<string, string>,
      options?: {
        maxRetries?: number
        retryDelay?: number
        priority?: number
        tags?: string[]
        groupId?: string
      },
    ) => {
      return requestQueue.enqueue(url, method, body, headers, options)
    },
    [],
  )

  const removeRequest = useCallback((id: string) => {
    return requestQueue.removeRequest(id)
  }, [])

  const retryRequest = useCallback((id: string) => {
    return requestQueue.retryRequest(id)
  }, [])

  const clearQueue = useCallback(() => {
    requestQueue.clearQueue()
  }, [])

  const clearFailedRequests = useCallback(() => {
    requestQueue.clearFailedRequests()
  }, [])

  const startProcessing = useCallback(() => {
    requestQueue.startProcessing()
  }, [])

  const stopProcessing = useCallback(() => {
    requestQueue.stopProcessing()
  }, [])

  return {
    queue,
    stats,
    enqueueRequest,
    removeRequest,
    retryRequest,
    clearQueue,
    clearFailedRequests,
    startProcessing,
    stopProcessing,
  }
}
