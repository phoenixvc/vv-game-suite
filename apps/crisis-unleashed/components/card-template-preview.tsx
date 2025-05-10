"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Info, Shield, Sword, Heart, Zap, Brain } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import HeroCard from "@/components/hero-card"
import ArtifactCard from "@/components/artifact-card"
import CrisisCard from "@/components/crisis-card"
import type { CardData } from "@/lib/card-data"
import { cn } from "@/lib/utils"

interface CardTemplatePreviewProps {
  card: CardData
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  showDetails?: boolean
  className?: string
}

export default function CardTemplatePreview({
  card,
  size = "md",
  onClick,
  showDetails = false,
  className,
}: CardTemplatePreviewProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // Get the appropriate card component based on type
  const getCardComponent = () => {
    const cardType = card.cardType || card.type

    if (cardType === "Hero") {
      return <HeroCard card={card} size={size} onClick={onClick} />
    } else if (cardType === "Artifact") {
      return <ArtifactCard card={card} size={size} onClick={onClick} />
    } else if (cardType === "Crisis") {
      return <CrisisCard card={card} size={size} onClick={onClick} />
    }

    // Default to Hero card if type is not specified
    return <HeroCard card={card} size={size} onClick={onClick} />
  }

  // Get image URL with fallback
  const getImageUrl = () => {
    if (!card.imageUrl) {
      return `/placeholder.svg?height=300&width=250&query=${encodeURIComponent(
        `fantasy ${card.cardType?.toLowerCase() || "card"} ${card.name}`,
      )}`
    }
    return card.imageUrl
  }

  // Determine size class
  const sizeClass = size === "sm" ? "w-36 h-52" : size === "lg" ? "w-64 h-96" : "w-48 h-72"

  return (
    <TooltipProvider>
      <div
        className={cn("relative group transition-all duration-300", sizeClass, className, isHovered && "z-10")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Card Component */}
        <div className="relative w-full h-full">{getCardComponent()}</div>

        {/* Quick Stats Overlay (visible on hover) */}
        {isHovered && card.cardType === "Hero" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm p-2 rounded-b-md"
          >
            <div className="grid grid-cols-3 gap-1 text-xs">
              <Tooltip>
                <TooltipTrigger className="flex items-center justify-center gap-1 bg-gray-800 rounded p-1">
                  <Heart className="h-3 w-3 text-red-400" />
                  <span className="font-bold">{card.health || 0}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Health: How much damage this hero can take</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger className="flex items-center justify-center gap-1 bg-gray-800 rounded p-1">
                  <Sword className="h-3 w-3 text-orange-400" />
                  <span className="font-bold">{card.attack || 0}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attack: Damage dealt to enemies</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger className="flex items-center justify-center gap-1 bg-gray-800 rounded p-1">
                  <Shield className="h-3 w-3 text-blue-400" />
                  <span className="font-bold">{card.defense || 0}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Defense: Reduces incoming damage</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </motion.div>
        )}

        {/* Ability Preview (visible on hover) */}
        {isHovered && card.abilities && card.abilities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -right-2 -top-2 z-20"
          >
            <Tooltip>
              <TooltipTrigger className="bg-blue-600 text-white rounded-full p-1 shadow-lg">
                <Zap className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="w-64 p-2">
                <h4 className="font-bold text-blue-400 mb-1">Abilities</h4>
                <div className="space-y-2">
                  {card.abilities.map((ability, index) => (
                    <div key={index} className="border-b border-gray-700 pb-1 last:border-0">
                      <div className="flex justify-between">
                        <span className="font-semibold">{ability.name}</span>
                        {ability.cost !== undefined && (
                          <span className="text-xs bg-blue-900/50 px-1.5 rounded">Cost: {ability.cost}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-300">{ability.description}</p>
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        )}

        {/* Synergy Indicator */}
        {isHovered && card.aspects && card.aspects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -left-2 -top-2 z-20"
          >
            <Tooltip>
              <TooltipTrigger className="bg-purple-600 text-white rounded-full p-1 shadow-lg">
                <Brain className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="w-64 p-2">
                <h4 className="font-bold text-purple-400 mb-1">Aspects & Synergies</h4>
                <div className="flex flex-wrap gap-1 mb-2">
                  {card.aspects.map((aspect, index) => (
                    <span key={index} className="text-xs bg-purple-900/50 px-1.5 py-0.5 rounded">
                      {aspect}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-300">
                  Cards with matching aspects create powerful synergies when played together.
                </p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        )}

        {/* Faction Synergy Indicator */}
        {isHovered && card.faction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -left-2 bottom-2 z-20"
          >
            <Tooltip>
              <TooltipTrigger className="bg-green-600 text-white rounded-full p-1 shadow-lg">
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="w-64 p-2">
                <h4 className="font-bold text-green-400 mb-1">{card.faction} Faction</h4>
                <p className="text-xs text-gray-300 mb-2">
                  This card belongs to the {card.faction} faction and gains bonuses when played with other{" "}
                  {card.faction} cards.
                </p>
                <div className="text-xs">
                  <span className="font-semibold">Typical Playstyle:</span>
                  <p className="text-gray-300">{getFactionPlaystyle(card.faction)}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </div>
    </TooltipProvider>
  )
}

// Helper function to get faction playstyle description
function getFactionPlaystyle(faction: string): string {
  const playstyles: Record<string, string> = {
    Order: "Control-oriented with strong defensive capabilities and tactical positioning.",
    Chaos: "Aggressive and unpredictable, focusing on high-risk, high-reward strategies.",
    Nature: "Growth-focused with regeneration abilities and swarm tactics.",
    Tech: "Resource efficiency and combo-based strategies with strong scaling.",
    Mystic: "Spell-focused with powerful abilities that require careful timing.",
    Cybernetic: "Resource manipulation and strategic planning with strong synergies.",
    Void: "Disruption and reality manipulation, sacrificing resources for powerful effects.",
    Primordial: "Growth mechanics and overwhelming opponents with numbers and regeneration.",
    Eclipsed: "Stealth tactics and targeted elimination with poison and debuffs.",
    Celestial: "Controlling the flow of time and predicting opponent moves.",
    Titanborn: "Defensive positioning and powerful counter-attacks with high durability.",
  }

  return playstyles[faction] || "Balanced gameplay with a mix of offensive and defensive capabilities."
}
