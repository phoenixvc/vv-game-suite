"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FaviconUsageInstructionsProps {
  selectedFaction: string
  getFactionColor: (faction: string, mono: boolean, invert: boolean) => string
}

export function FaviconUsageInstructions({
  selectedFaction,
  getFactionColor
}: FaviconUsageInstructionsProps) {
  return (
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
  )
}