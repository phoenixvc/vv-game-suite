"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, Clock, ArrowRight, ExternalLink } from "lucide-react"

interface RoadmapItem {
  title: string
  date: string
  description: string
  status: "completed" | "in-progress" | "upcoming"
  features?: string[]
  link?: string
}

const roadmapItems: RoadmapItem[] = [
  {
    title: "Alpha Release",
    date: "January 2025",
    description: "Initial release with core gameplay mechanics and basic faction implementation.",
    status: "completed",
    features: ["Core card system", "Basic faction themes", "Single player mode", "Card designer tool"],
  },
  {
    title: "Beta Release",
    date: "March 2025",
    description: "Expanded gameplay with multiplayer functionality and enhanced faction features.",
    status: "in-progress",
    features: [
      "Multiplayer functionality",
      "Enhanced faction abilities",
      "Card trading system",
      "Basic blockchain integration",
    ],
    link: "/roadmap/beta",
  },
  {
    title: "Deck Builder",
    date: "June 2025",
    description: "Advanced deck building with synergy analysis and strategy recommendations.",
    status: "upcoming",
    features: ["Synergy visualization", "Strategy recommendations", "Deck sharing", "Tournament preparation tools"],
  },
  {
    title: "Full Release",
    date: "September 2025",
    description: "Complete game with all planned features and competitive play support.",
    status: "upcoming",
    features: [
      "All factions implemented",
      "Competitive ranking system",
      "Mobile app integration",
      "Community marketplace",
    ],
  },
]

export function DevelopmentRoadmap() {
  const [expandedItem, setExpandedItem] = useState<number | null>(1) // Default to showing Beta Release details

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="p-6 pb-2">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Development Roadmap</h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />

          {/* Roadmap items */}
          <div className="space-y-1">
            {roadmapItems.map((item, index) => (
              <div key={index} className="relative">
                {/* Timeline node */}
                <div
                  className={cn(
                    "absolute left-4 top-6 w-4 h-4 rounded-full transform -translate-x-1/2 z-10",
                    item.status === "completed"
                      ? "bg-green-500"
                      : item.status === "in-progress"
                        ? "bg-blue-500"
                        : "bg-gray-500",
                  )}
                />

                {/* Item content */}
                <div
                  className={cn(
                    "ml-8 p-4 rounded-lg transition-all duration-200 cursor-pointer",
                    expandedItem === index ? "bg-gray-800" : "hover:bg-gray-800/50",
                  )}
                  onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {item.status === "completed" ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : item.status === "in-progress" ? (
                        <Clock className="h-4 w-4 text-blue-500 mr-2" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      )}
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    </div>
                    <div className="text-sm text-gray-400">{item.date}</div>
                  </div>

                  <p className="text-gray-300 mt-1 text-sm">{item.description}</p>

                  {/* Expanded content */}
                  {expandedItem === index && item.features && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h4 className="text-sm font-medium text-blue-400 mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {item.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {item.link && (
                        <a
                          href={item.link}
                          className="inline-flex items-center mt-4 text-sm text-blue-400 hover:text-blue-300"
                        >
                          Learn more <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
