"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import { useEffect, useRef } from "react"
import styles from "./favicon.module.css"

interface FaviconPreviewProps {
  size: number
  renderFavicon: () => void
  downloadFavicon: () => void
  generateAllSizes: () => void
}

export function FaviconPreview({ 
  size, 
  renderFavicon, 
  downloadFavicon, 
  generateAllSizes 
}: FaviconPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Effect to render the favicon when settings change
  useEffect(() => {
    if (canvasRef.current) {
      renderFavicon()
    }
  }, [renderFavicon])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>Current favicon preview</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className={styles.previewContainer}>
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className={styles.previewCanvas}
            style={{ width: Math.min(256, size), height: Math.min(256, size) }}
          />
        </div>

        <div className={styles.buttonsContainer}>
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
  )
}