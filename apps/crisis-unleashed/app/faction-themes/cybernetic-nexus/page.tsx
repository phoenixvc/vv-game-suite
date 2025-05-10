"use client"

import { useState } from "react"
import SharedNavigation from "@/components/shared-navigation"
import CyberneticBackground from "@/components/faction-themes/cybernetic-background"
import CyberneticCard from "@/components/faction-themes/cybernetic-card"
import CyberneticInterface from "@/components/faction-themes/cybernetic-interface"
import CyberneticButton from "@/components/faction-themes/cybernetic-button"
import { heroCards } from "@/data/heroes"
import { artifactCards } from "@/data/artifacts"
import Link from "next/link"
import { ArrowLeft, Shield, Cpu, Zap, Database, BarChart2 } from "lucide-react"

// Filter for Cybernetic Nexus cards
const cyberneticCards = [
  ...heroCards.filter((card) => card.faction === "Cybernetic Nexus" || card.faction === "Tech"),
  ...artifactCards.filter((card) => card.faction === "Cybernetic Nexus" || card.faction === "Tech"),
].slice(0, 6)

export default function CyberneticNexusThemePage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <CyberneticBackground color="#0ea5e9" density={1.2} />
      <SharedNavigation />

      <div className="pt-32 pb-20 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="flex items-center mb-8">
            <Link
              href="/factions"
              className="mr-4 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Factions
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Cybernetic Nexus
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CyberneticInterface title="Faction Control" className="mb-8">
                <div className="space-y-3">
                  <CyberneticButton
                    variant={activeTab === "overview" ? "primary" : "secondary"}
                    onClick={() => setActiveTab("overview")}
                    className="w-full justify-start"
                  >
                    <Shield size={16} />
                    <span>Faction Overview</span>
                  </CyberneticButton>
                  <CyberneticButton
                    variant={activeTab === "technology" ? "primary" : "secondary"}
                    onClick={() => setActiveTab("technology")}
                    className="w-full justify-start"
                  >
                    <Cpu size={16} />
                    <span>Technology</span>
                  </CyberneticButton>
                  <CyberneticButton
                    variant={activeTab === "abilities" ? "primary" : "secondary"}
                    onClick={() => setActiveTab("abilities")}
                    className="w-full justify-start"
                  >
                    <Zap size={16} />
                    <span>Abilities</span>
                  </CyberneticButton>
                  <CyberneticButton
                    variant={activeTab === "database" ? "primary" : "secondary"}
                    onClick={() => setActiveTab("database")}
                    className="w-full justify-start"
                  >
                    <Database size={16} />
                    <span>Card Database</span>
                  </CyberneticButton>
                  <CyberneticButton
                    variant={activeTab === "analytics" ? "primary" : "secondary"}
                    onClick={() => setActiveTab("analytics")}
                    className="w-full justify-start"
                  >
                    <BarChart2 size={16} />
                    <span>Battle Analytics</span>
                  </CyberneticButton>
                </div>
              </CyberneticInterface>

              <CyberneticInterface title="Faction Stats">
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">TECH LEVEL</div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                    <div className="text-right text-xs text-cyan-400 mt-1">85%</div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400 mb-1">CONTROL</div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                    <div className="text-right text-xs text-cyan-400 mt-1">70%</div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400 mb-1">POWER</div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                    <div className="text-right text-xs text-cyan-400 mt-1">60%</div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400 mb-1">DEFENSE</div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <div className="text-right text-xs text-cyan-400 mt-1">65%</div>
                  </div>
                </div>
              </CyberneticInterface>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <CyberneticInterface
                title={
                  activeTab === "overview"
                    ? "Faction Overview"
                    : activeTab === "technology"
                      ? "Technology"
                      : activeTab === "abilities"
                        ? "Abilities"
                        : activeTab === "database"
                          ? "Card Database"
                          : "Battle Analytics"
                }
                className="mb-8"
              >
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <p className="text-slate-300">
                      The Cybernetic Nexus represents humanity's fusion with technology. Founded in the aftermath of the
                      Great Digital Convergence, they believe that the path to survival lies in transcending biological
                      limitations through cybernetic enhancement and artificial intelligence.
                    </p>
                    <p className="text-slate-300">
                      Their stronghold, the Quantum Citadel, houses the most advanced computing systems known to exist.
                      Led by the Algorithm Council, they seek to optimize human potential through technological
                      integration.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-slate-800/50 p-4 rounded-md">
                        <h3 className="text-cyan-400 font-bold mb-2">Strengths</h3>
                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                          <li>Advanced technological synergy</li>
                          <li>Powerful enemy debuffs</li>
                          <li>Resource efficiency</li>
                          <li>Superior card draw mechanics</li>
                        </ul>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-md">
                        <h3 className="text-cyan-400 font-bold mb-2">Weaknesses</h3>
                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                          <li>Vulnerable to disruption tactics</li>
                          <li>Reliance on combo sequences</li>
                          <li>Lower individual unit strength</li>
                          <li>Susceptible to EMP effects</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "technology" && (
                  <div className="space-y-4">
                    <p className="text-slate-300">
                      Cybernetic Nexus technology represents the pinnacle of human innovation, combining advanced AI
                      systems with neural interfaces and quantum computing.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-slate-800/50 p-4 rounded-md">
                        <h3 className="text-cyan-400 font-bold mb-2">Neural Integration</h3>
                        <p className="text-slate-300 text-sm">
                          Direct brain-computer interfaces allow for instantaneous data processing and enhanced
                          cognitive abilities, giving Cybernetic units unprecedented reaction times.
                        </p>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-md">
                        <h3 className="text-cyan-400 font-bold mb-2">Quantum Computing</h3>
                        <p className="text-slate-300 text-sm">
                          Harnessing the power of quantum states allows Cybernetic units to process multiple combat
                          scenarios simultaneously, predicting enemy movements with uncanny accuracy.
                        </p>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-md">
                        <h3 className="text-cyan-400 font-bold mb-2">Nanite Systems</h3>
                        <p className="text-slate-300 text-sm">
                          Microscopic robots flow through Cybernetic units, repairing damage in real-time and adapting
                          to new threats by reconfiguring their defensive capabilities.
                        </p>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-md">
                        <h3 className="text-cyan-400 font-bold mb-2">Holographic Projection</h3>
                        <p className="text-slate-300 text-sm">
                          Advanced light manipulation technology creates convincing decoys and illusions on the
                          battlefield, confusing enemies and providing tactical advantages.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "abilities" && (
                  <div className="space-y-4">
                    <p className="text-slate-300">
                      Cybernetic Nexus units utilize a wide range of technologically enhanced abilities that focus on
                      control, enhancement, and tactical superiority.
                    </p>
                    <div className="space-y-3 mt-4">
                      <div className="bg-slate-800/50 p-4 rounded-md">
                        <h3 className="text-cyan-400 font-bold mb-2">System Override</h3>
                        <p className="text-slate-300 text-sm mb-2">
                          Temporarily disable an enemy unit's abilities and reduce their stats by 50% for 2 turns.
                        </p>
                        <div className="text-xs text-slate-400">Cost: 3 • Type: Control</div>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-md">
                        <h3 className="text-cyan-400 font-bold mb-2">Neural Boost</h3>
                        <p className="text-slate-300 text-sm mb-2">
                          Enhance a friendly unit's attack and intelligence by 2 for 3 turns. Draw a card when this
                          ability is activated.
                        </p>
                        <div className="text-xs text-slate-400">Cost: 2 • Type: Enhancement</div>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-md">
                        <h3 className="text-cyan-400 font-bold mb-2">Tactical Analysis</h3>
                        <p className="text-slate-300 text-sm mb-2">
                          Reveal all enemy cards for 1 turn and reduce the cost of your next ability by 1.
                        </p>
                        <div className="text-xs text-slate-400">Cost: 2 • Type: Intelligence</div>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-md">
                        <h3 className="text-cyan-400 font-bold mb-2">Nanite Swarm</h3>
                        <p className="text-slate-300 text-sm mb-2">
                          Deal 1 damage to all enemy units each turn for 3 turns. Friendly units recover 1 health each
                          turn during this period.
                        </p>
                        <div className="text-xs text-slate-400">Cost: 4 • Type: Area Effect</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "database" && (
                  <div>
                    <p className="text-slate-300 mb-4">
                      Access the Cybernetic Nexus card database to view detailed information on all available units and
                      artifacts.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cyberneticCards.map((card) => (
                        <CyberneticCard key={card.id} card={card} />
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <CyberneticButton onClick={() => console.log("View more cards")}>
                        Access Full Database
                      </CyberneticButton>
                    </div>
                  </div>
                )}

                {activeTab === "analytics" && (
                  <div className="space-y-4">
                    <p className="text-slate-300">
                      Review battle performance metrics and strategic analysis for Cybernetic Nexus units.
                    </p>
                    <div className="bg-slate-800/50 p-4 rounded-md">
                      <h3 className="text-cyan-400 font-bold mb-2">Win Rate Analysis</h3>
                      <div className="h-40 flex items-end justify-between gap-2">
                        {[65, 58, 72, 68, 75, 62, 70].map((value, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-cyan-500 rounded-t" style={{ height: `${value}%` }}></div>
                            <div className="text-xs text-slate-400 mt-1">W{index + 1}</div>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-slate-400 mt-2 text-center">Last 7 Weeks Performance</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 p-4 rounded-md">
                        <h3 className="text-cyan-400 font-bold mb-2">Top Performing Units</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-slate-300">Tech Innovator</span>
                            <span className="text-cyan-400">78% Win</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-slate-300">Neural Commander</span>
                            <span className="text-cyan-400">72% Win</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-slate-300">Quantum Engineer</span>
                            <span className="text-cyan-400">65% Win</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-md">
                        <h3 className="text-cyan-400 font-bold mb-2">Faction Matchups</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-slate-300">vs. Nature</span>
                            <span className="text-green-400">68% Win</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-slate-300">vs. Mystic</span>
                            <span className="text-red-400">42% Win</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-slate-300">vs. Chaos</span>
                            <span className="text-cyan-400">55% Win</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CyberneticInterface>

              {/* Featured Cards */}
              <CyberneticInterface title="Featured Technology">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-cyan-400 font-bold">Neural Enhancement Suite</h3>
                    <p className="text-sm text-slate-300">
                      The latest generation of neural interfaces allows for unprecedented integration between human
                      consciousness and digital systems, enhancing reaction times by 300% and enabling direct control of
                      multiple combat drones simultaneously.
                    </p>
                    <CyberneticButton onClick={() => console.log("Research")}>Research Details</CyberneticButton>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-cyan-400 font-bold">Quantum Encryption Protocol</h3>
                    <p className="text-sm text-slate-300">
                      Utilizing entangled particles to create unbreakable communication channels, this technology
                      ensures that Cybernetic Nexus tactical data remains secure from enemy interception, providing a
                      significant strategic advantage on the battlefield.
                    </p>
                    <CyberneticButton onClick={() => console.log("Research")}>Research Details</CyberneticButton>
                  </div>
                </div>
              </CyberneticInterface>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
