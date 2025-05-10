"use client"

import type React from "react"
import type { CardData } from "@/lib/card-data"
import styles from "@/styles/card-styles.module.css"

// Update the CrisisCardProps interface to include showFront
interface CrisisCardProps {
  card: CardData
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  showFront?: boolean
}

// Update the component to use the showFront prop
const CrisisCard: React.FC<CrisisCardProps> = ({ card, size = "md", onClick, showFront = true }) => {
  const sizeClass = size === "sm" ? styles.cardSm : size === "lg" ? styles.cardLg : styles.cardMd
  const factionClass = card.faction ? styles[`faction${card.faction}`] : ""
  const rarityClass = card.rarity ? styles[`rarity${card.rarity}`] : ""

  if (!showFront) {
    return (
      <div
        className={`${styles.crisisCard} ${sizeClass} ${factionClass} ${rarityClass}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <div className={styles.cardBack}>
          <div className={styles.cardBackHeader}>
            <h3 className={styles.cardBackName}>{card.name}</h3>
            <div className={styles.cardBackType}>{card.type || "Crisis"}</div>
          </div>
          <div className={styles.cardBackContent}>
            <div className={styles.crisisBackContent}>
              <div className={styles.crisisImpact}>
                <h4 className={styles.sectionTitle}>Impact</h4>
                <p>{card.impact || "No impact description available."}</p>
              </div>

              <div className={styles.crisisDuration}>
                <h4 className={styles.sectionTitle}>Duration</h4>
                <p>{card.duration || "Until resolved"}</p>
              </div>
            </div>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.cardFaction}>{card.faction}</div>
            <div className={styles.cardRarity}>{card.rarity}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${styles.crisisCard} ${sizeClass} ${factionClass} ${rarityClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardName}>{card.name}</h3>
        <div className={styles.crisisIcon}>⚠️</div>
      </div>

      <div className={styles.cardImageContainer}>
        <img
          src={card.imageUrl || `/placeholder.svg?height=300&width=250&query=fantasy crisis disaster`}
          alt={card.name}
          className={styles.cardImage}
        />
        <div className={styles.cardType}>{card.type || "Crisis"}</div>
      </div>

      <div className={styles.cardDescription}>
        <p>{card.description}</p>
      </div>

      <div className={styles.crisisImpact}>
        <div className={styles.impactHeader}>Impact</div>
        <p className={styles.impactText}>{card.impact}</p>
      </div>

      <div className={styles.crisisDuration}>
        <div className={styles.durationHeader}>Duration</div>
        <p className={styles.durationText}>{card.duration}</p>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.cardFaction}>{card.faction}</div>
        <div className={styles.cardRarity}>{card.rarity}</div>
      </div>
    </div>
  )
}

export default CrisisCard
