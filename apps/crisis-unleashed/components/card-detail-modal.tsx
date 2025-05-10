"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw, Edit, Trash2 } from "lucide-react"
import CardTemplatePreview from "./card-template-preview"
import { StandardizedCardBack } from "./standardized-card-back"
import type { CardData } from "@/lib/card-data"
import styles from "@/styles/card-detail-modal.module.css"

interface CardDetailModalProps {
  card: CardData
  isOpen: boolean
  onClose: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function CardDetailModal({ card, isOpen, onClose, onEdit, onDelete }: CardDetailModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFlipped, setIsFlipped] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`${styles.modalContent} ${isFullscreen ? styles.fullscreen : ""}`}
        aria-describedby="card-detail-description"
      >
        <DialogHeader className={styles.modalHeader}>
          <DialogTitle className={styles.modalTitle}>{card.name}</DialogTitle>
          <p id="card-detail-description" className="sr-only">
            Detailed view of {card.name} card showing its stats, abilities, and lore information.
          </p>
          <div className={styles.modalControls}>
            {onEdit && (
              <Button variant="outline" size="icon" onClick={onEdit} title="Edit Card">
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="icon"
                onClick={onDelete}
                title="Delete Card"
                className={styles.deleteButton}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className={styles.zoomLevel}>{Math.round(zoomLevel * 100)}%</span>
            <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleFlip} title="Flip Card">
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleFullscreen} title="Toggle Fullscreen">
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" size="icon" title="Close">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className={styles.modalBody}>
          <div className={styles.cardPreviewContainer} style={{ transform: `scale(${zoomLevel})` }}>
            <div className={`${styles.cardPreview} ${isFlipped ? styles.flipped : ""}`}>
              <div className={styles.cardFront}>
                <CardTemplatePreview card={card} size="lg" />
              </div>
              <div className={styles.cardBack}>
                <StandardizedCardBack card={card} />
              </div>
            </div>
          </div>

          <Tabs defaultValue="details" className={styles.detailsTabs}>
            <TabsList className={styles.tabsList}>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="lore">Lore</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className={styles.tabContent}>
              <div className={styles.detailsSection}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Type:</span>
                  <span className={styles.detailValue}>{card.cardType || card.type}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Faction:</span>
                  <span className={styles.detailValue}>{card.faction}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Rarity:</span>
                  <span className={styles.detailValue}>{card.rarity}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Provision:</span>
                  <span className={styles.detailValue}>{card.provision}</span>
                </div>
                <div className={styles.descriptionBox}>
                  <h4 className={styles.descriptionTitle}>Description</h4>
                  <p className={styles.descriptionText}>{card.description}</p>
                </div>

                {card.cardType === "Artifact" && (
                  <>
                    <div className={styles.descriptionBox}>
                      <h4 className={styles.descriptionTitle}>Effect</h4>
                      <p className={styles.descriptionText}>{card.effect}</p>
                    </div>
                    <div className={styles.descriptionBox}>
                      <h4 className={styles.descriptionTitle}>Requirements</h4>
                      <p className={styles.descriptionText}>{card.requirements}</p>
                    </div>
                  </>
                )}

                {card.cardType === "Crisis" && (
                  <>
                    <div className={styles.descriptionBox}>
                      <h4 className={styles.descriptionTitle}>Impact</h4>
                      <p className={styles.descriptionText}>{card.impact}</p>
                    </div>
                    <div className={styles.descriptionBox}>
                      <h4 className={styles.descriptionTitle}>Duration</h4>
                      <p className={styles.descriptionText}>{card.duration}</p>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="stats" className={styles.tabContent}>
              <div className={styles.statsGrid}>
                {card.health !== undefined && (
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Health</span>
                    <span className={styles.statValue}>{card.health}</span>
                  </div>
                )}
                {card.attack !== undefined && (
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Attack</span>
                    <span className={styles.statValue}>{card.attack}</span>
                  </div>
                )}
                {card.defense !== undefined && (
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Defense</span>
                    <span className={styles.statValue}>{card.defense}</span>
                  </div>
                )}
                {card.speed !== undefined && (
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Speed</span>
                    <span className={styles.statValue}>{card.speed}</span>
                  </div>
                )}
                {card.intelligence !== undefined && (
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Intelligence</span>
                    <span className={styles.statValue}>{card.intelligence}</span>
                  </div>
                )}
              </div>

              {card.abilities && card.abilities.length > 0 && (
                <div className={styles.abilitiesSection}>
                  <h4 className={styles.sectionTitle}>Abilities</h4>
                  <div className={styles.abilitiesList}>
                    {card.abilities.map((ability, index) => (
                      <div key={index} className={styles.abilityItem}>
                        <div className={styles.abilityHeader}>
                          <span className={styles.abilityName}>{ability.name}</span>
                          {ability.cost !== undefined && (
                            <span className={styles.abilityCost}>Cost: {ability.cost}</span>
                          )}
                        </div>
                        <p className={styles.abilityDescription}>{ability.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {card.aspects && card.aspects.length > 0 && (
                <div className={styles.aspectsSection}>
                  <h4 className={styles.sectionTitle}>Aspects</h4>
                  <div className={styles.aspectsList}>
                    {card.aspects.map((aspect, index) => (
                      <span key={index} className={styles.aspectTag}>
                        {aspect}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="lore" className={styles.tabContent}>
              <div className={styles.loreSection}>
                {card.lore ? (
                  <p className={styles.loreText}>{card.lore}</p>
                ) : (
                  <p className={styles.emptyLore}>No lore information available for this card.</p>
                )}
                {card.artist && (
                  <div className={styles.artistCredit}>
                    <span className={styles.artistLabel}>Artist:</span>
                    <span className={styles.artistName}>{card.artist}</span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
