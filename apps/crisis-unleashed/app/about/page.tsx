import SharedNavigation from "@/components/shared-navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SharedNavigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">About Crisis Unleashed</h1>
          <p className="text-xl text-center mb-12 text-gray-300 max-w-3xl mx-auto">
            The story behind the revolutionary card game
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Crisis Unleashed was born from a vision to create a card game that combines strategic depth with player
                creativity. We wanted to build a game where players could not only master existing cards but design
                their own, becoming active participants in the evolution of the game.
              </p>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Our team of veteran game designers and blockchain enthusiasts came together to create a game that pushes
                the boundaries of what's possible in digital card games. By integrating cutting-edge technology with
                classic card game mechanics, we've created an experience that's both familiar and revolutionary.
              </p>
              <p className="text-gray-300 leading-relaxed">
                With Crisis Unleashed, we're not just building a game—we're building a community of creators,
                strategists, and competitors who will shape the future of the game together.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Game Features</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    ✨
                  </div>
                  <div>
                    <h3 className="font-bold">Custom Card Designer</h3>
                    <p className="text-gray-300 text-sm">Create your own unique cards with our intuitive designer.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    🛡️
                  </div>
                  <div>
                    <h3 className="font-bold">Strategic Gameplay</h3>
                    <p className="text-gray-300 text-sm">
                      Master the lane-based combat system with frontrow, midrow, and backrow positioning.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    ⚔️
                  </div>
                  <div>
                    <h3 className="font-bold">Faction Synergies</h3>
                    <p className="text-gray-300 text-sm">Discover powerful combinations between factions.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-bold">Dynamic Events</h3>
                    <p className="text-gray-300 text-sm">
                      Experience game-changing crisis events that transform the battlefield.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    🔄
                  </div>
                  <div>
                    <h3 className="font-bold">Deck Analysis</h3>
                    <p className="text-gray-300 text-sm">
                      Analyze your deck's strengths and weaknesses with our advanced analytics tools.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    🌟
                  </div>
                  <div>
                    <h3 className="font-bold">NFT Integration</h3>
                    <p className="text-gray-300 text-sm">
                      Mint your custom cards as NFTs and trade them with other players.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">The Team Behind Crisis Unleashed</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                  👨‍💻
                </div>
                <h3 className="font-bold text-lg mb-1">Alex Chen</h3>
                <p className="text-cyan-400 text-sm mb-2">Lead Game Designer</p>
                <p className="text-gray-300 text-sm">
                  Former lead designer at Blizzard with 15+ years of experience in card game design.
                </p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                  👩‍🎨
                </div>
                <h3 className="font-bold text-lg mb-1">Sophia Rodriguez</h3>
                <p className="text-cyan-400 text-sm mb-2">Art Director</p>
                <p className="text-gray-300 text-sm">
                  Award-winning digital artist who has worked on multiple AAA game titles.
                </p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                  👨‍💼
                </div>
                <h3 className="font-bold text-lg mb-1">Marcus Johnson</h3>
                <p className="text-cyan-400 text-sm mb-2">Blockchain Lead</p>
                <p className="text-gray-300 text-sm">
                  Blockchain expert with experience at Ethereum Foundation and multiple NFT projects.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold mb-6">Join the Community</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Crisis Unleashed is more than just a game—it's a community of passionate players and creators. Join us
              today and help shape the future of the game.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                asChild
              >
                <Link href="/signup">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800" asChild>
                <Link href="https://discord.gg/crisisunleashed" target="_blank" rel="noopener noreferrer">
                  Join Discord
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
