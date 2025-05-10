import styles from "@/styles/card-backs.module.css"

interface CardBackProps {
  card: any
  darkMode?: boolean
  className?: string
}

export function TitanbornCardBack({ card, darkMode = false, className = "" }: CardBackProps) {
  const rarityClass = card.rarity ? styles[`rarity${card.rarity}`] : ""

  return (
    <div
      className={`${styles.cardBack} ${styles.titanbornCardBack} ${rarityClass} ${
        darkMode ? styles.darkMode : ""
      } ${className}`}
    >
      <div className={styles.cardBackInner}>
        <div className={styles.cardBackHeader}>
          <div className={styles.cardBackLogo}>
            <div className={styles.titanbornLogo}>TB</div>
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
          <div className={styles.titanbornMark}>⚒</div>
        </div>
      </div>
    </div>
  )
}
