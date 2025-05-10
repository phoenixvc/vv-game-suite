"use client"

import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeModeToggle() {
  const { mode, setMode } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
    >
      {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
