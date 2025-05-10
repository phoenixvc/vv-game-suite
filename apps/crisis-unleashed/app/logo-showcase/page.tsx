"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ResponsiveAnimatedLogo } from "@/components/responsive-animated-logo"
import { LogoErrorBoundary } from "@/components/error-boundaries/logo-error-boundary"
import { Copy, Download, Play, Pause, Code, Zap, Shield, Palette } from "lucide-react"

// Define the available logo variants
const VARIANTS = [
  { id: "standard", name: "Standard", description: "Default full logo" },
  { id: "compact", name: "Compact", description: "Smaller version for tight spaces" },
  { id: "horizontal", name: "Horizontal", description: "Logo with text to the right" },
  { id: "vertical", name: "Vertical", description: "Logo with text below" },
  { id: "icon-only", name: "Icon Only", description: "Just the icon, no text" },
  { id: "text-only", name: "Text Only", description: "Just the text, no icon" },
  { id: "footer", name: "Footer", description: "Optimized for footer" },
  { id: "mobile", name: "Mobile", description: "Mobile-specific version" },
  { id: "print", name: "Print", description: "High contrast for print" },
  { id: "watermark", name: "Watermark", description: "Subtle background version" },
  { id: "animated", name: "Animated", description: "Animated version for hero sections" },
]

const SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"]

const FACTIONS = [
  { id: "cybernetic-nexus", name: "Cybernetic Nexus", color: "blue" },
  { id: "primordial-ascendancy", name: "Primordial Ascendancy", color: "green" },
  { id: "void-harbingers", name: "Void Harbingers", color: "purple" },
  { id: "eclipsed-order", name: "Eclipsed Order", color: "gray" },
  { id: "titanborn", name: "Titanborn", color: "orange" },
  { id: "celestial-dominion", name: "Celestial Dominion", color: "yellow" },
]

// Animation presets
const ANIMATIONS = [
  { id: "none", name: "None", description: "No animation" },
  { id: "pulse", name: "Pulse", description: "Subtle pulsing effect" },
  { id: "fade", name: "Fade", description: "Smooth fade in/out" },
  { id: "rotate", name: "Rotate", description: "Slow rotation" },
  { id: "bounce", name: "Bounce", description: "Playful bounce" },
  { id: "glitch", name: "Glitch", description: "Digital distortion", faction: "cybernetic-nexus" },
  { id: "grow", name: "Grow", description: "Organic growth", faction: "primordial-ascendancy" },
  { id: "void-pulse", name: "Void Pulse", description: "Mysterious pulse", faction: "void-harbingers" },
  { id: "shadow", name: "Shadow", description: "Shadow reveal", faction: "eclipsed-order" },
  { id: "forge", name: "Forge", description: "Strong impact", faction: "titanborn" },
  { id: "shimmer", name: "Shimmer", description: "Starry shimmer", faction: "celestial-dominion" },
]

/**
 * Renders an interactive page for exploring, customizing, and exporting Crisis Unleashed logo variants.
 *
 * Provides a tabbed interface to preview and configure logo variants, sizes, factions, and animations, with live previews and export options for SVG and React code. Includes sections for all logo variants, animation presets, and faction-themed logos with color palettes.
 */
