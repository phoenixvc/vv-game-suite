import { FACTION_LOGOS } from "@/constants/factions";
import { getCyberneticCode, getRarityClass } from "@/lib/card-utils";
import styles from "@/styles/card-backs.module.css";
import { CardBackProps } from "@/types/card";

/**
 * Renders a stylized cybernetic-themed card back for a given card.
 *
 * Displays the card's name, type, set, and a generated cybernetic code, with visual elements themed for the Cybernetic faction. Supports optional dark mode and custom CSS classes.
 *
 * @param card - The card object containing details to display on the card back.
 * @param darkMode - If true, applies dark mode styling.
 * @param className - Additional CSS class names to apply to the card back.
 *
 * @returns A React element representing the cybernetic card back.
 */
export function CyberneticCardBack({ card, darkMode = false, className = "" }: CardBackProps) {
  const rarityClass = getRarityClass(card.rarity, styles);

  return (
    <div
      className={`${styles.cardBack} ${styles.cyberneticCardBack} ${rarityClass} ${
        darkMode ? styles.darkMode : ""
      } ${className}`}
    >
      <div className={styles.cardBackInner}>
        <div className={styles.cardBackHeader}>
          <div className={styles.cardBackLogo}>
            <div className={styles.cyberneticLogo}>{FACTION_LOGOS.CYBERNETIC}</div>
          </div>
          <h3 className={styles.cardBackName}>{card.name}</h3>
        </div>

        <div className={styles.cardBackContent}>
          <div className={styles.cyberneticCircuit}></div>
          <div className={styles.cyberneticGrid}></div>
          <div className={styles.cardBackType}>{card.type || "Hero"}</div>
        </div>

        <div className={styles.cardBackFooter}>
          <div className={styles.cardSet}>{card.set || "Core Set"}</div>
          <div className={styles.cyberneticCode}>
            {getCyberneticCode(card.id)}
          </div>
        </div>
      </div>
    </div>
  )
}
