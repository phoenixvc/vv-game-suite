"use client"

import type React from "react"
import { useState, useEffect } from "react"
import styles from "../../styles/animations.module.css"

interface PrimordialInterfaceProps {
  children?: React.ReactNode
  title?: string
  className?: string
}

export const PrimordialInterface: React.FC<PrimordialInterfaceProps> = ({
  children,
  title = "Primordial Interface",
  className = "",
}) => {
  const [loaded, setLoaded] = useState(false)
  const [energyLevel, setEnergyLevel] = useState(0)

  // Simulate energy level fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyLevel((prev) => {
        const newValue = prev + (Math.random() * 2 - 1) * 5
        return Math.max(0, Math.min(100, newValue))
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Simulate loading sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`relative rounded-lg overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(135deg, #0f1b0e 0%, #1a2f1c 100%)",
        boxShadow: "0 10px 25px rgba(0, 50, 0, 0.2), inset 0 0 20px rgba(34, 197, 94, 0.2)",
      }}
    >
      {/* Organic border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.3) 0%, transparent 70%)",
          opacity: 0.7,
        }}
      />

      {/* Vine decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top left vine */}
        <div
          className={`absolute top-0 left-0 w-24 h-24 ${styles.float}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 Q30,20 20,40 Q10,60 30,80 Q40,90 60,100' stroke='rgba(34, 197, 94, 0.6)' fill='none' strokeWidth='3'/%3E%3Cpath d='M20,40 Q30,35 40,45' stroke='rgba(34, 197, 94, 0.6)' fill='none' strokeWidth='2'/%3E%3Cpath d='M30,80 Q40,70 50,85' stroke='rgba(34, 197, 94, 0.6)' fill='none' strokeWidth='2'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            animationDuration: "8s",
          }}
        />

        {/* Bottom right vine */}
        <div
          className={`absolute bottom-0 right-0 w-24 h-24 ${styles.float}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100,100 Q70,80 80,60 Q90,40 70,20 Q60,10 40,0' stroke='rgba(34, 197, 94, 0.6)' fill='none' strokeWidth='3'/%3E%3Cpath d='M80,60 Q70,65 60,55' stroke='rgba(34, 197, 94, 0.6)' fill='none' strokeWidth='2'/%3E%3Cpath d='M70,20 Q60,30 50,15' stroke='rgba(34, 197, 94, 0.6)' fill='none' strokeWidth='2'/%3E%3C/svg%3E")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            animationDuration: "7s",
          }}
        />
      </div>

      {/* Interface header */}
      <div
        className="relative z-10 p-4 border-b border-green-700"
        style={{
          background: "linear-gradient(to right, rgba(22, 101, 52, 0.8), rgba(22, 101, 52, 0.4))",
        }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-green-100" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
            {title}
          </h2>

          {/* Energy indicator */}
          <div className="flex items-center space-x-2">
            <div className="text-xs text-green-200">Energy</div>
            <div
              className="w-24 h-3 bg-green-900 rounded-full overflow-hidden"
              style={{ border: "1px solid rgba(34, 197, 94, 0.5)" }}
            >
              <div
                className="h-full transition-all duration-1000 ease-in-out"
                style={{
                  width: `${energyLevel}%`,
                  background: `linear-gradient(to right, #22c55e, ${energyLevel > 70 ? "#4ade80" : "#22c55e"})`,
                  boxShadow: energyLevel > 70 ? "0 0 10px rgba(74, 222, 128, 0.5)" : "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loading animation */}
      {!loaded ? (
        <div className="flex flex-col items-center justify-center p-8 h-64">
          <div
            className="w-16 h-16 mb-4"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2322c55e' strokeWidth='2'%3E%3Cpath d='M32,4 L32,16 M32,48 L32,60 M4,32 L16,32 M48,32 L60,32 M12,12 L20,20 M44,44 L52,52 M12,52 L20,44 M44,20 L52,12'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 32 32' to='360 32 32' dur='3s' repeatCount='indefinite'/%3E%3C/path%3E%3Ccircle cx='32' cy='32' r='16'%3E%3Canimate attributeName='r' values='16;18;16' dur='2s' repeatCount='indefinite'/%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="text-green-300 text-sm">Connecting to natural energies...</div>
        </div>
      ) : (
        <div className="relative z-10 p-4">{children}</div>
      )}

      {/* Interface footer */}
      <div
        className="relative z-10 p-3 border-t border-green-700 flex justify-between items-center text-xs text-green-300"
        style={{
          background: "linear-gradient(to right, rgba(22, 101, 52, 0.4), rgba(22, 101, 52, 0.8))",
        }}
      >
        <div>Primordial Ascendancy</div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${energyLevel > 50 ? "bg-green-400" : "bg-green-700"}`}
            style={{
              boxShadow: energyLevel > 50 ? "0 0 5px rgba(74, 222, 128, 0.8)" : "none",
            }}
          />
          <div>Natural Connection: {energyLevel > 70 ? "Strong" : energyLevel > 30 ? "Stable" : "Weak"}</div>
        </div>
      </div>
    </div>
  )
}

export default PrimordialInterface
