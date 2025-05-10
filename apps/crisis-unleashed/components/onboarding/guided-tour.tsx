"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useImagePreloader } from "@/hooks/use-image-preloader"
import { LogoVariant } from "@/components/logo-system/logo-variant"

interface GuidedTourProps {
  onClose: () => void
}

export function GuidedTour({ onClose }: GuidedTourProps) {
  const [step, setStep] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  const tourSteps = [
    {
      title: "Welcome to Crisis Unleashed",
      description:
        "Embark on a strategic journey where faction politics, resource management, and tactical card play collide.",
      subDescription:
        "This brief introduction will help you understand the core concepts of the game and get you started on your adventure.",
      image: "/guided-tour-welcome.png",
      alt: "Welcome to Crisis Unleashed",
      showLogo: true,
    },
    {
      title: "Card Types",
      description:
        "Crisis Unleashed features three main card types: Heroes, Artifacts, and Crisis Events. Each type serves a unique purpose in your strategy.",
      image: "/guided-tour-card-types.png",
      alt: "Different card types in Crisis Unleashed",
    },
    {
      title: "The Battlefield",
      description:
        "The battlefield is where the action happens. Deploy your cards strategically to control territory and outmaneuver your opponents.",
      image: "/guided-tour-battlefield.png",
      alt: "Crisis Unleashed battlefield layout",
    },
    {
      title: "Factions",
      description:
        "Choose from six unique factions, each with distinct abilities and playstyles. Your faction choice influences your strategy and available cards.",
      image: "/guided-tour-factions.png",
      alt: "The six factions of Crisis Unleashed",
    },
    {
      title: "Your Collection",
      description:
        "Build and manage your card collection. Trade with other players, craft new cards, and build powerful decks to dominate the battlefield.",
      image: "/guided-tour-collection.png",
      alt: "Card collection interface",
    },
  ]

  // Preload all images
  const imagesToPreload = tourSteps.map((step) => step.image)
  const { imagesPreloaded } = useImagePreloader(imagesToPreload)

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep((prev) => prev + 1)
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    if (step > 0) {
      setStep((prev) => prev - 1)
    }
  }

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "ArrowLeft") {
        handlePrevious()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [step])

  // Logo colors
  const primaryColor = "#2563eb" // blue-600
  const secondaryColor = "#06b6d4" // cyan-500
  const accentColor = "#60a5fa" // blue-400
  const bgColor = "#0f172a" // slate-900
  const textColor = "#f8fafc" // slate-50

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 ${
        isExiting ? "pointer-events-none" : ""
      }`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-gray-900 shadow-2xl"
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          aria-label="Close guided tour"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          {/* Step indicator */}
          <div className="flex items-center p-4">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                {step + 1}
              </div>
              <span className="ml-2 text-sm text-gray-400">
                Step {step + 1} of {tourSteps.length}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="px-6 pt-2">
            <h2 className="text-center text-2xl font-bold text-white">{tourSteps[step].title}</h2>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center p-6">
            {/* Logo or Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 flex justify-center"
              >
                {tourSteps[step].showLogo ? (
                  <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white p-4">
                    <LogoVariant variant="icon-only" size="xl" className="h-full w-full" />
                  </div>
                ) : (
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    {imagesPreloaded ? (
                      <Image
                        src={tourSteps[step].image || "/placeholder.svg"}
                        alt={tourSteps[step].alt || "Tour image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-800">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500"></div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`desc-${step}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <p className="text-gray-300">{tourSteps[step].description}</p>
                {tourSteps[step].subDescription && (
                  <p className="mt-4 text-sm text-gray-400">{tourSteps[step].subDescription}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between p-4">
            <Button variant="outline" onClick={handlePrevious} disabled={step === 0} className="flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>

            <Button onClick={handleNext} className="flex items-center">
              {step < tourSteps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GuidedTour
