"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Question {
  question: string
  answer: string
}

interface ContextualFAQProps {
  questions: Question[]
  title?: string
}

export function ContextualFAQ({ questions, title = "Frequently Asked Questions" }: ContextualFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="my-8 rounded-lg bg-gray-800 bg-opacity-50 p-6 border border-gray-700">
      <h3 className="mb-4 text-xl font-semibold text-white">{title}</h3>
      <div className="space-y-3">
        {questions.map((q, index) => (
          <div
            key={index}
            className={`overflow-hidden rounded-lg transition-colors ${
              openIndex === index ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <button
              onClick={() => toggleQuestion(index)}
              className="flex w-full items-center justify-between p-4 text-left"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-medium text-gray-100">{q.question}</span>
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                  openIndex === index ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
                }`}
              >
                {openIndex === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  id={`faq-answer-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="border-t border-gray-700 p-4 text-gray-200">{q.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContextualFAQ
