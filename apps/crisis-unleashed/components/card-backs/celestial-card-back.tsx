import { FACTION_LOGOS } from "@/constants/factions";
import { getCelestialSymbol, getRarityClass } from "@/lib/card-utils";
import styles from "@/styles/card-backs.module.css";
import { CardBackProps } from "@/types/card";

/**
 * Renders a styled celestial-themed card back for a given card object.
 *
 * Displays the card's name, type (defaulting to "Hero" if unspecified), set (defaulting to "Core Set" if unspecified), a celestial faction logo, and a celestial symbol based on the card's ID. Supports optional dark mode and custom CSS class names.
 *
 * @param card - The card object to display on the card back.
 * @param darkMode - Whether to apply dark mode styling. Defaults to false.
 * @param className - Additional CSS class names to apply to the card back container.
 */
export function CelestialCardBack({ card, darkMode = false, className = "" }: CardBackProps) {
  const rarityClass = getRarityClass(card.rarity, styles);

  return (
    <div
      className={`${styles.cardBack} ${styles.celestialCardBack} ${rarityClass} ${
        darkMode ? styles.darkMode : ""
      } ${className}`}
    >
      <div className={styles.cardBackInner}>
        <div className={styles.cardBackHeader}>
          <div className={styles.cardBackLogo}>
            <div className={styles.celestialLogo}>{FACTION_LOGOS.CELESTIAL}</div>
          </div>
          <h3 className={styles.cardBackName}>{card.name}</h3>
        </div>

        <div className={styles.cardBackContent}>
          <div className={styles.celestialStars}></div>
          <div className={styles.celestialConstellation}></div>
          <div className={styles.cardBackType}>{card.type || "Hero"}</div>
        </div>

        <div className={styles.cardBackFooter}>
          <div className={styles.cardSet}>{card.set || "Core Set"}</div>
          <div className={styles.celestialSymbol}>{getCelestialSymbol(card.id)}</div>
        </div>
      </div>
    </div>
  )
}
