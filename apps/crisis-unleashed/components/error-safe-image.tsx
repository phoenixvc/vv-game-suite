"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { getSafeImagePath } from "@/lib/image-utils"

interface ErrorSafeImageProps extends Omit<ImageProps, "src"> {
  src: string
  fallbackSrc?: string
}

/**
 * Renders an image with automatic error handling and fallback support.
 *
 * If the primary image fails to load, displays a fallback image or a generic placeholder.
 *
 * @param src - The source URL of the primary image.
 * @param fallbackSrc - Optional fallback image URL to display if the primary image fails to load.
 * @param alt - Alternative text for the image.
 *
 * @returns A Next.js Image component with built-in error fallback behavior.
 */
export function ErrorSafeImage({
  src,
  fallbackSrc = "/generic-placeholder-image.png",
  alt,
  ...props
}: ErrorSafeImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(() => getSafeImagePath(src))
  const [error, setError] = useState(false)

  useEffect(() => {
    setImageSrc(getSafeImagePath(src))
    setError(false)
  }, [src])

  const handleError = () => {
    if (!error) {
      setError(true)
      setImageSrc(fallbackSrc)
    }
  }

  return <Image src={imageSrc || "/placeholder.svg"} alt={alt} onError={handleError} {...props} />
}
