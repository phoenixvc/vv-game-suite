"use client"

import { useState, useEffect, useRef } from "react"

type ImageStatus = "loading" | "loaded" | "error"

export function useImagePreloader(imageSources: string[]) {
  const [imagesStatus, setImagesStatus] = useState<Record<string, ImageStatus>>({})
  const [allLoaded, setAllLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  // Use refs to track state without causing re-renders
  const loadedCountRef = useRef(0)
  const isMountedRef = useRef(true)

  // Store image sources in a ref to avoid dependency changes
  const imageSourcesRef = useRef<string[]>([])

  useEffect(() => {
    // Update the ref when image sources change
    imageSourcesRef.current = imageSources
  }, [imageSources])

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true

    // Reset state when sources change
    loadedCountRef.current = 0
    setProgress(0)
    setAllLoaded(false)

    if (!imageSources.length) {
      setAllLoaded(true)
      return
    }

    // Initialize status for all images
    const initialStatus: Record<string, ImageStatus> = {}
    imageSources.forEach((src) => {
      initialStatus[src] = "loading"
    })
    setImagesStatus(initialStatus)

    // Create a stable updateProgress function that uses refs
    const updateProgress = () => {
      loadedCountRef.current += 1
      const newProgress = Math.round((loadedCountRef.current / imageSources.length) * 100)

      if (isMountedRef.current) {
        setProgress(newProgress)

        if (loadedCountRef.current === imageSources.length) {
          setAllLoaded(true)
        }
      }
    }

    // Preload all images
    const images: HTMLImageElement[] = []

    imageSources.forEach((src) => {
      const img = new Image()

      img.onload = () => {
        if (isMountedRef.current) {
          setImagesStatus((prev) => ({
            ...prev,
            [src]: "loaded",
          }))
          updateProgress()
        }
      }

      img.onerror = () => {
        if (isMountedRef.current) {
          setImagesStatus((prev) => ({
            ...prev,
            [src]: "error",
          }))
          updateProgress()
        }
      }

      img.src = src
      images.push(img)
    })

    // Cleanup function
    return () => {
      isMountedRef.current = false

      // Clean up image references
      images.forEach((img) => {
        img.onload = null
        img.onerror = null
      })
    }
  }, [imageSources]) // Only re-run if imageSources array changes

  return { imagesStatus, allLoaded, progress }
}
