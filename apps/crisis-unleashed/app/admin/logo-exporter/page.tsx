"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeAwareLogo } from "@/components/theme-aware-logo"
import { useTheme } from "@/contexts/theme-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { factionThemes } from "@/lib/faction-themes"

export default function LogoExporter() {
  const { setCurrentTheme, currentTheme } = useTheme()
  const [size, setSize] = useState(300)
  const [exportFormat, setExportFormat] = useState<"png" | "svg">("png")
  const svgRef = useRef<HTMLDivElement>(null)
  const [exportMessage, setExportMessage] = useState("")

  const exportLogo = async () => {
    if (!svgRef.current) return

    try {
      setExportMessage("Exporting logo...")
      const svgElement = svgRef.current.querySelector("svg")
      if (!svgElement) {
        setExportMessage("Error: SVG element not found")
        return
      }

      // Clone the SVG to modify it for export
      const svgClone = svgElement.cloneNode(true) as SVGElement

      // Set proper attributes for standalone SVG
      svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg")
      svgClone.setAttribute("width", size.toString())
      svgClone.setAttribute("height", size.toString())

      // Get SVG as string
      const svgData = new XMLSerializer().serializeToString(svgClone)

      if (exportFormat === "svg") {
        // For SVG export
        const blob = new Blob([svgData], { type: "image/svg+xml" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `crisis-unleashed-logo-${currentTheme}.svg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        setExportMessage("SVG exported successfully!")
      } else {
        // For PNG export
        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          setExportMessage("Error: Could not create canvas context")
          return
        }

        // Create an image from SVG
        const img = new Image()
        img.src = "data:image/svg+xml;base64," + btoa(svgData)

        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          const pngUrl = canvas.toDataURL("image/png")

          const link = document.createElement("a")
          link.href = pngUrl
          link.download = `crisis-unleashed-logo-${currentTheme}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          setExportMessage("PNG exported successfully!")
        }

        img.onerror = () => {
          setExportMessage("Error: Failed to convert SVG to PNG")
        }
      }
    } catch (error) {
      console.error("Export error:", error)
      setExportMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Theme-Aware Logo Exporter</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Logo Preview</CardTitle>
            <CardDescription>See how the logo looks with different themes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div ref={svgRef} className="mb-6">
              <ThemeAwareLogo width={size} height={size} exportMode={true} />
            </div>

            <div className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme-select">Select Theme</Label>
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
                <Label htmlFor="format-select">Export Format</Label>
                <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as "png" | "svg")}>
                  <SelectTrigger id="format-select">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="svg">SVG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size-select">Size: {size}px</Label>
                <Select value={size.toString()} onValueChange={(value) => setSize(Number.parseInt(value))}>
                  <SelectTrigger id="size-select">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100px</SelectItem>
                    <SelectItem value="200">200px</SelectItem>
                    <SelectItem value="300">300px</SelectItem>
                    <SelectItem value="500">500px</SelectItem>
                    <SelectItem value="1000">1000px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={exportLogo} className="w-full">
              Export Logo for {currentTheme} Theme
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>How to use the theme-aware logo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Option 1: Use the SVG Component</h3>
              <p className="text-sm text-gray-400 mb-2">
                The ThemeAwareLogo component automatically adapts to the current theme. Simply use it in your
                components:
              </p>
              <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                {`import { ThemeAwareLogo } from "@/components/theme-aware-logo"

// In your component:
<ThemeAwareLogo width={300} height={300} />`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Option 2: Export Static Images</h3>
              <p className="text-sm text-gray-400 mb-2">Export the logo for each theme and use them conditionally:</p>
              <ol className="list-decimal list-inside text-sm text-gray-400">
                <li>Select each theme and export as PNG or SVG</li>
                <li>Place the exported files in your public directory</li>
                <li>Use them conditionally based on the current theme</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Implementation Example</h3>
              <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                {`// Using exported static images
const logoSrc = \`/crisis-unleashed-logo-\${currentTheme}.png\`

<Image 
  src={logoSrc || "/placeholder.svg"}
  alt="Crisis Unleashed Logo"
  width={300}
  height={300}
  onError={(e) => {
    // Fallback to default if theme-specific logo not found
    e.currentTarget.src = "/crisis-unleashed-logo-default.png"
  }}
/>`}
              </pre>
            </div>
          </CardContent>
          <CardFooter>
            {exportMessage && <div className="w-full text-center p-2 rounded bg-gray-800">{exportMessage}</div>}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
