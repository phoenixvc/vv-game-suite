"use client"

import type React from "react"

import { useState, useEffect } from "react"
import styles from "@/styles/animations.module.css"

export default function CyberneticInterface({
  title,
  children,
  className = "",
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  const [bootSequence, setBootSequence] = useState(true)
  const [bootProgress, setBootProgress] = useState(0)
  const [systemMessages, setSystemMessages] = useState<string[]>([])

  // Simulate boot sequence
  useEffect(() => {
    if (!bootSequence) return

    const messages = [
      "Initializing system...",
      "Loading core modules...",
      "Establishing neural link...",
      "Calibrating interface...",
      "Scanning for threats...",
      "Optimizing data streams...",
      "System ready.",
    ]

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < messages.length) {
        setSystemMessages((prev) => [...prev, messages[currentIndex]])
        setBootProgress(((currentIndex + 1) / messages.length) * 100)
        currentIndex++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setBootSequence(false)
        }, 1000)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [bootSequence])

  if (bootSequence) {
    return (
      <div className={`bg-slate-900 border border-cyan-800 rounded-lg p-6 text-cyan-400 font-mono ${className}`}>
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">CYBERNETIC NEXUS OS v3.7.2</h2>
          <div className="text-xs">BOOT SEQUENCE</div>
        </div>

        <div className="space-y-2 mb-6">
          {systemMessages.map((message, index) => (
            <div key={index} className="flex">
              <span className="text-cyan-600 mr-2">&gt;</span>
              <span>{message}</span>
            </div>
          ))}
        </div>

        <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
          <div
            className="bg-cyan-500 h-2 rounded-full"
            style={{ width: `${bootProgress}%`, transition: "width 0.5s ease-in-out" }}
          ></div>
        </div>

        <div className="text-xs text-center text-cyan-600">{bootProgress < 100 ? "LOADING..." : "COMPLETE"}</div>
      </div>
    )
  }

  return (
    <div className={`bg-slate-900 border border-cyan-800 rounded-lg overflow-hidden ${className}`}>
      {/* Interface Header */}
      <div className="bg-slate-800 px-4 py-3 border-b border-cyan-900 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-cyan-400 mr-2 animate-pulse"></div>
          <h2 className="text-cyan-400 font-bold uppercase tracking-wider">{title}</h2>
        </div>
        <div className="flex space-x-2">
          <div className="text-xs bg-slate-700 px-2 py-1 rounded text-cyan-300 font-mono">SYS:ONLINE</div>
          <div className="text-xs bg-slate-700 px-2 py-1 rounded text-cyan-300 font-mono">SEC:ACTIVE</div>
        </div>
      </div>

      {/* Interface Content */}
      <div className="p-4">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="#0ea5e9" strokeWidth="2" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="#0ea5e9" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="#0ea5e9" strokeWidth="1" fill="none" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#0ea5e9" strokeWidth="1" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="#0ea5e9" strokeWidth="1" />
          </svg>
        </div>

        {/* Main Content */}
        <div className="relative z-10">{children}</div>
      </div>

      {/* Interface Footer */}
      <div className="bg-slate-800 px-4 py-2 border-t border-cyan-900 flex justify-between items-center text-xs text-slate-400">
        <div>CYBERNETIC NEXUS • SECURE CONNECTION</div>
        <div className={styles.pulse}>
          <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full mr-1"></span>
          SYSTEM ACTIVE
        </div>
      </div>
    </div>
  )
}
