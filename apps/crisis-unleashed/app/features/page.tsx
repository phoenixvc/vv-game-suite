import SharedNavigation from "@/components/shared-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SharedNavigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">Game Features</h1>
          <p className="text-xl text-center mb-12 text-gray-300 max-w-3xl mx-auto">
            Discover the innovative features that make Crisis Unleashed a revolutionary card game experience
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon="✨"
              title="Custom Card Designer"
              description="Create your own unique cards with our intuitive designer. Customize abilities, stats, and artwork to build your perfect deck."
            />
            <FeatureCard
              icon="🛡️"
              title="Strategic Gameplay"
              description="Master the lane-based combat system with frontrow, midrow, and backrow positioning. Plan your strategy and outmaneuver your opponents."
            />
            <FeatureCard
              icon="⚔️"
              title="Faction Synergies"
              description="Discover powerful combinations between factions. Mix and match cards to create devastating combos and unique strategies."
            />
            <FeatureCard
              icon="⚡"
              title="Dynamic Events"
              description="Experience game-changing crisis events that transform the battlefield and force players to adapt their strategies on the fly."
            />
            <FeatureCard
              icon="🔄"
              title="Deck Analysis"
              description="Analyze your deck's strengths and weaknesses with our advanced analytics tools. Optimize your strategy for maximum effectiveness."
            />
            <FeatureCard
              icon="🌟"
              title="NFT Integration"
              description="Mint your custom cards as NFTs and trade them with other players. Own your creations and build a valuable collection."
            />
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                  Crisis Unleashed Game Mechanics
                </h2>

                <Tabs defaultValue="overview">
                  <TabsList className="mb-4 bg-gray-900 p-1 rounded-lg">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-gray-700 data-[state=active]:text-white hover:bg-gray-800 transition-colors duration-200"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="combat"
                      className="data-[state=active]:bg-gray-700 data-[state=active]:text-white hover:bg-gray-800 transition-colors duration-200"
                    >
                      Combat
                    </TabsTrigger>
                    <TabsTrigger
                      value="resources"
                      className="data-[state=active]:bg-gray-700 data-[state=active]:text-white hover:bg-gray-800 transition-colors duration-200"
                    >
                      Resources
                    </TabsTrigger>
                    <TabsTrigger
                      value="artifacts"
                      className="data-[state=active]:bg-gray-700 data-[state=active]:text-white hover:bg-gray-800 transition-colors duration-200"
                    >
                      Artifacts
                    </TabsTrigger>
                    <TabsTrigger
                      value="crisis"
                      className="data-[state=active]:bg-gray-700 data-[state=active]:text-white hover:bg-gray-800 transition-colors duration-200"
                    >
                      Crisis Events
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        Crisis Unleashed is a fast-paced, faction-driven collectible card game where players assume the
                        role of powerful masterminds vying for dominance in a collapsing world. With a mix of strategic
                        deck construction, resource management, lane-based combat, and dynamic global events, each match
                        is a high-stakes duel shaped by shifting crises and evolving tactics.
                      </p>

                      <h3 className="text-lg font-semibold">Core Premise</h3>
                      <p className="text-gray-300">
                        In a world pushed to the brink by reality-bending anomalies, rogue technologies, ancient powers,
                        and cosmic instabilities, five dominant factions rise to command the future. Players lead their
                        forces through a mix of carefully crafted Character, Action, and Hero cards — all while adapting
                        to game-changing Crisis Events drawn each round.
                      </p>

                      <h3 className="text-lg font-semibold">Factions</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-300">
                        <li>
                          <span className="text-cyan-400 font-bold">Cybernetic Nexus</span>: Masters of digital
                          disruption and quantum control
                        </li>
                        <li>
                          <span className="text-purple-400 font-bold">Eclipsed Order</span>: Shadow operatives who
                          manipulate the battlefield from concealment
                        </li>
                        <li>
                          <span className="text-green-400 font-bold">Primordial Ascendancy</span>: Elemental forces of
                          nature and evolution
                        </li>
                        <li>
                          <span className="text-yellow-400 font-bold">Celestial Dominion</span>: Cosmic entities
                          wielding time and reality
                        </li>
                        <li>
                          <span className="text-red-400 font-bold">Titanborn</span>: Raw kinetic warriors of
                          overwhelming physical might
                        </li>
                        <li>
                          <span className="text-indigo-400 font-bold">Void Harbingers</span>: Dimensional manipulators
                          harnessing entropy and chaos
                        </li>
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="combat">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Lane-Based Combat</h3>
                      <p className="text-gray-300">
                        Combat in Crisis Unleashed takes place across three lanes: Front, Middle, and Back. Each lane
                        has strategic importance and different cards excel in different positions.
                      </p>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-gray-700 p-3 rounded hover:bg-gray-600 transition-colors duration-200 hover:shadow-md">
                          <h4 className="font-bold text-red-400">Front Lane</h4>
                          <p className="text-sm text-gray-300">
                            Ideal for tanks and melee fighters. Cards here can protect cards in other lanes and often
                            have higher defense values.
                          </p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded hover:bg-gray-600 transition-colors duration-200 hover:shadow-md">
                          <h4 className="font-bold text-yellow-400">Middle Lane</h4>
                          <p className="text-sm text-gray-300">
                            Versatile position for balanced cards. Units here can attack any lane but are more
                            vulnerable than front lane units.
                          </p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded hover:bg-gray-600 transition-colors duration-200 hover:shadow-md">
                          <h4 className="font-bold text-blue-400">Back Lane</h4>
                          <p className="text-sm text-gray-300">
                            Reserved for support units and ranged attackers. Cards here are protected but can only be
                            attacked by specific abilities.
                          </p>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mt-4">Attack and Defense</h3>
                      <p className="text-gray-300">
                        Cards have Attack and Defense values that determine combat outcomes. When a card attacks, it
                        deals damage equal to its Attack value. The defending card reduces this damage by its Defense
                        value before losing Health points.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="resources">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Dual Resource System</h3>
                      <p className="text-gray-300">Crisis Unleashed uses two primary resources:</p>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-700 p-3 rounded">
                          <h4 className="font-bold text-yellow-400">Power</h4>
                          <p className="text-sm text-gray-300">
                            The primary resource used to deploy cards and activate abilities. Power regenerates each
                            turn and increases over time.
                          </p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded">
                          <h4 className="font-bold text-purple-400">Momentum</h4>
                          <p className="text-sm text-gray-300">
                            A special resource earned through combat and combos. Momentum powers each Hero's
                            game-altering Ultimate Moves and special abilities.
                          </p>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mt-4">Provision-Based Deckbuilding</h3>
                      <p className="text-gray-300">
                        When building a deck, players must stay within a provision limit. More powerful cards cost more
                        provisions, forcing strategic choices about which cards to include.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="artifacts">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Artifact Cards</h3>
                      <p className="text-gray-300">
                        Artifacts are a special type of card that provide persistent passive effects and occasionally
                        grant activated abilities. Only one Artifact can be in play per player at a time.
                      </p>

                      <div className="bg-gray-700 p-4 rounded mt-4">
                        <h4 className="font-bold text-yellow-400">Key Artifact Features</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-300 mt-2">
                          <li>Provide persistent passive effects that last until the Artifact is removed</li>
                          <li>May have activated abilities that can be used once per turn</li>
                          <li>Often have faction affinities that boost their power when used by a matching Hero</li>
                          <li>Follow normal Power and Provision costs</li>
                          <li>Legendary Artifacts can turn the tide of battle by reinforcing synergy strategies</li>
                        </ul>
                      </div>

                      <p className="text-gray-300 mt-4">
                        Artifacts are played from the Action Deck and remain in play until destroyed or replaced.
                        Strategic timing of Artifact deployment can be crucial to victory.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="crisis">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Crisis Events</h3>
                      <p className="text-gray-300">
                        Every round begins with a global effect that changes how the battlefield works. These Crisis
                        Events force players to adapt their strategies on the fly.
                      </p>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-700 p-3 rounded">
                          <h4 className="font-bold text-red-400">Global Events</h4>
                          <p className="text-sm text-gray-300">
                            Affect all players and cards equally, changing fundamental game rules temporarily.
                          </p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded">
                          <h4 className="font-bold text-blue-400">Lane Events</h4>
                          <p className="text-sm text-gray-300">
                            Target specific lanes, making them more dangerous or beneficial to occupy.
                          </p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded">
                          <h4 className="font-bold text-green-400">Faction Events</h4>
                          <p className="text-sm text-gray-300">
                            Boost or hinder specific factions, creating temporary advantages or disadvantages.
                          </p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded">
                          <h4 className="font-bold text-yellow-400">Resource Events</h4>
                          <p className="text-sm text-gray-300">
                            Alter how Power and Momentum are generated or spent during the affected rounds.
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-300 mt-4">
                        Crisis Events typically last 2-3 turns before a new event is drawn. Adapting to these changing
                        conditions is key to mastering Crisis Unleashed.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 mt-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                  VeritasVault Integration
                </h2>
                <p className="text-gray-300">
                  Crisis Unleashed is developed and published by VeritasVault, a pioneering company at the intersection
                  of blockchain technology and gaming. All cards can be minted as NFTs, allowing players to truly own
                  their digital assets.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-700 p-3 rounded hover:bg-gray-600 transition-colors duration-200 hover:shadow-md">
                    <h4 className="font-bold">NFT Integration</h4>
                    <p className="text-sm text-gray-300">
                      Cards can be minted, traded, and sold on the blockchain, with all transactions secured by
                      VeritasVault's proprietary technology.
                    </p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded hover:bg-gray-600 transition-colors duration-200 hover:shadow-md">
                    <h4 className="font-bold">Cross-Platform Play</h4>
                    <p className="text-sm text-gray-300">
                      Play Crisis Unleashed across multiple platforms while maintaining ownership of your digital cards
                      through VeritasVault's secure wallet system.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors duration-300 hover:shadow-lg border border-gray-700">
      <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mb-4 text-xl">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}