export default function LogoShowcasePage() {
  const [selectedVariant, setSelectedVariant] = useState("standard")
  const [selectedSize, setSelectedSize] = useState("md")
  const [selectedFaction, setSelectedFaction] = useState("cybernetic-nexus")
  const [selectedAnimation, setSelectedAnimation] = useState("none")
  const [interactive, setInteractive] = useState(false)
  const [monochrome, setMonochrome] = useState(false)
  const [inverted, setInverted] = useState(false)
  const [withTagline, setWithTagline] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showErrorBoundary, setShowErrorBoundary] = useState(true)
  const [darkBackground, setDarkBackground] = useState(false)

  // Function to copy SVG code to clipboard
  const copySvgToClipboard = () => {
    // This is a placeholder - in a real implementation, you would get the actual SVG code
    const svgCode = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- SVG content for ${selectedVariant} logo -->
    </svg>`

    navigator.clipboard
      .writeText(svgCode)
      .then(() => {
        alert("SVG code copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy SVG code:", err)
      })
  }

  // Function to download SVG
  const downloadSvg = () => {
    // This is a placeholder - in a real implementation, you would generate the actual SVG file
    const svgContent = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- SVG content for ${selectedVariant} logo -->
    </svg>`

    const blob = new Blob([svgContent], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `crisis-unleashed-logo-${selectedVariant}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Function to copy React component code
  const copyReactCode = () => {
    const code = `<ResponsiveAnimatedLogo 
  variant="${selectedVariant}"
  size="${selectedSize}"
  faction="${selectedFaction}"
  interactive={${interactive}}
  monochrome={${monochrome}}
  inverted={${inverted}}
  withTagline={${withTagline}}
/>`

    navigator.clipboard
      .writeText(code)
      .then(() => {
        alert("React component code copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy code:", err)
      })
  }

  const renderLogo = () => {
    const logo = (
      <div
        className={`${selectedAnimation !== "none" && isPlaying ? `animate-${selectedAnimation}` : ""}`}
        style={{
          animationDuration: `${2 / animationSpeed}s`,
        }}
      >
        <ResponsiveAnimatedLogo
          variant={selectedVariant as any}
          size={selectedSize as any}
          faction={selectedFaction}
          interactive={interactive}
          monochrome={monochrome}
          inverted={inverted || darkBackground}
          withTagline={withTagline}
          animated={selectedAnimation !== "none" && isPlaying}
        />
      </div>
    )

    return showErrorBoundary ? (
      <LogoErrorBoundary size={selectedSize as any} variant="standard" fallbackClassName="">
        {logo}
      </LogoErrorBoundary>
    ) : (
      logo
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Logo System Showcase</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Explore and customize the Crisis Unleashed logo system</p>

      <Tabs defaultValue="interactive" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="interactive">Interactive Preview</TabsTrigger>
          <TabsTrigger value="variants">All Variants</TabsTrigger>
          <TabsTrigger value="animations">Animation Library</TabsTrigger>
          <TabsTrigger value="factions">Faction Themes</TabsTrigger>
        </TabsList>

        <TabsContent value="interactive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo Customizer</CardTitle>
              <CardDescription>Create and preview your perfect logo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Variant</h3>
                    <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select variant" />
                      </SelectTrigger>
                      <SelectContent>
                        {VARIANTS.map((variant) => (
                          <SelectItem key={variant.id} value={variant.id}>
                            <div className="flex flex-col">
                              <span>{variant.name}</span>
                              <span className="text-xs text-gray-500">{variant.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Size</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {SIZES.map((size) => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? "default" : "outline"}
                          onClick={() => setSelectedSize(size)}
                          className="uppercase"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Faction</h3>
                    <Select value={selectedFaction} onValueChange={setSelectedFaction}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select faction" />
                      </SelectTrigger>
                      <SelectContent>
                        {FACTIONS.map((faction) => (
                          <SelectItem key={faction.id} value={faction.id}>
                            {faction.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Animation</h3>
                    <Select value={selectedAnimation} onValueChange={setSelectedAnimation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select animation" />
                      </SelectTrigger>
                      <SelectContent>
                        {ANIMATIONS.map((animation) => (
                          <SelectItem key={animation.id} value={animation.id}>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <span>{animation.name}</span>
                                {animation.faction && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {FACTIONS.find((faction) => faction.id === animation.faction)?.name.split(" ")[0]}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">{animation.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedAnimation !== "none" && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Animation Speed: {animationSpeed}x</Label>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="h-8 px-2"
                              >
                                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <Slider
                            value={[animationSpeed]}
                            min={0.25}
                            max={3}
                            step={0.25}
                            onValueChange={(value) => setAnimationSpeed(value[0])}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="interactive" checked={interactive} onCheckedChange={setInteractive} />
                        <Label htmlFor="interactive">Interactive</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="monochrome" checked={monochrome} onCheckedChange={setMonochrome} />
                        <Label htmlFor="monochrome">Monochrome</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="withTagline" checked={withTagline} onCheckedChange={setWithTagline} />
                        <Label htmlFor="withTagline">With Tagline</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="errorBoundary" checked={showErrorBoundary} onCheckedChange={setShowErrorBoundary} />
                        <Label htmlFor="errorBoundary">Error Boundary</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium">Preview</h3>
                      <div className="flex items-center space-x-2">
                        <Switch id="darkBackground" checked={darkBackground} onCheckedChange={setDarkBackground} />
                        <Label htmlFor="darkBackground">Dark Background</Label>
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-center p-8 border rounded-lg min-h-[300px] transition-colors ${
                        darkBackground
                          ? "bg-gray-900 text-white"
                          : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
                      }`}
                    >
                      {renderLogo()}
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <Button onClick={copySvgToClipboard} variant="outline" size="sm">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy SVG
                      </Button>
                      <Button onClick={downloadSvg} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download SVG
                      </Button>
                      <Button onClick={copyReactCode} size="sm">
                        <Code className="mr-2 h-4 w-4" />
                        Copy React Code
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-3">Component Usage</h3>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
                        {`import { ResponsiveAnimatedLogo } from '@/components/responsive-animated-logo';

<ResponsiveAnimatedLogo 
  variant="${selectedVariant}"
  size="${selectedSize}"
  faction="${selectedFaction}"
  interactive={${interactive}}
  monochrome={${monochrome}}
  inverted={${inverted || darkBackground}}
  withTagline={${withTagline}}
/>`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo Variants</CardTitle>
              <CardDescription>All available logo variants in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {VARIANTS.map((variant) => (
                  <Card key={variant.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{variant.name}</CardTitle>
                      <CardDescription className="text-xs">{variant.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 flex justify-center items-center min-h-[150px] bg-gray-50 dark:bg-gray-900">
                      <ResponsiveAnimatedLogo variant={variant.id as any} size="md" faction={selectedFaction} />
                    </CardContent>
                    <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
                      <code className="text-xs">{`import { ResponsiveAnimatedLogo } from '@/components/responsive-animated-logo';

<ResponsiveAnimatedLogo variant="${variant.id}" />`}</code>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Size Comparison</CardTitle>
              <CardDescription>Logo sizes from extra small to 2x large</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {SIZES.map((size) => (
                    <div key={size} className="flex flex-col items-center">
                      <div className="mb-2 p-4 border rounded-lg flex items-center justify-center min-h-[100px] min-w-[100px]">
                        <ResponsiveAnimatedLogo variant="standard" size={size as any} faction={selectedFaction} />
                      </div>
                      <span className="text-sm font-medium uppercase">{size}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full max-w-2xl">
                  <div className="p-6 border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Size Guidelines</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">xs (16px)</span>
                        <span className="text-sm text-gray-500">Favicons, small UI elements</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">sm (24px)</span>
                        <span className="text-sm text-gray-500">Mobile navigation, compact UI</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">md (32px)</span>
                        <span className="text-sm text-gray-500">Standard UI elements, buttons</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">lg (48px)</span>
                        <span className="text-sm text-gray-500">Headers, prominent UI elements</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">xl (64px)</span>
                        <span className="text-sm text-gray-500">Hero sections, featured content</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">2xl (96px)</span>
                        <span className="text-sm text-gray-500">Splash screens, large displays</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="animations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Animation Library</CardTitle>
              <CardDescription>Predefined animations for logo elements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ANIMATIONS.filter((a) => a.id !== "none").map((animation) => (
                  <Card key={animation.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{animation.name}</CardTitle>
                        {animation.faction && (
                          <Badge variant="outline">
                            {FACTIONS.find((faction) => faction.id === animation.faction)?.name.split(" ")[0]}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs">{animation.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 flex justify-center items-center min-h-[150px] bg-gray-50 dark:bg-gray-900">
                      <div className={`animate-${animation.id}`}>
                        <ResponsiveAnimatedLogo
                          variant="standard"
                          size="md"
                          faction={animation.faction || selectedFaction}
                        />
                      </div>
                    </CardContent>
                    <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
                      <code className="text-xs">{`import { ResponsiveAnimatedLogo } from '@/components/responsive-animated-logo';

<div className="animate-${animation.id}">
  <ResponsiveAnimatedLogo variant="standard" />
</div>`}</code>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Animation Performance Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="p-4">
                      <div className="flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-amber-500" />
                        <CardTitle className="text-base">Optimize Performance</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm">
                        Use transform and opacity for animations instead of properties that trigger layout changes.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-green-500" />
                        <CardTitle className="text-base">Accessibility</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm">
                        Respect user preferences with prefers-reduced-motion media query for animations.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4">
                      <div className="flex items-center">
                        <Palette className="h-5 w-5 mr-2 text-blue-500" />
                        <CardTitle className="text-base">Theme Matching</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm">
                        Use faction-specific animations that match the visual language of each theme.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Faction-Themed Logos</CardTitle>
              <CardDescription>Logo variations for each faction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FACTIONS.map((faction) => (
                  <Card key={faction.id} className="overflow-hidden">
                    <CardHeader
                      className="p-4"
                      style={{
                        borderBottom: `2px solid var(--${faction.color}-500, #888)`,
                      }}
                    >
                      <CardTitle className="text-base">{faction.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-2">
                        <div className="p-6 flex justify-center items-center min-h-[120px] bg-gray-50 dark:bg-gray-900">
                          <ResponsiveAnimatedLogo variant="standard" size="sm" faction={faction.id} />
                        </div>
                        <div className="p-6 flex justify-center items-center min-h-[120px] bg-gray-900 text-white">
                          <ResponsiveAnimatedLogo variant="standard" size="sm" faction={faction.id} inverted={true} />
                        </div>
                      </div>
                      <div className="grid grid-cols-3">
                        <div className="p-4 flex justify-center items-center border-t">
                          <ResponsiveAnimatedLogo variant="icon-only" size="sm" faction={faction.id} />
                        </div>
                        <div className="p-4 flex justify-center items-center border-t border-l border-r">
                          <ResponsiveAnimatedLogo variant="compact" size="xs" faction={faction.id} />
                        </div>
                        <div className="p-4 flex justify-center items-center border-t">
                          <div className={`animate-${ANIMATIONS.find((a) => a.faction === faction.id)?.id || "pulse"}`}>
                            <ResponsiveAnimatedLogo variant="icon-only" size="xs" faction={faction.id} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
                      <code className="text-xs">{`import { ResponsiveAnimatedLogo } from '@/components/responsive-animated-logo';

<ResponsiveAnimatedLogo faction="${faction.id}" />`}</code>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Faction Color Palettes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {FACTIONS.map((faction) => (
                    <div key={faction.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{faction.name}</h4>
                      <div className="flex space-x-2">
                        <div
                          className={`w-8 h-8 rounded-full bg-${faction.color}-200 dark:bg-${faction.color}-900`}
                        ></div>
                        <div
                          className={`w-8 h-8 rounded-full bg-${faction.color}-400 dark:bg-${faction.color}-700`}
                        ></div>
                        <div
                          className={`w-8 h-8 rounded-full bg-${faction.color}-600 dark:bg-${faction.color}-500`}
                        ></div>
                        <div
                          className={`w-8 h-8 rounded-full bg-${faction.color}-800 dark:bg-${faction.color}-300`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
