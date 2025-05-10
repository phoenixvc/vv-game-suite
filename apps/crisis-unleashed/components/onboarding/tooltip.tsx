"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Info } from "lucide-react"

interface TooltipProps {
  term: string
  children: React.ReactNode
  icon?: boolean
}

export function GlossaryTooltip({ term, children, icon = false }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsOpen(true), 500)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsOpen(false), 300)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        <span
          className={`relative ${
            icon ? "inline-flex items-center" : "border-b border-dashed border-cyan-400/50 cursor-help"
          }`}
        >
          {term}
          {icon && <Info className="ml-1 h-4 w-4 text-cyan-400/70" />}
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 bg-gray-800/95 border-gray-700 text-gray-200 p-4 shadow-xl"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="space-y-2">
          <h4 className="font-semibold text-cyan-400">{term}</h4>
          <div className="text-sm">{children}</div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
