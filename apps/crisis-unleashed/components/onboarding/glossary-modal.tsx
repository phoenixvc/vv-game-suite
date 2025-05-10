"use client"

import { useState, useEffect } from "react"
import { X, Search, BookOpen } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// This component doesn't import from the logo system

type GlossaryTerm = {
  term: string
  definition: string
  category: string
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Energy",
    definition:
      "A primary resource used to power abilities, deploy cards, and activate effects. Each faction has different methods of generating and utilizing Energy.",
    category: "Resources",
  },
  {
    term: "Materials",
    definition:
      "A primary resource used for constructing structures, reinforcing units, and crafting artifacts. Materials are physical components needed for tangible creations.",
    category: "Resources",
  },
  {
    term: "Information",
    definition:
      "A primary resource representing knowledge, data, and intelligence. Used for research, espionage, and unlocking advanced technologies.",
    category: "Resources",
  },
  {
    term: "Crisis Event",
    definition:
      "Game-changing events that affect all players, creating both challenges and opportunities. Crisis events can alter resource generation, modify card abilities, or create new victory conditions.",
    category: "Gameplay",
  },
  {
    term: "Faction",
    definition:
      "One of six major groups in the game, each with unique abilities, playstyles, and aesthetic themes. Players typically align with one faction but can use cards from multiple factions.",
    category: "Gameplay",
  },
  {
    term: "Hero Card",
    definition:
      "Powerful character cards with health points, attack values, and special abilities. Heroes remain in play until defeated and can level up through gameplay actions.",
    category: "Cards",
  },
  {
    term: "Artifact Card",
    definition:
      "Equippable items and structures that provide ongoing benefits or abilities. Artifacts can be attached to heroes or placed in territory zones.",
    category: "Cards",
  },
  {
    term: "Territory",
    definition:
      "Zones on the game board that can be controlled by players. Controlling territories provides resource bonuses and strategic advantages.",
    category: "Gameplay",
  },
  {
    term: "Cybernetic Nexus",
    definition:
      "A faction specializing in technology, automation, and information warfare. They excel at resource conversion and efficiency.",
    category: "Factions",
  },
  {
    term: "Void Harbingers",
    definition:
      "A faction drawing power from dimensional rifts and cosmic anomalies. They specialize in sacrifice mechanics and reality manipulation.",
    category: "Factions",
  },
  {
    term: "Primordial Ascendancy",
    definition:
      "A faction harnessing natural forces and biological adaptation. They excel at resource regeneration and evolutionary mechanics.",
    category: "Factions",
  },
  {
    term: "Eclipsed Order",
    definition:
      "A faction of shadow operatives and mystical assassins. They specialize in stealth, sabotage, and targeted elimination.",
    category: "Factions",
  },
  {
    term: "Titanborn",
    definition:
      "A faction of master craftsmen and elemental forgers. They excel at creating powerful artifacts and reinforcing structures.",
    category: "Factions",
  },
  {
    term: "Celestial Dominion",
    definition:
      "A faction manipulating time and cosmic forces. They specialize in prediction, control, and altering the flow of the game.",
    category: "Factions",
  },
]

type GlossaryModalProps = {
  isOpen: boolean
  onClose: () => void
  initialTerm?: string
}

export function GlossaryModal({ isOpen, onClose, initialTerm }: GlossaryModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (initialTerm) {
      setSearchTerm(initialTerm)
      const term = glossaryTerms.find((t) => t.term.toLowerCase() === initialTerm.toLowerCase())
      if (term) {
        setActiveTab(term.category.toLowerCase())
      }
    }
  }, [initialTerm])

  const filteredTerms = glossaryTerms.filter(
    (term) =>
      (activeTab === "all" || term.category.toLowerCase() === activeTab) &&
      (term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const categories = ["All", ...new Set(glossaryTerms.map((term) => term.category))]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <BookOpen className="mr-2 h-6 w-6" />
            Game Glossary
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
            aria-label="Close glossary"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search terms..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 flex flex-wrap">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category.toLowerCase()}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="max-h-[60vh] overflow-y-auto pr-2">
            {filteredTerms.length > 0 ? (
              <div className="space-y-4">
                {filteredTerms.map((term) => (
                  <div key={term.term} className="rounded-lg border p-4">
                    <h3 className="mb-2 text-lg font-semibold">{term.term}</h3>
                    <p className="text-sm text-gray-500">{term.category}</p>
                    <p className="mt-2">{term.definition}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No matching terms found.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Add the GlossaryButton component
interface GlossaryButtonProps {
  onClick: () => void
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
}

export function GlossaryButton({ onClick, className, variant = "outline", size = "sm" }: GlossaryButtonProps) {
  return (
    <Button variant={variant} size={size} onClick={onClick} className={cn("flex items-center gap-1", className)}>
      <BookOpen className="h-4 w-4" />
      <span>Glossary</span>
    </Button>
  )
}

export default GlossaryModal
