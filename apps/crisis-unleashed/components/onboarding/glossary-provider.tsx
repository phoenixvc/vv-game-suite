"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { GlossaryModal } from "./glossary-modal"

type GlossaryContextType = {
  openGlossary: (term?: string) => void
  closeGlossary: () => void
}

const GlossaryContext = createContext<GlossaryContextType | undefined>(undefined)

export function useGlossary() {
  const context = useContext(GlossaryContext)
  if (!context) {
    throw new Error("useGlossary must be used within a GlossaryProvider")
  }
  return context
}

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTerm, setActiveTerm] = useState<string | undefined>(undefined)

  const openGlossary = (term?: string) => {
    setActiveTerm(term)
    setIsOpen(true)
  }

  const closeGlossary = () => {
    setIsOpen(false)
  }

  return (
    <GlossaryContext.Provider value={{ openGlossary, closeGlossary }}>
      {children}
      <GlossaryModal isOpen={isOpen} onClose={closeGlossary} initialTerm={activeTerm} />
    </GlossaryContext.Provider>
  )
}

export default GlossaryProvider
