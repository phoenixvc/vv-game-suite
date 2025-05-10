"use client"

import { useState } from "react"
import { EnhancedFactionLogo } from "@/components/enhanced-faction-logo"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/contexts/theme-context"
import { factionThemes } from "@/lib/faction-themes"

export default function LogoShowcase() {
  const { currentTheme, setCurrentTheme, mode, setMode } = useTheme()
  const [size, setSize] = useState(300)
  const [animationDuration, setAnimationDuration] = useState(0.8)
  const [showText, setShowText] = useState(true)
  const [interactive, setInteractive] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)

  // Auto-rotate through factions
  useState(() => {
    if (!autoRotate) return

    const interval = setInterval(() => {
      const currentIndex = factionThemes.findIndex((theme) => theme.id === currentTheme)
      const nextIndex = (currentIndex + 1) % factionThemes.length
      setCurrentTheme(factionThemes[nextIndex].id)
    }, 3000)

    return () => clearInterval(interval)
  }, [autoRotate, currentTheme, setCurrentTheme])

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Enhanced Faction Logo Showcase</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Logo Preview</CardTitle>
            <CardDescription>Interactive preview of the enhanced faction logo</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center">
            <div className="mb-6 flex items-center justify-center" style={{ minHeight: `${size}px` }}>
              <EnhancedFactionLogo
                width={size}
                height={size}
                animationDuration={animationDuration}
                showText={showText}
                interactive={interactive}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => {
                const currentIndex = factionThemes.findIndex((theme) => theme.id === currentTheme)
                const nextIndex = (currentIndex + 1) % factionThemes.length
                setCurrentTheme(factionThemes[nextIndex].id)
              }}
            >
              Switch Faction
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo Settings</CardTitle>
            <CardDescription>Customize the logo appearance and behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme-select">Faction Theme</Label>
              <Select value={currentTheme} onValueChange={(value) => setCurrentTheme(value)}>
                <SelectTrigger id="theme-select">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  {factionThemes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode-select">Display Mode</Label>
              <Select value={mode} onValueChange={(value) => setMode(value as "dark" | "light")}>
                <SelectTrigger id="mode-select">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="light">Light Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Logo Size: {size}px</Label>
              <Slider value={[size]} min={100} max={500} step={10} onValueChange={(value) => setSize(value[0])} />
            </div>

            <div className="space-y-2">
              <Label>Animation Duration: {animationDuration.toFixed(1)}s</Label>
              <Slider
                value={[animationDuration]}
                min={0.2}
                max={2}
                step={0.1}
                onValueChange={(value) => setAnimationDuration(value[0])}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-text">Show Text</Label>
              <Switch id="show-text" checked={showText} onCheckedChange={setShowText} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="interactive">Interactive (Clickable)</Label>
              <Switch id="interactive" checked={interactive} onCheckedChange={setInteractive} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-rotate">Auto-Rotate Factions</Label>
              <Switch id="auto-rotate" checked={autoRotate} onCheckedChange={setAutoRotate} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Implementation Guide</CardTitle>
            <CardDescription>How to use the enhanced faction logo in your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Basic Usage</h3>
              <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                {`import { EnhancedFactionLogo } from "@/components/enhanced-faction-logo"

// In your component:
<EnhancedFactionLogo width={300} height={300} />`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">With Custom Settings</h3>
              <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                {`<EnhancedFactionLogo 
  width={200} 
  height={200}
  animationDuration={0.5}
  showText={false}
  interactive={true}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Responsive Example</h3>
              <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                {`<div className="w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48">
  <EnhancedFactionLogo className="w-full h-full" />
</div>`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
