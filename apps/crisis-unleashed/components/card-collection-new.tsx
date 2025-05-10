"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Grid, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CardTemplatePreview from "@/components/card-template-preview"
import type { CardData } from "@/lib/card-data"
import styles from "@/styles/designer.module.css"

interface CardCollectionProps {
  cards: CardData[]
  onCardSelect: (cardId: string) => void
  selectedCardId?: string
  title?: string
  showFilters?: boolean
  onCardClick?: (card: CardData) => void
}

/**
 * Displays a searchable, sortable, and paginated grid of card items with selectable layouts.
 *
 * Renders a collection of cards with interactive search, sorting, and grid view toggles. Supports card selection, optional card click handling, and responsive pagination. If no cards match the current filters, an empty state is shown with an option to clear the search.
 *
 * @param cards - The array of card data to display.
 * @param onCardSelect - Callback invoked with the selected card's ID.
 * @param selectedCardId - (Optional) ID of the currently selected card.
 * @param title - (Optional) Title for the collection. Defaults to "Card Collection".
 * @param showFilters - (Optional) Whether to display search and sorting controls. Defaults to true.
 * @param onCardClick - (Optional) Callback invoked with the full card data when a card is clicked.
 */
export default function CardCollection({
  cards,
  onCardSelect,
  selectedCardId,
  title = "Card Collection",
  showFilters = true,
  onCardClick,
}: CardCollectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCards, setFilteredCards] = useState<CardData[]>(cards)
  const [gridView, setGridView] = useState<"compact" | "comfortable">("comfortable")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("name")
  const cardsPerPage = gridView === "compact" ? 20 : 12

  // Filter and sort cards when dependencies change
  useEffect(() => {
    let result = [...cards]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (card) =>
          card.name.toLowerCase().includes(term) ||
          card.description.toLowerCase().includes(term) ||
          (card.abilities &&
            card.abilities.some(
              (ability) =>
                ability.name.toLowerCase().includes(term) || ability.description.toLowerCase().includes(term),
            )),
      )
    }

    // Apply sorting
    const [sortField, sortDirection] = sortBy.includes("-desc")
      ? [sortBy.replace("-desc", ""), "desc"]
      : [sortBy, "asc"]

    result.sort((a, b) => {
      let valueA = a[sortField as keyof CardData]
      let valueB = b[sortField as keyof CardData]

      // Handle undefined values
      if (valueA === undefined) valueA = 0
      if (valueB === undefined) valueB = 0

      // Convert to strings for comparison if they're not numbers
      if (typeof valueA !== "number") valueA = String(valueA).toLowerCase()
      if (typeof valueB !== "number") valueB = String(valueB).toLowerCase()

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

    setFilteredCards(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [cards, searchTerm, sortBy])

  // Calculate pagination
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage)
  const currentCards = filteredCards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)

  // Handle card click
  const handleCardClick = (card: CardData) => {
    onCardSelect(card.id)
    if (onCardClick) {
      onCardClick(card)
    }
  }

  // Pagination controls
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}

      {showFilters && (
        <div className={styles.gridControls}>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-gray-800 border-gray-700"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="faction">Faction</SelectItem>
              <SelectItem value="rarity">Rarity</SelectItem>
              <SelectItem value="provision">Provision (Low to High)</SelectItem>
              <SelectItem value="provision-desc">Provision (High to Low)</SelectItem>
            </SelectContent>
          </Select>

          <div className={styles.gridViewToggle}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setGridView("compact")}
              className={`${styles.gridViewButton} ${gridView === "compact" ? styles.gridViewButtonActive : ""}`}
              title="Compact Grid"
            >
              <Grid size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setGridView("comfortable")}
              className={`${styles.gridViewButton} ${gridView === "comfortable" ? styles.gridViewButtonActive : ""}`}
              title="Comfortable Grid"
            >
              <LayoutGrid size={18} />
            </Button>
          </div>
        </div>
      )}

      {filteredCards.length > 0 ? (
        <>
          <div
            className={styles.cardGridContainer}
            style={{
              gridTemplateColumns:
                gridView === "compact"
                  ? "repeat(auto-fill, minmax(160px, 1fr))"
                  : "repeat(auto-fill, minmax(220px, 1fr))",
            }}
          >
            <AnimatePresence>
              {currentCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  className={styles.cardGridItem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <div
                    className={`${styles.cardItem} ${selectedCardId === card.id ? styles.selectedItem : ""}`}
                    onClick={() => handleCardClick(card)}
                  >
                    <div className={styles.cardWrapper}>
                      <CardTemplatePreview
                        card={card}
                        size={gridView === "compact" ? "sm" : "md"}
                        onClick={() => handleCardClick(card)}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className={styles.gridPagination}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                <ChevronLeft size={18} />
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate which page numbers to show
                let pageNum = i + 1
                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                }

                return (
                  <Button
                    key={pageNum}
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(pageNum)}
                    className={`${styles.paginationButton} ${currentPage === pageNum ? styles.paginationCurrent : ""}`}
                  >
                    {pageNum}
                  </Button>
                )
              })}

              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptyGrid}>
          <div className={styles.emptyGridIcon}>🔍</div>
          <p className={styles.emptyGridText}>No cards found matching your search criteria.</p>
          <Button variant="outline" onClick={() => setSearchTerm("")}>
            Clear Search
          </Button>
        </div>
      )}
    </div>
  )
}
