"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LogoVariant from "@/components/logo-system/logo-variant"

interface FaviconFactionSelectorProps {
  selectedFaction: string
  setSelectedFaction: (value: string) => void
  factions: string[]
  monochrome: boolean
  inverted: boolean
}

export function FaviconFactionSelector({
  selectedFaction,
  setSelectedFaction,
  factions,
  monochrome,
  inverted
}: FaviconFactionSelectorProps) {
  return (
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
          <LogoVariant
            variant="icon-only"
            size="lg"
            faction={selectedFaction}
            monochrome={monochrome}
            inverted={inverted}
          />
        </div>
      </CardContent>
    </Card>
  )
}