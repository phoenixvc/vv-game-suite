"use client"

import { useState } from "react"
import { useFactionAnimations } from "@/hooks/use-faction-animations"
import { useTheme } from "@/contexts/theme-context"
import { factionThemes } from "@/lib/faction-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimationErrorBoundary } from "./error-boundaries/animation-error-boundary"

export function AnimationDemo() {
  const { currentTheme, themeData } = useTheme()
  const { getAnimationStyle } = useFactionAnimations()
  const [category, setCategory] = useState("background")
  const [intensity, setIntensity] = useState("medium")

  // Get current faction animations
  const currentFaction = factionThemes.find((theme) => theme.id === currentTheme)

  // Animation categories
  const categories = [
    { id: "background", name: "Background" },
    { id: "card", name: "Card" },
    { id: "button", name: "Button" },
    { id: "interface", name: "Interface" },
    { id: "text", name: "Text" },
    { id: "icon", name: "Icon" },
    { id: "loading", name: "Loading" },
    { id: "transition", name: "Transition" },
    { id: "effect", name: "Effect" },
  ]

  // Get animations for current category
  const getAnimationsForCategory = () => {
    if (!currentTheme) return []

    const factionId = currentTheme
    const animations = []

    // Import animations dynamically based on faction
    let factionAnimations
    switch (factionId) {
      case "cybernetic-nexus":
        factionAnimations = require("@/lib/animations/cybernetic-animations").cyberneticAnimations
        break
      case "primordial-ascendancy":
        factionAnimations = require("@/lib/animations/primordial-animations").primordialAnimations
        break
      case "eclipsed-order":
        factionAnimations = require("@/lib/animations/eclipsed-animations").eclipsedAnimations
        break
      case "celestial-dominion":
        factionAnimations = require("@/lib/animations/celestial-animations").celestialAnimations
        break
      case "titanborn":
        factionAnimations = require("@/lib/animations/titanborn-animations").titanbornAnimations
        break
      case "void-harbingers":
        factionAnimations = require("@/lib/animations/void-animations").voidAnimations
        break
      default:
        factionAnimations = require("@/lib/animations/common-animations").commonAnimations
    }

    // Get animation names for the current category
    if (factionAnimations && factionAnimations[category]) {
      for (const animName in factionAnimations[category]) {
        animations.push(animName)
      }
    }

    return animations
  }

  const animations = getAnimationsForCategory()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{currentFaction?.name || "Default"} Animation Library</h1>

      <div className="mb-6">
        <Tabs defaultValue={category} onValueChange={(value) => setCategory(value)}>
          <TabsList className="grid grid-cols-3 md:grid-cols-9 mb-4">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id}>
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex justify-center space-x-4 mb-6">
          <Button variant={intensity === "subtle" ? "default" : "outline"} onClick={() => setIntensity("subtle")}>
            Subtle
          </Button>
          <Button variant={intensity === "medium" ? "default" : "outline"} onClick={() => setIntensity("medium")}>
            Medium
          </Button>
          <Button variant={intensity === "intense" ? "default" : "outline"} onClick={() => setIntensity("intense")}>
            Intense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animations.map((animName) => (
          <Card key={animName} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">{animName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <AnimationErrorBoundary animationName={animName}>
                  <div
                    className="w-32 h-32 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4"
                    style={{
                      ...getAnimationStyle(category, animName, { intensity }).animation,
                      backgroundColor: themeData?.colors?.secondary,
                      color: themeData?.colors?.text,
                    }}
                  >
                    <span className="text-sm">{animName}</span>
                  </div>
                </AnimationErrorBoundary>
                <code className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded w-full overflow-x-auto">
                  {`getAnimationStyle("${category}", "${animName}", { intensity: "${intensity}" })`}
                </code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
