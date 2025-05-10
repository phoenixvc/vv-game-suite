import FactionComparison from "@/components/faction-comparison"
import SharedNavigation from "@/components/shared-navigation"

/**
 * Renders the Faction Comparison page with navigation, a heading, a description, and the faction comparison component.
 *
 * Displays a full-page layout for users to compare the strengths, abilities, and playstyles of different factions.
 */
export default function FactionComparePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SharedNavigation />

      <div className="container mx-auto pt-32 pb-20 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Faction Comparison</h1>
        <p className="text-xl text-center mb-12 text-gray-300 max-w-3xl mx-auto">
          Compare the strengths, abilities, and playstyles of different factions to find your perfect match
        </p>

        <FactionComparison />
      </div>
    </div>
  )
}
