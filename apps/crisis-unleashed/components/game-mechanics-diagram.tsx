"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Cpu, Zap, Database, Box, AlertTriangle, Users, Map, Shield, Sword, RotateCw, Layers } from "lucide-react"

export default function GameMechanicsDiagram() {
  const [activeNode, setActiveNode] = useState<string | null>(null)

  const nodes = [
    {
      id: "resources",
      label: "Resources",
      icon: <Database className="h-6 w-6" />,
      position: { x: 50, y: 50 },
      connections: ["cards", "abilities", "territory"],
      description: "Gather and manage Energy, Materials, and Information to power your faction's strategy.",
    },
    {
      id: "cards",
      label: "Cards",
      icon: <Layers className="h-6 w-6" />,
      position: { x: 25, y: 25 },
      connections: ["heroes", "artifacts", "crisis"],
      description: "Deploy Heroes, Artifacts, and Crisis cards to execute your strategy.",
    },
    {
      id: "heroes",
      label: "Heroes",
      icon: <Users className="h-6 w-6" />,
      position: { x: 15, y: 40 },
      connections: ["abilities", "territory"],
      description: "Powerful characters with unique abilities that can turn the tide of battle.",
    },
    {
      id: "artifacts",
      label: "Artifacts",
      icon: <Box className="h-6 w-6" />,
      position: { x: 35, y: 40 },
      connections: ["abilities", "heroes"],
      description: "Equippable items and structures that provide ongoing benefits or abilities.",
    },
    {
      id: "crisis",
      label: "Crisis Events",
      icon: <AlertTriangle className="h-6 w-6" />,
      position: { x: 25, y: 60 },
      connections: ["resources", "territory"],
      description: "Game-changing events that create both challenges and opportunities for all players.",
    },
    {
      id: "abilities",
      label: "Abilities",
      icon: <Zap className="h-6 w-6" />,
      position: { x: 75, y: 25 },
      connections: ["resources", "territory"],
      description: "Special powers and actions that can be activated by spending resources.",
    },
    {
      id: "territory",
      label: "Territory",
      icon: <Map className="h-6 w-6" />,
      position: { x: 75, y: 75 },
      connections: ["resources", "victory"],
      description: "Control zones on the game board to gain resource bonuses and strategic advantages.",
    },
    {
      id: "factions",
      label: "Factions",
      icon: <Cpu className="h-6 w-6" />,
      position: { x: 50, y: 85 },
      connections: ["abilities", "cards"],
      description: "Choose from six unique factions, each with distinct playstyles and mechanics.",
    },
    {
      id: "attack",
      label: "Attack",
      icon: <Sword className="h-6 w-6" />,
      position: { x: 85, y: 40 },
      connections: ["heroes", "territory"],
      description: "Launch offensives against opponents to claim territory and eliminate their heroes.",
    },
    {
      id: "defense",
      label: "Defense",
      icon: <Shield className="h-6 w-6" />,
      position: { x: 85, y: 60 },
      connections: ["heroes", "territory"],
      description: "Protect your territory and heroes from enemy attacks with strategic positioning.",
    },
    {
      id: "victory",
      label: "Victory",
      icon: <RotateCw className="h-6 w-6" />,
      position: { x: 50, y: 15 },
      connections: ["territory", "crisis"],
      description: "Achieve victory through territorial control, resource dominance, or crisis objectives.",
    },
  ]

  // Calculate positions based on percentages
  const getPosition = (node: (typeof nodes)[0]) => {
    return {
      left: `${node.position.x}%`,
      top: `${node.position.y}%`,
    }
  }

  // Find connections for a node
  const getConnections = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return []

    return node.connections.map((targetId) => {
      const target = nodes.find((n) => n.id === targetId)
      if (!target) return null

      const isActive = activeNode === nodeId || activeNode === targetId

      return (
        <svg key={`${nodeId}-${targetId}`} className="absolute left-0 top-0 h-full w-full pointer-events-none z-0">
          <line
            x1={`${node.position.x}%`}
            y1={`${node.position.y}%`}
            x2={`${target.position.x}%`}
            y2={`${target.position.y}%`}
            stroke={isActive ? "rgb(59, 130, 246)" : "rgba(255, 255, 255, 0.2)"}
            strokeWidth={isActive ? 3 : 1}
            strokeDasharray={isActive ? "none" : "5,5"}
          />
        </svg>
      )
    })
  }

  // Get all connections
  const allConnections = nodes.flatMap((node) => getConnections(node.id))

  return (
    <div className="relative h-[500px] w-full rounded-xl bg-gray-800 bg-opacity-50 p-4">
      {/* Connections */}
      {allConnections}

      {/* Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className={`absolute z-10 flex flex-col items-center transition-all duration-300 ${
            activeNode === node.id
              ? "scale-110"
              : activeNode && node.connections.includes(activeNode)
                ? "scale-105 opacity-100"
                : activeNode
                  ? "opacity-40"
                  : "opacity-100"
          }`}
          style={getPosition(node)}
          onMouseEnter={() => setActiveNode(node.id)}
          onMouseLeave={() => setActiveNode(null)}
          whileHover={{ scale: 1.1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              activeNode === node.id ? "bg-blue-600" : "bg-gray-700"
            } text-white shadow-lg transition-colors duration-300`}
          >
            {node.icon}
          </div>
          <div className="mt-2 text-center">
            <div className="font-medium text-white">{node.label}</div>
            {activeNode === node.id && (
              <motion.div
                className="mt-2 max-w-[200px] rounded bg-gray-800 p-2 text-xs text-gray-300"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {node.description}
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
