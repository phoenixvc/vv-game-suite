"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const factions = [
  {
    id: "cybernetic-nexus",
    name: "Cybernetic Nexus",
    color: "#00a8ff",
    description:
      "Masters of technology and information warfare, the Cybernetic Nexus excels at resource conversion and efficiency.",
    strengths: ["Information generation", "Resource conversion", "Technology advancement"],
    weaknesses: ["Physical combat", "Biological threats", "Resource depletion"],
    playstyle: "Technical",
    difficulty: "Beginner",
    resources: {
      energy: 80,
      materials: 40,
      information: 100,
    },
  },
  {
    id: "void-harbingers",
    name: "Void Harbingers",
    color: "#9b59b6",
    description:
      "Drawing power from dimensional rifts, the Void Harbingers manipulate reality and employ sacrifice mechanics.",
    strengths: ["Dimensional manipulation", "Sacrifice benefits", "Crisis exploitation"],
    weaknesses: ["Resource generation", "Defensive capabilities", "Sustainability"],
    playstyle: "Sacrificial",
    difficulty: "Expert",
    resources: {
      energy: 70,
      materials: 50,
      information: 90,
    },
  },
  {
    id: "primordial-ascendancy",
    name: "Primordial Ascendancy",
    color: "#2ecc71",
    description:
      "Harnessing natural forces and biological adaptation, they excel at resource regeneration and evolution.",
    strengths: ["Resource regeneration", "Adaptation", "Territory control"],
    weaknesses: ["Technology", "Information warfare", "Urban environments"],
    playstyle: "Adaptive",
    difficulty: "Intermediate",
    resources: {
      energy: 60,
      materials: 100,
      information: 50,
    },
  },
  {
    id: "eclipsed-order",
    name: "Eclipsed Order",
    color: "#34495e",
    description:
      "Shadow operatives and mystical assassins, the Eclipsed Order specializes in stealth and targeted elimination.",
    strengths: ["Stealth operations", "Sabotage", "Targeted elimination"],
    weaknesses: ["Direct confrontation", "Resource generation", "Defensive warfare"],
    playstyle: "Tactical",
    difficulty: "Advanced",
    resources: {
      energy: 50,
      materials: 70,
      information: 90,
    },
  },
  {
    id: "titanborn",
    name: "Titanborn",
    color: "#e67e22",
    description:
      "Master craftsmen and elemental forgers, the Titanborn excel at creating powerful artifacts and structures.",
    strengths: ["Artifact creation", "Structural integrity", "Resource utilization"],
    weaknesses: ["Mobility", "Information warfare", "Adaptation"],
    playstyle: "Constructive",
    difficulty: "Beginner",
    resources: {
      energy: 70,
      materials: 100,
      information: 40,
    },
  },
  {
    id: "celestial-dominion",
    name: "Celestial Dominion",
    color: "#f1c40f",
    description:
      "Manipulators of time and cosmic forces, they specialize in prediction and altering the flow of the game.",
    strengths: ["Prediction", "Time manipulation", "Strategic planning"],
    weaknesses: ["Direct combat", "Resource generation", "Structural integrity"],
    playstyle: "Strategic",
    difficulty: "Expert",
    resources: {
      energy: 90,
      materials: 40,
      information: 80,
    },
  },
]

/**
 * Displays an interactive, animated UI for comparing detailed information about multiple factions.
 *
 * Presents a tabbed interface allowing users to explore each faction's overview, strengths and weaknesses, resource distribution, and playstyle. Faction selection and tab navigation dynamically update the displayed content with smooth transitions and faction-specific styling.
 *
 * @returns A React component rendering the faction comparison interface.
 */
