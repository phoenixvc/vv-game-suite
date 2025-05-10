"use client"

import React, { useState } from "react"
import { TitanbornBackground } from "../../../components/faction-themes/titanborn-background"
import { TitanbornCard } from "../../../components/faction-themes/titanborn-card"
import { TitanbornInterface } from "../../../components/faction-themes/titanborn-interface"
import { TitanbornButton } from "../../../components/faction-themes/titanborn-button"
import { SharedNavigation } from "../../../components/shared-navigation"
import styles from "../../../styles/animations.module.css"

export default function TitanbornPage() {
  const [forgeLevel, setForgeLevel] = useState(75)
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null)
  const [craftingProgress, setCraftingProgress] = useState(0)
  const [isCrafting, setIsCrafting] = useState(false)

  // Simulate crafting progress
  React.useEffect(() => {
    if (!isCrafting) return

    const interval = setInterval(() => {
      setCraftingProgress((prev) => {
        if (prev >= 100) {
          setIsCrafting(false)
          return 100
        }
        return prev + 5
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isCrafting])

  // Start crafting
  const startCrafting = () => {
    if (selectedArtifact && !isCrafting) {
      setCraftingProgress(0)
      setIsCrafting(true)
    }
  }

  // Reset crafting
  const resetCrafting = () => {
    setIsCrafting(false)
    setCraftingProgress(0)
    setSelectedArtifact(null)
  }

  // Artifacts data
  const artifacts = [
    {
      id: "hammer-of-dawn",
      title: "Hammer of Dawn",
      description: "A mighty warhammer forged in the heart of a dying star. Deals +3 damage to armored enemies.",
      image: "/placeholder.svg?key=78cwo",
      rarity: "legendary",
      type: "Weapon",
      cost: 5,
      power: 7,
    },
    {
      id: "stone-heart-amulet",
      title: "Stone Heart Amulet",
      description: "Grants the wearer resilience against earth and stone-based attacks. Reduces damage by 2.",
      image: "/stone-amulet.png",
      rarity: "rare",
      type: "Accessory",
      cost: 3,
      power: 4,
    },
    {
      id: "molten-gauntlets",
      title: "Molten Gauntlets",
      description: "Gauntlets that never cool, allowing the wearer to shape metal with their bare hands.",
      image: "/glowing-gauntlets.png",
      rarity: "uncommon",
      type: "Armor",
      cost: 2,
      power: 3,
    },
    {
      id: "obsidian-shield",
      title: "Obsidian Shield",
      description: "A shield of volcanic glass that absorbs magical attacks. Grants +2 magic resistance.",
      image: "/obsidian-shield.png",
      rarity: "common",
      type: "Shield",
      cost: 2,
      power: 4,
    },
  ] as const

  return (
    <div className="min-h-screen">
      <SharedNavigation />

      <TitanbornBackground intensity="medium" showForgeElements={true}>
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <h1 className={`text-4xl font-bold text-amber-300 mb-2 ${styles.metalShine}`}>Titanborn Forge</h1>
            <p className="text-stone-300 max-w-2xl mx-auto">
              Masters of stone and metal, the Titanborn harness the power of the forge to create legendary artifacts and
              weapons.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Forge controls */}
            <div>
              <TitanbornInterface title="Forge Controls" forgeLevel={forgeLevel} showForgeIndicator={true}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-stone-400 mb-1">Forge Temperature</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={forgeLevel}
                      onChange={(e) => setForgeLevel(Number.parseInt(e.target.value))}
                      className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-stone-500 mt-1">
                      <span>Cold</span>
                      <span>Optimal</span>
                      <span>Dangerous</span>
                    </div>
                  </div>

                  <div className="border-t border-stone-700 pt-4">
                    <h3 className="text-amber-300 font-bold mb-2">Crafting Station</h3>

                    {selectedArtifact ? (
                      <div className="space-y-3">
                        <p className="text-sm">
                          Selected:{" "}
                          <span className="text-amber-300">
                            {artifacts.find((a) => a.id === selectedArtifact)?.title}
                          </span>
                        </p>

                        {isCrafting ? (
                          <div>
                            <div className="w-full h-2 bg-stone-700 rounded-full overflow-hidden mb-2">
                              <div
                                className={`h-full bg-orange-500 ${styles.forgeFlicker}`}
                                style={{ width: `${craftingProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-stone-400">Crafting: {craftingProgress}% complete</p>
                          </div>
                        ) : craftingProgress === 100 ? (
                          <p className="text-green-400 text-sm">Crafting complete!</p>
                        ) : (
                          <div className="flex space-x-2">
                            <TitanbornButton variant="primary" onClick={startCrafting}>
                              Begin Forging
                            </TitanbornButton>
                            <TitanbornButton variant="outline" onClick={resetCrafting}>
                              Cancel
                            </TitanbornButton>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-stone-400">Select an artifact to craft</p>
                    )}
                  </div>

                  <div className="border-t border-stone-700 pt-4">
                    <h3 className="text-amber-300 font-bold mb-2">Forge Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <TitanbornButton variant="primary" size="sm">
                        Stoke Flames
                      </TitanbornButton>
                      <TitanbornButton variant="secondary" size="sm">
                        Add Ore
                      </TitanbornButton>
                      <TitanbornButton variant="outline" size="sm">
                        Cool Metal
                      </TitanbornButton>
                      <TitanbornButton variant="danger" size="sm">
                        Emergency Stop
                      </TitanbornButton>
                    </div>
                  </div>
                </div>
              </TitanbornInterface>
            </div>

            {/* Middle column - Faction info */}
            <div>
              <TitanbornInterface title="Titanborn Legacy">
                <div className="space-y-4">
                  <div className={`relative h-40 overflow-hidden rounded mb-4 ${styles.stoneTexture}`}>
                    <img
                      src="/ancient-forge-mountain.png"
                      alt="Titanborn Forge"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-amber-300 font-bold">The Great Forge</h3>
                      <p className="text-xs text-stone-300">Heart of the Titanborn civilization</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-amber-300 font-bold mb-2">Faction Traits</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-amber-500 mr-2">•</span>
                        <span>
                          <strong className="text-amber-300">Stone Resilience:</strong> Titanborn units have +1 health
                          and are immune to earth damage.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-500 mr-2">•</span>
                        <span>
                          <strong className="text-amber-300">Master Smiths:</strong> Artifact cards cost 1 less to play
                          and gain +1 power.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-500 mr-2">•</span>
                        <span>
                          <strong className="text-amber-300">Forge Magic:</strong> Can sacrifice artifacts to deal
                          direct damage to enemies.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-stone-700 pt-4">
                    <h3 className="text-amber-300 font-bold mb-2">Faction History</h3>
                    <p className="text-sm text-stone-300">
                      The Titanborn emerged from the volcanic mountains of the north, where they discovered the secrets
                      of metallurgy and stone magic. For centuries, they have crafted the finest weapons and armor in
                      the realm, their forges burning day and night.
                    </p>
                    <p className="text-sm text-stone-300 mt-2">
                      Their society values strength, craftsmanship, and honor above all else. The greatest among them
                      are those who can shape the most powerful artifacts, combining physical skill with ancient forge
                      magic.
                    </p>
                  </div>
                </div>
              </TitanbornInterface>
            </div>

            {/* Right column - Artifacts */}
            <div>
              <TitanbornInterface title="Artifact Forge">
                <div className="space-y-4">
                  <p className="text-sm text-stone-300 mb-4">
                    Select an artifact to forge. Higher rarity items require more forge heat and crafting time.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {artifacts.map((artifact) => (
                      <div
                        key={artifact.id}
                        className={`cursor-pointer transform transition-transform ${selectedArtifact === artifact.id ? "scale-105" : "hover:scale-102"}`}
                        onClick={() => {
                          if (!isCrafting) {
                            setSelectedArtifact(artifact.id)
                            setCraftingProgress(0)
                          }
                        }}
                      >
                        <TitanbornCard
                          title={artifact.title}
                          description={artifact.description}
                          image={artifact.image}
                          rarity={artifact.rarity as any}
                          type={artifact.type}
                          cost={artifact.cost}
                          power={artifact.power}
                          className={selectedArtifact === artifact.id ? "ring-2 ring-amber-500" : ""}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TitanbornInterface>
            </div>
          </div>

          {/* Bottom section - Buttons showcase */}
          <div className="mt-8">
            <TitanbornInterface title="Titanborn Controls">
              <div className="space-y-6">
                <div>
                  <h3 className="text-amber-300 font-bold mb-3">Button Variants</h3>
                  <div className="flex flex-wrap gap-4">
                    <TitanbornButton variant="primary">Primary Action</TitanbornButton>
                    <TitanbornButton variant="secondary">Secondary Action</TitanbornButton>
                    <TitanbornButton variant="outline">Outline Action</TitanbornButton>
                    <TitanbornButton variant="danger">Danger Action</TitanbornButton>
                    <TitanbornButton variant="primary" disabled>
                      Disabled
                    </TitanbornButton>
                  </div>
                </div>

                <div>
                  <h3 className="text-amber-300 font-bold mb-3">Button Sizes</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <TitanbornButton variant="primary" size="sm">
                      Small
                    </TitanbornButton>
                    <TitanbornButton variant="primary" size="md">
                      Medium
                    </TitanbornButton>
                    <TitanbornButton variant="primary" size="lg">
                      Large
                    </TitanbornButton>
                  </div>
                </div>
              </div>
            </TitanbornInterface>
          </div>
        </div>
      </TitanbornBackground>
    </div>
  )
}
