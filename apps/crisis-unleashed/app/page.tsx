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
// Import directly from the component file instead of the barrel file
import LogoVariant from "@/components/logo-system/logo-variant"

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

        {/* Rest of the component remains unchanged */}
        {/* ... */}

        {/* Single Footer */}
        <SharedFooter />
      </main>
    </GlossaryProvider>
  )
}