export default function FactionComparisonVisual() {
  const [selectedFaction, setSelectedFaction] = useState(factions[0])

  return (
    <div className="rounded-xl bg-gray-800 bg-opacity-50 p-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strengths">Strengths & Weaknesses</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="playstyle">Playstyle</TabsTrigger>
        </TabsList>

        <div className="mb-6 mt-6 flex flex-wrap justify-center gap-2">
          {factions.map((faction) => (
            <button
              key={faction.id}
              onClick={() => setSelectedFaction(faction)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedFaction.id === faction.id
                  ? `bg-[${faction.color}] text-white`
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              style={{
                backgroundColor: selectedFaction.id === faction.id ? faction.color : undefined,
              }}
            >
              {faction.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="overview" className="mt-0">
              <div className="rounded-lg bg-gray-700 bg-opacity-50 p-6">
                <h3
                  className="mb-4 text-2xl font-bold"
                  style={{
                    color: selectedFaction.color,
                  }}
                >
                  {selectedFaction.name}
                </h3>
                <p className="mb-6 text-gray-300">{selectedFaction.description}</p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-800 bg-opacity-50 p-4">
                    <h4 className="mb-2 font-semibold text-gray-200">Playstyle</h4>
                    <p className="text-gray-300">{selectedFaction.playstyle}</p>
                  </div>
                  <div className="rounded-lg bg-gray-800 bg-opacity-50 p-4">
                    <h4 className="mb-2 font-semibold text-gray-200">Difficulty</h4>
                    <p className="text-gray-300">{selectedFaction.difficulty}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="strengths" className="mt-0">
              <div className="rounded-lg bg-gray-700 bg-opacity-50 p-6">
                <h3
                  className="mb-4 text-2xl font-bold"
                  style={{
                    color: selectedFaction.color,
                  }}
                >
                  {selectedFaction.name}
                </h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-semibold text-green-400">Strengths</h4>
                    <ul className="list-inside list-disc space-y-2 text-gray-300">
                      {selectedFaction.strengths.map((strength) => (
                        <li key={strength}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-red-400">Weaknesses</h4>
                    <ul className="list-inside list-disc space-y-2 text-gray-300">
                      {selectedFaction.weaknesses.map((weakness) => (
                        <li key={weakness}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="mt-0">
              <div className="rounded-lg bg-gray-700 bg-opacity-50 p-6">
                <h3
                  className="mb-4 text-2xl font-bold"
                  style={{
                    color: selectedFaction.color,
                  }}
                >
                  {selectedFaction.name} Resources
                </h3>

                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-semibold text-blue-400">Energy</h4>
                      <span className="text-sm text-gray-300">{selectedFaction.resources.energy}%</span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-gray-800">
                      <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedFaction.resources.energy}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-semibold text-green-400">Materials</h4>
                      <span className="text-sm text-gray-300">{selectedFaction.resources.materials}%</span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-gray-800">
                      <motion.div
                        className="h-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedFaction.resources.materials}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-semibold text-purple-400">Information</h4>
                      <span className="text-sm text-gray-300">{selectedFaction.resources.information}%</span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-gray-800">
                      <motion.div
                        className="h-full bg-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedFaction.resources.information}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="playstyle" className="mt-0">
              <div className="rounded-lg bg-gray-700 bg-opacity-50 p-6">
                <h3
                  className="mb-4 text-2xl font-bold"
                  style={{
                    color: selectedFaction.color,
                  }}
                >
                  {selectedFaction.name} Playstyle
                </h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-800 bg-opacity-50 p-4">
                    <h4 className="mb-2 font-semibold text-gray-200">Style</h4>
                    <p className="text-gray-300">{selectedFaction.playstyle}</p>
                    <p className="mt-4 text-gray-400">
                      {selectedFaction.playstyle === "Technical"
                        ? "Focus on optimizing resource conversion and technological advancement."
                        : selectedFaction.playstyle === "Sacrificial"
                          ? "Willing to sacrifice resources and units for powerful effects."
                          : selectedFaction.playstyle === "Adaptive"
                            ? "Able to adapt to changing game conditions and evolve strategies."
                            : selectedFaction.playstyle === "Tactical"
                              ? "Emphasis on precise timing and positioning for maximum effect."
                              : selectedFaction.playstyle === "Constructive"
                                ? "Building and fortifying structures and artifacts for long-term advantage."
                                : "Planning several turns ahead and manipulating the flow of the game."}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-800 bg-opacity-50 p-4">
                    <h4 className="mb-2 font-semibold text-gray-200">Difficulty</h4>
                    <p className="text-gray-300">{selectedFaction.difficulty}</p>
                    <p className="mt-4 text-gray-400">
                      {selectedFaction.difficulty === "Beginner"
                        ? "Straightforward mechanics and forgiving gameplay, ideal for new players."
                        : selectedFaction.difficulty === "Intermediate"
                          ? "Balanced complexity with some advanced mechanics that require practice."
                          : selectedFaction.difficulty === "Advanced"
                            ? "Complex interactions and timing-sensitive abilities that reward skilled play."
                            : "Highly complex mechanics with long-term planning and risk management."}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
