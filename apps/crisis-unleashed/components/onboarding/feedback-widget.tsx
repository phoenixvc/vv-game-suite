"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, ThumbsUp, ThumbsDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface FeedbackWidgetProps {
  sectionId: string
}

export function FeedbackWidget({ sectionId }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState<"positive" | "negative" | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = () => {
    // In a real implementation, this would send the feedback to a server
    console.log({
      sectionId,
      feedbackType,
      feedbackText,
    })

    setIsSubmitted(true)
    setTimeout(() => {
      setIsOpen(false)
      // Reset after closing
      setTimeout(() => {
        setFeedbackType(null)
        setFeedbackText("")
        setIsSubmitted(false)
      }, 300)
    }, 2000)
  }

  return (
    <div className="relative mt-8 border-t border-gray-700 pt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center text-gray-300 hover:text-white hover:border-blue-400 border-gray-600 transition-colors"
      >
        <MessageSquare className="mr-2 h-4 w-4 text-blue-400" />
        <span>Share your feedback on this section</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 top-full z-10 mt-2 w-full max-w-md rounded-lg bg-gray-800 p-4 shadow-xl border border-gray-700"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
              aria-label="Close feedback form"
            >
              <X className="h-4 w-4" />
            </button>

            <h4 className="mb-3 text-sm font-medium text-white">How was this section?</h4>

            {isSubmitted ? (
              <div className="text-center text-green-400 py-4">
                <div className="mx-auto w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>Thank you for your feedback!</p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex space-x-2">
                  <Button
                    variant={feedbackType === "positive" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFeedbackType("positive")}
                    className={
                      feedbackType === "positive"
                        ? "bg-green-600 hover:bg-green-700 border-green-600"
                        : "border-gray-600"
                    }
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Helpful
                  </Button>
                  <Button
                    variant={feedbackType === "negative" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFeedbackType("negative")}
                    className={
                      feedbackType === "negative" ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-gray-600"
                    }
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Needs Improvement
                  </Button>
                </div>

                {feedbackType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Textarea
                      placeholder={
                        feedbackType === "positive"
                          ? "What did you find most helpful?"
                          : "How can we improve this section?"
                      }
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="mb-3 h-24 resize-none bg-gray-700 text-white placeholder:text-gray-400 border-gray-600 focus:border-blue-400"
                    />
                    <Button onClick={handleSubmit} size="sm" className="w-full bg-blue-500 hover:bg-blue-600">
                      Submit Feedback
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FeedbackWidget
