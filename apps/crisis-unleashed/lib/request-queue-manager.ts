import { logError } from "./error-logger"
import { parseApiError } from "./api-error-handler"

// Types for our queue system
export interface QueuedRequest {
  id: string
  url: string
  method: string
  body?: any
  headers?: Record<string, string>
  priority: number
  timestamp: number
  retryCount: number
  maxRetries: number
  retryDelay: number
  lastRetryTimestamp?: number
  status: "pending" | "retrying" | "succeeded" | "failed"
  errorMessage?: string
  tags?: string[]
  groupId?: string
}

export interface QueueOptions {
  maxRetries?: number
  retryDelay?: number
  priority?: number
  tags?: string[]
  groupId?: string
}

// Event types for the queue manager
type QueueEventType =
  | "added"
  | "retrying"
  | "succeeded"
  | "failed"
  | "removed"
  | "cleared"
  | "connectivity-changed"
  | "processing-started"
  | "processing-stopped"
  | "queue-updated"

interface QueueEvent {
  type: QueueEventType
  payload?: any
}

type QueueEventListener = (event: QueueEvent) => void

// The main RequestQueueManager class
class RequestQueueManager {
  private queue: QueuedRequest[] = []
  private isOnline: boolean = navigator.onLine
  private isProcessing = false
  private processingInterval: number | null = null
  private eventListeners: QueueEventListener[] = []
  private storageKey = "api_request_queue"
  private processingIntervalTime = 3000 // 3 seconds between processing attempts
  private maxQueueSize = 100 // Maximum number of requests to store

  constructor() {
    // Initialize the queue from storage
    this.loadFromStorage()

    // Set up online/offline event listeners
    window.addEventListener("online", this.handleOnline)
    window.addEventListener("offline", this.handleOffline)

    // Initial check
    this.isOnline = navigator.onLine
  }

  // Event handling
  private emit(event: QueueEvent) {
    this.eventListeners.forEach((listener) => listener(event))
  }

  public addEventListener(listener: QueueEventListener) {
    this.eventListeners.push(listener)
    return () => {
      this.eventListeners = this.eventListeners.filter((l) => l !== listener)
    }
  }

  // Online/offline handlers
  private handleOnline = () => {
    this.isOnline = true
    this.emit({ type: "connectivity-changed", payload: { isOnline: true } })
    this.startProcessing()
  }

  private handleOffline = () => {
    this.isOnline = false
    this.emit({ type: "connectivity-changed", payload: { isOnline: false } })
    this.stopProcessing()
  }

  // Queue a new request
  public enqueue(
    url: string,
    method: string,
    body?: any,
    headers?: Record<string, string>,
    options: QueueOptions = {},
  ): string {
    // Generate a unique ID for this request
    const id = this.generateRequestId()

    // Create the queued request object
    const request: QueuedRequest = {
      id,
      url,
      method,
      body,
      headers,
      priority: options.priority ?? 1, // Default priority
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: options.maxRetries ?? 3,
      retryDelay: options.retryDelay ?? 5000,
      status: "pending",
      tags: options.tags ?? [],
      groupId: options.groupId,
    }

    // Check if we need to enforce queue size limits
    if (this.queue.length >= this.maxQueueSize) {
      // Remove the oldest, lowest priority item
      const oldestIndex = this.findOldestLowestPriorityIndex()
      if (oldestIndex !== -1) {
        this.queue.splice(oldestIndex, 1)
      }
    }

    // Add to queue
    this.queue.push(request)

    // Sort the queue by priority (higher first) and then by timestamp (older first)
    this.sortQueue()

    // Save to storage
    this.saveToStorage()

    // Emit event
    this.emit({ type: "added", payload: { request } })
    this.emit({ type: "queue-updated", payload: { queue: this.getQueue() } })

    // If we're online, start processing
    if (this.isOnline && !this.isProcessing) {
      this.startProcessing()
    }

    return id
  }

  // Find the oldest, lowest priority item in the queue
  private findOldestLowestPriorityIndex(): number {
    if (this.queue.length === 0) return -1

    let oldestIndex = 0
    let oldestPriority = this.queue[0].priority
    let oldestTimestamp = this.queue[0].timestamp

    for (let i = 1; i < this.queue.length; i++) {
      const item = this.queue[i]

      // If this item has lower priority, or same priority but older
      if (item.priority < oldestPriority || (item.priority === oldestPriority && item.timestamp < oldestTimestamp)) {
        oldestIndex = i
        oldestPriority = item.priority
        oldestTimestamp = item.timestamp
      }
    }

    return oldestIndex
  }

  // Sort the queue by priority (higher first) and then by timestamp (older first)
  private sortQueue() {
    this.queue.sort((a, b) => {
      // First by priority (higher first)
      if (b.priority !== a.priority) {
        return b.priority - a.priority
      }
      // Then by timestamp (older first)
      return a.timestamp - b.timestamp
    })
  }

  // Generate a unique ID for a request
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  // Start processing the queue
  public startProcessing() {
    if (this.isProcessing || !this.isOnline) return

    this.isProcessing = true
    this.emit({ type: "processing-started" })

    // Process immediately, then set up interval
    this.processQueue()

    this.processingInterval = window.setInterval(() => {
      this.processQueue()
    }, this.processingIntervalTime)
  }

  // Stop processing the queue
  public stopProcessing() {
    if (!this.isProcessing) return

    this.isProcessing = false

    if (this.processingInterval !== null) {
      clearInterval(this.processingInterval)
      this.processingInterval = null
    }

    this.emit({ type: "processing-stopped" })
  }

