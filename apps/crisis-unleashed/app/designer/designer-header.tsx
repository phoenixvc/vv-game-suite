"use client"
import Link from "next/link"
import styles from "@/styles/shared-header.module.css"

interface DesignerHeaderProps {
  darkMode: boolean
  onToggleDarkMode: () => void
}

/**
 * Renders the header for the Designer page with navigation links and a theme toggle button.
 *
 * Displays a logo, navigation menu, and a button to switch between dark and light modes. The appearance and ARIA labels update based on the current theme.
 *
 * @param darkMode - Indicates whether dark mode is active.
 * @param onToggleDarkMode - Callback invoked when the theme toggle button is clicked.
 */
export function DesignerHeader({ darkMode, onToggleDarkMode }: DesignerHeaderProps) {
  return (
    <header className={`${styles.header} ${darkMode ? styles.darkHeader : styles.lightHeader}`}>
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logoLink}>
            <h1 className={styles.logoText}>Crisis Unleashed</h1>
          </Link>
        </div>

        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li className={`${styles.navItem} ${styles.active}`}>
              <Link href="/designer" className={styles.navLink}>
                Designer
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/gallery" className={styles.navLink}>
                Gallery
              </Link>
            </li>
          </ul>
        </nav>

        <button
          onClick={onToggleDarkMode}
          className={`${styles.themeToggle} ${darkMode ? styles.lightMode : styles.darkMode}`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  )
}
