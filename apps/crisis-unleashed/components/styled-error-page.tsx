"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Home, AlertTriangle, ChevronDown, ChevronUp, Copy, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import styles from "@/styles/styled-error-page.module.css"

interface StyledErrorPageProps {
  error?: Error | null
  resetErrorBoundary?: () => void
  title?: string
  subtitle?: string
  showHomeButton?: boolean
  showResetButton?: boolean
  homeButtonText?: string
  resetButtonText?: string
  homeButtonHref?: string
  theme?: "dark" | "light" | "game"
}

export default function StyledErrorPage({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
  subtitle = "We encountered an error while rendering this component",
  showHomeButton = true,
  showResetButton = true,
  homeButtonText = "Go to Home",
  resetButtonText = "Try Again",
  homeButtonHref = "/",
  theme = "dark",
}: StyledErrorPageProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [isCountingDown, setIsCountingDown] = useState(false)

  // Auto-reset countdown
  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (isCountingDown && countdown === 0) {
      setIsCountingDown(false)
      resetErrorBoundary?.()
    }
  }, [countdown, isCountingDown, resetErrorBoundary])

  const startCountdown = () => {
    setIsCountingDown(true)
    setCountdown(5)
  }

  const stopCountdown = () => {
    setIsCountingDown(false)
  }

  const copyErrorToClipboard = () => {
    if (error) {
      const errorText = `Error: ${error.message}\nStack: ${error.stack}`
      navigator.clipboard.writeText(errorText).then(
        () => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        },
        (err) => {
          console.error("Could not copy text: ", err)
        },
      )
    }
  }

  const themeClasses = {
    dark: styles.themeDark,
    light: styles.themeLight,
    game: styles.themeGame,
  }

  return (
    <div className={`${styles.errorContainer} ${themeClasses[theme]}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.errorCard}
      >
        <div className={styles.errorIconContainer}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
          >
            <AlertTriangle className={styles.errorIcon} />
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={styles.errorTitle}
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={styles.errorSubtitle}
        >
          {subtitle}
        </motion.p>

        {isCountingDown && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={styles.countdownContainer}
          >
            <div className={styles.countdownCircle}>
              <span className={styles.countdownNumber}>{countdown}</span>
            </div>
            <p className={styles.countdownText}>Auto-refreshing in {countdown} seconds</p>
            <Button variant="outline" size="sm" onClick={stopCountdown} className={styles.countdownCancelButton}>
              Cancel
            </Button>
          </motion.div>
        )}

        {error && (
          <div className={styles.errorDetailsContainer}>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={styles.errorDetailsToggle}
              aria-expanded={showDetails}
            >
              <span>Error Details</span>
              {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={styles.errorDetailsContent}
                >
                  <div className={styles.errorMessage}>
                    <p>{error.message}</p>
                  </div>

                  {error.stack && (
                    <div className={styles.errorStack}>
                      <div className={styles.errorStackHeader}>
                        <span>Stack Trace</span>
                        <button onClick={copyErrorToClipboard} className={styles.copyButton} title="Copy to clipboard">
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <pre className={styles.errorStackContent}>{error.stack}</pre>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className={styles.errorActions}>
          {showResetButton && resetErrorBoundary && (
            <Button onClick={resetErrorBoundary} className={styles.resetButton}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {resetButtonText}
            </Button>
          )}

          {showHomeButton && (
            <Button variant="outline" className={styles.homeButton} asChild>
              <a href={homeButtonHref}>
                <Home className="h-4 w-4 mr-2" />
                {homeButtonText}
              </a>
            </Button>
          )}
        </div>

        {resetErrorBoundary && (
          <div className={styles.autoResetContainer}>
            <Button variant="link" onClick={startCountdown} className={styles.autoResetButton}>
              Auto-refresh in 5 seconds
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
