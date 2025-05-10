"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import styles from "@/styles/image-optimization.module.css"
import { getSafeImagePath } from "@/lib/image-utils"

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
  animation?: "fadeIn" | "zoomIn" | "none"
  aspectRatio?: string
  caption?: string
  hoverEffect?: boolean
  blurEffect?: boolean
  priority?: boolean
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  animation = "fadeIn",
  aspectRatio,
  caption,
  hoverEffect = false,
  blurEffect = false,
  className = "",
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>(() => getSafeImagePath(src as string))
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Update image source when src prop changes
    setImageSrc(getSafeImagePath(src as string))
    setImageError(false)
  }, [src])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    const container = document.getElementById(`image-container-${String(src).replace(/[^a-zA-Z0-9]/g, "-")}`)
    if (container) {
      observer.observe(container)
    }

    return () => {
      observer.disconnect()
    }
  }, [src])

  const animationClass = animation !== "none" ? styles[animation] : ""
  const hoverClass = hoverEffect ? styles.imageWrapper : ""
  const blurClass = blurEffect && !isLoaded ? styles.blurLoad : ""

  const containerStyle = aspectRatio ? { aspectRatio, width: "100%", height: "auto" } : {}

  const handleImageError = () => {
    setImageError(true)
    setImageSrc("/generic-placeholder-image.png")
  }

  return (
    <div
      id={`image-container-${String(src).replace(/[^a-zA-Z0-9]/g, "-")}`}
      className={`${styles.imageContainer} ${className}`}
      style={containerStyle}
    >
      <div className={`${hoverClass} ${blurClass}`}>
        {(isInView || priority) && (
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={alt}
            width={width}
            height={height}
            className={`${animationClass} ${isLoaded ? "opacity-100" : "opacity-0"}`}
            onLoadingComplete={() => setIsLoaded(true)}
            onError={handleImageError}
            priority={priority}
            {...props}
          />
        )}
        {caption && <div className={styles.imageCaption}>{caption}</div>}
      </div>
    </div>
  )
}
