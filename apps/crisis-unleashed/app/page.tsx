"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { CircuitGridVisualization } from "@/components/circuit-grid-visualization"
import { ScrollAnimation } from "@/components/scroll-animation"
import GameMechanicsDiagram from "@/components/game-mechanics-diagram"
import CardTypeShowcase from "@/components/card-type-showcase"
import FactionComparisonVisual from "@/components/faction-comparison-visual"
import VaultVisualization from "@/components/vault-visualization"
import DevelopmentProgressVisual from "@/components/development-progress-visual"
import { NewUserWelcome } from "@/components/onboarding/new-user-welcome"
import { GuidedTourButton } from "@/components/onboarding/guided-tour-button"
import { GlossaryProvider } from "@/components/onboarding/glossary-provider"
import { ContextualFAQ } from "@/components/onboarding/contextual-faq"
import { ExpandableSection } from "@/components/onboarding/expandable-section"
import { FeedbackWidget } from "@/components/onboarding/feedback-widget"
import { SharedNavigation } from "@/components/shared-navigation"
import { SharedFooter } from "@/components/shared-footer"
// Import from the consolidated structure
import { LogoVariant } from "@/components/logo-system"

/**
 * Renders the main landing page for the Crisis Unleashed strategic card game, featuring interactive onboarding, educational sections, and calls to action.
 *
 * The page adapts its layout and content for first-time and returning visitors, displaying a welcome modal and animated background for new users, and a navigation bar for returning users. It includes multiple scroll-animated sections covering gameplay, card types, factions, blockchain-based card ownership, and development roadmap, each with interactive components, contextual FAQs, and feedback widgets.
 *
 * @returns The complete landing page React element for the Crisis Unleashed web application.
 *
 * @remark Uses localStorage to detect first-time visitors and conditionally display onboarding content.
 */
