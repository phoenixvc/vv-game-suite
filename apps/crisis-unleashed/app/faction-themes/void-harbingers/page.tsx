"use client"

import { useState } from "react"
import SharedNavigation from "@/components/shared-navigation"
import VoidBackground from "@/components/faction-themes/void-background"
import VoidCard from "@/components/faction-themes/void-card"
import VoidInterface from "@/components/faction-themes/void-interface"
import VoidButton from "@/components/faction-themes/void-button"
import { voidHarbingerCards } from "@/data/void-harbingers"
import Link from "next/link"
import { ArrowLeft, Zap, Compass, Skull, Book, Atom } from "lucide-react"
import styles from "@/styles/animations.module.css"

export default function VoidHarbingersThemePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [realityStability, setRealityStability] = useState(70)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  // Decrease reality stability
  const destabilizeReality = () => {
    setRealityStability((prev) => Math.max(10, prev - 10))
  }

  // Increase reality stability
  const stabilizeReality = () => {
    setRealityStability((prev) => Math.min(90, prev + 10))
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <VoidBackground intensity={1.5 - realityStability / 100} />
      <SharedNavigation />

      <div className="pt-32 pb-20 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="flex items-center mb-8">
            <Link
              href="/factions"
              className="mr-4 text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Factions
            </Link>
            <h1
              className={`text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent ${
                realityStability < 40 ? styles.voidGlitch : ""
              }`}
            >
              Void Harbingers
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <VoidInterface title="Dimensional Control" className="mb-8" unstable={realityStability < 40}>
                <div className="space-y-3">
                  <VoidButton
                    variant={activeTab === "overview" ? "primary" : "secondary"}
                    onClick={() => setActiveTab("overview")}
                    className="w-full justify-start"
                    unstable={realityStability < 40}
                  >
                    <Compass size={16} />
                    <span>Faction Overview</span>
                  </VoidButton>
                  <VoidButton
                    variant={activeTab === "abilities" ? "primary" : "secondary"}
                    onClick={() => setActiveTab("abilities")}
                    className="w-full justify-start"
                    unstable={realityStability < 40}
                  >
                    <Zap size={16} />
                    <span>Void Abilities</span>
                  </VoidButton>
                  <VoidButton
                    variant={activeTab === "entities" ? "primary" : "secondary"}
                    onClick={() => setActiveTab("entities")}
                    className="w-full justify-start"
                    unstable={realityStability < 40}
                  >
                    <Skull size={16} />
                    <span>Void Entities</span>
                  </VoidButton>
                  <VoidButton
                    variant={activeTab === "lore" ? "primary" : "secondary"}
                    onClick={() => setActiveTab("lore")}
                    className="w-full justify-start"
                    unstable={realityStability < 40}
                  >
                    <Book size={16} />
                    <span>Forbidden Lore</span>
                  </VoidButton>
                  <VoidButton
                    variant={activeTab === "research" ? "primary" : "secondary"}
                    onClick={() => setActiveTab("research")}
                    className="w-full justify-start"
                    unstable={realityStability < 40}
                  >
                    <Atom size={16} />
                    <span>Void Research</span>
                  </VoidButton>
                </div>
              </VoidInterface>

              <VoidInterface title="Reality Stability" unstable={realityStability < 40}>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-indigo-400 mb-1">DIMENSIONAL ANCHOR</div>
                    <div className="w-full bg-indigo-900/50 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{
                          width: `${realityStability}%`,
                          transition: "width 0.5s ease-out",
                        }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-indigo-400 mt-1">{realityStability}%</div>
                  </div>

                  <div className="flex justify-between gap-4">
                    <VoidButton
                      variant="danger"
                      onClick={destabilizeReality}
                      className="flex-1"
                      unstable={realityStability < 40}
                    >
                      Destabilize Reality
                    </VoidButton>
                    <VoidButton
                      variant="primary"
                      onClick={stabilizeReality}
                      className="flex-1"
                      unstable={realityStability < 40}
                    >
                      Stabilize Reality
                    </VoidButton>
                  </div>

                  <div className="text-sm text-indigo-300 bg-indigo-900/30 p-3 rounded border border-indigo-800">
                    <p className={realityStability < 40 ? styles.voidTextGlitch : ""}>
                      {realityStability > 70
                        ? "Reality anchor stable. Dimensional rifts contained."
                        : realityStability > 40
                          ? "Warning: Reality fluctuations detected. Monitor dimensional integrity."
                          : "CRITICAL: Reality collapse imminent. Dimensional breach detected."}
                    </p>
                  </div>
                </div>
              </VoidInterface>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <VoidInterface
                title={
                  activeTab === "overview"
                    ? "Faction Overview"
                    : activeTab === "abilities"
                      ? "Void Abilities"
                      : activeTab === "entities"
                        ? "Void Entities"
                        : activeTab === "lore"
                          ? "Forbidden Lore"
                          : "Void Research"
                }
                className="mb-8"
                unstable={realityStability < 40}
              >
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <p className={`text-indigo-200 ${realityStability < 40 ? styles.voidTextGlitch : ""}`}>
                      The Void Harbingers exist at the boundary between realities, manipulating the fabric of existence
                      itself. They emerged from the Dimensional Schism, when the barriers between worlds weakened and
                      allowed entities from beyond to slip into our reality.
                    </p>
                    <p className={`text-indigo-200 ${realityStability < 40 ? styles.voidTextGlitch : ""}`}>
                      Their stronghold, the Nexus of Infinite Paths, exists partially in our dimension and partially
                      beyond, making it nearly impossible to locate or assault. Led by the enigmatic Council of
                      Observers, they seek to reshape reality according to patterns only they can perceive.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-indigo-900/30 p-4 rounded-md border border-indigo-800">
                        <h3 className="text-indigo-400 font-bold mb-2">Strengths</h3>
                        <ul className="list-disc list-inside text-indigo-200 space-y-1">
                          <li>Reality manipulation</li>
                          <li>Unpredictable strategies</li>
                          <li>Dimensional phasing</li>
                          <li>Mind control capabilities</li>
                        </ul>
                      </div>
                      <div className="bg-indigo-900/30 p-4 rounded-md border border-indigo-800">
                        <h3 className="text-indigo-400 font-bold mb-2">Weaknesses</h3>
                        <ul className="list-disc list-inside text-indigo-200 space-y-1">
                          <li>Dimensional instability</li>
                          <li>Reliance on void energy</li>
                          <li>Vulnerability to reality anchors</li>
                          <li>Internal factional chaos</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "abilities" && (
                  <div className="space-y-4">
                    <p className={`text-indigo-200 ${realityStability < 40 ? styles.voidTextGlitch : ""}`}>
                      Void Harbingers wield powers that defy conventional understanding, manipulating probability,
                      dimensional boundaries, and the laws of physics themselves.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-indigo-900/30 p-4 rounded-md border border-indigo-800">
                        <h3 className="text-indigo-400 font-bold mb-2">Reality Tear</h3>
                        <p className="text-indigo-200 text-sm">
                          Create a dimensional rift that deals 3 damage to all units in a line and has a 20% chance to
                          banish them to the void for 1 turn.
                        </p>
                        <div className="text-xs text-indigo-300 mt-2">Cost: 4 • Type: Dimensional</div>
                      </div>
                      <div className="bg-indigo-900/30 p-4 rounded-md border border-indigo-800">
                        <h3 className="text-indigo-400 font-bold mb-2">Probability Shift</h3>
                        <p className="text-indigo-200 text-sm">
                          Alter the outcome of the next random effect. You may choose the result instead of it being
                          determined randomly.
                        </p>
                        <div className="text-xs text-indigo-300 mt-2">Cost: 3 • Type: Control</div>
                      </div>
                      <div className="bg-indigo-900/30 p-4 rounded-md border border-indigo-800">
                        <h3 className="text-indigo-400 font-bold mb-2">Mind Fracture</h3>
                        <p className="text-indigo-200 text-sm">
                          Target enemy unit attacks random targets for 2 turns and has a 50% chance to damage itself
                          when attacking.
                        </p>
                        <div className="text-xs text-indigo-300 mt-2">Cost: 5 • Type: Psychic</div>
                      </div>
                      <div className="bg-indigo-900/30 p-4 rounded-md border border-indigo-800">
                        <h3 className="text-indigo-400 font-bold mb-2">Entropic Surge</h3>
                        <p className="text-indigo-200 text-sm">
                          All units on the battlefield have their stats randomized between 1 and their current values
                          for 1 turn.
                        </p>
                        <div className="text-xs text-indigo-300 mt-2">Cost: 6 • Type: Chaos</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "entities" && (
                  <div>
                    <p className={`text-indigo-200 mb-4 ${realityStability < 40 ? styles.voidTextGlitch : ""}`}>
                      The Void Harbingers command entities that exist partially outside our reality, making them
                      unpredictable and difficult to counter with conventional tactics.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {voidHarbingerCards.map((card) => (
                        <div key={card.id}>
                          <VoidCard
                            title={card.name}
                            description={card.description}
                            image={card.imageUrl}
                            power={card.attack}
                            cost={card.provision}
                            type={card.type}
                            rarity={
                              card.rarity?.toLowerCase() === "legendary"
                                ? "legendary"
                                : card.rarity?.toLowerCase() === "rare"
                                  ? "rare"
                                  : card.rarity?.toLowerCase() === "uncommon"
                                    ? "uncommon"
                                    : "common"
                            }
                            onClick={() => setSelectedCard(card.id === selectedCard ? null : card.id)}
                            className={card.id === selectedCard ? "ring-2 ring-indigo-400 ring-opacity-70" : ""}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "lore" && (
                  <div className="space-y-4">
                    <p className={`text-indigo-200 ${realityStability < 40 ? styles.voidTextGlitch : ""}`}>
                      The origins of the Void Harbingers are shrouded in mystery, with contradictory accounts and
                      temporal anomalies making a coherent history impossible to compile.
                    </p>
                    <div className="bg-indigo-900/30 p-4 rounded-md border border-indigo-800 space-y-3">
                      <h3 className="text-indigo-400 font-bold">The Dimensional Schism</h3>
                      <p className="text-indigo-200 text-sm">
                        In the 73rd year of the Eternal Empire, a catastrophic experiment tore the fabric between
                        dimensions. The resulting Schism allowed entities from beyond to enter our reality, bringing
                        with them knowledge of void manipulation and dimensional travel.
                      </p>
                      <p className="text-indigo-200 text-sm">
                        Witnesses reported seeing the same event occur multiple times in different ways, suggesting that
                        the Schism affected not just space but time itself. Some scholars believe the event happened
                        both in the past and future simultaneously.
                      </p>
                    </div>
                    <div className="bg-indigo-900/30 p-4 rounded-md border border-indigo-800 space-y-3">
                      <h3 className="text-indigo-400 font-bold">The Observer Council</h3>
                      <p className="text-indigo-200 text-sm">
                        The leadership of the Void Harbingers consists of seven entities known as Observers. They appear
                        humanoid but exhibit impossible geometries when viewed from certain angles. Each Observer
                        represents a different aspect of void manipulation.
                      </p>
                      <p className="text-indigo-200 text-sm">
                        Council meetings occur outside conventional time, allowing them to make decisions with knowledge
                        of all possible outcomes. This gives them an uncanny strategic advantage, as they often counter
                        threats before they materialize.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "research" && (
                  <div className="space-y-4">
                    <p className={`text-indigo-200 ${realityStability < 40 ? styles.voidTextGlitch : ""}`}>
                      The Void Harbingers conduct research into dimensional manipulation, entropy control, and reality
                      alteration. Their findings often defy conventional understanding of physics.
                    </p>
                    <div className="bg-indigo-900/30 p-4 rounded-md border border-indigo-800">
                      <h3 className="text-indigo-400 font-bold mb-2">Current Research Projects</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-medium text-indigo-300">Reality Anchor Disruption</div>
                            <div className="text-xs text-indigo-400">67% Complete</div>
                          </div>
                          <div className="w-full bg-indigo-900/50 rounded-full h-1.5 mt-1">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: "67%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-medium text-indigo-300">Dimensional Folding</div>
                            <div className="text-xs text-indigo-400">42% Complete</div>
                          </div>
                          <div className="w-full bg-indigo-900/50 rounded-full h-1.5 mt-1">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: "42%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-medium text-indigo-300">Entropy Manipulation</div>
                            <div className="text-xs text-indigo-400">89% Complete</div>
                          </div>
                          <div className="w-full bg-indigo-900/50 rounded-full h-1.5 mt-1">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: "89%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-indigo-900/30 p-4 rounded-md border border-indigo-800">
                        <h3 className="text-indigo-400 font-bold mb-2">Dimensional Resonance</h3>
                        <p className="text-indigo-200 text-sm">
                          Our studies show that reality can be manipulated through specific frequency patterns. By
                          creating resonance between dimensions, we can temporarily weaken the barriers between worlds.
                        </p>
                      </div>
                      <div className="bg-indigo-900/30 p-4 rounded-md border border-indigo-800">
                        <h3 className="text-indigo-400 font-bold mb-2">Probability Matrices</h3>
                        <p className="text-indigo-200 text-sm">
                          By observing all possible outcomes simultaneously, we can select the most favorable timeline
                          and collapse reality around it. This technique requires significant void energy but yields
                          unprecedented control.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </VoidInterface>

              {/* Featured Entities */}
              <VoidInterface title="Featured Entities" unstable={realityStability < 40}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-indigo-400 font-bold">The Faceless Observer</h3>
                    <p className={`text-sm text-indigo-200 ${realityStability < 40 ? styles.voidTextGlitch : ""}`}>
                      A being that exists simultaneously in multiple realities, the Faceless Observer can perceive all
                      possible outcomes of any action. Its form shifts constantly as it phases between dimensions,
                      making it nearly impossible to target or contain.
                    </p>
                    <VoidButton onClick={() => console.log("View details")} unstable={realityStability < 40}>
                      View Entity File
                    </VoidButton>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-indigo-400 font-bold">Entropy Weaver</h3>
                    <p className={`text-sm text-indigo-200 ${realityStability < 40 ? styles.voidTextGlitch : ""}`}>
                      Master of chaos and disorder, the Entropy Weaver can accelerate decay and randomness in any
                      system. On the battlefield, it creates zones of pure chaos where the laws of physics become
                      unreliable and strategies fall apart in unpredictable ways.
                    </p>
                    <VoidButton onClick={() => console.log("View details")} unstable={realityStability < 40}>
                      View Entity File
                    </VoidButton>
                  </div>
                </div>
              </VoidInterface>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
