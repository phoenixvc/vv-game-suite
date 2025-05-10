import { FACTION_LOGOS } from "@/constants/factions";
import { getEclipsedMark, getRarityClass } from "@/lib/card-utils";
import styles from "@/styles/card-backs.module.css";
import { CardBackProps } from "@/types/card";

/**
 * Renders a styled card back UI for an "Eclipsed" faction card, displaying its name, type, set, and decorative elements.
 *
 * @param card - The card object to display on the card back.
 * @param darkMode - Whether to apply dark mode styling. Defaults to false.
 * @param className - Additional CSS class names to apply.
 *
 * @returns A React element representing the card back.
 *
 * @remark
 * If the card's type or set is missing, "Hero" and "Core Set" are used as defaults, respectively.
 */
export function EclipsedCardBack({ card, darkMode = false, className = "" }: CardBackProps) {
  const rarityClass = getRarityClass(card.rarity, styles);

  return (
    <div
      className={`${styles.cardBack} ${styles.eclipsedCardBack} ${rarityClass} ${
        darkMode ? styles.darkMode : ""
      } ${className}`}
    >
      <div className={styles.cardBackInner}>
        <div className={styles.cardBackHeader}>
          <div className={styles.cardBackLogo}>
            <div className={styles.eclipsedLogo}>{FACTION_LOGOS.ECLIPSED}</div>
          </div>
          <h3 className={styles.cardBackName}>{card.name}</h3>
        </div>

        <div className={styles.cardBackContent}>
          <div className={styles.eclipsedShadow}></div>
          <div className={styles.eclipsedDaggers}></div>
          <div className={styles.cardBackType}>{card.type || "Hero"}</div>
        </div>

        <div className={styles.cardBackFooter}>
          <div className={styles.cardSet}>{card.set || "Core Set"}</div>
          <div className={styles.eclipsedMark}>{getEclipsedMark(card.id)}</div>
        </div>
      </div>
    </div>
  )
}
