"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HeroCard from "./hero-card"
import ArtifactCard from "./artifact-card"
import CrisisCard from "./crisis-card"
import { heroCards } from "@/data/heroes"
import { artifactCards } from "@/data/artifacts"
import { crisisCards } from "@/data/crisis"

export default function FlippableCardsDemo() {
  const [activeTab, setActiveTab] = useState("heroes")
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({})

  // Sample cards
  const sampleHero = heroCards[0]
  const sampleArtifact = artifactCards[0]
  const sampleCrisis = crisisCards[0]

  // Toggle all cards
  const toggleAllCards = () => {
    const newState: Record<string, boolean> = {}

    if (activeTab === "heroes") {
      heroCards.forEach((card) => {
        newState[card.id] = !flippedCards[card.id]
      })
    } else if (activeTab === "artifacts") {
      artifactCards.forEach((card) => {
        newState[card.id] = !flippedCards[card.id]
      })
    } else if (activeTab === "crisis") {
      crisisCards.forEach((card) => {
        newState[card.id] = !flippedCards[card.id]
      })
    }

    setFlippedCards({ ...flippedCards, ...newState })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Flippable Cards Demo</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={toggleAllCards}>Flip All Cards</Button>
      </div>

      <Tabs defaultValue="heroes" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="heroes">Heroes</TabsTrigger>
          <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
          <TabsTrigger value="crisis">Crisis Events</TabsTrigger>
        </TabsList>

        <TabsContent value="heroes">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {heroCards.slice(0, 8).map((card) => (
              <div key={card.id} className="h-96">
                <HeroCard
                  card={card}
                  showFront={!flippedCards[card.id]}
                  onClick={() => setFlippedCards({ ...flippedCards, [card.id]: !flippedCards[card.id] })}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="artifacts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artifactCards.slice(0, 8).map((card) => (
              <div key={card.id} className="h-96">
                <ArtifactCard
                  card={card}
                  showFront={!flippedCards[card.id]}
                  onClick={() => setFlippedCards({ ...flippedCards, [card.id]: !flippedCards[card.id] })}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="crisis">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {crisisCards.slice(0, 8).map((card) => (
              <div key={card.id} className="h-96">
                <CrisisCard
                  card={card}
                  showFront={!flippedCards[card.id]}
                  onClick={() => setFlippedCards({ ...flippedCards, [card.id]: !flippedCards[card.id] })}
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
