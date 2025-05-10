"use client"

import { useState, type ReactNode } from "react"
import styles from "@/styles/flippable-card.module.css"

interface FlippableCardProps {
  frontContent: ReactNode
  backContent: ReactNode
  isFlipped?: boolean
  onFlip?: () => void
  className?: string
}

export function FlippableCard({
  frontContent,
  backContent,
  isFlipped = false,
  onFlip,
  className = "",
}: FlippableCardProps) {
  const [internalFlipped, setInternalFlipped] = useState(isFlipped)

  // Use either controlled or uncontrolled state
  const flipped = onFlip ? isFlipped : internalFlipped

  const handleFlip = () => {
    if (onFlip) {
      onFlip()
    } else {
      setInternalFlipped(!internalFlipped)
    }
  }

  return (
    <div className={`${styles.cardContainer} ${className}`}>
      <div className={`${styles.card} ${flipped ? styles.flipped : ""}`} onClick={handleFlip}>
        <div className={styles.cardFace + " " + styles.cardFront}>{frontContent}</div>
        <div className={styles.cardFace + " " + styles.cardBack}>{backContent}</div>
      </div>
    </div>
  )
}
