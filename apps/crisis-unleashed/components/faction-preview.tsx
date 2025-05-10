"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFactionAnimations } from "@/hooks/use-faction-animations"
import styles from "@/components/faction-preview.module.css"
import type { CardData } from "@/lib/card-data"
import { useInView } from "react-intersection-observer"
import { ChevronDown, Star, Shield, Zap, Brain, Users, Sparkles } from "lucide-react"

// Import all background components
import CyberneticBackground from "@/components/faction-themes/cybernetic-background"
import PrimordialBackground from "@/components/faction-themes/primordial-background"
import EclipsedBackground from "@/components/faction-themes/eclipsed-background"
import CelestialBackground from "@/components/faction-themes/celestial-background"
import TitanbornBackground from "@/components/faction-themes/titanborn-background"
import VoidBackground from "@/components/faction-themes/void-background"

// Import all faction example cards
import CyberneticCard from "@/components/faction-themes/cybernetic-card"
import PrimordialCard from "@/components/faction-themes/primordial-card"
import EclipsedCard from "@/components/faction-themes/eclipsed-card"
import CelestialCard from "@/components/faction-themes/celestial-card"
import TitanbornCard from "@/components/faction-themes/titanborn-card"
import VoidCard from "@/components/faction-themes/void-card"

// Import faction interfaces for interactive elements
import CyberneticInterface from "@/components/faction-themes/cybernetic-interface"
import PrimordialInterface from "@/components/faction-themes/primordial-interface"
import EclipsedInterface from "@/components/faction-themes/eclipsed-interface"
import CelestialInterface from "@/components/faction-themes/celestial-interface"
import TitanbornInterface from "@/components/faction-themes/titanborn-interface"
import VoidInterface from "@/components/faction-themes/void-interface"

interface FactionPreviewProps {
  faction: any
  onSelect: () => void
}

/**
 * Renders an interactive, animated preview of a game faction, displaying detailed information, visuals, and selection controls.
 *
 * Presents a tabbed interface with animated transitions for faction overview, strengths, lore, and details, including expandable trait lists, stat bars, lore sections, strategy tips, and relationship breakdowns. The component features faction-specific backgrounds, animated emblems, example cards, interface previews, and particle effects. Users can select the faction via an animated button.
 *
 * @param faction - The faction data object to display.
 * @param onSelect - Callback invoked when the user selects the faction.
 *
 * @returns The complete animated preview UI for the specified faction.
 */
