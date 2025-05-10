"use client"

import { useState } from "react"
import { useAccessibility } from "@/contexts/accessibility-context"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings, Eye, Zap } from "lucide-react"

/**
 * Renders a floating accessibility controls popover with toggles for reduced motion and high contrast modes.
 *
 * Provides users with quick access to accessibility options, allowing them to minimize animations and increase text contrast. Preferences are persisted for future visits.
 */
export function AccessibilityControls() {
  const [open, setOpen] = useState(false)
  const { reducedMotion, toggleReducedMotion, highContrast, toggleHighContrast } = useAccessibility()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 bg-gray-800/80 border-gray-700 hover:bg-gray-700 hover:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Accessibility options"
        >
          <Settings className="h-5 w-5 text-gray-300" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gray-800/95 border-gray-700 text-gray-200 shadow-lg" side="top" align="end">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibility Options
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="reduced-motion" className="text-sm font-medium">
                  Reduce motion
                </label>
                <p className="text-xs text-gray-400">Minimize animations and motion effects</p>
              </div>
              <Switch
                id="reduced-motion"
                checked={reducedMotion}
                onCheckedChange={toggleReducedMotion}
                aria-label="Toggle reduced motion"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="high-contrast" className="text-sm font-medium">
                  High contrast
                </label>
                <p className="text-xs text-gray-400">Increase text contrast for better readability</p>
              </div>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={toggleHighContrast}
                aria-label="Toggle high contrast"
              />
            </div>
          </div>
          <div className="pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Your accessibility preferences will be saved for future visits
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default AccessibilityControls
