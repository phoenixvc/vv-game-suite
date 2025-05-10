"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Save, Trash2 } from "lucide-react"
import type { CardData, Ability } from "@/lib/card-data"
import styles from "@/styles/card-form.module.css"
import { FormErrorBoundary } from "./error-boundaries/form-error-boundary"

interface CardFormProps {
  card: CardData
  onSave: (updatedCard: CardData) => void
  onCancel: () => void
  darkMode?: boolean
}

export function CardForm({ card, onSave, onCancel, darkMode = false }: CardFormProps) {
  const [formData, setFormData] = useState<CardData>({ ...card })
  const [activeTab, setActiveTab] = useState("basic")

  // Reset form when card changes
  useEffect(() => {
    setFormData({ ...card })
  }, [card])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value === "" ? undefined : Number.parseInt(value, 10) }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAbilityChange = (index: number, field: keyof Ability, value: string | number) => {
    const updatedAbilities = [...(formData.abilities || [])]
    if (!updatedAbilities[index]) {
      updatedAbilities[index] = { name: "", description: "" }
    }
    updatedAbilities[index] = { ...updatedAbilities[index], [field]: value }
    setFormData((prev) => ({ ...prev, abilities: updatedAbilities }))
  }

  const addAbility = () => {
    const updatedAbilities = [...(formData.abilities || []), { name: "", description: "", cost: 0 }]
    setFormData((prev) => ({ ...prev, abilities: updatedAbilities }))
  }

  const removeAbility = (index: number) => {
    const updatedAbilities = [...(formData.abilities || [])]
    updatedAbilities.splice(index, 1)
    setFormData((prev) => ({ ...prev, abilities: updatedAbilities }))
  }

  const handleAspectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const aspectsString = e.target.value
    const aspectsArray = aspectsString
      .split(",")
      .map((aspect) => aspect.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, aspects: aspectsArray }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <FormErrorBoundary formName="CardForm" onReset={() => setFormData({ ...card })}>
      <form onSubmit={handleSubmit} className={`${styles.cardForm} ${darkMode ? styles.darkMode : ""}`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className={styles.formTabs}>
          <TabsList className={styles.tabsList}>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="stats">Stats & Abilities</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Card Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="cardType" className={styles.formLabel}>
                  Card Type
                </label>
                <Select
                  value={formData.cardType || formData.type}
                  onValueChange={(value) => handleSelectChange("cardType", value)}
                >
                  <SelectTrigger className={styles.formSelect}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hero">Hero</SelectItem>
                    <SelectItem value="Artifact">Artifact</SelectItem>
                    <SelectItem value="Crisis">Crisis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="faction" className={styles.formLabel}>
                  Faction
                </label>
                <Select value={formData.faction || ""} onValueChange={(value) => handleSelectChange("faction", value)}>
                  <SelectTrigger className={styles.formSelect}>
                    <SelectValue placeholder="Select faction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Order">Order</SelectItem>
                    <SelectItem value="Chaos">Chaos</SelectItem>
                    <SelectItem value="Nature">Nature</SelectItem>
                    <SelectItem value="Tech">Tech</SelectItem>
                    <SelectItem value="Mystic">Mystic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="rarity" className={styles.formLabel}>
                  Rarity
                </label>
                <Select value={formData.rarity || ""} onValueChange={(value) => handleSelectChange("rarity", value)}>
                  <SelectTrigger className={styles.formSelect}>
                    <SelectValue placeholder="Select rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Common">Common</SelectItem>
                    <SelectItem value="Uncommon">Uncommon</SelectItem>
                    <SelectItem value="Rare">Rare</SelectItem>
                    <SelectItem value="Epic">Epic</SelectItem>
                    <SelectItem value="Legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="provision" className={styles.formLabel}>
                  Provision Cost
                </label>
                <Input
                  id="provision"
                  name="provision"
                  type="number"
                  min="0"
                  max="20"
                  value={formData.provision || 0}
                  onChange={handleNumberChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.formLabel}>
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.formTextarea}
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="stats" className={styles.tabContent}>
            {(formData.cardType === "Hero" || formData.type === "Hero") && (
              <>
                <div className={styles.statsGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="health" className={styles.formLabel}>
                      Health
                    </label>
                    <Input
                      id="health"
                      name="health"
                      type="number"
                      min="0"
                      max="20"
                      value={formData.health || 0}
                      onChange={handleNumberChange}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="attack" className={styles.formLabel}>
                      Attack
                    </label>
                    <Input
                      id="attack"
                      name="attack"
                      type="number"
                      min="0"
                      max="20"
                      value={formData.attack || 0}
                      onChange={handleNumberChange}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="defense" className={styles.formLabel}>
                      Defense
                    </label>
                    <Input
                      id="defense"
                      name="defense"
                      type="number"
                      min="0"
                      max="20"
                      value={formData.defense || 0}
                      onChange={handleNumberChange}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="speed" className={styles.formLabel}>
                      Speed
                    </label>
                    <Input
                      id="speed"
                      name="speed"
                      type="number"
                      min="0"
                      max="20"
                      value={formData.speed || 0}
                      onChange={handleNumberChange}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="intelligence" className={styles.formLabel}>
                      Intelligence
                    </label>
                    <Input
                      id="intelligence"
                      name="intelligence"
                      type="number"
                      min="0"
                      max="20"
                      value={formData.intelligence || 0}
                      onChange={handleNumberChange}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.abilitiesSection}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Abilities</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addAbility} className={styles.addButton}>
                      <PlusCircle className="h-4 w-4 mr-1" /> Add Ability
                    </Button>
                  </div>

                  {formData.abilities?.map((ability, index) => (
                    <div key={index} className={styles.abilityForm}>
                      <div className={styles.abilityHeader}>
                        <h4 className={styles.abilityTitle}>Ability {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAbility(index)}
                          className={styles.removeButton}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor={`ability-${index}-name`} className={styles.formLabel}>
                            Name
                          </label>
                          <Input
                            id={`ability-${index}-name`}
                            value={ability.name}
                            onChange={(e) => handleAbilityChange(index, "name", e.target.value)}
                            className={styles.formInput}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor={`ability-${index}-cost`} className={styles.formLabel}>
                            Cost
                          </label>
                          <Input
                            id={`ability-${index}-cost`}
                            type="number"
                            min="0"
                            max="10"
                            value={ability.cost || 0}
                            onChange={(e) => handleAbilityChange(index, "cost", Number.parseInt(e.target.value, 10))}
                            className={styles.formInput}
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor={`ability-${index}-description`} className={styles.formLabel}>
                          Description
                        </label>
                        <Textarea
                          id={`ability-${index}-description`}
                          value={ability.description}
                          onChange={(e) => handleAbilityChange(index, "description", e.target.value)}
                          className={styles.formTextarea}
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}

                  {(!formData.abilities || formData.abilities.length === 0) && (
                    <div className={styles.emptyState}>No abilities added yet.</div>
                  )}
                </div>
              </>
            )}

            {formData.cardType === "Artifact" && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="effect" className={styles.formLabel}>
                    Effect
                  </label>
                  <Textarea
                    id="effect"
                    name="effect"
                    value={formData.effect || ""}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="requirements" className={styles.formLabel}>
                    Requirements
                  </label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements || ""}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    rows={2}
                  />
                </div>
              </>
            )}

            {formData.cardType === "Crisis" && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="impact" className={styles.formLabel}>
                    Impact
                  </label>
                  <Textarea
                    id="impact"
                    name="impact"
                    value={formData.impact || ""}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="duration" className={styles.formLabel}>
                    Duration
                  </label>
                  <Textarea
                    id="duration"
                    name="duration"
                    value={formData.duration || ""}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    rows={2}
                  />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="details" className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label htmlFor="aspects" className={styles.formLabel}>
                Aspects (comma separated)
              </label>
              <Input
                id="aspects"
                name="aspects"
                value={formData.aspects?.join(", ") || ""}
                onChange={handleAspectsChange}
                className={styles.formInput}
                placeholder="e.g. Guardian, Leader, Tactical"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lore" className={styles.formLabel}>
                Lore
              </label>
              <Textarea
                id="lore"
                name="lore"
                value={formData.lore || ""}
                onChange={handleInputChange}
                className={styles.formTextarea}
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="artist" className={styles.formLabel}>
                Artist
              </label>
              <Input
                id="artist"
                name="artist"
                value={formData.artist || ""}
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>
          </TabsContent>

          <TabsContent value="appearance" className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label htmlFor="imageUrl" className={styles.formLabel}>
                Image URL
              </label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ""}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="Enter image URL or use placeholder"
              />
            </div>

            <div className={styles.imagePreview}>
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl || "/placeholder.svg"}
                  alt={formData.name}
                  className={styles.previewImage}
                  onError={(e) => {
                    e.currentTarget.src = `/placeholder.svg?height=300&width=250&query=${encodeURIComponent(
                      formData.name,
                    )}`
                  }}
                />
              ) : (
                <div className={styles.placeholderImage}>
                  <span>No image selected</span>
                </div>
              )}
            </div>

            <div className={styles.placeholderOptions}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    imageUrl: `/placeholder.svg?height=300&width=250&query=${encodeURIComponent(
                      `fantasy ${formData.cardType?.toLowerCase() || "card"} ${formData.name}`,
                    )}`,
                  }))
                }
                className={styles.placeholderButton}
              >
                Generate Placeholder
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className={styles.formActions}>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className={styles.saveButton}>
            <Save className="h-4 w-4 mr-1" /> Save Card
          </Button>
        </div>
      </form>
    </FormErrorBoundary>
  )
}
