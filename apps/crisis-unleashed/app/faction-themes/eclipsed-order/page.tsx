"use client"

import { useState } from "react"
import { EclipsedBackground } from "../../../components/faction-themes/eclipsed-background"
import { EclipsedCard } from "../../../components/faction-themes/eclipsed-card"
import { EclipsedInterface } from "../../../components/faction-themes/eclipsed-interface"
import { EclipsedButton } from "../../../components/faction-themes/eclipsed-button"
import styles from "../../../styles/animations.module.css"

export default function EclipsedOrderPage() {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)
  const [missionStatus, setMissionStatus] = useState<"planning" | "active" | "complete">("planning")
  const [showSecretInfo, setShowSecretInfo] = useState(false)

  const handleTargetSelect = (target: string) => {
    setSelectedTarget(target)
  }

  const handleMissionStart = () => {
    setMissionStatus("active")
  }

  const handleMissionComplete = () => {
    setMissionStatus("complete")
  }

  const toggleSecretInfo = () => {
    setShowSecretInfo((prev) => !prev)
  }

  return (
    <EclipsedBackground shadowIntensity="medium">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Eclipsed Order</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Masters of shadow and stealth, the Eclipsed Order operates from the darkness, striking with precision and
            disappearing without a trace.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Assassin profiles */}
          <div className="space-y-6">
            <EclipsedInterface title="OPERATIVE PROFILES" stealthLevel={85} className="h-auto">
              <div className="space-y-4">
                <div className="text-sm text-gray-400 mb-4">
                  Select an operative to view their profile and mission history.
                </div>

                <div className="space-y-2">
                  {["Shadowblade", "Nightwhisper", "Silentfoot"].map((name) => (
                    <div
                      key={name}
                      className={`
                        p-2 border border-gray-700 rounded cursor-pointer transition-all
                        ${selectedTarget === name ? "bg-gray-800 border-gray-500" : "bg-gray-900 hover:bg-gray-800"}
                      `}
                      onClick={() => handleTargetSelect(name)}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center mr-3">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        </div>
                        <div>
                          <div className="text-gray-200">{name}</div>
                          <div className="text-xs text-gray-500">Rank: Shadow Operative</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <EclipsedButton variant="outline" size="sm" onClick={toggleSecretInfo}>
                    {showSecretInfo ? "Hide" : "Show"} Classified Information
                  </EclipsedButton>

                  {showSecretInfo && (
                    <div
                      className={`mt-3 p-2 border border-gray-700 bg-gray-900 text-xs text-gray-400 ${styles.shadowReveal}`}
                    >
                      <p>Operative training includes:</p>
                      <ul className="list-disc pl-4 mt-1 space-y-1">
                        <li>Shadow manipulation</li>
                        <li>Silent elimination</li>
                        <li>Poison crafting</li>
                        <li>Information extraction</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </EclipsedInterface>

            <EclipsedCard
              title="Shadow Dagger"
              description="A ceremonial blade given to members of the Eclipsed Order upon completion of their first successful mission. The blade absorbs light, making it nearly invisible in darkness."
              image="/ornate-dark-dagger.png"
              rarity="rare"
            />
          </div>

          {/* Middle column - Mission control */}
          <div className="space-y-6">
            <EclipsedInterface
              title="MISSION CONTROL"
              stealthLevel={missionStatus === "active" ? 45 : 75}
              className="h-full"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-300">Mission Status:</div>
                  <div
                    className={`
                    px-2 py-1 rounded text-xs font-medium
                    ${
                      missionStatus === "planning"
                        ? "bg-gray-700 text-gray-300"
                        : missionStatus === "active"
                          ? "bg-yellow-900 text-yellow-300"
                          : "bg-green-900 text-green-300"
                    }
                  `}
                  >
                    {missionStatus === "planning" ? "PLANNING" : missionStatus === "active" ? "ACTIVE" : "COMPLETE"}
                  </div>
                </div>

                <div className="relative h-48 border border-gray-700 bg-gray-900 rounded overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: `url(/placeholder.svg?height=400&width=600&query=night%20city%20map)` }}
                  ></div>

                  {/* Target markers */}
                  <div className="absolute top-1/4 left-1/3 w-4 h-4">
                    <div className={`w-full h-full rounded-full border border-red-500 ${styles.shadowPulse}`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="absolute bottom-1/3 right-1/4 w-4 h-4">
                    <div className="w-full h-full rounded-full border border-gray-500"></div>
                  </div>

                  {/* Operative path */}
                  {missionStatus === "active" && (
                    <div
                      className="absolute top-1/4 left-1/3 w-24 h-1 bg-red-900 opacity-50"
                      style={{
                        transformOrigin: "left center",
                        transform: "rotate(45deg)",
                      }}
                    ></div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <EclipsedButton onClick={handleMissionStart} disabled={missionStatus !== "planning"}>
                    Deploy Operative
                  </EclipsedButton>

                  <EclipsedButton
                    variant="danger"
                    onClick={handleMissionComplete}
                    disabled={missionStatus !== "active"}
                  >
                    Complete Mission
                  </EclipsedButton>
                </div>

                <div className="text-sm text-gray-400 border-t border-gray-700 pt-3 mt-3">
                  <div className="mb-2">Mission Objectives:</div>
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-sm border border-gray-600 mr-2 ${missionStatus !== "planning" ? "bg-gray-700" : ""}`}
                      ></div>
                      <span className={missionStatus !== "planning" ? "line-through text-gray-600" : ""}>
                        Infiltrate target location
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-sm border border-gray-600 mr-2 ${missionStatus === "complete" ? "bg-gray-700" : ""}`}
                      ></div>
                      <span className={missionStatus === "complete" ? "line-through text-gray-600" : ""}>
                        Eliminate primary target
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className={`w-3 h-3 rounded-sm border border-gray-600 mr-2`}></div>
                      <span>Retrieve classified documents</span>
                    </li>
                  </ul>
                </div>
              </div>
            </EclipsedInterface>
          </div>

          {/* Right column - Equipment and abilities */}
          <div className="space-y-6">
            <EclipsedInterface title="EQUIPMENT & ABILITIES" stealthLevel={90} showTargets={false} className="h-auto">
              <div className="space-y-4">
                <div className="text-sm text-gray-400 mb-2">Available equipment and shadow techniques.</div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Shadow Step", type: "ability", cooldown: "30s" },
                    { name: "Poison Vial", type: "equipment", uses: "3" },
                    { name: "Smoke Bomb", type: "equipment", uses: "2" },
                    { name: "Mark Target", type: "ability", cooldown: "60s" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="p-2 border border-gray-700 rounded bg-gray-900 hover:bg-gray-800 transition-all cursor-pointer"
                    >
                      <div className="text-gray-200 text-sm">{item.name}</div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{item.type}</span>
                        <span className="text-gray-400">
                          {item.type === "ability" ? `CD: ${item.cooldown}` : `Uses: ${item.uses}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-700">
                  <div className="text-sm text-gray-300 mb-2">Shadow Mastery</div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-gray-600 to-gray-400" style={{ width: "65%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Novice</span>
                    <span>Adept</span>
                    <span>Master</span>
                  </div>
                </div>
              </div>
            </EclipsedInterface>

            <div className="grid grid-cols-2 gap-4">
              <EclipsedCard
                title="Nightveil Cloak"
                description="A cloak woven from shadow essence that renders the wearer nearly invisible in darkness."
                image="/dark-cloak.png"
                rarity="legendary"
                className="w-full h-auto"
              />

              <EclipsedCard
                title="Whisper Blade"
                description="A thin, flexible blade that makes no sound when drawn or used. Perfect for silent eliminations."
                image="/placeholder.svg?key=imvcd"
                rarity="uncommon"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <footer className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>The Eclipsed Order: "We strike from shadows, we return to shadows."</p>
        </footer>
      </div>
    </EclipsedBackground>
  )
}
