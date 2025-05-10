"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/theme-context"
import { factionThemes } from "@/lib/faction-themes"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Info, Check, HelpCircle, Sparkles } from "lucide-react"
import FactionPreview from "@/components/faction-preview"
import styles from "./immersive-selection.module.css"

// Faction selection steps
type SelectionStep = "intro" | "overview" | "detail" | "quiz" | "confirmation"

export default function ImmersiveSelectionPage() {
  const router = useRouter()
  const { setCurrentTheme } = useTheme()
  const [currentStep, setCurrentStep] = useState<SelectionStep>("intro")
  const [activeFaction, setActiveFaction] = useState(0)
  const [selectedFaction, setSelectedFaction] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizQuestion, setQuizQuestion] = useState(0)
  const [recommendedFaction, setRecommendedFaction] = useState<number | null>(null)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intro animation sequence
  useEffect(() => {
    if (currentStep === "intro") {
      const timer = setTimeout(() => {
        setShowIntro(false)
        setCurrentStep("overview")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  // Handle faction navigation
  const handleFactionSelect = (index: number) => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setDirection(index > activeFaction ? 1 : -1)
    setActiveFaction(index)

    // Reset transition state
    setTimeout(() => setIsTransitioning(false), 600)
  }

  // Handle quiz answers
  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers, answerIndex]
    setQuizAnswers(newAnswers)

    if (quizQuestion < quizQuestions.length - 1) {
      setQuizQuestion(quizQuestion + 1)
    } else {
      // Calculate recommended faction based on answers
      const factionScores = Array(factionThemes.length).fill(0)

      newAnswers.forEach((answer, qIndex) => {
        const questionWeights = quizQuestions[qIndex].factionWeights
        questionWeights.forEach((weight, fIndex) => {
          if (answer === weight) {
            factionScores[fIndex]++
          }
        })
      })

      // Find highest score
      let highestScore = 0
      let recommendedIndex = 0

      factionScores.forEach((score, index) => {
        if (score > highestScore) {
          highestScore = score
          recommendedIndex = index
        }
      })

      setRecommendedFaction(recommendedIndex)
      setActiveFaction(recommendedIndex)
      setCurrentStep("detail")
    }
  }

  // Confirm faction selection
  const confirmSelection = () => {
    setSelectedFaction(activeFaction)
    setCurrentStep("confirmation")

    // Add selection animation
    setTimeout(() => {
      const selectedTheme = factionThemes[activeFaction].id
      setCurrentTheme(selectedTheme)

      // Redirect after animation completes
      setTimeout(() => {
        router.push("/designer")
      }, 2000)
    }, 1000)
  }

  // Navigation controls
  const handlePrevious = () => {
    if (isTransitioning) return
    handleFactionSelect((activeFaction - 1 + factionThemes.length) % factionThemes.length)
  }

  const handleNext = () => {
    if (isTransitioning) return
    handleFactionSelect((activeFaction + 1) % factionThemes.length)
  }

  // Handle step navigation
  const goToStep = (step: SelectionStep) => {
    setCurrentStep(step)
  }

  // Quiz questions
  const quizQuestions = [
    {
      question: "What approach do you prefer when facing challenges?",
      answers: [
        "Analyze and strategize with technological solutions",
        "Adapt and grow, using natural forces to overcome",
        "Strike from the shadows, eliminating threats before they see you",
        "Predict outcomes and manipulate time to your advantage",
        "Stand firm and counter with overwhelming strength",
        "Embrace chaos and bend reality to create unexpected solutions",
      ],
      factionWeights: [0, 1, 2, 3, 4, 5], // Index corresponds to faction
    },
    {
      question: "Which environment do you feel most comfortable in?",
      answers: [
        "High-tech laboratory or digital space",
        "Natural wilderness or ancient forest",
        "Shadowy corners and hidden passages",
        "Observatory or cosmic study",
        "Forge or mountainous stronghold",
        "Dimensional rift or chaotic space",
      ],
      factionWeights: [0, 1, 2, 3, 4, 5],
    },
    {
      question: "What is your preferred combat style?",
      answers: [
        "Tactical precision with technological enhancements",
        "Overwhelming with numbers and natural forces",
        "Stealth and precision strikes",
        "Manipulating time and space to control the battlefield",
        "Defensive positioning and powerful counter-attacks",
        "Unpredictable chaos and reality manipulation",
      ],
      factionWeights: [0, 1, 2, 3, 4, 5],
    },
    {
      question: "What do you value most?",
      answers: [
        "Progress and innovation",
        "Balance and harmony with nature",
        "Control and information",
        "Knowledge and cosmic understanding",
        "Strength and honor",
        "Freedom and possibility",
      ],
      factionWeights: [0, 1, 2, 3, 4, 5],
    },
    {
      question: "How do you approach decision making?",
      answers: [
        "Logical analysis of data and probabilities",
        "Intuition guided by ancient wisdom",
        "Careful planning with contingencies for every outcome",
        "Considering the long-term cosmic implications",
        "Following traditional methods proven by ancestors",
        "Embracing randomness and unexpected outcomes",
      ],
      factionWeights: [0, 1, 2, 3, 4, 5],
    },
  ]

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Cosmic background with parallax stars */}
      <div className={styles.cosmicBackground}>
        <div className={styles.stars}></div>
        <div className={styles.twinkling}></div>
        <div className={styles.nebula}></div>

        {/* Faction-specific background elements that change with selection */}
        <AnimatePresence mode="wait">
          {activeFaction === 0 && (
            <motion.div
              key="cyber-bg"
              className={styles.factionBackground}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <div className={styles.circuitLines}></div>
            </motion.div>
          )}

          {activeFaction === 1 && (
            <motion.div
              key="primordial-bg"
              className={styles.factionBackground}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <div className={styles.vinePatternsContainer}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={styles.vinePattern}
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                    }}
                  ></div>
                ))}
              </div>
            </motion.div>
          )}

          {activeFaction === 2 && (
            <motion.div
              key="eclipsed-bg"
              className={styles.factionBackground}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <div className={styles.shadowsContainer}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={styles.shadowElement}
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      width: `${100 + Math.random() * 200}px`,
                      height: `${100 + Math.random() * 200}px`,
                      animationDelay: `${Math.random() * 8}s`,
                    }}
                  ></div>
                ))}
              </div>
            </motion.div>
          )}

          {activeFaction === 3 && (
            <motion.div
              key="celestial-bg"
              className={styles.factionBackground}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <div className={styles.constellationsContainer}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={styles.constellation}
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      transform: `rotate(${Math.random() * 360}deg)`,
                      animationDelay: `${Math.random() * 10}s`,
                    }}
                  ></div>
                ))}
              </div>
            </motion.div>
          )}

          {activeFaction === 4 && (
            <motion.div
              key="titanborn-bg"
              className={styles.factionBackground}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <div className={styles.forgeElementsContainer}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={styles.emberParticle}
                    style={{
                      top: `${80 + Math.random() * 20}%`,
                      left: `${Math.random() * 100}%`,
                      animationDuration: `${3 + Math.random() * 4}s`,
                      animationDelay: `${Math.random() * 5}s`,
                    }}
                  ></div>
                ))}
              </div>
            </motion.div>
          )}

          {activeFaction === 5 && (
            <motion.div
              key="void-bg"
              className={styles.factionBackground}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <div className={styles.voidRiftsContainer}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={styles.voidRift}
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 1})`,
                      animationDelay: `${Math.random() * 8}s`,
                    }}
                  ></div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content container */}
      <AnimatePresence mode="wait">
        {/* Intro sequence */}
        {currentStep === "intro" && (
          <motion.div
            key="intro"
            className={styles.introSequence}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <motion.div
              className={styles.introLogo}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.5 }}
            >
              <Sparkles size={120} className={styles.sparkleIcon} />
              <h1>CRISIS UNLEASHED</h1>
            </motion.div>

            <motion.div
              className={styles.introText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <p>Choose your faction and shape the destiny of the universe</p>
            </motion.div>

            <motion.div
              className={styles.skipIntro}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
              onClick={() => {
                setShowIntro(false)
                setCurrentStep("overview")
              }}
            >
              Skip Intro
            </motion.div>
          </motion.div>
        )}

        {/* Faction overview carousel */}
        {currentStep === "overview" && (
          <motion.div
            key="overview"
            className={styles.overviewContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.header}>
              <motion.h1
                className={styles.title}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Choose Your Faction
              </motion.h1>
              <motion.p
                className={styles.subtitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Your choice will determine your destiny in the battles to come
              </motion.p>
            </div>

            <div className={styles.carouselContainer}>
              <button className={styles.navButton} onClick={handlePrevious} aria-label="Previous faction">
                <ChevronLeft size={24} />
              </button>

              <div className={styles.carousel}>
                <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                  <motion.div
                    key={factionThemes[activeFaction].id}
                    custom={direction}
                    variants={{
                      enter: (direction) => ({
                        x: direction > 0 ? 1000 : -1000,
                        opacity: 0,
                        scale: 0.8,
                      }),
                      center: {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                      },
                      exit: (direction) => ({
                        x: direction > 0 ? -1000 : 1000,
                        opacity: 0,
                        scale: 0.8,
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                    className={styles.carouselItem}
                  >
                    <div
                      className={styles.factionCard}
                      style={{
                        backgroundColor: `${factionThemes[activeFaction].colors.background}80`,
                        borderColor: factionThemes[activeFaction].colors.primary,
                      }}
                    >
                      <div
                        className={styles.factionEmblem}
                        style={{
                          backgroundColor: factionThemes[activeFaction].colors.primary,
                          boxShadow: `0 0 20px ${factionThemes[activeFaction].colors.primary}80`,
                        }}
                      >
                        <div
                          className={styles.emblemInner}
                          style={{
                            backgroundColor: factionThemes[activeFaction].colors.accent,
                          }}
                        ></div>
                      </div>

                      <h2
                        className={styles.factionName}
                        style={{
                          color: factionThemes[activeFaction].colors.primary,
                        }}
                      >
                        {factionThemes[activeFaction].name}
                      </h2>

                      <p className={styles.factionDescription}>{factionThemes[activeFaction].description}</p>

                      <div className={styles.factionTraits}>
                        {factionThemes[activeFaction].elements.slice(0, 3).map((element, index) => (
                          <div
                            key={index}
                            className={styles.traitBadge}
                            style={{
                              backgroundColor: `${factionThemes[activeFaction].colors.secondary}80`,
                              borderColor: factionThemes[activeFaction].colors.accent,
                            }}
                          >
                            {element}
                          </div>
                        ))}
                      </div>

                      <div className={styles.cardActions}>
                        <Button
                          className={styles.detailButton}
                          onClick={() => {
                            setActiveFaction(activeFaction)
                            goToStep("detail")
                          }}
                          style={{
                            backgroundColor: factionThemes[activeFaction].colors.primary,
                            color: factionThemes[activeFaction].colors.text,
                          }}
                        >
                          <Info size={16} className="mr-2" />
                          View Details
                        </Button>

                        <Button
                          className={styles.selectButton}
                          onClick={() => confirmSelection()}
                          style={{
                            backgroundColor: factionThemes[activeFaction].colors.accent,
                            color: factionThemes[activeFaction].colors.text,
                          }}
                        >
                          <Check size={16} className="mr-2" />
                          Choose Faction
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button className={styles.navButton} onClick={handleNext} aria-label="Next faction">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className={styles.indicators}>
              {factionThemes.map((faction, index) => (
                <button
                  key={faction.id}
                  className={`${styles.indicator} ${index === activeFaction ? styles.activeIndicator : ""}`}
                  onClick={() => handleFactionSelect(index)}
                  aria-label={`Select ${faction.name}`}
                  aria-current={index === activeFaction ? "true" : "false"}
                  style={{
                    backgroundColor: index === activeFaction ? faction.colors.primary : "rgba(255,255,255,0.3)",
                    boxShadow: index === activeFaction ? `0 0 10px ${faction.colors.primary}80` : "none",
                  }}
                />
              ))}
            </div>

            <div className={styles.alternateOptions}>
              <Button
                variant="outline"
                className={styles.quizButton}
                onClick={() => {
                  setQuizAnswers([])
                  setQuizQuestion(0)
                  goToStep("quiz")
                }}
              >
                <HelpCircle size={16} className="mr-2" />
                Take Faction Quiz
              </Button>
            </div>
          </motion.div>
        )}

        {/* Detailed faction view */}
        {currentStep === "detail" && (
          <motion.div
            key="detail"
            className={styles.detailContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.detailHeader}>
              <Button variant="ghost" className={styles.backButton} onClick={() => goToStep("overview")}>
                <ChevronLeft size={16} className="mr-1" />
                Back to Overview
              </Button>

              {recommendedFaction !== null && (
                <div className={styles.recommendationBadge}>
                  <Sparkles size={16} className="mr-1" />
                  Recommended Faction
                </div>
              )}
            </div>

            <div className={styles.detailContent}>
              {factionThemes[activeFaction] && (
                <FactionPreview
                  faction={{
                    ...factionThemes[activeFaction],
                    elements: factionThemes[activeFaction].elements || [],
                    animations: factionThemes[activeFaction].animations || [],
                  }}
                  onSelect={confirmSelection}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Faction quiz */}
        {currentStep === "quiz" && (
          <motion.div
            key="quiz"
            className={styles.quizContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.quizHeader}>
              <Button variant="ghost" className={styles.backButton} onClick={() => goToStep("overview")}>
                <X size={16} className="mr-1" />
                Cancel Quiz
              </Button>

              <div className={styles.quizProgress}>
                <div className={styles.progressText}>
                  Question {quizQuestion + 1} of {quizQuestions.length}
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${((quizQuestion + 1) / quizQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className={styles.quizContent}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`question-${quizQuestion}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className={styles.questionContainer}
                >
                  <h2 className={styles.questionText}>{quizQuestions[quizQuestion].question}</h2>

                  <div className={styles.answerOptions}>
                    {quizQuestions[quizQuestion].answers.map((answer, index) => (
                      <motion.button
                        key={index}
                        className={styles.answerOption}
                        onClick={() => handleQuizAnswer(index)}
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                      >
                        <div className={styles.answerNumber}>{index + 1}</div>
                        <div className={styles.answerText}>{answer}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Confirmation screen */}
        {currentStep === "confirmation" && selectedFaction !== null && (
          <motion.div
            key="confirmation"
            className={styles.confirmationContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className={styles.confirmationContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div
                className={styles.confirmationEmblem}
                style={{
                  backgroundColor: factionThemes[selectedFaction].colors.primary,
                  boxShadow: `0 0 30px ${factionThemes[selectedFaction].colors.primary}`,
                }}
              >
                <motion.div
                  className={styles.emblemInner}
                  style={{ backgroundColor: factionThemes[selectedFaction].colors.accent }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
              </div>

              <h2 className={styles.confirmationTitle} style={{ color: factionThemes[selectedFaction].colors.primary }}>
                {factionThemes[selectedFaction].name} Selected
              </h2>

              <p className={styles.confirmationText}>
                You have joined the {factionThemes[selectedFaction].name}. Your journey begins now.
              </p>

              <motion.div
                className={styles.loadingIndicator}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <div
                  className={styles.loadingCircle}
                  style={{ borderColor: factionThemes[selectedFaction].colors.primary }}
                ></div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
