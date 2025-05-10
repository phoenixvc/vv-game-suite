"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Unlock, Shield, Database, CreditCard, RefreshCw } from "lucide-react"

export default function VaultVisualization() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4)
    }, 3000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const steps = [
    {
      title: "Secure Storage",
      description: "Your cards are securely stored on the blockchain, ensuring true ownership and authenticity.",
      icon: <Lock className="h-12 w-12 text-blue-400" />,
    },
    {
      title: "Trading Platform",
      description: "Exchange cards with other players through our secure trading platform with verified transactions.",
      icon: <RefreshCw className="h-12 w-12 text-green-400" />,
    },
    {
      title: "Fraud Protection",
      description: "Advanced security measures protect against counterfeit cards and fraudulent transactions.",
      icon: <Shield className="h-12 w-12 text-purple-400" />,
    },
    {
      title: "Easy Access",
      description: "Access your collection anytime, anywhere, with no cryptocurrency knowledge required.",
      icon: <Unlock className="h-12 w-12 text-yellow-400" />,
    },
  ]

  return (
    <div className="relative rounded-xl bg-gray-800 bg-opacity-50 p-6">
      <div className="absolute right-4 top-4 flex space-x-2">
        {steps.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-colors ${step === index ? "bg-blue-500" : "bg-gray-600"}`}
            onClick={() => {
              setStep(index)
              setIsPlaying(false)
            }}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
        <button
          className={`ml-2 rounded-full p-1 ${isPlaying ? "bg-blue-500 text-white" : "bg-gray-600 text-gray-300"}`}
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause animation" : "Play animation"}
        >
          {isPlaying ? (
            <span className="block h-2 w-2 rounded-sm bg-white"></span>
          ) : (
            <span className="block h-0 w-0 border-y-4 border-r-0 border-l-4 border-y-transparent border-l-white"></span>
          )}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-8 md:flex-row md:items-start md:py-12">
        <div className="mb-8 flex w-full max-w-md flex-col items-center justify-center md:mb-0 md:mr-8 md:w-1/2">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-700">
                {steps[step].icon}
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">{steps[step].title}</h3>
              <p className="text-gray-300">{steps[step].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative h-[300px] w-full max-w-md overflow-hidden rounded-lg border-2 border-gray-700 bg-gray-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex h-64 w-48 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-blue-900 to-purple-900 p-4 shadow-xl">
              <div className="absolute inset-0 opacity-20">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              <Database className="mb-4 h-12 w-12 text-blue-300" />
              <div className="mb-2 text-center text-lg font-bold text-white">Card Vault</div>
              <div className="mb-4 text-center text-xs text-blue-200">Blockchain Secured</div>

              <div className="mt-2 flex w-full flex-col space-y-2">
                <div className="flex items-center justify-between rounded bg-blue-800 bg-opacity-30 px-2 py-1">
                  <span className="text-xs text-blue-200">Cards</span>
                  <span className="text-xs font-bold text-white">142</span>
                </div>
                <div className="flex items-center justify-between rounded bg-blue-800 bg-opacity-30 px-2 py-1">
                  <span className="text-xs text-blue-200">Rarity</span>
                  <span className="text-xs font-bold text-white">★★★☆☆</span>
                </div>
                <div className="flex items-center justify-between rounded bg-blue-800 bg-opacity-30 px-2 py-1">
                  <span className="text-xs text-blue-200">Value</span>
                  <span className="text-xs font-bold text-white">$1,240</span>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-xs text-green-300">Verified</span>
              </div>
            </div>
          </div>

          {/* Animated elements */}
          <AnimatePresence>
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-blue-500 bg-opacity-10"></div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  className="rounded-full bg-blue-500 bg-opacity-20 p-8"
                >
                  <Lock className="h-8 w-8 text-blue-400" />
                </motion.div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-green-500 bg-opacity-10"></div>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "linear" }}
                  className="rounded-full bg-green-500 bg-opacity-20 p-8"
                >
                  <RefreshCw className="h-8 w-8 text-green-400" />
                </motion.div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-purple-500 bg-opacity-10"></div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  className="rounded-full bg-purple-500 bg-opacity-20 p-8"
                >
                  <Shield className="h-8 w-8 text-purple-400" />
                </motion.div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-yellow-500 bg-opacity-10"></div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                  className="rounded-full bg-yellow-500 bg-opacity-20 p-8"
                >
                  <CreditCard className="h-8 w-8 text-yellow-400" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
