"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, User, Box, AlertTriangle } from "lucide-react"

type CardType = "hero" | "artifact" | "crisis"

const cardData = {
  hero: {
    title: "Hero Cards",
    description:
      "Heroes are powerful characters with unique abilities. They remain in play until defeated and can level up through gameplay actions.",
    examples: [
      {
        name: "Shadow Stalker",
        image: "/fantasy-shadow-stalker.png",
        faction: "Eclipsed Order",
        ability: "Can move undetected through enemy territory and sabotage resource generators.",
      },
      {
        name: "Valiant Defender",
        image: "/fantasy-valiant-defender.png",
        faction: "Titanborn",
        ability: "Provides +2 defense to adjacent allies and can intercept attacks targeting them.",
      },
      {
        name: "Mage with Glowing Staff",
        image: "/fantasy-mage-glowing-staff.png",
        faction: "Celestial Dominion",
        ability: "Can manipulate time to grant allies an additional action once per turn.",
      },
    ],
  },
  artifact: {
    title: "Artifact Cards",
    description:
      "Artifacts are equippable items and structures that provide ongoing benefits. They can be attached to heroes or placed in territory zones.",
    examples: [
      {
        name: "Amulet of Vitality",
        image: "/fantasy-amulet-of-vitality.png",
        faction: "Primordial Ascendancy",
        ability: "Regenerates 1 health per turn to the equipped hero.",
      },
      {
        name: "Quantum Stabilizer",
        image: "/sci-fi-quantum-stabilizer.png",
        faction: "Cybernetic Nexus",
        ability: "Prevents crisis events from affecting the territory where it's placed.",
      },
      {
        name: "Blade of Elements",
        image: "/fantasy-blade-of-elements.png",
        faction: "Titanborn",
        ability: "Grants the equipped hero attacks that ignore elemental resistances.",
      },
    ],
  },
  crisis: {
    title: "Crisis Cards",
    description:
      "Crisis cards create global effects that last for a specified duration. They can change resource generation, modify card abilities, or create new victory conditions.",
    examples: [
      {
        name: "Dimensional Rift",
        image: "/fantasy-dimensional-rift.png",
        faction: "Void Harbingers",
        ability: "All players must sacrifice a resource each turn or lose a territory zone.",
      },
      {
        name: "System Failure",
        image: "/sci-fi-system-failure.png",
        faction: "Cybernetic Nexus",
        ability: "Information resources cannot be generated for 3 turns.",
      },
      {
        name: "Temporal Anomaly",
        image: "/fantasy-temporal-anomaly.png",
        faction: "Celestial Dominion",
        ability: "The turn order is reversed until the next crisis event.",
      },
    ],
  },
}

/**
 * Displays an interactive, animated showcase of categorized cards with navigation and filtering.
 *
 * Users can select between hero, artifact, and crisis card categories, browse example cards within each category, and view card details with animated transitions. Includes controls for switching categories, navigating cards, and direct card selection.
 */
export default function CardTypeShowcase() {
  const [activeType, setActiveType] = useState<CardType>("hero")
  const [activeCardIndex, setActiveCardIndex] = useState(0)

  const handlePrevCard = () => {
    setActiveCardIndex((prev) => (prev === 0 ? cardData[activeType].examples.length - 1 : prev - 1))
  }

  const handleNextCard = () => {
    setActiveCardIndex((prev) => (prev === cardData[activeType].examples.length - 1 ? 0 : prev + 1))
  }

  const activeCard = cardData[activeType].examples[activeCardIndex]

  return (
    <div className="rounded-xl bg-gray-800 bg-opacity-50 p-6">
      <div className="mb-8 flex justify-center space-x-4">
        <TypeButton
          type="hero"
          activeType={activeType}
          onClick={() => {
            setActiveType("hero")
            setActiveCardIndex(0)
          }}
          icon={<User className="mr-2 h-5 w-5" />}
        />
        <TypeButton
          type="artifact"
          activeType={activeType}
          onClick={() => {
            setActiveType("artifact")
            setActiveCardIndex(0)
          }}
          icon={<Box className="mr-2 h-5 w-5" />}
        />
        <TypeButton
          type="crisis"
          activeType={activeType}
          onClick={() => {
            setActiveType("crisis")
            setActiveCardIndex(0)
          }}
          icon={<AlertTriangle className="mr-2 h-5 w-5" />}
        />
      </div>

      <div className="mb-6 text-center">
        <h3 className="mb-2 text-2xl font-bold text-white">{cardData[activeType].title}</h3>
        <p className="mx-auto max-w-2xl text-gray-300">{cardData[activeType].description}</p>
      </div>

      <div className="relative mx-auto max-w-4xl">
        <button
          onClick={handlePrevCard}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-800 p-2 text-white opacity-80 transition-opacity hover:opacity-100"
          aria-label="Previous card"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex flex-col items-center justify-center md:flex-row md:items-start md:space-x-8">
          <div className="relative mb-6 h-[300px] w-[220px] overflow-hidden rounded-lg border-2 border-gray-700 md:mb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCard.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <Image
                  src={activeCard.image || "/placeholder.svg"}
                  alt={activeCard.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 220px"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCard.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="mb-2 text-xl font-bold text-white">{activeCard.name}</h4>
                <p className="mb-4 text-sm text-blue-400">{activeCard.faction}</p>
                <div className="rounded-lg bg-gray-700 bg-opacity-50 p-4">
                  <h5 className="mb-2 font-semibold text-gray-200">Ability</h5>
                  <p className="text-gray-300">{activeCard.ability}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <button
          onClick={handleNextCard}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-800 p-2 text-white opacity-80 transition-opacity hover:opacity-100"
          aria-label="Next card"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="mt-4 flex justify-center space-x-2">
          {cardData[activeType].examples.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === activeCardIndex ? "bg-blue-500" : "bg-gray-600"
              } transition-colors`}
              onClick={() => setActiveCardIndex(index)}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Renders a selectable button for a card category with an icon and label.
 *
 * Highlights the button if it matches the currently active card type.
 *
 * @param type - The card category represented by this button.
 * @param activeType - The currently selected card category.
 * @param onClick - Handler invoked when the button is clicked.
 * @param icon - Icon to display alongside the label.
 */
function TypeButton({
  type,
  activeType,
  onClick,
  icon,
}: {
  type: CardType
  activeType: CardType
  onClick: () => void
  icon: React.ReactNode
}) {
  const isActive = type === activeType
  const typeLabels = {
    hero: "Heroes",
    artifact: "Artifacts",
    crisis: "Crisis Events",
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        isActive ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
      }`}
    >
      {icon}
      {typeLabels[type]}
    </button>
  )
}