export default function Home() {
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [showNewUserWelcome, setShowNewUserWelcome] = useState(false)

  useEffect(() => {
    // Check if this is the user's first visit
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore")
    if (!hasVisitedBefore) {
      setIsFirstVisit(true)
      setShowNewUserWelcome(true)
      localStorage.setItem("hasVisitedBefore", "true")
    }
  }, [])

  return (
    <GlossaryProvider>
      <main className="relative min-h-screen overflow-x-hidden">
        {/* Background Elements - Only show circuit visualization for first-time visitors */}
        <div className="fixed inset-0 z-0">
          {isFirstVisit ? (
            <CircuitGridVisualization />
          ) : (
            <div
              className="h-full w-full bg-cover bg-center bg-no-repeat opacity-20"
              style={{ backgroundImage: "url('/landing-page-pattern.png')" }}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Navigation - Only show for returning users */}
        {!isFirstVisit && <SharedNavigation />}

        {/* New User Welcome Modal */}
        <AnimatePresence>
          {showNewUserWelcome && <NewUserWelcome onClose={() => setShowNewUserWelcome(false)} />}
        </AnimatePresence>

        {/* Guided Tour Button - Always visible but more prominent for first-time visitors */}
        <div className="fixed bottom-4 right-4 z-50">
          <GuidedTourButton isFirstVisit={isFirstVisit} />
        </div>

        {/* Hero Section - With new hero background */}
        <section
          className={`relative z-10 flex min-h-screen flex-col items-center justify-center px-4 ${
            !isFirstVisit ? "pt-24" : "py-20"
          } text-center`}
          style={{
            backgroundImage: "url('/hero-background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

          {/* Use our new logo system with animated variant for hero */}
          <div className="mb-6 relative z-10">
            <LogoVariant variant="animated" size="2xl" className="mx-auto" interactive={true} />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-4xl font-bold leading-tight tracking-tighter md:text-6xl relative z-10"
          >
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Strategic Card Game
            </span>{" "}
            <span className="block">with Blockchain Integration</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-10 max-w-3xl text-xl text-gray-200 relative z-10"
          >
            Immerse yourself in a world where strategy, faction politics, and resource management collide in an
            ever-evolving game ecosystem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 relative z-10"
          >
            <Link
              href="/factions/select"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 p-0.5 text-lg font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 focus-visible:ring-4"
              aria-label="Choose your faction"
            >
              <span className="relative rounded-md bg-gray-900 px-8 py-3.5 transition-all duration-300 ease-out group-hover:bg-opacity-0">
                Choose Your Faction
              </span>
            </Link>

            <Link
              href="/learn/getting-started"
              className="relative inline-flex items-center justify-center rounded-lg border-2 border-blue-400 bg-transparent px-8 py-3 text-lg font-medium text-blue-400 transition-colors hover:bg-blue-400 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 focus-visible:ring-4"
              aria-label="Learn how to play"
            >
              Learn How to Play
            </Link>

            <Link
              href="/designer"
              className="relative inline-flex items-center justify-center rounded-lg border-2 border-gray-400 bg-transparent px-8 py-3 text-lg font-medium text-gray-400 transition-colors hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-500 focus-visible:ring-4"
              aria-label="Design custom cards"
            >
              Design Custom Cards
            </Link>
          </motion.div>
        </section>

        {/* Introduction Section with Educational Content - Added community collaboration image */}
        <section className="relative z-10 bg-gray-900 bg-opacity-90 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-4xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Welcome to Crisis Unleashed
              </span>
            </h2>

            <div className="mb-16 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-2xl font-semibold text-white">What is Crisis Unleashed?</h3>
                <p className="mb-4 text-gray-300">
                  Crisis Unleashed is a strategic card game where players command unique factions in a battle for
                  resources and territory. Each faction has distinct abilities, cards, and playstyles.
                </p>

                <ExpandableSection title="How is it different from other card games?">
                  <p className="mb-4 text-gray-300">
                    Unlike traditional card games, Crisis Unleashed combines strategic deck building with resource
                    management and territory control. The blockchain integration allows for true ownership of cards and
                    verifiable scarcity.
                  </p>
                  <p className="text-gray-300">
                    Each faction has a unique playstyle and aesthetic, creating diverse gameplay experiences and
                    strategies.
                  </p>
                </ExpandableSection>

                <div className="mt-6">
                  <Link
                    href="/learn/gameplay"
                    className="text-blue-400 underline hover:text-blue-300"
                    aria-label="Learn more about gameplay"
                  >
                    Learn more about gameplay →
                  </Link>
                </div>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-blue-500 shadow-lg shadow-blue-500/20">
                <Image
                  src="/community-collaboration.png"
                  alt="Community members collaborating on card designs"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <ContextualFAQ
              questions={[
                {
                  question: "Do I need to understand blockchain to play?",
                  answer:
                    "Not at all! While Crisis Unleashed utilizes blockchain technology for card ownership and trading, the gameplay itself doesn't require any blockchain knowledge.",
                },
                {
                  question: "How long does a typical game take?",
                  answer:
                    "A standard match typically takes 20-30 minutes, though strategic depth can extend games between experienced players.",
                },
                {
                  question: "Can I play for free?",
                  answer:
                    "Yes! Crisis Unleashed offers a free-to-play option with starter decks for each faction. Premium cards and customization options are available for purchase.",
                },
              ]}
            />

            <FeedbackWidget sectionId="intro" />
          </div>
        </section>

        {/* Game Mechanics Section - Using feature-card-bg for cards */}
        <ScrollAnimation>
          <section
            className="relative z-10 px-4 py-20"
            style={{
              backgroundImage: "url('/landing-page-pattern.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
              backgroundBlendMode: "overlay",
              backgroundColor: "rgba(17, 24, 39, 0.85)",
            }}
          >
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-12 text-center text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Game Mechanics
                </span>
              </h2>

              <GameMechanicsDiagram />

              <div className="mt-12 grid gap-8 md:grid-cols-3">
                <div
                  className="rounded-lg p-6 relative overflow-hidden"
                  style={{
                    backgroundImage: "url('/feature-card-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-90"></div>
                  <div className="relative z-10">
                    <h3 className="mb-4 text-xl font-semibold text-white">Resource Management</h3>
                    <p className="text-gray-300">
                      Balance your faction's unique resources to power abilities and deploy cards strategically.
                    </p>
                    <ExpandableSection title="Learn more about resources">
                      <p className="text-gray-300">
                        Each faction has access to common resources (Energy, Materials, Information) but specializes in
                        generating and utilizing specific types more efficiently.
                      </p>
                    </ExpandableSection>
                  </div>
                </div>

                <div
                  className="rounded-lg p-6 relative overflow-hidden"
                  style={{
                    backgroundImage: "url('/feature-card-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-90"></div>
                  <div className="relative z-10">
                    <h3 className="mb-4 text-xl font-semibold text-white">Crisis Events</h3>
                    <p className="text-gray-300">
                      Adapt to game-changing events that create opportunities and challenges for all players.
                    </p>
                    <ExpandableSection title="How crisis events work">
                      <p className="text-gray-300">
                        Crisis events occur at predetermined intervals or through special card effects. They affect all
                        players but may benefit certain factions or strategies more than others.
                      </p>
                    </ExpandableSection>
                  </div>
                </div>

                <div
                  className="rounded-lg p-6 relative overflow-hidden"
                  style={{
                    backgroundImage: "url('/feature-card-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-90"></div>
                  <div className="relative z-10">
                    <h3 className="mb-4 text-xl font-semibold text-white">Faction Abilities</h3>
                    <p className="text-gray-300">
                      Leverage your faction's unique powers and synergies to outmaneuver opponents.
                    </p>
                    <ExpandableSection title="Faction ability examples">
                      <ul className="list-inside list-disc text-gray-300">
                        <li>Cybernetic Nexus: Convert excess Energy into Information</li>
                        <li>Void Harbingers: Sacrifice cards for powerful effects</li>
                        <li>Primordial Ascendancy: Regenerate resources over time</li>
                      </ul>
                    </ExpandableSection>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/learn/gameplay"
                  className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus-visible:ring-4"
                  aria-label="Explore detailed game mechanics"
                >
                  Explore Detailed Game Mechanics
                </Link>
              </div>

              <FeedbackWidget sectionId="mechanics" />
            </div>
          </section>
        </ScrollAnimation>

        {/* Card Types Section - Using card-design-feature image */}
        <ScrollAnimation>
          <section className="relative z-10 bg-gray-900 bg-opacity-90 px-4 py-20">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-12 text-center text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Card Types
                </span>
              </h2>

              <div className="mb-12 overflow-hidden rounded-xl shadow-2xl shadow-blue-500/20">
                <Image
                  src="/card-design-feature.png"
                  alt="Card design interface showing different card types"
                  width={1200}
                  height={600}
                  className="w-full object-cover"
                />
              </div>

              <CardTypeShowcase />

              <div className="mt-12 grid gap-8 md:grid-cols-3">
                <div className="rounded-lg bg-gray-800 p-6">
                  <h3 className="mb-4 text-xl font-semibold text-white">Hero Cards</h3>
                  <p className="text-gray-300">
                    Powerful characters with unique abilities that can turn the tide of battle.
                  </p>
                  <ExpandableSection title="Hero card mechanics">
                    <p className="text-gray-300">
                      Heroes have health points, attack values, and special abilities. They remain in play until
                      defeated and can level up through gameplay actions.
                    </p>
                  </ExpandableSection>
                </div>

                <div className="rounded-lg bg-gray-800 p-6">
                  <h3 className="mb-4 text-xl font-semibold text-white">Artifact Cards</h3>
                  <p className="text-gray-300">
                    Equippable items and structures that provide ongoing benefits or abilities.
                  </p>
                  <ExpandableSection title="Artifact card mechanics">
                    <p className="text-gray-300">
                      Artifacts can be attached to heroes or placed in territory zones. They provide passive bonuses,
                      activated abilities, or resource generation.
                    </p>
                  </ExpandableSection>
                </div>

                <div className="rounded-lg bg-gray-800 p-6">
                  <h3 className="mb-4 text-xl font-semibold text-white">Crisis Cards</h3>
                  <p className="text-gray-300">Event cards that dramatically alter the game state for all players.</p>
                  <ExpandableSection title="Crisis card mechanics">
                    <p className="text-gray-300">
                      Crisis cards create global effects that last for a specified duration. They can change resource
                      generation, modify card abilities, or create new victory conditions.
                    </p>
                  </ExpandableSection>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/cards"
                  className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus-visible:ring-4"
                  aria-label="Browse card gallery"
                >
                  Browse Card Gallery
                </Link>
              </div>

              <FeedbackWidget sectionId="cards" />
            </div>
          </section>
        </ScrollAnimation>

        {/* Factions Section - Using faction-showcase image */}
        <ScrollAnimation>
          <section
            className="relative z-10 px-4 py-20"
            style={{
              backgroundImage: "url('/landing-page-pattern.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
              backgroundBlendMode: "overlay",
              backgroundColor: "rgba(17, 24, 39, 0.85)",
            }}
          >
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-12 text-center text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Factions
                </span>
              </h2>

              <div className="mb-12 overflow-hidden rounded-xl shadow-2xl shadow-blue-500/20">
                <Image
                  src="/faction-showcase.png"
                  alt="The six factions of Crisis Unleashed"
                  width={1200}
                  height={600}
                  className="w-full object-cover"
                />
              </div>

              <FactionComparisonVisual />

              <div className="mt-8 text-center">
                <Link
                  href="/factions/select"
                  className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus-visible:ring-4"
                  aria-label="Choose your faction"
                >
                  Choose Your Faction
                </Link>
                <Link
                  href="/factions/compare"
                  className="ml-4 inline-flex items-center rounded-lg border-2 border-blue-400 bg-transparent px-6 py-3 text-blue-400 transition-colors hover:bg-blue-400 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 focus-visible:ring-4"
                  aria-label="Compare all factions"
                >
                  Compare All Factions
                </Link>
              </div>

              <ContextualFAQ
                questions={[
                  {
                    question: "Can I change my faction later?",
                    answer:
                      "Yes! While your account will have a primary faction for profile purposes, you can build decks and play with cards from any faction.",
                  },
                  {
                    question: "Are some factions better for beginners?",
                    answer:
                      "The Cybernetic Nexus and Titanborn factions have more straightforward mechanics that are recommended for new players. The Void Harbingers and Celestial Dominion have more complex interactions better suited for experienced players.",
                  },
                ]}
              />

              <FeedbackWidget sectionId="factions" />
            </div>
          </section>
        </ScrollAnimation>

        {/* Card Vault Section - Using testimonial-bg for background */}
        <ScrollAnimation>
          <section
            className="relative z-10 px-4 py-20"
            style={{
              backgroundImage: "url('/testimonial-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay",
              backgroundColor: "rgba(17, 24, 39, 0.9)",
            }}
          >
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-12 text-center text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Card Vault
                </span>
              </h2>

              <VaultVisualization />

              <div className="mt-12 grid gap-8 md:grid-cols-2">
                <div className="rounded-lg bg-gray-800 bg-opacity-80 p-6">
                  <h3 className="mb-4 text-2xl font-semibold text-white">Card Ownership</h3>
                  <p className="mb-4 text-gray-300">
                    Crisis Unleashed uses blockchain technology to provide true ownership of your cards.
                  </p>
                  <ExpandableSection title="What does card ownership mean?">
                    <p className="text-gray-300">
                      When you own a card in Crisis Unleashed, it's truly yours - you can trade it, sell it, or use it
                      across supported platforms. The blockchain verifies your ownership and the card's authenticity and
                      rarity.
                    </p>
                  </ExpandableSection>
                </div>

                <div className="rounded-lg bg-gray-800 bg-opacity-80 p-6">
                  <h3 className="mb-4 text-2xl font-semibold text-white">Trading System</h3>
                  <p className="mb-4 text-gray-300">
                    Exchange cards with other players through our secure trading platform.
                  </p>
                  <ExpandableSection title="How does trading work?">
                    <p className="text-gray-300">
                      The trading system allows direct player-to-player exchanges or marketplace listings. All
                      transactions are secured by blockchain verification, ensuring safe and transparent trading.
                    </p>
                  </ExpandableSection>
                </div>
              </div>

              <ContextualFAQ
                questions={[
                  {
                    question: "Do I need cryptocurrency to play or trade?",
                    answer:
                      "No, Crisis Unleashed handles all the blockchain interactions behind the scenes. You can use regular payment methods for purchases, and our simplified trading system doesn't require crypto knowledge.",
                  },
                  {
                    question: "What happens if I lose access to my account?",
                    answer:
                      "We have account recovery options that will restore access to your card collection. Your ownership is verified on the blockchain, so your cards are never truly lost.",
                  },
                ]}
              />

              <FeedbackWidget sectionId="vault" />
            </div>
          </section>
        </ScrollAnimation>

        {/* Development Roadmap Section */}
        <ScrollAnimation>
          <section
            className="relative z-10 px-4 py-20"
            style={{
              backgroundImage: "url('/landing-page-pattern.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
              backgroundBlendMode: "overlay",
              backgroundColor: "rgba(17, 24, 39, 0.85)",
            }}
          >
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-12 text-center text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Development Roadmap
                </span>
              </h2>

              <DevelopmentProgressVisual />

              <div className="mt-8 text-center">
                <Link
                  href="/about"
                  className="inline-flex items-center rounded-lg border-2 border-blue-400 bg-transparent px-6 py-3 text-blue-400 transition-colors hover:bg-blue-400 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 focus-visible:ring-4"
                  aria-label="Learn more about our development"
                >
                  Learn More About Our Development
                </Link>
              </div>

              <FeedbackWidget sectionId="roadmap" />
            </div>
          </section>
        </ScrollAnimation>

        {/* Call to Action Section - Using cta-background */}
        <section
          className="relative z-10 px-4 py-20 text-center"
          style={{
            backgroundImage: "url('/cta-background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-cyan-900/90"></div>
          <div className="mx-auto max-w-4xl relative z-10">
            <h2 className="mb-6 text-4xl font-bold text-white">Ready to Join the Crisis?</h2>
            <p className="mb-10 text-xl text-gray-200">
              Choose your faction, build your deck, and enter the world of Crisis Unleashed today.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 p-0.5 text-lg font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 focus-visible:ring-4 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                aria-label="Sign up now"
              >
                <span className="relative rounded-md bg-gray-900 px-8 py-3.5 transition-all duration-300 ease-out group-hover:bg-opacity-0">
                  Sign Up Now
                </span>
              </Link>

              <Link
                href="/learn/getting-started"
                className="relative inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-white hover:text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-300 focus-visible:ring-4"
                aria-label="Learn more first"
              >
                Learn More First
              </Link>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center rounded-full bg-blue-900/50 px-4 py-2 text-sm text-gray-200 border border-blue-400/30">
                <svg
                  className="mr-2 h-4 w-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>No credit card required • Free starter decks available</span>
              </div>
            </div>
          </div>
        </section>

        {/* Single Footer */}
        <SharedFooter />
      </main>
    </GlossaryProvider>
  )
}
