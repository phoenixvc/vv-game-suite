"use client"

import { useState } from "react"
import { useTheme } from "@/contexts/theme-context"
import { factionThemes } from "@/lib/faction-themes"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import styles from "@/styles/theme-switcher.module.css"

export function ThemeSwitcher() {
  const { currentTheme, setCurrentTheme, themeData } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId)
    setIsOpen(false)
  }

  return (
    <div className={styles.themeSwitcher}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={styles.themeButton}>
            <div
              className={styles.themeColorIndicator}
              style={{ backgroundColor: themeData?.colors?.primary || "#6366f1" }}
            ></div>
            <span>{themeData?.name || "Default Theme"}</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={styles.themeDropdown}>
          {factionThemes.map((theme) => (
            <DropdownMenuItem key={theme.id} className={styles.themeItem} onClick={() => handleThemeChange(theme.id)}>
              <div className={styles.themeItemContent}>
                <div className={styles.themeColorIndicator} style={{ backgroundColor: theme.colors.primary }}></div>
                <span>{theme.name}</span>
              </div>
              {currentTheme === theme.id && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
