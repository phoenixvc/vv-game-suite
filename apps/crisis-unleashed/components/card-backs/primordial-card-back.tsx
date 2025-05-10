import { FACTION_LOGOS } from "@/constants/factions";
import { getPrimordialRune, getRarityClass } from "@/lib/card-utils";
import styles from "@/styles/card-backs.module.css";
import { CardBackProps } from "@/types/card";

/**
 * Renders a styled card back for a Primordial-themed card, displaying its name, type, set, and decorative elements.
 *
 * Applies rarity-based and dark mode styling, and includes faction-specific icons and runes based on the provided card data.
 *
 * @param card - Card data containing details such as name, rarity, type, set, and id.
 * @param darkMode - If true, applies dark mode styling.
 * @param className - Additional CSS classes to apply to the card back.
 */
export function PrimordialCardBack({ card, darkMode = false, className = "" }: CardBackProps) {
  const rarityClass = getRarityClass(card.rarity, styles);

  return (
    <div
      className={`${styles.cardBack} ${styles.primordialCardBack} ${rarityClass} ${
        darkMode ? styles.darkMode : ""
      } ${className}`}
    >
      <div className={styles.cardBackInner}>
        <div className={styles.cardBackHeader}>
          <div className={styles.cardBackLogo}>
            <div className={styles.primordialLogo}>{FACTION_LOGOS.PRIMORDIAL}</div>
          </div>
          <h3 className={styles.cardBackName}>{card.name}</h3>
        </div>

        <div className={styles.cardBackContent}>
          <div className={styles.primordialVines}></div>
          <div className={styles.primordialRunes}></div>
          <div className={styles.cardBackType}>{card.type || "Hero"}</div>
        </div>

        <div className={styles.cardBackFooter}>
          <div className={styles.cardSet}>{card.set || "Core Set"}</div>
          <div className={styles.primordialRune}>
            {getPrimordialRune(card.id)}
          </div>
        </div>
      </div>
    </div>
  )
}
