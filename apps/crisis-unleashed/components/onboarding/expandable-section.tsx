"use client"

import { useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ExpandableSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function ExpandableSection({ title, children, defaultOpen = false }: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md bg-gray-800 bg-opacity-50 px-3 py-2 text-left text-sm font-medium text-gray-200 hover:bg-opacity-70"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-2 text-sm">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExpandableSection
