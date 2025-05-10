"use client"

import { useState } from "react"
import { CardDesigner } from "@/components/card-designer"
import styles from "@/styles/designer.module.css"

/**
 * Renders the Crisis Unleashed Card Designer page with a toggleable dark mode.
 *
 * Displays a header with a theme toggle button and the card designer interface, applying dark or light theme styles based on user selection.
 */
export default function DesignerPage() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`${styles.container} ${darkMode ? styles.darkMode : ""}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Crisis Unleashed Card Designer</h1>
        <button onClick={toggleDarkMode} className={styles.themeToggle}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <main className={styles.main}>
        <CardDesigner darkMode={darkMode} />
      </main>
    </div>
  )
}
