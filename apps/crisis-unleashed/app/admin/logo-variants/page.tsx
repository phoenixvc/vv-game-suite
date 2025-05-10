"use client"

import { useState } from "react"
import { LogoSystem, type LogoVariant, type LogoSize } from "@/components/logo-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"

const factions = [
  "cybernetic-nexus",
  "primordial-ascendancy",
  "void-harbingers",
  "eclipsed-order",
  "titanborn",
  "celestial-dominion",
]

const variants: LogoVariant[] = [
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
]

const sizes: LogoSize[] = ["xs", "sm", "md", "lg", "xl", "2xl"]

export default function LogoVariantsPage() {
  const { theme, setTheme } = useTheme()
  const [selectedFaction, setSelectedFaction] = useState<string>("cybernetic-nexus")
  const [animated, setAnimated] = useState<boolean>(true)
  const [interactive, setInteractive] = useState<boolean>(false)
  const [monochrome, setMonochrome] = useState<boolean>(false)
  const [inverted, setInverted] = useState<boolean>(false)
  const [withTagline, setWithTagline] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("all")

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Logo Variants</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Logo Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Switch id="animated" checked={animated} onCheckedChange={setAnimated} />
              <Label htmlFor="animated">Animated</Label>
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

            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                Toggle Theme ({theme})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Variants</TabsTrigger>
          <TabsTrigger value="sizes">Size Comparison</TabsTrigger>
          <TabsTrigger value="factions">Faction Comparison</TabsTrigger>
          <TabsTrigger value="usage">Usage Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {variants.map((variant) => (
              <Card key={variant}>
                <CardHeader>
                  <CardTitle className="capitalize">{variant} Logo</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center min-h-[150px] bg-muted/20 rounded-md">
                  <LogoSystem
                    variant={variant}
                    size="lg"
                    faction={selectedFaction}
                    animated={animated}
                    interactive={interactive}
                    monochrome={monochrome}
                    inverted={inverted}
                    withTagline={withTagline}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sizes">
          <Card>
            <CardHeader>
              <CardTitle>Size Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {sizes.map((size) => (
                  <div key={size} className="flex items-center">
                    <div className="w-20 text-sm font-medium">{size}:</div>
                    <LogoSystem
                      size={size}
                      faction={selectedFaction}
                      animated={animated}
                      interactive={interactive}
                      monochrome={monochrome}
                      inverted={inverted}
                      withTagline={withTagline}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {factions.map((faction) => (
              <Card key={faction}>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {faction
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center min-h-[150px] bg-muted/20 rounded-md">
                  <LogoSystem
                    size="lg"
                    faction={faction}
                    animated={animated}
                    interactive={interactive}
                    monochrome={monochrome}
                    inverted={inverted}
                    withTagline={withTagline}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <LogoUsageGuide />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LogoUsageGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo Usage Guidelines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Standard Logo</h3>
          <p>
            Use the standard logo for most applications where space permits. This is the primary logo representation.
          </p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoSystem variant="standard" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Compact Logo</h3>
          <p>
            Use the compact logo in spaces where the standard logo would be too large but you still need both icon and
            text.
          </p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoSystem variant="compact" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Horizontal Logo</h3>
          <p>Use the horizontal logo in headers and navigation bars where horizontal space is available.</p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoSystem variant="horizontal" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Vertical Logo</h3>
          <p>Use the vertical logo in narrow spaces or for decorative purposes where vertical space is available.</p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoSystem variant="vertical" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Icon-Only Logo</h3>
          <p>Use the icon-only logo for app icons, favicons, and small UI elements where text would be illegible.</p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoSystem variant="icon-only" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Text-Only Logo</h3>
          <p>
            Use the text-only logo when the icon is displayed separately or when you need to emphasize the brand name.
          </p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoSystem variant="text-only" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Footer Logo</h3>
          <p>Use the footer logo in website footers, typically in a more subtle presentation.</p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoSystem variant="footer" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Mobile Logo</h3>
          <p>Use the mobile logo for mobile navigation and small screen contexts.</p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoSystem variant="mobile" size="lg" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Print Logo</h3>
          <p>Use the print logo for printed materials, ensuring high contrast and readability.</p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoSystem variant="print" size="lg" monochrome />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Watermark Logo</h3>
          <p>Use the watermark logo as a subtle background element or for document watermarking.</p>
          <div className="mt-4 p-4 bg-muted/20 rounded-md flex justify-center">
            <LogoSystem variant="watermark" size="lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
