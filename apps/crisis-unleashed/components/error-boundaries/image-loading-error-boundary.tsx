"use client"

import type React from "react"
import ErrorBoundary from "../error-boundary"
import { Button } from "@/components/ui/button"
import { ImageOff, RefreshCw } from "lucide-react"
import { logError } from "@/lib/error-logger"
import Image from "next/image"

interface ImageLoadingErrorBoundaryProps {
  children: React.ReactNode
  imageSrc?: string
  imageAlt?: string
  fallbackImageSrc?: string
  width?: number
  height?: number
}

export function ImageLoadingErrorBoundary({
  children,
  imageSrc,
  imageAlt = "Image",
  fallbackImageSrc,
  width = 200,
  height = 200,
}: ImageLoadingErrorBoundaryProps) {
  const handleError = (error: Error) => {
    logError({
      message: error.message,
      stack: error.stack,
      componentName: "ImageLoading",
      severity: "low",
      metadata: {
        imageSrc,
        imageAlt,
      },
    })
  }

  const fallbackUI = (
    <div
      className="relative flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {fallbackImageSrc ? (
        // Show fallback image if provided
        <Image
          src={fallbackImageSrc || "/placeholder.svg"}
          alt={`Fallback for ${imageAlt}`}
          width={width}
          height={height}
          className="object-cover"
        />
      ) : (
        // Default fallback UI
        <div className="flex flex-col items-center justify-center p-4 text-center space-y-2 h-full w-full">
          <ImageOff className="h-8 w-8 text-gray-400" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Image failed to load</p>
          <Button size="sm" variant="ghost" className="text-xs py-1 h-auto" onClick={() => window.location.reload()}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <ErrorBoundary componentName="ImageLoading" onError={handleError} fallback={fallbackUI}>
      {children}
    </ErrorBoundary>
  )
}
