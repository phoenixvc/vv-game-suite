"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"
import { glossaryTerms } from "@/data/glossary"

export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  category: string
  relatedTerms?: string[]
}

interface GlossaryContextType {
  terms: GlossaryTerm[]
  activeTerm: GlossaryTerm | null
  setActiveTerm: (term: GlossaryTerm | null) => void
  isGlossaryModalOpen: boolean
  openGlossaryModal: (termId?: string) => void
  closeGlossaryModal: () => void
  searchTerms: (query: string) => GlossaryTerm[]
  getTermById: (id: string) => GlossaryTerm | undefined
  recentlyViewedTerms: GlossaryTerm[]
}

const GlossaryContext = createContext<GlossaryContextType | undefined>(undefined)

export const useGlossary = () => {
  const context = useContext(GlossaryContext)
  if (context === undefined) {
    throw new Error("useGlossary must be used within a GlossaryProvider")
  }
  return context
}

interface GlossaryProviderProps {
  children: ReactNode
}

export const GlossaryProvider: React.FC<GlossaryProviderProps> = ({ children }) => {
  const [terms] = useState<GlossaryTerm[]>(glossaryTerms)
  const [activeTerm, setActiveTerm] = useState<GlossaryTerm | null>(null)
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState(false)
  const [recentlyViewedTerms, setRecentlyViewedTerms] = useState<GlossaryTerm[]>([])

  const addToRecentlyViewed = (term: GlossaryTerm) => {
    setRecentlyViewedTerms((prevTerms) => {
      const isTermAlreadyInList = prevTerms.some((t) => t.id === term.id)
      if (isTermAlreadyInList) {
        return prevTerms
      }
      return [...prevTerms, term]
    })
  }

  const openGlossaryModal = (termId?: string) => {
    if (termId) {
      const term = terms.find((t) => t.id === termId)
      if (term) {
        setActiveTerm(term)
        addToRecentlyViewed(term)
      }
    }
    setIsGlossaryModalOpen(true)
  }

  const closeGlossaryModal = () => {
    setIsGlossaryModalOpen(false)
    setActiveTerm(null)
  }

  const searchTerms = (query: string) => {
    const lowerCaseQuery = query.toLowerCase()
    return terms.filter(
      (term) =>
        term.term.toLowerCase().includes(lowerCaseQuery) || term.definition.toLowerCase().includes(lowerCaseQuery),
    )
  }

  const getTermById = (id: string) => {
    return terms.find((term) => term.id === id)
  }

  return (
    <GlossaryContext.Provider
      value={{
        terms,
        activeTerm,
        setActiveTerm,
        isGlossaryModalOpen,
        openGlossaryModal,
        closeGlossaryModal,
        searchTerms,
        getTermById,
        recentlyViewedTerms,
      }}
    >
      {children}
    </GlossaryContext.Provider>
  )
}
