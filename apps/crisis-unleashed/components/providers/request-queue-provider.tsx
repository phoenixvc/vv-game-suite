"use client"

import type { ReactNode } from "react"
import { RequestQueueStatus } from "@/components/request-queue-status"

interface RequestQueueProviderProps {
  children: ReactNode
}

export function RequestQueueProvider({ children }: RequestQueueProviderProps) {
  return (
    <>
      {children}
      <RequestQueueStatus />
    </>
  )
}
