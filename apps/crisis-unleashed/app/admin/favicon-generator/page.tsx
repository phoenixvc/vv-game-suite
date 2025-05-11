"use client"

import { FaviconFactionSelector } from "@/components/admin/favicon/favicon-faction-selector"
import { FaviconPreview } from "@/components/admin/favicon/favicon-preview"
import { FaviconSettings } from "@/components/admin/favicon/favicon-settings"
import { FaviconUsageInstructions } from "@/components/admin/favicon/favicon-usage-instructions"
import { getFactionColor } from "@/components/admin/favicon/favicon-utils"
import { FaviconRenderers } from "@/components/admin/favicon/renderers"
import { getAllFactions } from "@/components/logo-system/utils"
import { useEffect, useRef, useState } from "react"

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
  const factions = getAllFactions()

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

    // Calculate inner size and get faction color
    const innerSize = size - padding * 2
    const factionColor = getFactionColor(selectedFaction, monochrome, inverted)

    // Use the appropriate renderer based on favicon type
    const renderer = FaviconRenderers[faviconType]
    if (renderer) {
      renderer.render({
        ctx,
        size,
        innerSize,
        padding,
        backgroundColor,
        factionColor,
        selectedFaction
      })
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
    // We would need to create multiple canvases or reuse one
    // For this example, we'll just show an alert
    alert(`In a full implementation, this would generate favicons in sizes: ${standardSizes.join(", ")}px`)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Favicon Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FaviconFactionSelector
            selectedFaction={selectedFaction}
            setSelectedFaction={setSelectedFaction}
            factions={factions}
            monochrome={monochrome}
            inverted={inverted}
          />

          <FaviconSettings
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            padding={padding}
            setPadding={setPadding}
            borderRadius={borderRadius}
            setBorderRadius={setBorderRadius}
            size={size}
            setSize={setSize}
            monochrome={monochrome}
            setMonochrome={setMonochrome}
            inverted={inverted}
            setInverted={setInverted}
            faviconType={faviconType}
            setFaviconType={setFaviconType}
          />
        </div>

        <div className="space-y-6">
          <FaviconPreview
            size={size}
            renderFavicon={() => {
              if (canvasRef.current) {
                renderFavicon();
              }
            }}
            downloadFavicon={downloadFavicon}
            generateAllSizes={generateAllSizes}
          />

          <FaviconUsageInstructions
            selectedFaction={selectedFaction}
            getFactionColor={getFactionColor}
          />
        </div>
      </div>
    </div>
  )
}