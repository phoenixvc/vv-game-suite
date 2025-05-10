"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { LogoSystem } from "@/components/logo-system/logo-variant"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download } from "lucide-react"

const factions = [
  "cybernetic-nexus",
  "primordial-ascendancy",
  "void-harbingers",
  "eclipsed-order",
  "titanborn",
  "celestial-dominion",
]

/**
 * React component providing an interactive UI for generating, previewing, and downloading customizable faction-themed favicons.
 *
 * Users can select a faction, adjust appearance settings (background color, padding, border radius, size, monochrome, inverted), and choose between standard, letter, or icon favicon styles. The component renders a live preview on a canvas and allows downloading the generated favicon as a PNG file.
 *
 * @returns The rendered favicon generator page component.
 *
 * @remark The "Generate All Sizes" feature is currently a placeholder and does not produce multiple favicon files.
 */
export default function FaviconGeneratorPage() {
  const [selectedFaction, setSelectedFaction] = useState<string>("cybernetic-nexus")
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff")
  const [padding, setPadding] = useState<number>(10)
  const [borderRadius, setBorderRadius] = useState<number>(0)
  const [monochrome, setMonochrome] = useState<boolean>(false)
  const [inverted, setInverted] = useState<boolean>(false)
  const [size, setSize] = useState<number>(32)
  const [faviconType, setFaviconType] = useState<string>("standard")

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Effect to render the favicon to canvas when settings change
  useEffect(() => {
    renderFavicon()
  }, [selectedFaction, backgroundColor, padding, borderRadius, monochrome, inverted, size, faviconType])

  const renderFavicon = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    canvas.width = size
    canvas.height = size

    // Draw background
    ctx.fillStyle = backgroundColor
    if (borderRadius > 0) {
      // Draw rounded rectangle
      const r = size * (borderRadius / 100)
      ctx.beginPath()
      ctx.moveTo(r, 0)
      ctx.lineTo(size - r, 0)
      ctx.quadraticCurveTo(size, 0, size, r)
      ctx.lineTo(size, size - r)
      ctx.quadraticCurveTo(size, size, size - r, size)
      ctx.lineTo(r, size)
      ctx.quadraticCurveTo(0, size, 0, size - r)
      ctx.lineTo(0, r)
      ctx.quadraticCurveTo(0, 0, r, 0)
      ctx.closePath()
      ctx.fill()
    } else {
      ctx.fillRect(0, 0, size, size)
    }

    // In a real implementation, we would render the actual faction logo here
    // For now, we'll simulate this with a placeholder based on faction
    const innerSize = size - padding * 2
    ctx.fillStyle = getFactionColor(selectedFaction, monochrome, inverted)

    if (faviconType === "standard") {
      // Draw a simple shape based on faction
      ctx.beginPath()
      if (selectedFaction === "cybernetic-nexus") {
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, innerSize / 2, 0, Math.PI * 2)
        ctx.fill()

        // Add some details to make it look technological
        ctx.strokeStyle = inverted ? "#ffffff" : "#000000"
        ctx.lineWidth = Math.max(1, size / 16)
        ctx.beginPath()
        ctx.moveTo(size / 2 - innerSize / 4, size / 2)
        ctx.lineTo(size / 2 + innerSize / 4, size / 2)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(size / 2, size / 2 - innerSize / 4)
        ctx.lineTo(size / 2, size / 2 + innerSize / 4)
        ctx.stroke()
      } else if (selectedFaction === "void-harbingers") {
        // Draw a pentagram
        const radius = innerSize / 2
        const centerX = size / 2
        const centerY = size / 2

        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const x = centerX + radius * Math.cos(Math.PI / 2 + (i * 2 * Math.PI) / 5)
          const y = centerY - radius * Math.sin(Math.PI / 2 + (i * 2 * Math.PI) / 5)
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
      } else if (selectedFaction === "primordial-ascendancy") {
        // Draw a leaf-like pattern
        const centerX = size / 2
        const centerY = size / 2

        ctx.beginPath()
        ctx.moveTo(centerX, centerY - innerSize / 2)
        ctx.bezierCurveTo(
          centerX + innerSize / 2,
          centerY - innerSize / 4,
          centerX + innerSize / 2,
          centerY + innerSize / 4,
          centerX,
          centerY + innerSize / 2,
        )
        ctx.bezierCurveTo(
          centerX - innerSize / 2,
          centerY + innerSize / 4,
          centerX - innerSize / 2,
          centerY - innerSize / 4,
          centerX,
          centerY - innerSize / 2,
        )
        ctx.fill()
      } else if (selectedFaction === "eclipsed-order") {
        // Draw a crescent moon
        const centerX = size / 2
        const centerY = size / 2
        const radius = innerSize / 2

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalCompositeOperation = "destination-out"
        ctx.beginPath()
        ctx.arc(centerX + radius / 2, centerY, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalCompositeOperation = "source-over"
      } else if (selectedFaction === "titanborn") {
        // Draw a mountain-like shape
        const centerX = size / 2
        const centerY = size / 2
        const baseY = centerY + innerSize / 2

        ctx.beginPath()
        ctx.moveTo(centerX - innerSize / 2, baseY)
        ctx.lineTo(centerX - innerSize / 6, centerY - innerSize / 3)
        ctx.lineTo(centerX + innerSize / 6, centerY - innerSize / 2)
        ctx.lineTo(centerX + innerSize / 2, baseY)
        ctx.closePath()
        ctx.fill()
      } else if (selectedFaction === "celestial-dominion") {
        // Draw a star
        const centerX = size / 2
        const centerY = size / 2
        const outerRadius = innerSize / 2
        const innerRadius = outerRadius * 0.4
        const spikes = 8

        ctx.beginPath()
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const angle = (Math.PI * i) / spikes
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
      }
    } else if (faviconType === "letter") {
      // Draw first letter of faction name
      const letter = selectedFaction.charAt(0).toUpperCase()
      const fontSize = Math.floor(innerSize * 0.8)
      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(letter, size / 2, size / 2)
    } else if (faviconType === "icon") {
      // Draw a simple icon based on faction
      if (selectedFaction === "cybernetic-nexus") {
        // Circuit pattern
        const lineWidth = Math.max(1, size / 32)
        ctx.strokeStyle = ctx.fillStyle
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.moveTo(padding + innerSize * 0.2, padding + innerSize * 0.2)
        ctx.lineTo(padding + innerSize * 0.8, padding + innerSize * 0.2)
        ctx.lineTo(padding + innerSize * 0.8, padding + innerSize * 0.8)
        ctx.lineTo(padding + innerSize * 0.2, padding + innerSize * 0.8)
        ctx.closePath()
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(size / 2, size / 2, innerSize / 4, 0, Math.PI * 2)
        ctx.fill()
      } else if (selectedFaction === "void-harbingers") {
        // Eye symbol
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, innerSize / 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = backgroundColor
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, innerSize / 6, 0, Math.PI * 2)
        ctx.fill()
      } else if (selectedFaction === "primordial-ascendancy") {
        // Tree symbol
        ctx.fillRect(size / 2 - innerSize / 10, size / 2, innerSize / 5, innerSize / 2)

        ctx.beginPath()
        ctx.arc(size / 2 - innerSize / 6, size / 2 - innerSize / 6, innerSize / 3, 0, Math.PI * 2)
        ctx.fill()
      } else if (selectedFaction === "eclipsed-order") {
        // Sun and moon
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, innerSize / 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = backgroundColor
        ctx.beginPath()
        ctx.arc(size / 2 + innerSize / 6, size / 2, innerSize / 3, 0, Math.PI * 2)
        ctx.fill()
      } else if (selectedFaction === "titanborn") {
        // Hammer symbol
        ctx.fillRect(size / 2 - innerSize / 10, size / 2 - innerSize / 3, innerSize / 5, innerSize / 2)

        ctx.beginPath()
        ctx.moveTo(size / 2 - innerSize / 3, size / 2 - innerSize / 3)
        ctx.lineTo(size / 2 + innerSize / 3, size / 2 - innerSize / 3)
        ctx.lineTo(size / 2 + innerSize / 3, size / 2 - innerSize / 6)
        ctx.lineTo(size / 2 - innerSize / 3, size / 2 - innerSize / 6)
        ctx.closePath()
        ctx.fill()
      } else if (selectedFaction === "celestial-dominion") {
        // Star
        drawStar(ctx, size / 2, size / 2, 5, innerSize / 3, innerSize / 6)
      }
    }
  }

  // Helper function to draw a star
  const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
  ) => {
    let rot = (Math.PI / 2) * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      ctx.lineTo(x, y)
      rot += step
    }
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()
    ctx.fill()
  }

  const getFactionColor = (faction: string, mono: boolean, invert: boolean): string => {
    if (mono) return invert ? "#ffffff" : "#000000"

    switch (faction) {
      case "cybernetic-nexus":
        return "#00a8ff"
      case "primordial-ascendancy":
        return "#2ecc71"
      case "void-harbingers":
        return "#9b59b6"
      case "eclipsed-order":
        return "#34495e"
      case "titanborn":
        return "#e67e22"
      case "celestial-dominion":
        return "#f1c40f"
      default:
        return "#3498db"
    }
  }

  const downloadFavicon = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create a link and trigger download
    const link = document.createElement("a")
    link.download = `${selectedFaction}-favicon-${size}x${size}.png`
    link.href = canvas.toDataURL("image/png")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Function to generate all standard favicon sizes
  const generateAllSizes = () => {
    const standardSizes = [16, 32, 48, 64, 128, 256]
    const currentSize = size

    // We would need to create multiple canvases or reuse one
    // For this example, we'll just show an alert
    alert(`In a full implementation, this would generate favicons in sizes: ${standardSizes.join(", ")}px`)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Favicon Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Faction Selection</CardTitle>
              <CardDescription>Choose your faction identity</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedFaction} onValueChange={setSelectedFaction}>
                <SelectTrigger>
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

              <div className="mt-4 flex items-center justify-center">
                <LogoSystem
                  variant="icon-only"
                  size="lg"
                  faction={selectedFaction}
                  animated={false}
                  monochrome={monochrome}
                  inverted={inverted}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Favicon Settings</CardTitle>
              <CardDescription>Customize your favicon appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Favicon Type</Label>
                <Tabs defaultValue="standard" value={faviconType} onValueChange={setFaviconType}>
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
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Current favicon preview</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="mb-8 p-8 bg-grid-pattern rounded-lg">
                <canvas
                  ref={canvasRef}
                  width={size}
                  height={size}
                  className="border border-muted shadow-md"
                  style={{
                    width: Math.min(256, size),
                    height: Math.min(256, size),
                    imageRendering: "pixelated",
                  }}
                />
              </div>

              <div className="flex flex-col gap-4 w-full max-w-xs">
                <Button onClick={downloadFavicon}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Favicon ({size}px)
                </Button>
                <Button variant="outline" onClick={generateAllSizes}>
                  Generate All Sizes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
              <CardDescription>Implementation instructions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">Basic Usage</h3>
              <p className="text-sm text-muted-foreground">
                Place your favicon.ico file in the root of your web server and add the following code to the head
                section of your HTML:
              </p>
              <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs">
                <code>{`<link rel="icon" href="/favicon.ico" sizes="any">`}</code>
              </pre>

              <h3 className="font-semibold mt-4">Advanced Usage</h3>
              <p className="text-sm text-muted-foreground">
                For better cross-browser and device support, use multiple sizes and formats:
              </p>
              <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs">
                <code>{`<!-- Standard favicons -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">

<!-- iOS and Android icons -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">

<!-- Safari pinned tab icon -->
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="${getFactionColor(selectedFaction, false, false)}">`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
