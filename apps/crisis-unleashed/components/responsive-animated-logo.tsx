"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import LogoVariant, { type LogoSize } from "@/components/logo-system/logo-variant"

export type LogoProps = {
  variant?:
    | "standard"
    | "compact"
    | "horizontal"
    | "vertical"
    | "icon-only"
    | "text-only"
    | "footer"
    | "mobile"
    | "print"
    | "watermark"
    | "animated"
  size?: LogoSize
  faction?: string
  interactive?: boolean
  monochrome?: boolean
  inverted?: boolean
  withTagline?: boolean
  className?: string
  animated?: boolean
  fallbackText?: string
  useSvg?: boolean
}

export function ResponsiveAnimatedLogo({
  variant = "standard",
  size = "md",
  faction = "cybernetic-nexus",
  interactive = false,
  monochrome = false,
  inverted = false,
  withTagline = false,
  className = "",
  animated = false,
  fallbackText = "Crisis Unleashed",
  useSvg = true, // Default to using SVG version
}: LogoProps) {
  const [imageExists, setImageExists] = useState<boolean | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { currentTheme } = useTheme()
  const actualFaction = faction || currentTheme || "cybernetic-nexus"

  // If using SVG, just render the LogoVariant component
  if (useSvg) {
    return (
      <LogoVariant
        variant={variant}
        size={size}
        faction={actualFaction}
        interactive={interactive}
        monochrome={monochrome}
        inverted={inverted}
        withTagline={withTagline}
        className={className}
      />
    )
  }

  // Check if theme-specific image exists
  useEffect(() => {
    let isMounted = true
    let themeImageExists = false
    let defaultImageExists = false

    const checkImages = async () => {
      if (!isMounted) return // Prevent race condition

      try {
        const img = new Image()
        img.src = `/crisis-unleashed-logo-${actualFaction}.png`
        img.onload = () => {
          if (isMounted) {
            themeImageExists = true
            setImageExists(true) // Set imageExists directly here
            setImageLoaded(true) // Set imageLoaded directly here
          }
        }
        img.onerror = () => {
          // Theme-specific image failed to load, try the default logo
          try {
            const defaultImg = new Image()
            defaultImg.src = "/crisis-unleashed-logo.png"
            defaultImg.onload = () => {
              if (isMounted) {
                defaultImageExists = true
                setImageExists(true) // Set imageExists directly here
                setImageLoaded(true) // Set imageLoaded directly here
              }
            }
            defaultImg.onerror = () => {
              // Default image also failed to load
              if (isMounted) {
                setImageExists(false) // Set imageExists directly here
                setImageLoaded(false) // Ensure imageLoaded is also false
                console.error("Logo images failed to load")
              }
            }
          } catch (error) {
            if (isMounted) {
              setImageExists(false) // Ensure imageExists is set even if default fails
              setImageLoaded(false) // Ensure imageLoaded is also false
              console.error("Default logo failed to load", error)
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          setImageExists(false) // Ensure imageExists is set even if initial load fails
          setImageLoaded(false) // Ensure imageLoaded is also false
          console.error("Initial logo load failed", error)
        }
      }
    }

    checkImages()

    return () => {
      isMounted = false
    }
  }, [actualFaction])

  // Logo animation variants
  const logoVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    pulse: {
      scale: [1, 1.05, 1],
      filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  }

  let content

  // If we're still checking if the image exists
  if (imageExists === null) {
    content = (
      <motion.div
        initial="hidden"
        animate="visible"
        className={`flex items-center justify-center h-32 w-32 md:h-48 md:w-48 lg:h-64 lg:w-64 ${className}`}
      >
        <div className="animate-pulse bg-gray-700 rounded-full h-full w-full"></div>
      </motion.div>
    )
  } else if (imageExists === false) {
    // If the image doesn't exist, show a text-based logo
    content = (
      <motion.div
        initial="hidden"
        animate={["visible", "pulse"]}
        variants={logoVariants}
        className={`flex items-center justify-center ${className}`}
      >
        <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          {fallbackText}
        </div>
      </motion.div>
    )
  } else {
    // If the image exists, show it with animation
    content = (
      <motion.div
        initial="hidden"
        animate={imageLoaded ? ["visible", "pulse"] : "hidden"}
        variants={logoVariants}
        className={`relative ${className}`}
      >
        <Image
          src={`/crisis-unleashed-logo-${actualFaction}.png`}
          alt="Crisis Unleashed Logo"
          width={300}
          height={300}
          className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 object-contain"
          priority
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            // Fallback to default logo
            e.currentTarget.src = "/crisis-unleashed-logo.png"
          }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-500 filter blur-xl opacity-30 z-[-1]"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </motion.div>
    )
  }

  return content
}

// Export the component as default for easier imports
export default ResponsiveAnimatedLogo
