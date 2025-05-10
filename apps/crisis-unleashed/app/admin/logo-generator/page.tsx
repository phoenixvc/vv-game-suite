"use client"

import { useState } from "react"
import { GeneratedLogo } from "@/components/generated-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ResponsiveAnimatedLogo } from "@/components/responsive-animated-logo"

/**
 * Provides a user interface for generating, previewing, and downloading a custom logo for Crisis Unleashed.
 *
 * Allows users to customize the logo text (up to 4 characters), adjust the logo size, preview the animated logo, and download the generated logo as a PNG file. Also displays the current logo status and provides instructions for updating the logo in the public directory.
 */
export default function LogoGenerator() {
  const [size, setSize] = useState(300)
  const [text, setText] = useState("CU")
  const [showPreview, setShowPreview] = useState(false)

  const downloadLogo = () => {
    const canvas = document.querySelector("canvas")
    if (!canvas) return

    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = "crisis-unleashed-logo.png"
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Logo Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate New Logo</CardTitle>
            <CardDescription>Create a new logo for Crisis Unleashed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Logo Text</Label>
              <Input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={4}
                placeholder="Logo text (max 4 characters)"
              />
            </div>

            <div className="space-y-2">
              <Label>Logo Size: {size}px</Label>
              <Slider value={[size]} min={100} max={600} step={10} onValueChange={(value) => setSize(value[0])} />
            </div>

            <div className="flex justify-center my-6">
              <GeneratedLogo width={size} height={size} text={text} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              Preview Animation
            </Button>
            <Button onClick={downloadLogo}>Download Logo</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Logo Status</CardTitle>
            <CardDescription>Check if the current logo exists and preview it</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="mb-4">
              <ResponsiveAnimatedLogo />
            </div>

            <div className="text-sm text-gray-400 mt-4 text-center">
              <p>The component above is checking if the logo exists in the public directory.</p>
              <p>If it doesn't exist, it will show a text fallback.</p>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-gray-400 w-full">
              <p>Instructions:</p>
              <ol className="list-decimal list-inside mt-2">
                <li>Generate a new logo with your preferred settings</li>
                <li>Download the generated logo</li>
                <li>Place it in the public directory as "crisis-unleashed-logo.png"</li>
              </ol>
            </div>
          </CardFooter>
        </Card>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">Logo Animation Preview</h2>

            <div className="flex justify-center mb-8">
              <ResponsiveAnimatedLogo />
            </div>

            <div className="text-center">
              <Button onClick={() => setShowPreview(false)}>Close Preview</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
