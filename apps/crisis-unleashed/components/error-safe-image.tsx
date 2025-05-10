"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { getSafeImagePath } from "@/lib/image-utils"

interface ErrorSafeImageProps extends Omit<ImageProps, "src"> {
  src: string
  fallbackSrc?: string
}

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
