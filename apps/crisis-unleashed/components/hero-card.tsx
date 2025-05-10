"use client"

import type React from "react"
import type { CardData } from "@/lib/card-data"
import styles from "@/styles/card-styles.module.css"
import { useState } from "react"

// Update the HeroCardProps interface to include showFront
interface HeroCardProps {
  card: CardData
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  showFront?: boolean
}

// Update the component to use the showFront prop
const HeroCard: React.FC<HeroCardProps> = ({ card, size = "md", onClick, showFront = true }) => {
  const sizeClass = size === "sm" ? styles.cardSm : size === "lg" ? styles.cardLg : styles.cardMd
  const factionClass = card.faction ? styles[`faction${card.faction}`] : ""
  const rarityClass = card.rarity ? styles[`rarity${card.rarity}`] : ""
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const getImageUrl = () => {
    if (imageError || !card.imageUrl) {
      return `/placeholder.svg?height=300&width=250&query=${encodeURIComponent(`fantasy ${card.name.toLowerCase()}`)}`
    }
    return card.imageUrl
  }

  if (!showFront) {
    return (
      <div
        className={`${styles.heroCard} ${sizeClass} ${factionClass} ${rarityClass}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <div className={styles.cardBack}>
          <div className={styles.cardBackHeader}>
            <h3 className={styles.cardBackName}>{card.name}</h3>
            <div className={styles.cardBackType}>{card.type || "Hero"}</div>
          </div>
          <div className={styles.cardBackContent}>
            <div className={styles.statsSection}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Health</span>
                <span className={styles.statValue}>{card.health || 0}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Attack</span>
                <span className={styles.statValue}>{card.attack || 0}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Defense</span>
                <span className={styles.statValue}>{card.defense || 0}</span>
              </div>
            </div>
            <div className={styles.abilitiesSection}>
              <h4 className={styles.sectionTitle}>Abilities</h4>
              {card.abilities && card.abilities.length > 0 ? (
                card.abilities.map((ability, index) => (
                  <div key={index} className={styles.abilityItem}>
                    <div className={styles.abilityHeader}>
                      <span className={styles.abilityName}>{ability.name}</span>
                      {ability.cost !== undefined && <span className={styles.abilityCost}>{ability.cost}</span>}
                    </div>
                    <p className={styles.abilityDescription}>{ability.description}</p>
                  </div>
                ))
              ) : (
                <p className={styles.noContent}>No abilities</p>
              )}
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
      className={`${styles.heroCard} ${sizeClass} ${factionClass} ${rarityClass}`}
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
          src={getImageUrl() || "/placeholder.svg"}
          alt={card.name}
          className={styles.cardImage}
          onError={handleImageError}
        />
        <div className={styles.cardType}>{card.type || "Hero"}</div>
      </div>

      <div className={styles.cardStats}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>❤️</span>
          <span className={styles.statValue}>{card.health || 0}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>⚔️</span>
          <span className={styles.statValue}>{card.attack || 0}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>🛡️</span>
          <span className={styles.statValue}>{card.defense || 0}</span>
        </div>
      </div>

      <div className={styles.cardDescription}>
        <p>{card.description}</p>
      </div>

      {card.abilities && card.abilities.length > 0 && (
        <div className={styles.cardAbilities}>
          {card.abilities.slice(0, 2).map((ability, index) => (
            <div key={index} className={styles.abilityItem}>
              <div className={styles.abilityHeader}>
                <span className={styles.abilityName}>{ability.name}</span>
                {ability.cost !== undefined && <span className={styles.abilityCost}>{ability.cost}</span>}
              </div>
              <p className={styles.abilityDescription}>{ability.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className={styles.cardFooter}>
        <div className={styles.cardFaction}>{card.faction}</div>
        <div className={styles.cardRarity}>{card.rarity}</div>
      </div>
    </div>
  )
}

export default HeroCard
