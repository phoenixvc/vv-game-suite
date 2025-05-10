"use client"

import type React from "react"
import type { CardData } from "@/lib/card-data"
import styles from "@/styles/card-styles.module.css"

// Update the ArtifactCardProps interface to include showFront
interface ArtifactCardProps {
  card: CardData
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  showFront?: boolean
}

// Update the component to use the showFront prop
const ArtifactCard: React.FC<ArtifactCardProps> = ({ card, size = "md", onClick, showFront = true }) => {
  const sizeClass = size === "sm" ? styles.cardSm : size === "lg" ? styles.cardLg : styles.cardMd
  const factionClass = card.faction ? styles[`faction${card.faction}`] : ""
  const rarityClass = card.rarity ? styles[`rarity${card.rarity}`] : ""

  if (!showFront) {
    return (
      <div
        className={`${styles.artifactCard} ${sizeClass} ${factionClass} ${rarityClass}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <div className={styles.cardBack}>
          <div className={styles.cardBackHeader}>
            <h3 className={styles.cardBackName}>{card.name}</h3>
            <div className={styles.cardBackType}>{card.type || "Artifact"}</div>
          </div>
          <div className={styles.cardBackContent}>
            <div className={styles.artifactBackContent}>
              <div className={styles.artifactEffect}>
                <h4 className={styles.sectionTitle}>Effect</h4>
                <p>{card.effect || "No effect description available."}</p>
              </div>

              <div className={styles.artifactRequirements}>
                <h4 className={styles.sectionTitle}>Requirements</h4>
                <p>{card.requirements || "No special requirements."}</p>
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
      className={`${styles.artifactCard} ${sizeClass} ${factionClass} ${rarityClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardName}>{card.name}</h3>
        <div className={styles.cardCost}>{card.provision || 0}</div>
      </div>

      <div className={styles.cardImageContainer}>
        <img
          src={card.imageUrl || `/placeholder.svg?height=300&width=250&query=fantasy artifact item`}
          alt={card.name}
          className={styles.cardImage}
        />
        <div className={styles.cardType}>{card.type || "Artifact"}</div>
      </div>

      <div className={styles.cardDescription}>
        <p>{card.description}</p>
      </div>

      <div className={styles.artifactEffect}>
        <div className={styles.effectHeader}>Effect</div>
        <p className={styles.effectText}>{card.effect}</p>
      </div>

      {card.requirements && (
        <div className={styles.artifactRequirements}>
          <div className={styles.requirementsHeader}>Requirements</div>
          <p className={styles.requirementsText}>{card.requirements}</p>
        </div>
      )}

      <div className={styles.cardFooter}>
        <div className={styles.cardFaction}>{card.faction}</div>
        <div className={styles.cardRarity}>{card.rarity}</div>
      </div>
    </div>
  )
}

export default ArtifactCard
