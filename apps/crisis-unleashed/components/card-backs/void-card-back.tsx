import styles from "@/styles/card-backs.module.css"
import { getVoidGlyph, getRarityClass } from "@/lib/card-utils"
import { CardBackProps } from "@/types/card";

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
