"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, BarChart3, Shield, Sword, Zap, Brain, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { factionThemes } from "@/lib/faction-themes"
import { useFactionAnimations } from "@/hooks/use-faction-animations"
import styles from "@/styles/faction-comparison.module.css"

// Import faction card components
import CyberneticCard from "@/components/faction-themes/cybernetic-card"
import PrimordialCard from "@/components/faction-themes/primordial-card"
import EclipsedCard from "@/components/faction-themes/eclipsed-card"
import CelestialCard from "@/components/faction-themes/celestial-card"
import TitanbornCard from "@/components/faction-themes/titanborn-card"
import VoidCard from "@/components/faction-themes/void-card"

interface FactionComparisonProps {
  initialFactions?: [string, string]
  onSelectFaction?: (factionId: string, position: "left" | "right") => void
}

/**
 * Displays an interactive side-by-side comparison of two factions, allowing users to compare stats, traits, synergies, and cards with animated transitions.
 *
 * Users can cycle through available factions on each side, switch between comparison tabs, and view detailed information for each faction. Stats are generated deterministically for consistency, and all transitions are animated for a smooth user experience.
 *
 * @param initialFactions - Optional tuple of two faction IDs to initialize the left and right factions.
 * @param onSelectFaction - Optional callback invoked when a faction is selected or changed, receiving the new faction ID and its position ("left" or "right").
 *
 * @remark Faction cycling is temporarily disabled during animations to prevent rapid state changes.
 */
