"use client"

import { useTheme } from "@/contexts/theme-context"
import { getRarityClass } from "@/lib/card-utils"
import styles from "@/styles/card-backs.module.css"
import { CardAbility, CardBackProps } from "@/types/card"
import { CelestialCardBack } from "./card-backs/celestial-card-back"
import { CyberneticCardBack } from "./card-backs/cybernetic-card-back"
import { EclipsedCardBack } from "./card-backs/eclipsed-card-back"
import { PrimordialCardBack } from "./card-backs/primordial-card-back"
import { TitanbornCardBack } from "./card-backs/titanborn-card-back"
import { VoidCardBack } from "./card-backs/void-card-back"

export function StandardizedCardBack({ card, darkMode = false, className = "" }: CardBackProps) {
  const { currentTheme } = useTheme()
  const cardType = card.type?.toLowerCase() || "hero"
  const rarityClass = getRarityClass(card.rarity, styles);
  // Render faction-specific card back based on the current theme
  switch (currentTheme) {
    case "cybernetic":
      return <CyberneticCardBack card={card} darkMode={darkMode} className={className} />
    case "primordial":
      return <PrimordialCardBack card={card} darkMode={darkMode} className={className} />
    case "eclipsed":
      return <EclipsedCardBack card={card} darkMode={darkMode} className={className} />
    case "celestial":
      return <CelestialCardBack card={card} darkMode={darkMode} className={className} />
    case "titanborn":
      return <TitanbornCardBack card={card} darkMode={darkMode} className={className} />
    case "void":
      return <VoidCardBack card={card} darkMode={darkMode} className={className} />
    default:
      return (
        <div
         className={`${styles.cardBack} ${styles.defaultCardBack} ${rarityClass} ${darkMode ? styles.darkMode : ""} ${className}`}
     >
          <div className={styles.cardBackHeader}>
            <h3 className={styles.cardBackName}>{card.name}</h3>
            <div className={styles.cardBackType}>{card.type || "Hero"}</div>
          </div>

          <div className={styles.cardBackContent}>
            {cardType === "hero" && (
              <div className={styles.heroBackContent}>
                <div className={styles.statsSection}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Power</span>
                    <span className={styles.statValue}>{card.stats?.power || 0}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Health</span>
                    <span className={styles.statValue}>{card.stats?.health || 0}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Cost</span>
                    <span className={styles.statValue}>{card.stats?.cost || 0}</span>
                  </div>
                </div>

                <div className={styles.abilitiesSection}>
                  <h4 className={styles.sectionTitle}>Abilities</h4>
                  {card.abilities && card.abilities.length > 0 ? (
                    card.abilities.map((ability: CardAbility, index: number) => (
                      <div key={index} className={styles.abilityItem}>
                        <div className={styles.abilityHeader}>
                          <span className={styles.abilityName}>{ability.name || `Ability ${index + 1}`}</span>
                          {ability.cost && <span className={styles.abilityCost}>Cost: {ability.cost}</span>}
                        </div>
                        <p className={styles.abilityDescription}>{ability.description || "No description"}</p>
                      </div>
                    ))
                  ) : (
                    <p className={styles.noContent}>No abilities</p>
                  )}
                </div>
              </div>
            )}

            {cardType === "artifact" && (
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
            )}

            {cardType === "crisis" && (
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
            )}
          </div>

          <div className={styles.cardBackFooter}>
            <div className={styles.cardLore}>{card.lore || "No lore available for this card."}</div>
            <div className={styles.cardSet}>{card.set || "Core Set"}</div>
          </div>
        </div>
      )
    }
}
