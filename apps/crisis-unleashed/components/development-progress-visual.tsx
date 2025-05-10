"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Circle, Clock, Calendar, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const milestones = [
  {
    title: "Alpha Release",
    date: "January 2025",
    description: "Initial release with core gameplay mechanics and basic faction implementation.",
    status: "completed",
    features: ["Core card mechanics", "Basic faction abilities", "Single-player mode", "Tutorial system"],
    position: "left",
  },
  {
    title: "Beta Release",
    date: "March 2025",
    description: "Expanded gameplay with multiplayer functionality and enhanced faction features.",
    status: "completed",
    features: [
      "Multiplayer functionality",
      "Enhanced faction abilities",
      "Card trading system",
      "Basic blockchain integration",
    ],
    position: "right",
  },
  {
    title: "Full Release",
    date: "May 2025",
    description: "Official launch with complete feature set and polished gameplay experience.",
    status: "in-progress",
    features: [
      "Complete card collection",
      "Advanced faction mechanics",
      "Tournament system",
      "Full blockchain integration",
      "Mobile app release",
    ],
    position: "left",
  },
  {
    title: "Expansion 1: Dimensional Rift",
    date: "August 2025",
    description: "First major expansion introducing new factions and gameplay mechanics.",
    status: "planned",
    features: [
      "Two new factions",
      "Dimensional rift mechanics",
      "New card types",
      "Enhanced visual effects",
      "Cross-platform progression",
    ],
    position: "right",
  },
  {
    title: "Expansion 2: Eternal Conflict",
    date: "November 2025",
    description: "Second expansion focusing on PvP and competitive gameplay.",
    status: "planned",
    features: ["Ranked ladder system", "Seasonal rewards", "Competitive balancing", "Spectator mode", "Replay system"],
    position: "left",
  },
  {
    title: "Community Creation Tools",
    date: "February 2026",
    description: "Release of tools allowing players to create and share custom content.",
    status: "planned",
    features: [
      "Card creator studio",
      "Custom game modes",
      "Community marketplace",
      "Content voting system",
      "Creator rewards program",
    ],
    position: "right",
  },
]

/**
 * Displays an interactive development roadmap timeline with animated milestones and game victory condition cards.
 *
 * Users can view project milestones, expand or collapse milestone details, and see key features for each milestone. The component visually distinguishes milestone status and allows toggling between expanded and collapsed views for all milestones. Game victory conditions are presented in styled cards below the timeline.
 */
