import styles from "@/styles/card-backs.module.css"
import { getVoidGlyph, getRarityClass } from "@/lib/card-utils"
import { CardBackProps } from "@/types/card";

/**
 * Renders a styled card back UI for a "void" card, displaying its name, type, set, and a unique glyph.
 *
 * Applies dynamic styling based on the card's rarity, dark mode preference, and additional class names.
 *
 * @param card - The card data to display on the card back.
 * @param darkMode - Whether to apply dark mode styling. Defaults to false.
 * @param className - Additional CSS class names to apply.
 *
 * @returns The JSX element representing the void card back.
 */
export function VoidCardBack({ card, darkMode = false, className = "" }: CardBackProps) {
  const rarityClass = getRarityClass(card.rarity, styles);

  return (
    <div
      className={`${styles.cardBack} ${styles.voidCardBack} ${rarityClass} ${
        darkMode ? styles.darkMode : ""
      } ${className}`}
    >
      <div className={styles.cardBackInner}>
        <div className={styles.cardBackHeader}>
          <div className={styles.cardBackLogo}>
            <div className={styles.voidLogo}>VH</div>
          </div>
          <h3 className={styles.cardBackName}>{card.name}</h3>
        </div>

        <div className={styles.cardBackContent}>
          <div className={styles.voidRift}></div>
          <div className={styles.voidSymbols}></div>
          <div className={styles.cardBackType}>{card.type || "Hero"}</div>
        </div>

        <div className={styles.cardBackFooter}>
          <div className={styles.cardSet}>{card.set || "Core Set"}</div>
          <div className={styles.voidGlyph}>
            {getVoidGlyph(card.id)}
          </div>
        </div>
      </div>
    </div>
  )
}