  // Process the queue
  private async processQueue() {
    if (!this.isOnline || this.queue.length === 0) {
      if (this.queue.length === 0) {
        this.stopProcessing()
      }
      return
    }

    // Find the next request that's ready to be retried
    const now = Date.now()
    const requestIndex = this.queue.findIndex((req) => {
      return req.status === "pending" && (!req.lastRetryTimestamp || now - req.lastRetryTimestamp >= req.retryDelay)
    })

    if (requestIndex === -1) return

    const request = this.queue[requestIndex]

    // Update status to retrying
    request.status = "retrying"
    request.lastRetryTimestamp = now
    request.retryCount++

    this.saveToStorage()
    this.emit({ type: "retrying", payload: { request } })
    this.emit({ type: "queue-updated", payload: { queue: this.getQueue() } })

    try {
      // Attempt the request
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          ...request.headers,
        },
        body: request.body ? JSON.stringify(request.body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      // Request succeeded
      request.status = "succeeded"
      this.emit({ type: "succeeded", payload: { request, response } })

      // Remove from queue
      this.queue = this.queue.filter((req) => req.id !== request.id)
      this.saveToStorage()
      this.emit({ type: "queue-updated", payload: { queue: this.getQueue() } })
    } catch (error) {
      // Request failed
      const apiError = parseApiError(error)

      // Update the request status
      if (request.retryCount >= request.maxRetries) {
        request.status = "failed"
        request.errorMessage = apiError.message
        this.emit({ type: "failed", payload: { request, error: apiError } })
      } else {
        request.status = "pending"
        request.errorMessage = apiError.message
      }

      this.saveToStorage()
      this.emit({ type: "queue-updated", payload: { queue: this.getQueue() } })

      // Log the error
      logError({
        message: `Queue retry failed for ${request.url}: ${apiError.message}`,
        componentName: "RequestQueueManager",
        severity: "medium",
        metadata: {
          requestId: request.id,
          url: request.url,
          method: request.method,
          retryCount: request.retryCount,
          maxRetries: request.maxRetries,
        },
      })
    }
  }

  // Remove a request from the queue
  public removeRequest(id: string) {
    const requestIndex = this.queue.findIndex((req) => req.id === id)
    if (requestIndex === -1) return false

    const request = this.queue[requestIndex]
    this.queue.splice(requestIndex, 1)

    this.saveToStorage()
    this.emit({ type: "removed", payload: { request } })
    this.emit({ type: "queue-updated", payload: { queue: this.getQueue() } })

    return true
  }

  // Retry a specific failed request immediately
  public retryRequest(id: string) {
    const request = this.queue.find((req) => req.id === id)
    if (!request || (request.status !== "failed" && request.status !== "pending")) {
      return false
    }

    // Reset for retry
    request.status = "pending"
    request.retryCount = 0
    request.lastRetryTimestamp = undefined

    this.saveToStorage()
    this.emit({ type: "queue-updated", payload: { queue: this.getQueue() } })

    // Start processing if needed
    if (this.isOnline && !this.isProcessing) {
      this.startProcessing()
    }

    return true
  }

  // Clear all requests from the queue
  public clearQueue() {
    this.queue = []
    this.saveToStorage()
    this.emit({ type: "cleared" })
    this.emit({ type: "queue-updated", payload: { queue: this.getQueue() } })

    if (this.isProcessing) {
      this.stopProcessing()
    }
  }

  // Clear all failed requests from the queue
  public clearFailedRequests() {
    this.queue = this.queue.filter((req) => req.status !== "failed")
    this.saveToStorage()
    this.emit({ type: "queue-updated", payload: { queue: this.getQueue() } })
  }

  // Get the current queue
  public getQueue(): QueuedRequest[] {
    return [...this.queue]
  }

  // Get a specific request by ID
  public getRequest(id: string): QueuedRequest | undefined {
    return this.queue.find((req) => req.id === id)
  }

  // Get queue statistics
  public getStats() {
    const total = this.queue.length
    const pending = this.queue.filter((req) => req.status === "pending").length
    const retrying = this.queue.filter((req) => req.status === "retrying").length
    const succeeded = this.queue.filter((req) => req.status === "succeeded").length
    const failed = this.queue.filter((req) => req.status === "failed").length

    return {
      total,
      pending,
      retrying,
      succeeded,
      failed,
      isOnline: this.isOnline,
      isProcessing: this.isProcessing,
    }
  }

  // Save the queue to localStorage
  private saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue))
    } catch (error) {
      console.error("Failed to save queue to storage:", error)
    }
  }

  // Load the queue from localStorage
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        this.queue = JSON.parse(stored)

        // Reset any "retrying" status to "pending"
        this.queue.forEach((req) => {
          if (req.status === "retrying") {
            req.status = "pending"
          }
        })

        this.sortQueue()
      }
    } catch (error) {
      console.error("Failed to load queue from storage:", error)
      this.queue = []
    }
  }

  // Clean up
  public destroy() {
    window.removeEventListener("online", this.handleOnline)
    window.removeEventListener("offline", this.handleOffline)

    if (this.processingInterval !== null) {
      clearInterval(this.processingInterval)
    }

    this.eventListeners = []
  }
}

// Create a singleton instance
export const requestQueue = new RequestQueueManager()

// Export a hook for components to use the queue
export function useRequestQueue() {
  return requestQueue
}
