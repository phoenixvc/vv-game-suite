"use client"

import { useTheme } from "@/contexts/theme-context"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ResponsiveAnimatedLogo } from "@/components/responsive-animated-logo"

interface ThemeAwareLogoProps {
  width?: number
  height?: number
  className?: string
  exportMode?: boolean
}

export function ThemeAwareLogo({ width = 300, height = 300, className = "", exportMode = false }: ThemeAwareLogoProps) {
  const { themeData, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only render after mount to avoid hydration issues with theme
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ width, height }} className={className} />
  }

  // Animation variants (only if not in export mode)
  const logoVariants = exportMode
    ? {}
    : {
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

  return (
    <motion.div
      animate={exportMode ? undefined : "pulse"}
      variants={logoVariants}
      className={className}
      style={{ width, height }}
    >
      <ResponsiveAnimatedLogo
        variant="standard"
        size="2xl"
        faction={currentTheme}
        interactive={false}
        monochrome={false}
        inverted={themeData?.mode === "light"}
        withTagline={true}
        className="w-full h-full"
        animated={!exportMode}
      />
    </motion.div>
  )
}

export default ThemeAwareLogo
