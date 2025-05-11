"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FaviconSettingsProps {
  backgroundColor: string
  setBackgroundColor: (value: string) => void
  padding: number
  setPadding: (value: number) => void
  borderRadius: number
  setBorderRadius: (value: number) => void
  size: number
  setSize: (value: number) => void
  monochrome: boolean
  setMonochrome: (value: boolean) => void
  inverted: boolean
  setInverted: (value: boolean) => void
  faviconType: "standard" | "letter" | "icon"
  setFaviconType: (value: "standard" | "letter" | "icon") => void
}

/**
 * Renders a settings panel for customizing favicon appearance.
 *
 * Provides controls for selecting favicon type, background color, padding, border radius, size, and toggling monochrome and inverted modes. All changes are propagated via callback props for state management in the parent component.
 */
export function FaviconSettings({
  backgroundColor,
  setBackgroundColor,
  padding,
  setPadding,
  borderRadius,
  setBorderRadius,
  size,
  setSize,
  monochrome,
  setMonochrome,
  inverted,
  setInverted,
  faviconType,
  setFaviconType
}: FaviconSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Favicon Settings</CardTitle>
        <CardDescription>Customize your favicon appearance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Favicon Type</Label>
          <Tabs defaultValue="standard" value={faviconType} onValueChange={(value) => setFaviconType(value as "standard" | "letter" | "icon")}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="standard">Standard</TabsTrigger>
              <TabsTrigger value="letter">Letter</TabsTrigger>
              <TabsTrigger value="icon">Icon</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bg-color">Background Color</Label>
          <div className="flex items-center gap-2">
            <input
              id="bg-color"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="h-8 w-8 rounded border"
              aria-label="Background Color"
              title="Choose background color"
            />
            <span className="text-sm font-mono">{backgroundColor}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="padding-slider">Padding</Label>
            <span className="text-sm">{padding}px</span>
          </div>
          <Slider
            id="padding-slider"
            min={0}
            max={20}
            step={1}
            value={[padding]}
            onValueChange={(value) => setPadding(value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="radius-slider">Border Radius</Label>
            <span className="text-sm">{borderRadius}%</span>
          </div>
          <Slider
            id="radius-slider"
            min={0}
            max={50}
            step={1}
            value={[borderRadius]}
            onValueChange={(value) => setBorderRadius(value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="size-slider">Size</Label>
            <span className="text-sm">{size}px</span>
          </div>
          <Slider
            id="size-slider"
            min={16}
            max={512}
            step={16}
            value={[size]}
            onValueChange={(value) => setSize(value[0])}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="monochrome" checked={monochrome} onCheckedChange={setMonochrome} />
          <Label htmlFor="monochrome">Monochrome</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="inverted" checked={inverted} onCheckedChange={setInverted} />
          <Label htmlFor="inverted">Inverted</Label>
        </div>
      </CardContent>
    </Card>
  )
}