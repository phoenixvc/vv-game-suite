"use client"

import { useState } from "react"
import PrimordialBackground from "../../../components/faction-themes/primordial-background"
import PrimordialCard from "../../../components/faction-themes/primordial-card"
import PrimordialInterface from "../../../components/faction-themes/primordial-interface"
import PrimordialButton from "../../../components/faction-themes/primordial-button"
import styles from "../../../styles/animations.module.css"

export default function PrimordialAscendancyDemo() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const cards = [
    {
      id: "ancient-guardian",
      title: "Ancient Guardian",
      description:
        "This ancient protector draws power from the oldest trees in the forest. When played, it heals all your nature units.",
      image: "/fantasy-natures-guardian.png",
      power: 5,
      cost: 4,
      type: "Creature - Guardian",
      rarity: "rare" as const,
    },
    {
      id: "vine-entangler",
      title: "Vine Entangler",
      description: "Summons vines that slow enemy movement. Enemies caught in the vines take damage each turn.",
      image: "/fantasy-vine-creature.png",
      power: 3,
      cost: 2,
      type: "Creature - Plant",
      rarity: "common" as const,
    },
    {
      id: "forest-blessing",
      title: "Forest Blessing",
      description:
        "Channel the energy of the forest to restore life. Heal a friendly unit and grant it Regeneration for 3 turns.",
      image: "/glowing-forest-magic.png",
      power: null,
      cost: 3,
      type: "Spell - Healing",
      rarity: "uncommon" as const,
    },
  ]

  return (
    <PrimordialBackground className="min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 text-center">
          <h1
            className={`text-4xl font-bold text-green-100 mb-4 ${styles.fadeIn}`}
            style={{
              textShadow: "0 2px 10px rgba(34, 197, 94, 0.5)",
              animationDelay: "0.2s",
            }}
          >
            Primordial Ascendancy
          </h1>
          <p className={`text-xl text-green-200 max-w-2xl mx-auto ${styles.fadeIn}`} style={{ animationDelay: "0.4s" }}>
            Masters of nature's ancient power, the Primordial Ascendancy faction harnesses the primal forces of life and
            growth.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className={`col-span-1 ${styles.fadeIn}`} style={{ animationDelay: "0.6s" }}>
            <PrimordialInterface title="Faction Overview">
              <div className="text-green-100 space-y-4">
                <p>
                  The Primordial Ascendancy draws power from the ancient forces of nature, channeling the energy of
                  forests, rivers, and mountains.
                </p>
                <div className="bg-green-900 bg-opacity-30 p-3 rounded border border-green-700">
                  <h3 className="text-green-300 font-semibold mb-2">Faction Abilities</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Natural Growth: Units gain +1/+1 each turn they remain on the field</li>
                    <li>Regeneration: Damaged units heal 1 health at the start of your turn</li>
                    <li>Symbiosis: When you play a Plant creature, all other Plant creatures get +1 health</li>
                  </ul>
                </div>
                <div className="flex justify-center mt-4">
                  <PrimordialButton
                    variant="primary"
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15 5H9L12 2Z" fill="currentColor" />
                        <path d="M12 22L9 19H15L12 22Z" fill="currentColor" />
                        <path d="M2 12L5 9V15L2 12Z" fill="currentColor" />
                        <path d="M22 12L19 15V9L22 12Z" fill="currentColor" />
                        <circle cx="12" cy="12" r="4" fill="currentColor" />
                      </svg>
                    }
                  >
                    Channel Nature
                  </PrimordialButton>
                </div>
              </div>
            </PrimordialInterface>
          </div>

          <div className={`col-span-1 lg:col-span-2 ${styles.fadeIn}`} style={{ animationDelay: "0.8s" }}>
            <PrimordialInterface title="Card Collection">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cards.map((card) => (
                  <div key={card.id} className="flex justify-center">
                    <PrimordialCard
                      title={card.title}
                      description={card.description}
                      image={card.image}
                      power={card.power || undefined}
                      cost={card.cost}
                      type={card.type}
                      rarity={card.rarity}
                      onClick={() => setSelectedCard(card.id === selectedCard ? null : card.id)}
                      className={card.id === selectedCard ? "ring-4 ring-green-400 ring-opacity-70" : ""}
                    />
                  </div>
                ))}
              </div>
            </PrimordialInterface>
          </div>
        </div>

        <div className={`${styles.fadeIn}`} style={{ animationDelay: "1s" }}>
          <PrimordialInterface title="Faction Actions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              <div className="flex flex-col items-center space-y-3">
                <PrimordialButton variant="primary" size="lg" fullWidth>
                  Deploy Forces
                </PrimordialButton>
                <p className="text-xs text-green-300 text-center">Send your nature forces to battle</p>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <PrimordialButton variant="secondary" size="lg" fullWidth>
                  Gather Resources
                </PrimordialButton>
                <p className="text-xs text-green-300 text-center">Collect natural energy from the environment</p>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <PrimordialButton variant="outline" size="lg" fullWidth>
                  Research Abilities
                </PrimordialButton>
                <p className="text-xs text-green-300 text-center">Discover new ways to harness nature's power</p>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <PrimordialButton variant="primary" size="lg" fullWidth disabled>
                  Summon Ancient One
                </PrimordialButton>
                <p className="text-xs text-green-300 text-center">Requires maximum energy level</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-900 bg-opacity-20 rounded border border-green-800">
              <h3 className="text-green-200 font-semibold mb-2">Faction Strategy</h3>
              <p className="text-green-100 text-sm">
                The Primordial Ascendancy excels at sustained battles, with units that grow stronger over time. Focus on
                defensive positioning early game while your forces gather strength from nature. Use regeneration
                abilities to keep your units alive and overwhelm opponents in the late game with powerful nature magic.
              </p>
            </div>
          </PrimordialInterface>
        </div>
      </div>
    </PrimordialBackground>
  )
}
