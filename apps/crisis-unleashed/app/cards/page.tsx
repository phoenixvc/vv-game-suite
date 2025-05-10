import SharedNavigation from "@/components/shared-navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CardTemplatePreview from "@/components/card-template-preview"
import { heroCards } from "@/data/heroes"
import { artifactCards } from "@/data/artifacts"
import { crisisCards } from "@/data/crisis"

export default function CardsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SharedNavigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">Card Library</h1>
          <p className="text-xl text-center mb-12 text-gray-300 max-w-3xl mx-auto">
            Explore the complete collection of Crisis Unleashed cards
          </p>

          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input type="text" placeholder="Search cards..." className="pl-9 bg-gray-700 border-gray-600" />
              </div>

              <div className="flex gap-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Faction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Factions</SelectItem>
                    <SelectItem value="cybernetic-nexus">Cybernetic Nexus</SelectItem>
                    <SelectItem value="primordial-ascendancy">Primordial Ascendancy</SelectItem>
                    <SelectItem value="eclipsed-order">Eclipsed Order</SelectItem>
                    <SelectItem value="celestial-dominion">Celestial Dominion</SelectItem>
                    <SelectItem value="titanborn">Titanborn</SelectItem>
                    <SelectItem value="void-harbingers">Void Harbingers</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rarities</SelectItem>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="uncommon">Uncommon</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="border-gray-600 bg-gray-700">
                  <Filter size={16} className="mr-2" /> More Filters
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="heroes">
            <TabsList className="mb-6 bg-gray-900 p-1 rounded-lg">
              <TabsTrigger value="heroes">Heroes ({heroCards.length})</TabsTrigger>
              <TabsTrigger value="artifacts">Artifacts ({artifactCards.length})</TabsTrigger>
              <TabsTrigger value="crises">Crisis Events ({crisisCards.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="heroes">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {heroCards.map((card) => (
                  <div key={card.id} className="h-80">
                    <CardTemplatePreview card={card} size="md" />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="artifacts">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {artifactCards.map((card) => (
                  <div key={card.id} className="h-80">
                    <CardTemplatePreview card={card} size="md" />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="crises">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {crisisCards.map((card) => (
                  <div key={card.id} className="h-80">
                    <CardTemplatePreview card={card} size="md" />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