export default function FactionPreview({ faction, onSelect }: FactionPreviewProps) {
  // Ensure faction and its properties are defined
  const safeFaction = {
    ...faction,
    id: faction?.id || "unknown",
    name: faction?.name || "Unknown Faction",
    description: faction?.description || "No description available",
    elements: faction?.elements || [],
    colors: faction?.colors || {
      primary: "#6366f1",
      secondary: "#312e81",
      accent: "#818cf8",
      background: "#0f0f1a",
      text: "#e0e7ff",
    },
  }
  const [isHovered, setIsHovered] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "strengths" | "lore" | "details">("overview")
  const [expandedTrait, setExpandedTrait] = useState<number | null>(null)
  const { animations } = useFactionAnimations(safeFaction.id)
  const previewRef = useRef<HTMLDivElement>(null)

  // Add these inside the FactionPreview component, after the existing state declarations
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [showRelationships, setShowRelationships] = useState(false)
  const [showSignatureAbility, setShowSignatureAbility] = useState(false)
  const [showStrategyTips, setShowStrategyTips] = useState(false)
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  // Ensure faction and colors are properly defined
  const safeColors = {
    primary: safeFaction?.colors?.primary || "#6366f1",
    secondary: safeFaction?.colors?.secondary || "#312e81",
    accent: safeFaction?.colors?.accent || "#818cf8",
    background: safeFaction?.colors?.background || "#0f0f1a",
    text: safeFaction?.colors?.text || "#e0e7ff",
  }

  // Add this useEffect to trigger animations when the component comes into view
  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  // Add this function to handle section expansion
  const toggleSection = useCallback(
    (section: string) => {
      setExpandedSection(expandedSection === section ? null : section)
    },
    [expandedSection],
  )

  // Show features after a small delay
  useEffect(() => {
    const timer = setTimeout(() => setShowFeatures(true), 800)
    return () => clearTimeout(timer)
  }, [])

  // Add scroll into view effect when component mounts
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [])

  // Get background component based on faction id
  const BackgroundComponent = (() => {
    const factionId = safeFaction?.id || "void-harbingers" // Default to void-harbingers if no id

    switch (factionId) {
      case "cybernetic-nexus":
        return <CyberneticBackground color={safeColors.primary} />
      case "primordial-ascendancy":
        return <PrimordialBackground />
      case "eclipsed-order":
        return (
          <EclipsedBackground showDaggers={true} shadowIntensity="medium">
            <div className="w-full h-full" />
          </EclipsedBackground>
        )
      case "celestial-dominion":
        return <CelestialBackground showConstellations={true} />
      case "titanborn":
        return <TitanbornBackground intensity="medium" />
      case "void-harbingers":
        return <VoidBackground intensity={1} />
      default:
        return <div className={`bg-gradient-to-br from-gray-900 to-black w-full h-full`} />
    }
  })()

  // Example card component for each faction
  const ExampleCard = (() => {
    const cardSize = "md"
    const factionId = safeFaction?.id || "void-harbingers" // Default to void-harbingers if no id
    const factionName = safeFaction?.name || "Void Harbingers" // Default name

    // Sample card data for preview purposes
    const getSampleCard = (factionId: string): CardData => {
      const baseCard: CardData = {
        id: `sample-${factionId}`,
        name: `${factionName} Champion`,
        type: "Hero",
        faction: factionName,
        rarity: "Legendary",
        provision: 8,
        description: `A powerful ${factionName} unit with unique abilities.`,
        health: 5,
        attack: 4,
        defense: 3,
        abilities: [
          {
            name: "Faction Synergy",
            description: `Boost allied ${factionName} units by 2.`,
            cost: 2,
          },
        ],
        aspects: [safeFaction.elements[0] || "Unknown"],
        lore: `A champion of the ${factionName}, sworn to protect their realm.`,
        artist: "Game Artist",
      }

      return baseCard
    }

    switch (factionId) {
      case "cybernetic-nexus":
        return <CyberneticCard card={getSampleCard(factionId)} size={cardSize} />
      case "primordial-ascendancy":
        return <PrimordialCard card={getSampleCard(factionId)} size={cardSize} />
      case "eclipsed-order":
        return <EclipsedCard card={getSampleCard(factionId)} size={cardSize} />
      case "celestial-dominion":
        return <CelestialCard card={getSampleCard(factionId)} size={cardSize} />
      case "titanborn":
        return <TitanbornCard card={getSampleCard(factionId)} size={cardSize} />
      case "void-harbingers":
        return <VoidCard card={getSampleCard(factionId)} size={cardSize} />
      default:
        return null
    }
  })()

  // Faction interface component
  const InterfaceComponent = (() => {
    const factionId = safeFaction?.id || "void-harbingers" // Default to void-harbingers if no id

    switch (factionId) {
      case "cybernetic-nexus":
        return <CyberneticInterface />
      case "primordial-ascendancy":
        return <PrimordialInterface />
      case "eclipsed-order":
        return <EclipsedInterface />
      case "celestial-dominion":
        return <CelestialInterface />
      case "titanborn":
        return <TitanbornInterface />
      case "void-harbingers":
        return <VoidInterface />
      default:
        return null
    }
  })()

  // Generate faction stats based on faction id
  const factionStats = {
    offense: Math.floor(Math.random() * 5) + 5,
    defense: Math.floor(Math.random() * 5) + 5,
    utility: Math.floor(Math.random() * 5) + 5,
    complexity: Math.floor(Math.random() * 5) + 5,
  }

  // Faction lore snippets
  const factionLore = {
    "cybernetic-nexus":
      "The Cybernetic Nexus emerged from the ruins of the old world, fusing human consciousness with advanced AI systems. Their neural networks span across the known universe, processing data at speeds incomprehensible to organic minds.",
    "primordial-ascendancy":
      "Ancient as the first forests, the Primordial Ascendancy draws power from the very essence of nature itself. Their shamans commune with spirits that have existed since time immemorial, guiding their people through the cycles of creation and destruction.",
    "eclipsed-order":
      "Operating from the shadows, the Eclipsed Order has shaped history through calculated assassinations and strategic manipulation. Their agents are bound by blood oaths that transcend death itself.",
    "celestial-dominion":
      "The Celestial Dominion arose when the barriers between dimensions weakened, allowing cosmic entities to impart their knowledge to chosen vessels. They perceive time not as linear but as a tapestry that can be rewoven.",
    titanborn:
      "Descendants of ancient mountain titans, the Titanborn carry the legacy of primeval strength in their blood. Their forges burn with fires stolen from the heart of dying stars, crafting weapons that can shatter reality itself.",
    "void-harbingers":
      "The Void Harbingers emerged when scientists peered too deeply into the spaces between realities. Now they exist partially outside normal space-time, perceiving possibilities that others cannot comprehend.",
  }

  // Faction relationships
  const factionRelationships = {
    "cybernetic-nexus": {
      allies: ["void-harbingers"],
      enemies: ["primordial-ascendancy"],
      neutral: ["titanborn", "celestial-dominion", "eclipsed-order"],
    },
    "primordial-ascendancy": {
      allies: ["titanborn"],
      enemies: ["cybernetic-nexus", "void-harbingers"],
      neutral: ["celestial-dominion", "eclipsed-order"],
    },
    "eclipsed-order": {
      allies: ["void-harbingers"],
      enemies: ["celestial-dominion"],
      neutral: ["cybernetic-nexus", "primordial-ascendancy", "titanborn"],
    },
    "celestial-dominion": {
      allies: ["titanborn"],
      enemies: ["eclipsed-order", "void-harbingers"],
      neutral: ["cybernetic-nexus", "primordial-ascendancy"],
    },
    titanborn: {
      allies: ["primordial-ascendancy", "celestial-dominion"],
      enemies: [],
      neutral: ["cybernetic-nexus", "eclipsed-order", "void-harbingers"],
    },
    "void-harbingers": {
      allies: ["cybernetic-nexus", "eclipsed-order"],
      enemies: ["primordial-ascendancy", "celestial-dominion"],
      neutral: ["titanborn"],
    },
  }

  // Faction strategy tips
  const factionStrategyTips = {
    "cybernetic-nexus": [
      "Focus on building synergies between tech units",
      "Use resource manipulation to gain advantage in the late game",
      "Deploy enhancement abilities to upgrade your units over time",
      "Control the board with tactical positioning",
    ],
    "primordial-ascendancy": [
      "Overwhelm opponents with numbers and growth mechanics",
      "Use nature's resilience to withstand enemy attacks",
      "Harness elemental powers for area effects",
      "Build symbiotic relationships between your units",
    ],
    "eclipsed-order": [
      "Master stealth and surprise attacks",
      "Eliminate key enemy units with precision strikes",
      "Use deception to mislead your opponent",
      "Control the shadows to gain information advantage",
    ],
    "celestial-dominion": [
      "Manipulate time to gain extra actions",
      "Predict and counter enemy moves before they happen",
      "Use cosmic energy to enhance your abilities",
      "Balance offensive and defensive celestial powers",
    ],
    titanborn: [
      "Build an impenetrable defense with your sturdy units",
      "Use forge abilities to craft powerful equipment",
      "Counter-attack with devastating force",
      "Leverage terrain advantages for positional strength",
    ],
    "void-harbingers": [
      "Disrupt enemy plans with reality manipulation",
      "Use dimensional rifts for unexpected movements",
      "Embrace chaos to create unpredictable outcomes",
      "Sacrifice stability for powerful void effects",
    ],
  }

  // Faction signature abilities
  const factionSignatureAbilities = {
    "cybernetic-nexus": {
      name: "Neural Network",
      description: "Connect your units in a network that shares buffs and abilities.",
      cooldown: "3 turns",
    },
    "primordial-ascendancy": {
      name: "Natural Growth",
      description: "Units gain strength each turn they remain on the field.",
      cooldown: "Passive",
    },
    "eclipsed-order": {
      name: "Shadow Strike",
      description: "Deal critical damage to an enemy unit and apply a weakening effect.",
      cooldown: "4 turns",
    },
    "celestial-dominion": {
      name: "Time Dilation",
      description: "Grant an extra action to one of your units this turn.",
      cooldown: "5 turns",
    },
    titanborn: {
      name: "Mountain's Resilience",
      description: "Reduce all incoming damage by half for one turn.",
      cooldown: "4 turns",
    },
    "void-harbingers": {
      name: "Reality Tear",
      description: "Create a dimensional rift that swaps random units on the board.",
      cooldown: "3 turns",
    },
  }

  return (
    <div className={styles.factionPreview} ref={previewRef}>
      {/* Background layer with animated opacity */}
      <motion.div
        className={styles.backgroundLayer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {BackgroundComponent}

        {/* Animated overlay effect */}
        <motion.div
          className={styles.overlayEffect}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          style={{
            background: `radial-gradient(circle at center, ${safeColors.primary}33 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      <div className={styles.contentWrapper}>
        <div className={styles.detailSection}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {/* Faction emblem/icon */}
            <motion.div
              className={styles.factionEmblem}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              style={{
                backgroundColor: safeColors.secondary,
                borderColor: safeColors.accent,
              }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={styles.emblemInner}
                style={{ backgroundColor: safeColors.primary }}
                animate={{
                  boxShadow: [
                    `0 0 5px ${safeColors.primary}80`,
                    `0 0 15px ${safeColors.primary}80`,
                    `0 0 5px ${safeColors.primary}80`,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "mirror",
                }}
              />
            </motion.div>

            {/* Faction name with text glow effect */}
            <motion.h2
              className={styles.factionName}
              style={{ color: safeColors.accent }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {safeFaction.name}
            </motion.h2>

            {/* Tab navigation */}
            <motion.div
              className={styles.tabNavigation}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                className={`${styles.tabButton} ${activeTab === "overview" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("overview")}
                style={{
                  borderColor: activeTab === "overview" ? safeColors.accent : "transparent",
                  color: activeTab === "overview" ? safeColors.accent : "rgba(255,255,255,0.7)",
                }}
              >
                Overview
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "strengths" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("strengths")}
                style={{
                  borderColor: activeTab === "strengths" ? safeColors.accent : "transparent",
                  color: activeTab === "strengths" ? safeColors.accent : "rgba(255,255,255,0.7)",
                }}
              >
                Strengths
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "lore" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("lore")}
                style={{
                  borderColor: activeTab === "lore" ? safeColors.accent : "transparent",
                  color: activeTab === "lore" ? safeColors.accent : "rgba(255,255,255,0.7)",
                }}
              >
                Lore
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "details" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("details")}
                style={{
                  borderColor: activeTab === "details" ? safeColors.accent : "transparent",
                  color: activeTab === "details" ? safeColors.accent : "rgba(255,255,255,0.7)",
                }}
              >
                Details
              </button>
            </motion.div>

            {/* Tab content with AnimatePresence for smooth transitions */}
            <div className={styles.tabContent}>
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className={styles.factionDescription}>{safeFaction.description}</p>

                    {showFeatures && (
                      <motion.div
                        className={styles.featuresList}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className={styles.featuresTitle}>Faction Traits</h3>
                        <ul className={styles.traits}>
                          {safeFaction.elements &&
                            safeFaction.elements.map((element: string, index: number) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className={`${styles.traitItem} ${expandedTrait === index ? styles.expandedTrait : ""}`}
                                onClick={() => setExpandedTrait(expandedTrait === index ? null : index)}
                                whileHover={{
                                  scale: 1.02,
                                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                                }}
                              >
                                <div className={styles.traitBullet} style={{ backgroundColor: safeColors.accent }} />
                                <span>{element}</span>
                                <motion.div
                                  className={styles.traitExpand}
                                  animate={{ rotate: expandedTrait === index ? 180 : 0 }}
                                >
                                  {expandedTrait === index ? "−" : "+"}
                                </motion.div>

                                {/* Expanded content */}
                                {expandedTrait === index && (
                                  <motion.div
                                    className={styles.traitDetail}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                  >
                                    <p>
                                      This {safeFaction.id} trait enhances your cards with unique abilities and
                                      synergies.
                                    </p>
                                  </motion.div>
                                )}
                              </motion.li>
                            ))}
                        </ul>

                        <div className={styles.animationTags}>
                          {animations &&
                            animations.slice(0, 5).map((animation: any, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Badge
                                  variant="outline"
                                  className={styles.animationBadge}
                                  style={{
                                    borderColor: safeColors.accent,
                                    color: safeColors.accent,
                                  }}
                                >
                                  {animation.name}
                                </Badge>
                              </motion.div>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {activeTab === "strengths" && (
                  <motion.div
                    key="strengths"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={styles.strengthsTab}
                  >
                    <div className={styles.statsContainer}>
                      {Object.entries(factionStats).map(([stat, value], index) => (
                        <motion.div
                          key={stat}
                          className={styles.statItem}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                        >
                          <div className={styles.statLabel}>
                            {stat === "offense" && <Zap size={16} className="mr-1" />}
                            {stat === "defense" && <Shield size={16} className="mr-1" />}
                            {stat === "utility" && <Star size={16} className="mr-1" />}
                            {stat === "complexity" && <Brain size={16} className="mr-1" />}
                            {stat.charAt(0).toUpperCase() + stat.slice(1)}
                          </div>
                          <div className={styles.statBarContainer}>
                            <motion.div
                              className={styles.statBar}
                              initial={{ width: 0 }}
                              animate={{ width: `${(value / 10) * 100}%` }}
                              transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                              style={{
                                backgroundColor: safeColors.primary,
                                boxShadow: `0 0 10px ${safeColors.primary}80`,
                              }}
                            />
                            {/* Add stat markers */}
                            <div className={styles.statMarkers}>
                              {[2, 4, 6, 8].map((marker) => (
                                <div
                                  key={marker}
                                  className={styles.statMarker}
                                  style={{ left: `${(marker / 10) * 100}%` }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className={styles.statValue}>{value}</div>

                          {/* Add stat comparison indicator */}
                          <motion.div
                            className={styles.statComparison}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            style={{
                              color: value > 7 ? "#4ade80" : value < 5 ? "#f87171" : "#94a3b8",
                              backgroundColor:
                                value > 7
                                  ? "rgba(74, 222, 128, 0.2)"
                                  : value < 5
                                    ? "rgba(248, 113, 113, 0.2)"
                                    : "rgba(148, 163, 184, 0.2)",
                            }}
                          >
                            {value > 7 ? "High" : value < 5 ? "Low" : "Med"}
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      className={styles.interfacePreview}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {InterfaceComponent}
                    </motion.div>

                    <motion.div
                      className={styles.strengthsDescription}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <h4>Playstyle</h4>
                      <p>
                        The {safeFaction.name} excels at {getPlaystyleDescription(safeFaction.id)}. Their unique
                        mechanics allow for creative strategies and powerful combinations.
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                {activeTab === "lore" && (
                  <motion.div
                    key="lore"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={styles.loreTab}
                  >
                    <motion.div
                      className={styles.loreScroll}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      style={{ borderColor: safeColors.accent }}
                    >
                      <motion.div
                        className={styles.loreContent}
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.4, type: "spring" }}
                      >
                        <h3 style={{ color: safeColors.accent }}>Origins</h3>
                        <p>{factionLore[safeFaction.id as keyof typeof factionLore]}</p>

                        <h3 style={{ color: safeColors.accent }}>Philosophy</h3>
                        <p>
                          The {safeFaction.name} believes in {getFactionPhilosophy(safeFaction.id)}. This core belief
                          shapes their approach to the ongoing conflicts.
                        </p>

                        <h3 style={{ color: safeColors.accent }}>Notable Figures</h3>
                        <ul>
                          {getNotableFigures(safeFaction.id).map((figure, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                            >
                              <strong>{figure.name}:</strong> {figure.description}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
                {activeTab === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={styles.detailsTab}
                  >
                    {/* Signature Ability Section */}
                    <motion.div
                      className={styles.detailSection}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div
                        className={styles.sectionHeader}
                        onClick={() => setShowSignatureAbility(!showSignatureAbility)}
                        style={{ borderColor: safeColors.accent }}
                      >
                        <Sparkles size={18} color={safeColors.accent} />
                        <h3>Signature Ability</h3>
                        <motion.div animate={{ rotate: showSignatureAbility ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronDown size={18} />
                        </motion.div>
                      </div>

                      <AnimatePresence>
                        {showSignatureAbility && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={styles.sectionContent}
                          >
                            <div className={styles.abilityCard} style={{ borderColor: safeColors.accent }}>
                              <div className={styles.abilityHeader} style={{ backgroundColor: safeColors.primary }}>
                                <h4>
                                  {
                                    factionSignatureAbilities[safeFaction.id as keyof typeof factionSignatureAbilities]
                                      ?.name
                                  }
                                </h4>
                                <div className={styles.abilityCooldown}>
                                  {
                                    factionSignatureAbilities[safeFaction.id as keyof typeof factionSignatureAbilities]
                                      ?.cooldown
                                  }
                                </div>
                              </div>
                              <p>
                                {
                                  factionSignatureAbilities[safeFaction.id as keyof typeof factionSignatureAbilities]
                                    ?.description
                                }
                              </p>

                              <motion.div
                                className={styles.abilityGlow}
                                animate={{
                                  opacity: [0.3, 0.7, 0.3],
                                  scale: [1, 1.05, 1],
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatType: "mirror",
                                }}
                                style={{ backgroundColor: safeColors.accent }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Strategy Tips Section */}
                    <motion.div
                      className={styles.detailSection}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div
                        className={styles.sectionHeader}
                        onClick={() => setShowStrategyTips(!showStrategyTips)}
                        style={{ borderColor: safeColors.accent }}
                      >
                        <Brain size={18} color={safeColors.accent} />
                        <h3>Strategy Tips</h3>
                        <motion.div animate={{ rotate: showStrategyTips ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronDown size={18} />
                        </motion.div>
                      </div>

                      <AnimatePresence>
                        {showStrategyTips && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={styles.sectionContent}
                          >
                            <ul className={styles.strategyList}>
                              {(factionStrategyTips[safeFaction.id as keyof typeof factionStrategyTips] || []).map(
                                (tip, index) => (
                                  <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className={styles.strategyTip}
                                  >
                                    <div className={styles.tipIcon} style={{ backgroundColor: safeColors.accent }}>
                                      {index + 1}
                                    </div>
                                    <p>{tip}</p>
                                  </motion.li>
                                ),
                              )}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Faction Relationships Section */}
                    <motion.div
                      className={styles.detailSection}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div
                        className={styles.sectionHeader}
                        onClick={() => setShowRelationships(!showRelationships)}
                        style={{ borderColor: safeColors.accent }}
                      >
                        <Users size={18} color={safeColors.accent} />
                        <h3>Faction Relationships</h3>
                        <motion.div animate={{ rotate: showRelationships ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronDown size={18} />
                        </motion.div>
                      </div>

                      <AnimatePresence>
                        {showRelationships && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={styles.sectionContent}
                          >
                            <div className={styles.relationshipsContainer}>
                              {/* Allies */}
                              <div className={styles.relationshipGroup}>
                                <h4 className={styles.relationshipType} style={{ color: "#4ade80" }}>
                                  Allies
                                </h4>
                                <div className={styles.relationshipFactions}>
                                  {(
                                    factionRelationships[safeFaction.id as keyof typeof factionRelationships]?.allies ||
                                    []
                                  ).length > 0 ? (
                                    (
                                      factionRelationships[safeFaction.id as keyof typeof factionRelationships]
                                        ?.allies || []
                                    ).map((allyId, index) => (
                                      <motion.div
                                        key={index}
                                        className={styles.relationshipBadge}
                                        style={{ backgroundColor: "rgba(74, 222, 128, 0.2)", borderColor: "#4ade80" }}
                                        whileHover={{ scale: 1.05 }}
                                      >
                                        {formatFactionName(allyId)}
                                      </motion.div>
                                    ))
                                  ) : (
                                    <div className={styles.emptyRelationship}>No known allies</div>
                                  )}
                                </div>
                              </div>

                              {/* Enemies */}
                              <div className={styles.relationshipGroup}>
                                <h4 className={styles.relationshipType} style={{ color: "#f87171" }}>
                                  Enemies
                                </h4>
                                <div className={styles.relationshipFactions}>
                                  {(
                                    factionRelationships[safeFaction.id as keyof typeof factionRelationships]
                                      ?.enemies || []
                                  ).length > 0 ? (
                                    (
                                      factionRelationships[safeFaction.id as keyof typeof factionRelationships]
                                        ?.enemies || []
                                    ).map((enemyId, index) => (
                                      <motion.div
                                        key={index}
                                        className={styles.relationshipBadge}
                                        style={{ backgroundColor: "rgba(248, 113, 113, 0.2)", borderColor: "#f87171" }}
                                        whileHover={{ scale: 1.05 }}
                                      >
                                        {formatFactionName(enemyId)}
                                      </motion.div>
                                    ))
                                  ) : (
                                    <div className={styles.emptyRelationship}>No known enemies</div>
                                  )}
                                </div>
                              </div>

                              {/* Neutral */}
                              <div className={styles.relationshipGroup}>
                                <h4 className={styles.relationshipType} style={{ color: "#94a3b8" }}>
                                  Neutral
                                </h4>
                                <div className={styles.relationshipFactions}>
                                  {(
                                    factionRelationships[safeFaction.id as keyof typeof factionRelationships]
                                      ?.neutral || []
                                  ).length > 0 ? (
                                    (
                                      factionRelationships[safeFaction.id as keyof typeof factionRelationships]
                                        ?.neutral || []
                                    ).map((neutralId, index) => (
                                      <motion.div
                                        key={index}
                                        className={styles.relationshipBadge}
                                        style={{ backgroundColor: "rgba(148, 163, 184, 0.2)", borderColor: "#94a3b8" }}
                                        whileHover={{ scale: 1.05 }}
                                      >
                                        {formatFactionName(neutralId)}
                                      </motion.div>
                                    ))
                                  ) : (
                                    <div className={styles.emptyRelationship}>No neutral relationships</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={styles.selectButtonWrapper}
            >
              <Button
                className={styles.selectButton}
                style={{
                  backgroundColor: safeColors.primary,
                  borderColor: safeColors.accent,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onSelect}
              >
                <motion.span
                  className={styles.selectText}
                  animate={{
                    scale: isHovered ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "loop",
                  }}
                >
                  {isHovered ? "Confirm Selection" : "Choose Faction"}
                </motion.span>

                {/* Button glow effect */}
                {isHovered && (
                  <motion.span
                    className={styles.buttonGlow}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ backgroundColor: safeColors.accent }}
                  />
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className={styles.cardSection}
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            delay: 0.3,
          }}
        >
          {/* Card floating animation */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 2, 0, -2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
            }}
          >
            {ExampleCard}

            {/* Card glow effect */}
            <motion.div
              className={styles.cardGlow}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
              }}
              style={{ backgroundColor: safeColors.primary }}
            />
          </motion.div>

          {/* Enhanced particle effects */}
          <div className={styles.particleContainer}>
            {/* Standard particles */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className={styles.particle}
                initial={{
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 200 - 100,
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  x: Math.random() * 300 - 150,
                  y: Math.random() * 300 - 150,
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 5,
                }}
                style={{ backgroundColor: safeColors.accent }}
              />
            ))}

            {/* Faction-specific particles */}
            {safeFaction.id === "cybernetic-nexus" &&
              Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`cyber-${i}`}
                  className={styles.dataParticle}
                  initial={{
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                    opacity: 0,
                  }}
                  animate={{
                    x: Math.random() * 300 - 150,
                    y: Math.random() * 300 - 150,
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 5,
                  }}
                >
                  {Math.random() > 0.5 ? "1" : "0"}
                </motion.div>
              ))}

            {safeFaction.id === "void-harbingers" &&
              Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`void-${i}`}
                  className={styles.voidRift}
                  initial={{
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                    opacity: 0,
                    scale: 0,
                    rotate: Math.random() * 360,
                  }}
                  animate={{
                    x: Math.random() * 300 - 150,
                    y: Math.random() * 300 - 150,
                    opacity: [0, 0.6, 0],
                    scale: [0, 1, 0],
                    rotate: [Math.random() * 360, Math.random() * 360 + 180],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 5,
                  }}
                  style={{
                    backgroundColor: "transparent",
                    borderColor: safeColors.accent,
                  }}
                />
              ))}

            {safeFaction.id === "primordial-ascendancy" &&
              Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`leaf-${i}`}
                  className={styles.leafParticle}
                  initial={{
                    x: Math.random() * 200 - 100,
                    y: -20,
                    opacity: 0,
                    rotate: 0,
                  }}
                  animate={{
                    x: [Math.random() * 200 - 100, Math.random() * 300 - 150],
                    y: [0, 300],
                    opacity: [0, 0.8, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 5 + Math.random() * 5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 5,
                    ease: "easeInOut",
                  }}
                  style={{
                    backgroundColor: `hsl(${110 + Math.random() * 40}, 70%, 40%)`,
                  }}
                />
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/**
 * Returns a description of the playstyle associated with a given faction.
 *
 * @param factionId - The unique identifier of the faction.
 * @returns A string describing the faction's typical playstyle, or "balanced gameplay" if the faction is unrecognized.
 */
function getPlaystyleDescription(factionId: string): string {
  if (!factionId) return "balanced gameplay"

  const playstyles = {
    "cybernetic-nexus": "resource manipulation and strategic planning",
    "primordial-ascendancy": "growth mechanics and overwhelming opponents with numbers",
    "eclipsed-order": "stealth tactics and targeted elimination",
    "celestial-dominion": "controlling the flow of time and predicting opponent moves",
    titanborn: "defensive positioning and powerful counter-attacks",
    "void-harbingers": "disruption and reality manipulation",
  }

  return playstyles[factionId as keyof typeof playstyles] || "balanced gameplay"
}

/**
 * Returns the core philosophical belief of a faction based on its ID.
 *
 * @param factionId - The unique identifier of the faction.
 * @returns The faction's philosophy as a descriptive string, or a default value if the ID is unrecognized.
 */
function getFactionPhilosophy(factionId: string): string {
  if (!factionId) return "maintaining balance"

  const philosophies = {
    "cybernetic-nexus": "the inevitable fusion of organic and synthetic consciousness",
    "primordial-ascendancy": "maintaining balance with the natural order and respecting ancient cycles",
    "eclipsed-order": "controlling from the shadows and eliminating threats before they arise",
    "celestial-dominion": "transcending mortal limitations through cosmic enlightenment",
    titanborn: "honoring ancestral strength and forging one's destiny through trial",
    "void-harbingers": "embracing chaos as the true nature of reality",
  }

  return philosophies[factionId as keyof typeof philosophies] || "maintaining balance"
}

/**
 * Returns a list of notable figures for the specified faction.
 *
 * @param factionId - The unique identifier of the faction.
 * @returns An array of objects containing the name and description of each notable figure, or an empty array if none are found.
 */
function getNotableFigures(factionId: string): Array<{ name: string; description: string }> {
  if (!factionId) return []

  const figures = {
    "cybernetic-nexus": [
      {
        name: "Nexus Prime",
        description: "The first successful human-AI hybrid, now guiding the faction's evolution.",
      },
      { name: "Dr. Eliza Voss", description: "Creator of the neural interface technology that defines the faction." },
      {
        name: "Cipher",
        description: "A mysterious entity existing purely in digital space, believed to be an emergent AI.",
      },
    ],
    "primordial-ascendancy": [
      { name: "Elder Thorne", description: "Ancient shaman who communes with the oldest spirits of the forest." },
      { name: "Gaia's Voice", description: "A collective consciousness formed by thousands of plant entities." },
      {
        name: "Rootwalker Vex",
        description: "Half-human scout who can travel through root networks across continents.",
      },
    ],
    "eclipsed-order": [
      { name: "The Veiled One", description: "Leader whose identity remains unknown even to most Order members." },
      {
        name: "Crimson Blade",
        description: "Legendary assassin responsible for altering the course of three major wars.",
      },
      { name: "Whisper", description: "Master of infiltration who has never failed a mission in 30 years." },
    ],
    "celestial-dominion": [
      { name: "Chronos Seer", description: "Prophet who can glimpse multiple timelines and possible futures." },
      { name: "Astral Weaver", description: "Cosmic entity who takes human form to guide the Dominion." },
      { name: "Time Keeper Zara", description: "Guardian of the Celestial Archives containing all recorded history." },
    ],
    titanborn: [
      { name: "Forge Lord Krag", description: "Descendant of the mountain titan Brokk, master of the Star Forge." },
      {
        name: "Stone Heart",
        description: "Warrior whose skin turned to living stone after surviving a volcanic trial.",
      },
      { name: "Rune Carver Thrain", description: "Keeper of ancient titan knowledge encoded in living runes." },
    ],
    "void-harbingers": [
      {
        name: "The Fractured One",
        description: "Being split across multiple realities who perceives all simultaneously.",
      },
      { name: "Void Walker Null", description: "First human to survive crossing the dimensional threshold." },
      { name: "Professor Eternity", description: "Scientist whose consciousness exists outside normal time." },
    ],
  }

  return figures[factionId as keyof typeof figures] || []
}

/**
 * Converts a hyphen-separated faction ID into a human-readable, title-cased name.
 *
 * @param factionId - The hyphen-separated identifier of the faction.
 * @returns The formatted faction name, or the original string if formatting fails.
 */
function formatFactionName(factionId: string): string {
  if (!factionId) return ""

  try {
    return factionId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  } catch (error) {
    return factionId // Return the original string if any error occurs
  }
}