export default function FactionComparison({
  initialFactions = ["cybernetic-nexus", "void-harbingers"],
  onSelectFaction,
}: FactionComparisonProps) {
  const [leftFaction, setLeftFaction] = useState(initialFactions[0])
  const [rightFaction, setRightFaction] = useState(initialFactions[1])
  const [activeTab, setActiveTab] = useState<"stats" | "traits" | "synergies" | "cards">("stats")
  const [isAnimating, setIsAnimating] = useState(false)

  const leftFactionData = factionThemes.find((f) => f.id === leftFaction) || factionThemes[0]
  const rightFactionData = factionThemes.find((f) => f.id === rightFaction) || factionThemes[1]

  const leftAnimations = useFactionAnimations(leftFaction)
  const rightAnimations = useFactionAnimations(rightFaction)

  // Function to cycle through factions
  const cycleFaction = (direction: "next" | "prev", position: "left" | "right") => {
    if (isAnimating) return

    setIsAnimating(true)

    const currentIndex = factionThemes.findIndex((f) => f.id === (position === "left" ? leftFaction : rightFaction))

    let newIndex
    if (direction === "next") {
      newIndex = (currentIndex + 1) % factionThemes.length
    } else {
      newIndex = (currentIndex - 1 + factionThemes.length) % factionThemes.length
    }

    const newFactionId = factionThemes[newIndex].id

    if (position === "left") {
      setLeftFaction(newFactionId)
    } else {
      setRightFaction(newFactionId)
    }

    if (onSelectFaction) {
      onSelectFaction(newFactionId, position)
    }

    // Reset animation lock after animation completes
    setTimeout(() => setIsAnimating(false), 500)
  }

  // Generate faction stats
  const generateStats = (factionId: string) => {
    // Use seeded random based on faction id to ensure consistent stats
    const seedRandom = (min: number, max: number, seed: string) => {
      const hash = seed.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0)
        return a & a
      }, 0)

      const rand = Math.sin(hash) * 10000
      return Math.floor((rand - Math.floor(rand)) * (max - min + 1)) + min
    }

    return {
      offense: seedRandom(3, 10, factionId + "offense"),
      defense: seedRandom(3, 10, factionId + "defense"),
      utility: seedRandom(3, 10, factionId + "utility"),
      complexity: seedRandom(3, 10, factionId + "complexity"),
      control: seedRandom(3, 10, factionId + "control"),
      synergy: seedRandom(3, 10, factionId + "synergy"),
    }
  }

  const leftStats = generateStats(leftFaction)
  const rightStats = generateStats(rightFaction)

  // Get faction card component
  const getFactionCard = (factionId: string, size = "sm") => {
    switch (factionId) {
      case "cybernetic-nexus":
        return <CyberneticCard size={size} />
      case "primordial-ascendancy":
        return <PrimordialCard size={size} />
      case "eclipsed-order":
        return <EclipsedCard size={size} />
      case "celestial-dominion":
        return <CelestialCard size={size} />
      case "titanborn":
        return <TitanbornCard size={size} />
      case "void-harbingers":
        return <VoidCard size={size} />
      default:
        return null
    }
  }

  // Get faction synergies
  const getSynergies = (factionId: string) => {
    const synergies = {
      "cybernetic-nexus": [
        {
          faction: "celestial-dominion",
          strength: "high",
          description: "Time manipulation enhances AI processing capabilities",
        },
        {
          faction: "void-harbingers",
          strength: "medium",
          description: "Dimensional tech expands computational possibilities",
        },
        { faction: "titanborn", strength: "low", description: "Opposing philosophies limit cooperation potential" },
      ],
      "primordial-ascendancy": [
        { faction: "titanborn", strength: "high", description: "Ancient powers combine with titan strength" },
        {
          faction: "cybernetic-nexus",
          strength: "low",
          description: "Natural forces resist technological integration",
        },
        { faction: "eclipsed-order", strength: "medium", description: "Shadow tactics complement natural camouflage" },
      ],
      "eclipsed-order": [
        {
          faction: "void-harbingers",
          strength: "high",
          description: "Chaos and shadow create unpredictable strategies",
        },
        {
          faction: "primordial-ascendancy",
          strength: "medium",
          description: "Natural cover enhances stealth operations",
        },
        { faction: "celestial-dominion", strength: "low", description: "Cosmic illumination counters shadow tactics" },
      ],
      "celestial-dominion": [
        {
          faction: "cybernetic-nexus",
          strength: "high",
          description: "Temporal manipulation enhances technological precision",
        },
        {
          faction: "void-harbingers",
          strength: "medium",
          description: "Dimensional understanding creates powerful combinations",
        },
        { faction: "eclipsed-order", strength: "low", description: "Light and cosmic energy dispel shadows" },
      ],
      titanborn: [
        { faction: "primordial-ascendancy", strength: "high", description: "Primal forces amplify titan strength" },
        {
          faction: "celestial-dominion",
          strength: "medium",
          description: "Cosmic energy can be channeled through ancient runes",
        },
        {
          faction: "cybernetic-nexus",
          strength: "low",
          description: "Technology struggles to enhance natural titan abilities",
        },
      ],
      "void-harbingers": [
        {
          faction: "eclipsed-order",
          strength: "high",
          description: "Shadow and void create unpredictable dimensional attacks",
        },
        {
          faction: "celestial-dominion",
          strength: "medium",
          description: "Cosmic understanding enhances void manipulation",
        },
        {
          faction: "primordial-ascendancy",
          strength: "low",
          description: "Natural order resists chaotic void energies",
        },
      ],
    }

    return synergies[factionId as keyof typeof synergies] || []
  }

  // Get faction unique traits
  const getUniqueTraits = (factionId: string) => {
    const traits = {
      "cybernetic-nexus": [
        { name: "Neural Network", description: "Enhance adjacent cards with +1 power" },
        { name: "Data Mining", description: "Draw an additional card when playing tech cards" },
        { name: "System Upgrade", description: "Boost a card's stats permanently each turn" },
      ],
      "primordial-ascendancy": [
        { name: "Natural Growth", description: "Units gain +1/+1 each turn they remain in play" },
        { name: "Elemental Harmony", description: "Elemental cards cost 1 less to play" },
        { name: "Regeneration", description: "Heal 1 damage from each unit at the start of your turn" },
      ],
      "eclipsed-order": [
        { name: "Shadow Strike", description: "Deal 2 damage to any unit that enters play" },
        { name: "Poison Mastery", description: "Apply damage over time effects to enemy units" },
        { name: "Assassination", description: "Instantly eliminate a damaged enemy unit" },
      ],
      "celestial-dominion": [
        { name: "Time Manipulation", description: "Play an additional card once per turn" },
        { name: "Cosmic Insight", description: "Look at the top 3 cards of your deck each turn" },
        { name: "Astral Projection", description: "Move units to any position on the board" },
      ],
      titanborn: [
        { name: "Mountain's Strength", description: "Units cannot be moved by enemy effects" },
        { name: "Runic Armor", description: "Reduce all damage taken by 1" },
        { name: "Titan's Fury", description: "Deal double damage when attacking with 8+ power units" },
      ],
      "void-harbingers": [
        { name: "Reality Distortion", description: "Change the cost of random cards each turn" },
        { name: "Dimensional Rift", description: "Banish a card from play temporarily" },
        { name: "Chaos Theory", description: "50% chance to play cards for free" },
      ],
    }

    return traits[factionId as keyof typeof traits] || []
  }

  return (
    <div className={styles.comparisonContainer}>
      <div className={styles.header}>
        <h2>Faction Comparison</h2>
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tabButton} ${activeTab === "stats" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            <BarChart3 size={16} />
            <span>Stats</span>
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "traits" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("traits")}
          >
            <Sparkles size={16} />
            <span>Traits</span>
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "synergies" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("synergies")}
          >
            <Zap size={16} />
            <span>Synergies</span>
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "cards" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("cards")}
          >
            <BarChart3 size={16} />
            <span>Cards</span>
          </button>
        </div>
      </div>

      <div className={styles.comparisonContent}>
        {/* Left Faction Selector */}
        <div className={styles.factionSelector}>
          <Button
            variant="ghost"
            size="icon"
            className={styles.cycleButton}
            onClick={() => cycleFaction("prev", "left")}
            disabled={isAnimating}
          >
            <ChevronLeft />
          </Button>

          <AnimatePresence mode="wait">
            <motion.div
              key={leftFaction}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={styles.factionHeader}
              style={{
                backgroundColor: leftFactionData.colors.background,
                borderColor: leftFactionData.colors.primary,
              }}
            >
              <h3 style={{ color: leftFactionData.colors.primary }}>{leftFactionData.name}</h3>
              <p style={{ color: leftFactionData.colors.text }}>{leftFactionData.description}</p>
            </motion.div>
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            className={styles.cycleButton}
            onClick={() => cycleFaction("next", "left")}
            disabled={isAnimating}
          >
            <ChevronRight />
          </Button>
        </div>

        {/* VS Divider */}
        <div className={styles.vsDivider}>
          <div className={styles.vsCircle}>VS</div>
          <div className={styles.dividerLine} />
        </div>

        {/* Right Faction Selector */}
        <div className={styles.factionSelector}>
          <Button
            variant="ghost"
            size="icon"
            className={styles.cycleButton}
            onClick={() => cycleFaction("prev", "right")}
            disabled={isAnimating}
          >
            <ChevronLeft />
          </Button>

          <AnimatePresence mode="wait">
            <motion.div
              key={rightFaction}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={styles.factionHeader}
              style={{
                backgroundColor: rightFactionData.colors.background,
                borderColor: rightFactionData.colors.primary,
              }}
            >
              <h3 style={{ color: rightFactionData.colors.primary }}>{rightFactionData.name}</h3>
              <p style={{ color: rightFactionData.colors.text }}>{rightFactionData.description}</p>
            </motion.div>
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            className={styles.cycleButton}
            onClick={() => cycleFaction("next", "right")}
            disabled={isAnimating}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      {/* Comparison Content */}
      <div className={styles.comparisonDetails}>
        <AnimatePresence mode="wait">
          {activeTab === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.statsComparison}
            >
              <div className={styles.statsGrid}>
                <StatComparison
                  label="Offense"
                  leftValue={leftStats.offense}
                  rightValue={rightStats.offense}
                  icon={<Sword size={16} />}
                  leftColor={leftFactionData.colors.primary}
                  rightColor={rightFactionData.colors.primary}
                />

                <StatComparison
                  label="Defense"
                  leftValue={leftStats.defense}
                  rightValue={rightStats.defense}
                  icon={<Shield size={16} />}
                  leftColor={leftFactionData.colors.primary}
                  rightColor={rightFactionData.colors.primary}
                />

                <StatComparison
                  label="Utility"
                  leftValue={leftStats.utility}
                  rightValue={rightStats.utility}
                  icon={<Zap size={16} />}
                  leftColor={leftFactionData.colors.primary}
                  rightColor={rightFactionData.colors.primary}
                />

                <StatComparison
                  label="Complexity"
                  leftValue={leftStats.complexity}
                  rightValue={rightStats.complexity}
                  icon={<Brain size={16} />}
                  leftColor={leftFactionData.colors.primary}
                  rightColor={rightFactionData.colors.primary}
                />

                <StatComparison
                  label="Control"
                  leftValue={leftStats.control}
                  rightValue={rightStats.control}
                  icon={<BarChart3 size={16} />}
                  leftColor={leftFactionData.colors.primary}
                  rightColor={rightFactionData.colors.primary}
                />

                <StatComparison
                  label="Synergy"
                  leftValue={leftStats.synergy}
                  rightValue={rightStats.synergy}
                  icon={<Sparkles size={16} />}
                  leftColor={leftFactionData.colors.primary}
                  rightColor={rightFactionData.colors.primary}
                />
              </div>

              <div className={styles.radarChartContainer}>
                <div className={styles.radarChart}>
                  {/* Radar chart would be implemented here */}
                  <div className={styles.radarPlaceholder}>
                    <div
                      className={styles.radarOverlay}
                      style={{ backgroundColor: `${leftFactionData.colors.primary}33` }}
                    />
                    <div
                      className={styles.radarOverlay}
                      style={{ backgroundColor: `${rightFactionData.colors.primary}33` }}
                    />
                  </div>
                </div>

                <div className={styles.radarLegend}>
                  <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: leftFactionData.colors.primary }} />
                    <span>{leftFactionData.name}</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: rightFactionData.colors.primary }} />
                    <span>{rightFactionData.name}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "traits" && (
            <motion.div
              key="traits"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.traitsComparison}
            >
              <div className={styles.traitsColumn} style={{ borderColor: leftFactionData.colors.primary }}>
                <h4 style={{ color: leftFactionData.colors.primary }}>Unique Traits</h4>
                {getUniqueTraits(leftFaction).map((trait, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={styles.traitCard}
                    style={{ borderColor: leftFactionData.colors.primary }}
                  >
                    <h5 style={{ color: leftFactionData.colors.accent }}>{trait.name}</h5>
                    <p>{trait.description}</p>
                  </motion.div>
                ))}

                <h4 style={{ color: leftFactionData.colors.primary, marginTop: "1.5rem" }}>Elements</h4>
                <div className={styles.elementsGrid}>
                  {leftFactionData.elements.map((element, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      style={{
                        borderColor: leftFactionData.colors.primary,
                        color: leftFactionData.colors.accent,
                      }}
                    >
                      {element}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className={styles.traitsColumn} style={{ borderColor: rightFactionData.colors.primary }}>
                <h4 style={{ color: rightFactionData.colors.primary }}>Unique Traits</h4>
                {getUniqueTraits(rightFaction).map((trait, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={styles.traitCard}
                    style={{ borderColor: rightFactionData.colors.primary }}
                  >
                    <h5 style={{ color: rightFactionData.colors.accent }}>{trait.name}</h5>
                    <p>{trait.description}</p>
                  </motion.div>
                ))}

                <h4 style={{ color: rightFactionData.colors.primary, marginTop: "1.5rem" }}>Elements</h4>
                <div className={styles.elementsGrid}>
                  {rightFactionData.elements.map((element, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      style={{
                        borderColor: rightFactionData.colors.primary,
                        color: rightFactionData.colors.accent,
                      }}
                    >
                      {element}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "synergies" && (
            <motion.div
              key="synergies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.synergiesComparison}
            >
              <div className={styles.synergiesColumn}>
                <h4 style={{ color: leftFactionData.colors.primary }}>Synergies with Other Factions</h4>
                {getSynergies(leftFaction).map((synergy, index) => {
                  const synergyFaction = factionThemes.find((f) => f.id === synergy.faction)
                  if (!synergyFaction) return null

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={styles.synergyCard}
                      style={{
                        borderColor: leftFactionData.colors.primary,
                        background: `linear-gradient(135deg, ${leftFactionData.colors.background}80, ${synergyFaction.colors.background}80)`,
                      }}
                    >
                      <div className={styles.synergyHeader}>
                        <h5>{synergyFaction.name}</h5>
                        <Badge
                          variant={synergy.strength === "high" ? "default" : "outline"}
                          style={{
                            backgroundColor:
                              synergy.strength === "high" ? leftFactionData.colors.primary : "transparent",
                            borderColor: leftFactionData.colors.primary,
                            color: synergy.strength === "high" ? "white" : leftFactionData.colors.primary,
                          }}
                        >
                          {synergy.strength.toUpperCase()}
                        </Badge>
                      </div>
                      <p>{synergy.description}</p>
                    </motion.div>
                  )
                })}
              </div>

              <div className={styles.synergiesColumn}>
                <h4 style={{ color: rightFactionData.colors.primary }}>Synergies with Other Factions</h4>
                {getSynergies(rightFaction).map((synergy, index) => {
                  const synergyFaction = factionThemes.find((f) => f.id === synergy.faction)
                  if (!synergyFaction) return null

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={styles.synergyCard}
                      style={{
                        borderColor: rightFactionData.colors.primary,
                        background: `linear-gradient(135deg, ${rightFactionData.colors.background}80, ${synergyFaction.colors.background}80)`,
                      }}
                    >
                      <div className={styles.synergyHeader}>
                        <h5>{synergyFaction.name}</h5>
                        <Badge
                          variant={synergy.strength === "high" ? "default" : "outline"}
                          style={{
                            backgroundColor:
                              synergy.strength === "high" ? rightFactionData.colors.primary : "transparent",
                            borderColor: rightFactionData.colors.primary,
                            color: synergy.strength === "high" ? "white" : rightFactionData.colors.primary,
                          }}
                        >
                          {synergy.strength.toUpperCase()}
                        </Badge>
                      </div>
                      <p>{synergy.description}</p>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {activeTab === "cards" && (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.cardsComparison}
            >
              <div className={styles.cardsColumn}>
                <h4 style={{ color: leftFactionData.colors.primary }}>Example Cards</h4>
                <div className={styles.cardsGrid}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className={styles.cardWrapper}
                  >
                    {getFactionCard(leftFaction, "sm")}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className={styles.cardWrapper}
                  >
                    {getFactionCard(leftFaction, "sm")}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className={styles.cardWrapper}
                  >
                    {getFactionCard(leftFaction, "sm")}
                  </motion.div>
                </div>

                <h4 style={{ color: leftFactionData.colors.primary, marginTop: "1.5rem" }}>Animations</h4>
                <div className={styles.animationsGrid}>
                  {leftAnimations.animations.slice(0, 6).map((animation: any, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      style={{
                        borderColor: leftFactionData.colors.primary,
                        color: leftFactionData.colors.accent,
                      }}
                    >
                      {animation.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className={styles.cardsColumn}>
                <h4 style={{ color: rightFactionData.colors.primary }}>Example Cards</h4>
                <div className={styles.cardsGrid}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className={styles.cardWrapper}
                  >
                    {getFactionCard(rightFaction, "sm")}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className={styles.cardWrapper}
                  >
                    {getFactionCard(rightFaction, "sm")}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className={styles.cardWrapper}
                  >
                    {getFactionCard(rightFaction, "sm")}
                  </motion.div>
                </div>

                <h4 style={{ color: rightFactionData.colors.primary, marginTop: "1.5rem" }}>Animations</h4>
                <div className={styles.animationsGrid}>
                  {rightAnimations.animations.slice(0, 6).map((animation: any, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      style={{
                        borderColor: rightFactionData.colors.primary,
                        color: rightFactionData.colors.accent,
                      }}
                    >
                      {animation.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * Displays a side-by-side comparison of a single stat for two factions with animated bars and a difference indicator.
 *
 * @param label - The name of the stat being compared.
 * @param leftValue - The stat value for the left faction.
 * @param rightValue - The stat value for the right faction.
 * @param icon - Icon representing the stat.
 * @param leftColor - Color used for the left faction's stat bar.
 * @param rightColor - Color used for the right faction's stat bar.
 *
 * @returns A React element rendering the stat comparison row with animated bars and a badge showing the value difference.
 */
function StatComparison({
  label,
  leftValue,
  rightValue,
  icon,
  leftColor,
  rightColor,
}: {
  label: string
  leftValue: number
  rightValue: number
  icon: React.ReactNode
  leftColor: string
  rightColor: string
}) {
  const difference = leftValue - rightValue

  return (
    <div className={styles.statComparisonRow}>
      <div className={styles.statLabel}>
        {icon}
        <span>{label}</span>
      </div>

      <div className={styles.statBars}>
        <div className={styles.leftStatBar}>
          <motion.div
            className={styles.statBarFill}
            initial={{ width: 0 }}
            animate={{ width: `${(leftValue / 10) * 100}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ backgroundColor: leftColor }}
          />
          <span className={styles.statValue}>{leftValue}</span>
        </div>

        <div className={styles.rightStatBar}>
          <motion.div
            className={styles.statBarFill}
            initial={{ width: 0 }}
            animate={{ width: `${(rightValue / 10) * 100}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ backgroundColor: rightColor }}
          />
          <span className={styles.statValue}>{rightValue}</span>
        </div>
      </div>

      <div className={styles.statDifference}>
        {difference !== 0 && (
          <Badge variant="outline" className={difference > 0 ? styles.positiveValue : styles.negativeValue}>
            {difference > 0 ? `+${difference}` : difference}
          </Badge>
        )}
      </div>
    </div>
  )
}
