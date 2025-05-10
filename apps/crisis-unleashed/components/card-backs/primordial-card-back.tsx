import styles from "@/styles/card-backs.module.css"

interface CardBackProps {
  card: any
  darkMode?: boolean
  className?: string
}

export function PrimordialCardBack({ card, darkMode = false, className = "" }: CardBackProps) {
  const rarityClass = card.rarity ? styles[`rarity${card.rarity}`] : ""

  return (
    <div
      className={`${styles.cardBack} ${styles.primordialCardBack} ${rarityClass} ${
        darkMode ? styles.darkMode : ""
      } ${className}`}
    >
      <div className={styles.cardBackInner}>
        <div className={styles.cardBackHeader}>
          <div className={styles.cardBackLogo}>
            <div className={styles.primordialLogo}>PA</div>
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
            {String.fromCharCode(8448 + (card.id ? card.id.charCodeAt(0) % 20 : 0))}
          </div>
        </div>
      </div>
    </div>
  )
}
