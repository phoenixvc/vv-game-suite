"use client"

import { useState } from "react"
import { CelestialBackground } from "../../../components/faction-themes/celestial-background"
import { CelestialCard } from "../../../components/faction-themes/celestial-card"
import { CelestialInterface } from "../../../components/faction-themes/celestial-interface"
import { CelestialButton } from "../../../components/faction-themes/celestial-button"
import { SharedNavigation } from "../../../components/shared-navigation"
import styles from "../../../styles/animations.module.css"
import Image from "next/image"

/**
 * Renders the Celestial Dominion faction interface with themed UI, interactive cosmic power controls, spell selection, and celestial cards.
 *
 * Displays a full-page layout featuring faction overview, cosmic power meter, dimensional portal toggle, spell selection and casting, and showcases hero and artifact cards. Includes a control panel with various styled buttons and cosmic effects.
 */
export default function CelestialDominionPage() {
  const [showPortal, setShowPortal] = useState(false)
  const [selectedSpell, setSelectedSpell] = useState<string | null>(null)
  const [cosmicPower, setCosmicPower] = useState(50)

  const spells = [
    {
      id: "time-stop",
      title: "Time Stop",
      description: "Freeze time in a localized area, allowing allies to act freely while enemies are frozen.",
      image: "/cosmic-time-stop.png",
      rarity: "epic" as const,
      type: "spell" as const,
    },
    {
      id: "cosmic-vision",
      title: "Cosmic Vision",
      description: "Peer into possible futures to gain strategic advantage and foresee enemy actions.",
      image: "/cosmic-vision.png",
      rarity: "rare" as const,
      type: "spell" as const,
    },
    {
      id: "celestial-alignment",
      title: "Celestial Alignment",
      description: "Align the stars to boost the power of all cosmic abilities for a short duration.",
      image: "/celestial-alignment.png",
      rarity: "legendary" as const,
      type: "spell" as const,
    },
  ]

  const artifacts = [
    {
      id: "chronos-pendant",
      title: "Chronos Pendant",
      description: "Ancient artifact that allows the wearer to manipulate the flow of time around them.",
      image: "/chronos-pendant.png",
      rarity: "legendary" as const,
      type: "artifact" as const,
    },
    {
      id: "astral-compass",
      title: "Astral Compass",
      description: "Navigate the cosmos with precision, revealing hidden pathways between dimensions.",
      image: "/astral-compass.png",
      rarity: "epic" as const,
      type: "artifact" as const,
    },
  ]

  const heroes = [
    {
      id: "astromancer",
      title: "Astromancer Lyra",
      description: "Master of celestial magic who can read the stars to predict and alter fate.",
      image: "/astromancer.png",
      rarity: "legendary" as const,
      type: "hero" as const,
    },
  ]

  return (
    <div className="min-h-screen">
      <CelestialBackground intensity="medium" showPortal={showPortal} showConstellations={true}>
        <div className="container mx-auto px-4 py-8">
          <SharedNavigation />

          <div className="mt-8 mb-12 text-center">
            <h1 className={`text-4xl font-bold text-white mb-4 ${styles.cosmicText}`}>Celestial Dominion</h1>
            <p className="text-purple-100 max-w-2xl mx-auto">
              Wielders of cosmic energy and time manipulation, the Celestial Dominion faction harnesses the power of the
              stars to bend reality to their will.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Faction info */}
            <div>
              <CelestialInterface title="Faction Overview" showTimeControls={false} showCosmicMap={true}>
                <div className="space-y-4">
                  <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                    <Image
                      src="/cosmic-observatory.png"
                      alt="Celestial Observatory"
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a103d] to-transparent"></div>
                    <div className="absolute bottom-2 left-2 text-white font-bold">Celestial Observatory</div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-purple-200 mb-2">Faction Traits</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                        <span>Time Manipulation</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                        <span>Cosmic Foresight</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                        <span>Dimensional Travel</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                        <span>Astral Projection</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-lg font-bold text-purple-200 mb-2">Cosmic Power</h3>
                    <div className="w-full bg-purple-900/30 rounded-full h-4 mb-2">
                      <div
                        className={`h-full rounded-full ${styles.cosmicPulse}`}
                        style={{
                          width: `${cosmicPower}%`,
                          background: "linear-gradient(90deg, #a855f7, #c084fc)",
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      <CelestialButton
                        size="sm"
                        variant="outline"
                        onClick={() => setCosmicPower(Math.max(0, cosmicPower - 10))}
                      >
                        Decrease
                      </CelestialButton>
                      <span className="text-purple-200">{cosmicPower}%</span>
                      <CelestialButton
                        size="sm"
                        variant="outline"
                        onClick={() => setCosmicPower(Math.min(100, cosmicPower + 10))}
                      >
                        Increase
                      </CelestialButton>
                    </div>
                  </div>
                </div>
              </CelestialInterface>

              <div className="mt-6">
                <CelestialInterface title="Dimensional Portal" showTimeControls={false} showCosmicMap={false}>
                  <div className="text-center">
                    <p className="mb-4">Open a portal to the cosmic realm to access powerful abilities.</p>
                    <CelestialButton variant="primary" cosmicEffect="portal" onClick={() => setShowPortal(!showPortal)}>
                      {showPortal ? "Close Portal" : "Open Portal"}
                    </CelestialButton>
                  </div>
                </CelestialInterface>
              </div>
            </div>

            {/* Middle column - Spells */}
            <div>
              <CelestialInterface title="Cosmic Spells" showTimeControls={true} showCosmicMap={false}>
                <div className="space-y-4">
                  <p className="text-sm text-purple-200 mb-4">Select a spell to channel its cosmic energy.</p>

                  <div className="grid grid-cols-1 gap-4">
                    {spells.map((spell) => (
                      <div
                        key={spell.id}
                        className={`p-2 rounded-lg cursor-pointer transition-all duration-300 ${
                          selectedSpell === spell.id
                            ? "bg-purple-900/50 border border-purple-500"
                            : "bg-purple-900/20 border border-transparent"
                        }`}
                        onClick={() => setSelectedSpell(spell.id)}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
                            <Image
                              src={spell.image || "/placeholder.svg"}
                              alt={spell.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className={`font-bold text-purple-100 ${styles.cosmicText}`}>{spell.title}</h4>
                            <p className="text-xs text-purple-200/70">{spell.description.substring(0, 60)}...</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <CelestialButton
                      variant="primary"
                      cosmicEffect="stars"
                      disabled={!selectedSpell}
                      className="w-full"
                    >
                      Cast Selected Spell
                    </CelestialButton>
                  </div>
                </div>
              </CelestialInterface>
            </div>

            {/* Right column - Cards */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Celestial Cards</h3>

              <div className="grid grid-cols-1 gap-6">
                {/* Hero card */}
                <CelestialCard
                  title={heroes[0].title}
                  description={heroes[0].description}
                  image={heroes[0].image}
                  rarity={heroes[0].rarity}
                  type={heroes[0].type}
                />

                {/* Artifact card */}
                <CelestialCard
                  title={artifacts[0].title}
                  description={artifacts[0].description}
                  image={artifacts[0].image}
                  rarity={artifacts[0].rarity}
                  type={artifacts[0].type}
                />
              </div>
            </div>
          </div>

          {/* Button showcase */}
          <div className="mt-12 bg-purple-900/20 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Celestial Controls</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CelestialButton variant="primary" cosmicEffect="stars">
                Primary Button
              </CelestialButton>
              <CelestialButton variant="secondary" cosmicEffect="time">
                Secondary Button
              </CelestialButton>
              <CelestialButton variant="outline" cosmicEffect="portal">
                Outline Button
              </CelestialButton>
              <CelestialButton variant="ghost" cosmicEffect="none">
                Ghost Button
              </CelestialButton>
            </div>
          </div>
        </div>
      </CelestialBackground>
    </div>
  )
}
