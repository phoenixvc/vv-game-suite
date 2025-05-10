"use client"

import { useState } from "react"
import { CardDesigner } from "@/components/card-designer"
import styles from "@/styles/designer.module.css"

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
