"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown, Zap, Shield, Sword, MagnetIcon as Magic, Target, Flame } from "lucide-react"

interface CardType {
  id: string
  name: string
  type: string
  faction: string
  synergies: string[]
  power: number
  image: string
}

// Sample card data
const sampleCards: CardType[] = [
  {
    id: "card1",
    name: "Valiant Defender",
    type: "Hero",
    faction: "Celestial Dominion",
    synergies: ["protection", "healing", "celestial"],
    power: 7,
    image: "/fantasy-valiant-defender.png",
  },
  {
    id: "card2",
    name: "Shadow Stalker",
    type: "Hero",
    faction: "Eclipsed Order",
    synergies: ["stealth", "damage", "shadow"],
    power: 6,
    image: "/fantasy-shadow-stalker.png",
  },
  {
    id: "card3",
    name: "Amulet of Vitality",
    type: "Artifact",
    faction: "Celestial Dominion",
    synergies: ["healing", "protection", "celestial"],
    power: 4,
    image: "/fantasy-amulet-of-vitality.png",
  },
  {
    id: "card4",
    name: "Blade of Elements",
    type: "Artifact",
    faction: "Primordial Ascendancy",
    synergies: ["damage", "elemental", "nature"],
    power: 5,
    image: "/fantasy-blade-of-elements.png",
  },
  {
    id: "card5",
    name: "Dimensional Rift",
    type: "Crisis",
    faction: "Void Harbingers",
    synergies: ["void", "disruption", "dimensional"],
    power: 8,
    image: "/fantasy-dimensional-rift.png",
  },
]

// Synergy types with icons
const synergies = [
  { name: "protection", icon: Shield, color: "bg-blue-500" },
  { name: "healing", icon: Zap, color: "bg-green-500" },
  { name: "damage", icon: Sword, color: "bg-red-500" },
  { name: "elemental", icon: Flame, color: "bg-orange-500" },
  { name: "celestial", icon: Magic, color: "bg-purple-500" },
  { name: "shadow", icon: Target, color: "bg-gray-500" },
  { name: "void", icon: Target, color: "bg-indigo-500" },
  { name: "nature", icon: Zap, color: "bg-emerald-500" },
  { name: "disruption", icon: Target, color: "bg-yellow-500" },
  { name: "dimensional", icon: Magic, color: "bg-cyan-500" },
  { name: "stealth", icon: Target, color: "bg-pink-500" },
]

export function DeckBuilderSynergyPreview() {
  const [selectedCards, setSelectedCards] = useState<string[]>(["card1", "card3", "card4"])
  const [showSynergies, setShowSynergies] = useState(true)

  // Get selected card objects
  const selectedCardObjects = sampleCards.filter((card) => selectedCards.includes(card.id))

  // Calculate synergies
  const synergyCounts: Record<string, number> = {}
  selectedCardObjects.forEach((card) => {
    card.synergies.forEach((synergy) => {
      synergyCounts[synergy] = (synergyCounts[synergy] || 0) + 1
    })
  })

  // Sort synergies by count
  const sortedSynergies = Object.entries(synergyCounts).sort(([, countA], [, countB]) => countB - countA)

  // Calculate deck power
  const deckPower = selectedCardObjects.reduce((sum, card) => sum + card.power, 0)

  // Calculate synergy bonus
  const synergyBonus = Object.values(synergyCounts)
    .filter((count) => count > 1)
    .reduce((sum, count) => sum + (count - 1) * 2, 0)

  // Get synergy icon
  const getSynergyIcon = (name: string) => {
    const synergy = synergies.find((s) => s.name === name)
    const Icon = synergy?.icon || Target
    return <Icon className="h-4 w-4" />
  }

  // Get synergy color
  const getSynergyColor = (name: string) => {
    return synergies.find((s) => s.name === name)?.color || "bg-gray-500"
  }

  return (
    <Card className="w-full bg-gray-900 border-gray-800 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-white flex justify-between items-center">
          <span>Deck Synergy Preview</span>
          <Badge className="bg-blue-600 hover:bg-blue-700">Beta</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Deck stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-400">Cards</div>
              <div className="text-xl font-bold text-white">{selectedCardObjects.length}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-400">Power</div>
              <div className="text-xl font-bold text-white">{deckPower}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-400">Synergy</div>
              <div className="text-xl font-bold text-green-500">+{synergyBonus}</div>
            </div>
          </div>

          {/* Synergy breakdown */}
          <div>
            <button
              className="w-full flex justify-between items-center p-3 bg-gray-800 rounded-lg mb-2"
              onClick={() => setShowSynergies(!showSynergies)}
            >
              <span className="font-medium text-white">Synergy Breakdown</span>
              {showSynergies ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>

            {showSynergies && (
              <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                {sortedSynergies.length > 0 ? (
                  sortedSynergies.map(([synergy, count]) => (
                    <div key={synergy} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={cn("p-1 rounded-md mr-2", getSynergyColor(synergy))}>
                          {getSynergyIcon(synergy)}
                        </div>
                        <span className="capitalize text-gray-200">{synergy}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={cn("text-sm font-medium", count > 1 ? "text-green-500" : "text-gray-400")}>
                          {count}×
                        </span>
                        {count > 1 && (
                          <span className="ml-2 text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">
                            +{(count - 1) * 2}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-2">No synergies found</div>
                )}
              </div>
            )}
          </div>

          {/* Selected cards */}
          <div className="grid grid-cols-3 gap-2">
            {selectedCardObjects.map((card) => (
              <div
                key={card.id}
                className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors"
              >
                <img
                  src={card.image || "/placeholder.svg"}
                  alt={card.name}
                  className="w-full h-24 object-cover object-center"
                />
                <div className="p-2">
                  <div className="text-xs font-medium text-white truncate">{card.name}</div>
                  <div className="flex justify-between items-center mt-1">
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {card.type}
                    </Badge>
                    <span className="text-xs text-blue-400">{card.power}P</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium">
            Open Deck Builder
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
