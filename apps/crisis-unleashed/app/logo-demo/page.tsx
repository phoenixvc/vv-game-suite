"use client"

import { useState } from "react"
import { ResponsiveAnimatedLogo } from "@/components/responsive-animated-logo"
import type { LogoSize } from "@/components/logo-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const variants = [
  "standard",
  "compact",
  "horizontal",
  "vertical",
  "icon-only",
  "text-only",
  "footer",
  "mobile",
  "print",
  "watermark",
  "animated",
]

const sizes: LogoSize[] = ["xs", "sm", "md", "lg", "xl", "2xl"]

const factions = [
  "cybernetic-nexus",
  "primordial-ascendancy",
  "void-harbingers",
  "eclipsed-order",
  "titanborn",
  "celestial-dominion",
]

/**
 * Renders an interactive demo page for previewing and customizing a logo system.
 *
 * Provides controls for selecting logo variant, size, faction, and visual options such as interactivity, monochrome, inverted colors, and tagline display. Displays a live preview and grids showing all variants, sizes, and factions with the current settings.
 */
export default function LogoDemoPage() {
  const [selectedVariant, setSelectedVariant] = useState<string>("standard")
  const [selectedSize, setSelectedSize] = useState<LogoSize>("lg")
  const [selectedFaction, setSelectedFaction] = useState<string>("cybernetic-nexus")
  const [interactive, setInteractive] = useState<boolean>(false)
  const [monochrome, setMonochrome] = useState<boolean>(false)
  const [inverted, setInverted] = useState<boolean>(false)
  const [withTagline, setWithTagline] = useState<boolean>(false)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Logo System Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Logo Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center min-h-[200px] bg-muted/20 rounded-md">
            <ResponsiveAnimatedLogo
              variant={selectedVariant as any}
              size={selectedSize}
              faction={selectedFaction}
              interactive={interactive}
              monochrome={monochrome}
              inverted={inverted}
              withTagline={withTagline}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="variant">Variant</Label>
              <Select value={selectedVariant} onValueChange={(value) => setSelectedVariant(value)}>
                <SelectTrigger id="variant">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {variants.map((variant) => (
                    <SelectItem key={variant} value={variant}>
                      {variant.charAt(0).toUpperCase() + variant.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Select value={selectedSize} onValueChange={(value) => setSelectedSize(value as LogoSize)}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="faction">Faction</Label>
              <Select value={selectedFaction} onValueChange={setSelectedFaction}>
                <SelectTrigger id="faction">
                  <SelectValue placeholder="Select faction" />
                </SelectTrigger>
                <SelectContent>
                  {factions.map((faction) => (
                    <SelectItem key={faction} value={faction}>
                      {faction
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="interactive" checked={interactive} onCheckedChange={setInteractive} />
              <Label htmlFor="interactive">Interactive</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="monochrome" checked={monochrome} onCheckedChange={setMonochrome} />
              <Label htmlFor="monochrome">Monochrome</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="inverted" checked={inverted} onCheckedChange={setInverted} />
              <Label htmlFor="inverted">Inverted</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="withTagline" checked={withTagline} onCheckedChange={setWithTagline} />
              <Label htmlFor="withTagline">With Tagline</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">All Variants</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {variants.map((variant) => (
          <Card key={variant}>
            <CardHeader className="p-4">
              <CardTitle className="text-sm capitalize">{variant}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex justify-center items-center min-h-[100px] bg-muted/20 rounded-md">
              <ResponsiveAnimatedLogo
                variant={variant as any}
                size="md"
                faction={selectedFaction}
                interactive={interactive}
                monochrome={monochrome}
                inverted={inverted}
                withTagline={withTagline}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">All Sizes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {sizes.map((size) => (
          <Card key={size}>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">{size}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex justify-center items-center min-h-[100px] bg-muted/20 rounded-md">
              <ResponsiveAnimatedLogo
                variant={selectedVariant as any}
                size={size}
                faction={selectedFaction}
                interactive={interactive}
                monochrome={monochrome}
                inverted={inverted}
                withTagline={withTagline}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">All Factions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {factions.map((faction) => (
          <Card key={faction}>
            <CardHeader className="p-4">
              <CardTitle className="text-sm capitalize">
                {faction
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex justify-center items-center min-h-[100px] bg-muted/20 rounded-md">
              <ResponsiveAnimatedLogo
                variant={selectedVariant as any}
                size="md"
                faction={faction}
                interactive={interactive}
                monochrome={monochrome}
                inverted={inverted}
                withTagline={withTagline}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
