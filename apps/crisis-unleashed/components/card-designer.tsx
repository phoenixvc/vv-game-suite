"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Download, Upload, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import CardTemplatePreview from "@/components/card-template-preview"
import { CardDetailModal } from "./card-detail-modal"
import { CardForm } from "./card-form"
import { FlippableCard } from "./flippable-card"
import { StandardizedCardBack } from "./standardized-card-back"
import CardCollection from "./card-collection-new"
import type { CardData } from "@/lib/card-data"
import { heroCards as initialHeroes } from "@/data/heroes"
import { artifactCards as initialArtifacts } from "@/data/artifacts"
import { crisisCards as initialCrises } from "@/data/crisis"
import styles from "@/styles/designer.module.css"

interface CardDesignerProps {
  darkMode?: boolean
}

// Generate a unique ID
const generateId = () => `card-${Date.now()}-${Math.floor(Math.random() * 1000)}`

export function CardDesigner({ darkMode = false }: CardDesignerProps) {
  // State for cards
  const [heroes, setHeroes] = useState<CardData[]>(initialHeroes)
  const [artifacts, setArtifacts] = useState<CardData[]>(initialArtifacts)
  const [crises, setCrises] = useState<CardData[]>(initialCrises)

  // State for card viewing and editing
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newCardType, setNewCardType] = useState<string>("Hero")
  const [activeTab, setActiveTab] = useState("heroes")

  // State for card navigation
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load cards from localStorage on initial render
  useEffect(() => {
    const savedHeroes = localStorage.getItem("gameCardDesigner_heroes")
    const savedArtifacts = localStorage.getItem("gameCardDesigner_artifacts")
    const savedCrises = localStorage.getItem("gameCardDesigner_crises")

    if (savedHeroes) setHeroes(JSON.parse(savedHeroes))
    if (savedArtifacts) setArtifacts(JSON.parse(savedArtifacts))
    if (savedCrises) setCrises(JSON.parse(savedCrises))
  }, [])

  // Save cards to localStorage when they change
  useEffect(() => {
    localStorage.setItem("gameCardDesigner_heroes", JSON.stringify(heroes))
    localStorage.setItem("gameCardDesigner_artifacts", JSON.stringify(artifacts))
    localStorage.setItem("gameCardDesigner_crises", JSON.stringify(crises))
  }, [heroes, artifacts, crises])

  // Get current collection based on active tab
  const getCurrentCollection = () => {
    if (activeTab === "heroes") return heroes
    if (activeTab === "artifacts") return artifacts
    if (activeTab === "crises") return crises
    return []
  }

  // Handle card selection
  const handleCardSelect = (cardId: string) => {
    const allCards = [...heroes, ...artifacts, ...crises]
    const card = allCards.find((c) => c.id === cardId)
    if (card) {
      setSelectedCard(card)
      // Update current card index for navigation
      const collection = getCurrentCollection()
      const index = collection.findIndex((c) => c.id === cardId)
      if (index !== -1) {
        setCurrentCardIndex(index)
      }
    }
  }

  // Handle card click for viewing details
  const handleCardClick = (card: CardData) => {
    setSelectedCard(card)
    setIsDetailModalOpen(true)

    // Update current card index for navigation
    const collection = getCurrentCollection()
    const index = collection.findIndex((c) => c.id === card.id)
    if (index !== -1) {
      setCurrentCardIndex(index)
    }
  }

  // Handle editing a card
  const handleEditCard = () => {
    if (selectedCard) {
      setIsDetailModalOpen(false)
      setIsEditModalOpen(true)
    }
  }

  // Handle saving an edited card
  const handleSaveEdit = (updatedCard: CardData) => {
    if (!updatedCard.id) return

    const cardType = updatedCard.cardType || updatedCard.type

    if (cardType === "Hero") {
      setHeroes((prev) => prev.map((card) => (card.id === updatedCard.id ? updatedCard : card)))
    } else if (cardType === "Artifact") {
      setArtifacts((prev) => prev.map((card) => (card.id === updatedCard.id ? updatedCard : card)))
    } else if (cardType === "Crisis") {
      setCrises((prev) => prev.map((card) => (card.id === updatedCard.id ? updatedCard : card)))
    }

    setIsEditModalOpen(false)
  }

  // Handle creating a new card
  const handleCreateCard = (cardType: string) => {
    setNewCardType(cardType)
    setIsCreateModalOpen(true)
  }

  // Handle saving a new card
  const handleSaveNewCard = (newCard: CardData) => {
    const cardWithId = { ...newCard, id: generateId() }
    const cardType = cardWithId.cardType || cardWithId.type

    if (cardType === "Hero") {
      setHeroes((prev) => [...prev, cardWithId])
      setActiveTab("heroes")
    } else if (cardType === "Artifact") {
      setArtifacts((prev) => [...prev, cardWithId])
      setActiveTab("artifacts")
    } else if (cardType === "Crisis") {
      setCrises((prev) => [...prev, cardWithId])
      setActiveTab("crises")
    }

    setIsCreateModalOpen(false)
  }

  // Handle deleting a card
  const handleDeleteCard = (cardId: string) => {
    const cardToDelete = [...heroes, ...artifacts, ...crises].find((c) => c.id === cardId)
    if (!cardToDelete) return

    const cardType = cardToDelete.cardType || cardToDelete.type

    if (cardType === "Hero") {
      setHeroes((prev) => prev.filter((card) => card.id !== cardId))
    } else if (cardType === "Artifact") {
      setArtifacts((prev) => prev.filter((card) => card.id !== cardId))
    } else if (cardType === "Crisis") {
      setCrises((prev) => prev.filter((card) => card.id !== cardId))
    }

    setIsDetailModalOpen(false)
    setSelectedCard(null)
  }

  // Handle exporting cards
  const handleExportCards = () => {
    const exportData = {
      heroes,
      artifacts,
      crises,
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `crisis-unleashed-cards-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Handle importing cards
  const handleImportCards = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string)

          if (importedData.heroes) setHeroes(importedData.heroes)
          if (importedData.artifacts) setArtifacts(importedData.artifacts)
          if (importedData.crises) setCrises(importedData.crises)

          alert("Cards imported successfully!")
        } catch (error) {
          console.error("Error importing cards:", error)
          alert("Error importing cards. Please check the file format.")
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  // Create empty card template based on type
  const createEmptyCard = (type: string): CardData => {
    const baseCard = {
      id: "",
      name: `New ${type}`,
      type: type,
      cardType: type,
      description: `Description for your new ${type.toLowerCase()}`,
      faction: "",
      rarity: "Common",
      provision: 0,
    }

    if (type === "Hero") {
      return {
        ...baseCard,
        health: 5,
        attack: 5,
        defense: 5,
        speed: 5,
        intelligence: 5,
        abilities: [{ name: "New Ability", description: "Describe what this ability does", cost: 1 }],
      }
    } else if (type === "Artifact") {
      return {
        ...baseCard,
        effect: "Describe the artifact's effect",
        requirements: "Any requirements to use this artifact",
      }
    } else if (type === "Crisis") {
      return {
        ...baseCard,
        impact: "Describe how this crisis impacts the game",
        duration: "How long the crisis lasts",
      }
    }

    return baseCard
  }

  // Handle card navigation
  const navigateCards = (direction: "next" | "prev") => {
    const currentCollection = getCurrentCollection()
    if (!currentCollection.length) return

    let newIndex = currentCardIndex
    if (direction === "next") {
      newIndex = (currentCardIndex + 1) % currentCollection.length
    } else {
      newIndex = (currentCardIndex - 1 + currentCollection.length) % currentCollection.length
    }

    setCurrentCardIndex(newIndex)
    setSelectedCard(currentCollection[newIndex])
  }

  // Handle scroll wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current || !containerRef.current.contains(e.target as Node)) return

      if (e.deltaY < 0) {
        navigateCards("prev")
      } else {
        navigateCards("next")
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel)
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [currentCardIndex, activeTab])

  return (
    <div className={styles.designerWrapper}>
      <div className={styles.designerHeader}>
        <h1 className={styles.designerTitle}>Card Designer</h1>
        <div className={styles.designerActions}>
          <Button variant="outline" size="sm" onClick={handleExportCards} className={styles.actionButton}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleImportCards} className={styles.actionButton}>
            <Upload className="h-4 w-4 mr-1" /> Import
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() =>
              handleCreateCard(activeTab === "heroes" ? "Hero" : activeTab === "artifacts" ? "Artifact" : "Crisis")
            }
            className={styles.createButton}
          >
            <Plus className="h-4 w-4 mr-1" /> Create Card
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className={styles.designerTabs}>
        <TabsList className={styles.tabsList}>
          <TabsTrigger value="heroes">Heroes ({heroes.length})</TabsTrigger>
          <TabsTrigger value="artifacts">Artifacts ({artifacts.length})</TabsTrigger>
          <TabsTrigger value="crises">Crises ({crises.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="heroes" className={styles.tabContent}>
          <CardCollection
            cards={heroes}
            onCardSelect={handleCardSelect}
            selectedCardId={selectedCard?.id}
            onCardClick={handleCardClick}
            title=""
          />
        </TabsContent>

        <TabsContent value="artifacts" className={styles.tabContent}>
          <CardCollection
            cards={artifacts}
            onCardSelect={handleCardSelect}
            selectedCardId={selectedCard?.id}
            onCardClick={handleCardClick}
            title=""
          />
        </TabsContent>

        <TabsContent value="crises" className={styles.tabContent}>
          <CardCollection
            cards={crises}
            onCardSelect={handleCardSelect}
            selectedCardId={selectedCard?.id}
            onCardClick={handleCardClick}
            title=""
          />
        </TabsContent>
      </Tabs>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onEdit={handleEditCard}
          onDelete={() => handleDeleteCard(selectedCard.id)}
        />
      )}

      {/* Edit Card Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent
          className={`${styles.modalContent} ${darkMode ? styles.darkMode : ""}`}
          aria-describedby="edit-card-description"
        >
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
            <p id="edit-card-description" className="sr-only">
              Edit the properties of your selected card including name, type, stats, and abilities.
            </p>
          </DialogHeader>
          {selectedCard && (
            <CardForm
              card={selectedCard}
              onSave={handleSaveEdit}
              onCancel={() => setIsEditModalOpen(false)}
              darkMode={darkMode}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Card Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent
          className={`${styles.modalContent} ${darkMode ? styles.darkMode : ""}`}
          aria-describedby="create-card-description"
        >
          <DialogHeader>
            <DialogTitle>Create New {newCardType}</DialogTitle>
            <p id="create-card-description" className="sr-only">
              Create a new {newCardType.toLowerCase()} card by filling out the form with name, stats, abilities, and
              other properties.
            </p>
          </DialogHeader>
          <CardForm
            card={createEmptyCard(newCardType)}
            onSave={handleSaveNewCard}
            onCancel={() => setIsCreateModalOpen(false)}
            darkMode={darkMode}
          />
        </DialogContent>
      </Dialog>

      {/* Preview Section */}
      <div className={styles.previewSection} ref={containerRef}>
        <h2 className={styles.previewTitle}>Card Preview</h2>
        <div className={styles.previewContainer}>
          {selectedCard ? (
            <div className={styles.selectedCardPreview}>
              <div className="relative">
                <FlippableCard
                  frontContent={<CardTemplatePreview card={selectedCard} size="lg" />}
                  backContent={<StandardizedCardBack card={selectedCard} darkMode={darkMode} />}
                  className={styles.previewFlippableCard}
                />

                {/* Card Navigation Controls */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full shadow-lg pointer-events-auto opacity-80 hover:opacity-100"
                    onClick={() => navigateCards("prev")}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full shadow-lg pointer-events-auto opacity-80 hover:opacity-100"
                    onClick={() => navigateCards("next")}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* Card Counter */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded-full">
                  {currentCardIndex + 1} of {getCurrentCollection().length}
                </div>
              </div>

              <div className={styles.previewActions}>
                <Button variant="outline" size="sm" onClick={() => setIsDetailModalOpen(true)}>
                  View Details
                </Button>
                <Button variant="outline" size="sm" onClick={handleEditCard}>
                  Edit Card
                </Button>
              </div>

              {/* Card Synergy Information */}
              <div className="mt-4 bg-gray-800/50 rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-400" />
                  <h3 className="font-semibold">Card Synergies</h3>
                </div>
                <p className="text-gray-300 text-xs mb-2">This card has potential synergies with:</p>
                <div className="flex flex-wrap gap-1">
                  {getSynergySuggestions(selectedCard, getCurrentCollection()).map((card, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded"
                            onClick={() => handleCardSelect(card.id)}
                          >
                            {card.name}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{card.description}</p>
                          <p className="text-xs text-blue-400 mt-1">Click to view this card</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {getSynergySuggestions(selectedCard, getCurrentCollection()).length === 0 && (
                    <span className="text-gray-400 text-xs italic">
                      No direct synergies found in current collection
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyPreview}>
              <p>Select a card to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to find synergy suggestions
function getSynergySuggestions(card: CardData, collection: CardData[]): CardData[] {
  if (!card) return []

  // Find cards with matching faction
  const factionMatches = collection.filter((c) => c.id !== card.id && c.faction === card.faction)

  // Find cards with matching aspects
  const aspectMatches = collection.filter(
    (c) => c.id !== card.id && c.aspects && card.aspects && c.aspects.some((aspect) => card.aspects?.includes(aspect)),
  )

  // Combine and remove duplicates
  const allMatches = [...factionMatches, ...aspectMatches]
  const uniqueMatches = allMatches.filter((card, index, self) => index === self.findIndex((c) => c.id === card.id))

  // Limit to 5 suggestions
  return uniqueMatches.slice(0, 5)
}