export default function DevelopmentProgressVisual() {
  const [activeMilestone, setActiveMilestone] = useState(2) // Default to the in-progress milestone
  const [showAllFeatures, setShowAllFeatures] = useState(false)
  const [expandedMilestones, setExpandedMilestones] = useState<number[]>([2]) // Start with in-progress expanded

  const toggleMilestoneExpansion = (index: number) => {
    setExpandedMilestones((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="rounded-xl bg-gray-900/80 border border-gray-800 p-4">
      <h3 className="mb-4 text-center text-2xl font-bold text-white">Development Roadmap</h3>

      <div className="relative mb-6">
        {/* Timeline line */}
        <div className="absolute left-0 top-0 h-full w-px bg-gray-700 md:left-1/2"></div>

        {/* Milestones */}
        {milestones.map((milestone, index) => (
          <div
            key={milestone.title}
            className={`relative mb-6 ${
              milestone.position === "left" ? "md:text-right md:pr-6" : "md:pl-6 md:ml-auto"
            }`}
            style={{ width: "calc(50% - 1px)" }}
          >
            {/* Timeline dot */}
            <div
              className={`absolute ${
                milestone.position === "left"
                  ? "right-0 md:left-auto md:right-0 translate-x-1/2"
                  : "left-0 md:left-0 -translate-x-1/2"
              } top-3 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-colors md:left-1/2 ${
                activeMilestone === index
                  ? "bg-blue-500"
                  : milestone.status === "completed"
                    ? "bg-green-500"
                    : milestone.status === "in-progress"
                      ? "bg-yellow-500"
                      : "bg-gray-600"
              }`}
              onClick={() => setActiveMilestone(index)}
            >
              {milestone.status === "completed" ? (
                <CheckCircle className="h-5 w-5 text-white" />
              ) : milestone.status === "in-progress" ? (
                <Clock className="h-5 w-5 text-white" />
              ) : (
                <Circle className="h-5 w-5 text-white" />
              )}
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0.8, y: 5 }}
              animate={activeMilestone === index ? { opacity: 1, y: 0, scale: 1.02 } : { opacity: 0.8, y: 5, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "cursor-pointer rounded-lg p-3 transition-colors",
                activeMilestone === index ? "bg-gray-800 border border-gray-700" : "bg-gray-900 hover:bg-gray-800",
              )}
              onClick={() => toggleMilestoneExpansion(index)}
            >
              <div className="mb-1 flex items-center justify-between">
                <h4
                  className={`text-base font-bold ${
                    milestone.status === "completed"
                      ? "text-green-400"
                      : milestone.status === "in-progress"
                        ? "text-yellow-400"
                        : "text-gray-400"
                  }`}
                >
                  {milestone.title}
                </h4>
                <div className="flex items-center text-xs text-gray-400">
                  <Calendar className="mr-1 h-3 w-3" />
                  {milestone.date}
                </div>
              </div>
              <p className="mb-2 text-sm text-gray-300">{milestone.description}</p>

              <div className="flex justify-between items-center">
                <div className="text-xs text-blue-400">
                  {expandedMilestones.includes(index) ? "Click to collapse" : "Click to expand"}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMilestoneExpansion(index)
                  }}
                >
                  {expandedMilestones.includes(index) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {expandedMilestones.includes(index) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 pt-2 border-t border-gray-700"
                >
                  <h5 className="mb-2 text-xs font-semibold text-blue-400">Key Features:</h5>
                  <ul className="list-inside list-disc space-y-1 text-xs text-gray-300">
                    {milestone.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>

                  {/* Interactive elements */}
                  {activeMilestone === index && (
                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 h-7 px-2"
                      >
                        <span>Learn more</span>
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Connector line for visual effect */}
              {milestone.position === "left" && (
                <div className="absolute -right-3 top-3 h-0.5 w-3 bg-gray-600 md:block hidden"></div>
              )}
              {milestone.position === "right" && (
                <div className="absolute -left-3 top-3 h-0.5 w-3 bg-gray-600 md:block hidden"></div>
              )}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Toggle to show all features */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (showAllFeatures) {
              setExpandedMilestones([activeMilestone])
            } else {
              setExpandedMilestones(milestones.map((_, i) => i))
            }
            setShowAllFeatures(!showAllFeatures)
          }}
          className="text-xs"
        >
          {showAllFeatures ? "Collapse All Milestones" : "Expand All Milestones"}
        </Button>
      </div>

      {/* Victory condition cards */}
      <div className="mt-6 border-t border-gray-700 pt-4">
        <h4 className="mb-3 text-center text-base font-semibold text-white">Game Victory Conditions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gray-800 rounded-lg p-3 border border-blue-900/50">
            <h5 className="font-bold text-sm text-blue-400 mb-1">Territory Domination</h5>
            <p className="text-xs text-gray-300">Control the majority of territory zones for 3 consecutive turns.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-purple-900/50">
            <h5 className="font-bold text-sm text-purple-400 mb-1">Resource Supremacy</h5>
            <p className="text-xs text-gray-300">Accumulate 30 total resources across all resource types.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-red-900/50">
            <h5 className="font-bold text-sm text-red-400 mb-1">Faction Elimination</h5>
            <p className="text-xs text-gray-300">Defeat all enemy hero cards on the battlefield.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
