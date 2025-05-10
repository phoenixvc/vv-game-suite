import Link from "next/link"
import SharedNavigation from "@/components/shared-navigation"
import { Button } from "@/components/ui/button"
import SimpleCircuitBackground from "@/components/simple-circuit-background"

/**
 * Renders the Factions selection page with a styled background, navigation, and a grid of faction cards.
 *
 * Displays six unique factions, each with themed visuals, descriptions, and stats, allowing users to choose their allegiance.
 */
export default function FactionsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      <SimpleCircuitBackground lineColor="rgba(66, 153, 225, 0.2)" nodeColor="rgba(66, 153, 225, 0.4)" />

      <SharedNavigation />

      <div className="pt-32 pb-20 px-4 relative z-10">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">Factions</h1>
          <p className="text-xl text-center mb-12 text-gray-300 max-w-3xl mx-auto">
            Choose your allegiance and master the unique abilities of each faction
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FactionCard
              color="bg-blue-600"
              icon="🛡️"
              name="Cybernetic Nexus"
              description="Masters of technology and artificial intelligence, the Cybernetic Nexus faction excels at enhancement and control."
              stats={[
                { value: 8, label: "Tech" },
                { value: 6, label: "Control" },
                { value: 4, label: "Power" },
              ]}
            />
            <FactionCard
              color="bg-green-600"
              icon="⚡"
              name="Primordial Ascendancy"
              description="Connected to the ancient forces of nature, the Primordial Ascendancy harnesses elemental power and growth."
              stats={[
                { value: 7, label: "Growth" },
                { value: 8, label: "Healing" },
                { value: 5, label: "Defense" },
              ]}
            />
            <FactionCard
              color="bg-red-600"
              icon="⚔️"
              name="Eclipsed Order"
              description="Masters of shadow and deception, the Eclipsed Order excels at stealth, sabotage, and devastating attacks."
              stats={[
                { value: 9, label: "Attack" },
                { value: 7, label: "Stealth" },
                { value: 3, label: "Defense" },
              ]}
            />
            <FactionCard
              color="bg-purple-600"
              icon="🧠"
              name="Celestial Dominion"
              description="Wielders of cosmic energy and time manipulation, the Celestial Dominion controls the battlefield with foresight."
              stats={[
                { value: 6, label: "Power" },
                { value: 9, label: "Control" },
                { value: 7, label: "Knowledge" },
              ]}
            />
            <FactionCard
              color="bg-yellow-600"
              icon="⭐"
              name="Titanborn"
              description="Descendants of ancient titans, the Titanborn faction overwhelms opponents with raw strength and resilience."
              stats={[
                { value: 10, label: "Strength" },
                { value: 8, label: "Defense" },
                { value: 4, label: "Speed" },
              ]}
            />
            <FactionCard
              color="bg-indigo-600"
              icon="🔮"
              name="Void Harbingers"
              description="Masters of dimensional manipulation and entropy, the Void Harbingers harness the power of the spaces between realities."
              stats={[
                { value: 5, label: "Power" },
                { value: 9, label: "Entropy" },
                { value: 8, label: "Control" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Renders a styled card displaying a faction's icon, name, description, stats, and a link to the faction's detail page.
 *
 * @param color - Tailwind CSS class for the card's header background color.
 * @param icon - Emoji or icon representing the faction.
 * @param name - Name of the faction.
 * @param description - Brief description of the faction.
 * @param stats - Array of objects containing a numeric value and label for each faction stat.
 *
 * @returns A React element representing the faction card.
 */
function FactionCard({
  color,
  icon,
  name,
  description,
  stats,
}: {
  color: string
  icon: string
  name: string
  description: string
  stats: { value: number; label: string }[]
}) {
  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className={`${color} p-12 flex items-center justify-center`}>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">{icon}</div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <div className="flex justify-between">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4 bg-gray-700 hover:bg-gray-600" asChild>
          <Link href={`/factions/${name.toLowerCase().replace(/\s+/g, "-")}`}>Explore Faction</Link>
        </Button>
      </div>
    </div>
  )
}
