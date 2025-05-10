import Link from "next/link"
import SharedNavigation from "@/components/shared-navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { heroCards } from "@/data/heroes"
import { artifactCards } from "@/data/artifacts"
import { crisisCards } from "@/data/crisis"
import CardTemplatePreview from "@/components/card-template-preview"

// This is a sample implementation - in a real app, you would fetch this data dynamically
const factions = [
  {
    slug: "cybernetic-nexus",
    name: "Cybernetic Nexus",
    color: "bg-blue-600",
    icon: "🛡️",
    description:
      "Masters of technology and artificial intelligence, the Cybernetic Nexus faction excels at enhancement and control.",
    lore: "Founded in the aftermath of the Great Digital Convergence, the Cybernetic Nexus represents humanity's fusion with technology. Their leaders, known as the Algorithm Council, believe that the path to survival lies in transcending biological limitations through cybernetic enhancement and artificial intelligence. Their stronghold, the Quantum Citadel, houses the most advanced computing systems known to exist.",
    playstyle:
      "Cybernetic Nexus players focus on enhancement, control, and synergy. Their cards often buff each other when played in sequence, creating powerful combos. They excel at neutralizing enemy threats through hacking, EMP effects, and system overrides. While their individual units may not be the strongest, their collective power and tactical flexibility make them formidable opponents.",
    strengths: ["Tech synergy", "Enemy debuffs", "Resource efficiency", "Card draw"],
    weaknesses: ["Vulnerable to disruption", "Reliance on combos", "Lower individual unit strength"],
    stats: [
      { value: 8, label: "Tech" },
      { value: 6, label: "Control" },
      { value: 4, label: "Power" },
    ],
  },
  {
    slug: "primordial-ascendancy",
    name: "Primordial Ascendancy",
    color: "bg-green-600",
    icon: "⚡",
    description:
      "Connected to the ancient forces of nature, the Primordial Ascendancy harnesses elemental power and growth.",
    lore: "The Primordial Ascendancy emerged when the world's natural forces began to awaken and coalesce around human vessels. These chosen few learned to channel the raw power of earth, water, fire, and air, becoming living conduits for nature's wrath and bounty. They seek to restore balance to a world thrown into chaos, believing that only by reconnecting with the primal forces can humanity survive the coming cataclysm.",
    playstyle:
      "Primordial Ascendancy players focus on growth, healing, and overwhelming force. Their cards often start weak but grow stronger over time, and they excel at healing and protecting their units. They can summon powerful elemental entities and transform the battlefield with environmental effects. Their late-game potential is unmatched if they can survive the early rounds.",
    strengths: ["Healing and regeneration", "Growth over time", "Environmental control", "Late-game power"],
    weaknesses: ["Slow start", "Vulnerable to aggression", "Resource intensive"],
    stats: [
      { value: 7, label: "Growth" },
      { value: 8, label: "Healing" },
      { value: 5, label: "Defense" },
    ],
  },
  {
    slug: "void-harbingers",
    name: "Void Harbingers",
    color: "bg-indigo-600",
    icon: "🔮",
    description:
      "Masters of dimensional manipulation and entropy, the Void Harbingers harness the power of the spaces between realities.",
    lore: "The Void Harbingers emerged when a group of theoretical physicists accidentally tore open a rift to the spaces between dimensions—the Void. Transformed by their exposure to this realm of pure potential and entropy, they gained the ability to manipulate reality itself. Now they seek to harness the Void's power, believing that only by embracing entropy can the universe achieve its final, perfect state.",
    playstyle:
      "Void Harbingers excel at disruption and transformation. Their cards often manipulate the rules of the game itself, swapping stats, changing card types, and even altering the effects of Crisis Events. They can banish enemy cards to the Void and summon powerful entities from beyond reality. While their units may be unstable and unpredictable, their ability to fundamentally change the flow of battle makes them formidable opponents.",
    strengths: ["Reality manipulation", "Card transformation", "Rule breaking", "Unpredictability"],
    weaknesses: ["Self-damage", "Instability", "Complex decision trees", "Vulnerability to direct attacks"],
    stats: [
      { value: 5, label: "Power" },
      { value: 9, label: "Entropy" },
      { value: 8, label: "Control" },
    ],
  },
  // Add other factions here
]

export default function FactionDetailPage({ params }: { params: { slug: string } }) {
  const faction = factions.find((f) => f.slug === params.slug) || factions[0]

  // Filter cards that belong to this faction
  const factionHeroes = heroCards.filter((card) => card.faction === faction.name)
  const factionArtifacts = artifactCards.filter((card) => card.faction === faction.name)
  const factionCrises = crisisCards.filter((card) => card.faction === faction.name)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SharedNavigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className={`${faction.color} rounded-lg p-8 flex items-center justify-center md:w-1/3`}>
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-5xl">
                {faction.icon}
              </div>
            </div>

            <div className="md:w-2/3">
              <h1 className="text-4xl font-bold mb-4">{faction.name}</h1>
              <p className="text-xl mb-6 text-gray-300">{faction.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                {faction.stats.map((stat, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-3 text-center min-w-[100px]">
                    <div className="text-3xl font-bold text-cyan-400">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                  asChild
                >
                  <Link href="/designer">Design Cards</Link>
                </Button>
                <Button variant="outline" className="border-gray-700 hover:bg-gray-800" asChild>
                  <Link href="/gallery">View Gallery</Link>
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="lore" className="max-w-4xl mx-auto">
            <TabsList className="mb-6 bg-gray-900 p-1 rounded-lg">
              <TabsTrigger
                value="lore"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white hover:bg-gray-800 transition-colors duration-200"
              >
                Lore
              </TabsTrigger>
              <TabsTrigger
                value="playstyle"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white hover:bg-gray-800 transition-colors duration-200"
              >
                Playstyle
              </TabsTrigger>
              <TabsTrigger
                value="cards"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white hover:bg-gray-800 transition-colors duration-200"
              >
                Cards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lore" className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Faction Lore</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">{faction.lore}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2">Strengths</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    {faction.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2">Weaknesses</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    {faction.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="playstyle" className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Playstyle</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">{faction.playstyle}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2">Early Game</h3>
                  <p className="text-gray-300">
                    Focus on establishing board presence and setting up your synergies. Use low-cost units to defend
                    while building resources.
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2">Mid Game</h3>
                  <p className="text-gray-300">
                    Deploy your key combo pieces and start activating faction synergies. Look for opportunities to
                    counter enemy strategies.
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2">Late Game</h3>
                  <p className="text-gray-300">
                    Unleash your most powerful units and abilities. Use your faction's unique strengths to overwhelm
                    your opponent and secure victory.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cards" className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Faction Cards</h2>

              <Tabs defaultValue="heroes">
                <TabsList className="mb-4 bg-gray-900 p-1 rounded-lg">
                  <TabsTrigger value="heroes">Heroes ({factionHeroes.length})</TabsTrigger>
                  <TabsTrigger value="artifacts">Artifacts ({factionArtifacts.length})</TabsTrigger>
                  <TabsTrigger value="crises">Crisis Events ({factionCrises.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="heroes">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {factionHeroes.map((card) => (
                      <div key={card.id} className="h-80">
                        <CardTemplatePreview card={card} size="md" />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="artifacts">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {factionArtifacts.map((card) => (
                      <div key={card.id} className="h-80">
                        <CardTemplatePreview card={card} size="md" />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="crises">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {factionCrises.map((card) => (
                      <div key={card.id} className="h-80">
                        <CardTemplatePreview card={card} size="md" />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
