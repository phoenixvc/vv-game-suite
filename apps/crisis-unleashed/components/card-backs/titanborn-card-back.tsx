import { FACTION_LOGOS } from "@/constants/factions";
import { getRarityClass, getTitanbornMark } from "@/lib/card-utils";
import styles from "@/styles/card-backs.module.css";
import { CardBackProps } from "@/types/card";

/**
 * Renders the back side of a Titanborn faction card with styling and details based on the provided card data.
 *
 * Displays the Titanborn logo, card name, type (defaulting to "Hero" if unspecified), set (defaulting to "Core Set" if unspecified), and a Titanborn-specific mark derived from the card's ID. Supports optional dark mode and additional CSS classes.
 *
 * @param card - Card data including rarity, name, type, set, and id.
 * @param darkMode - If true, applies dark mode styling.
 * @param className - Additional CSS classes to apply to the card back.
 *
 * @returns The JSX element representing the styled Titanborn card back.
 */
export function TitanbornCardBack({ card, darkMode = false, className = "" }: CardBackProps) {
  const rarityClass = getRarityClass(card.rarity, styles);

  return (
    <div
      className={`${styles.cardBack} ${styles.titanbornCardBack} ${rarityClass} ${
        darkMode ? styles.darkMode : ""
      } ${className}`}
    >
      <div className={styles.cardBackInner}>
        <div className={styles.cardBackHeader}>
          <div className={styles.cardBackLogo}>
            <div className={styles.titanbornLogo}>{FACTION_LOGOS.TITANBORN}</div>
          </div>
          <h3 className={styles.cardBackName}>{card.name}</h3>
        </div>

        <div className={styles.cardBackContent}>
          <div className={styles.titanbornStone}></div>
          <div className={styles.titanbornRunes}></div>
          <div className={styles.cardBackType}>{card.type || "Hero"}</div>
        </div>

        <div className={styles.cardBackFooter}>
          <div className={styles.cardSet}>{card.set || "Core Set"}</div>
          <div className={styles.titanbornMark}>{getTitanbornMark(card.id)}</div>
        </div>
      </div>
    </div>
  )
}
