"use client"

import LogoVariant from "@/components/logo-system/logo-variant"
import { FactionId } from "@/components/logo-system/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FaviconFactionSelectorProps {
  selectedFaction: FactionId
  setSelectedFaction: (value: FactionId) => void
  factions: FactionId[]
  monochrome: boolean
  inverted: boolean
}

const formatFactionDisplayName = (faction: string): string => {
  return faction
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Renders a card UI for selecting a faction from a list and previewing its logo variant.
 *
 * Displays a dropdown menu populated with available factions, allowing the user to select one. The selected faction's logo is shown below the selector, styled according to the `monochrome` and `inverted` flags.
 *
 * @param selectedFaction - The currently selected faction ID.
 * @param setSelectedFaction - Callback to update the selected faction.
 * @param factions - Array of available faction IDs to choose from.
 * @param monochrome - If true, displays the logo in monochrome style.
 * @param inverted - If true, displays the logo with inverted colors.
 */
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
        <Select 
          value={selectedFaction} 
          onValueChange={(value) => setSelectedFaction(value as FactionId)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select faction" />
          </SelectTrigger>
          <SelectContent>
            {factions.map((faction) => (
              <SelectItem key={faction} value={faction}>
                {formatFactionDisplayName(faction)}
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