import SharedNavigation from "@/components/shared-navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search, Filter, Heart, Download, Share2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CardTemplatePreview from "@/components/card-template-preview"
import { heroCards } from "@/data/heroes"
import { artifactCards } from "@/data/artifacts"
import { crisisCards } from "@/data/crisis"
import Link from "next/link"

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SharedNavigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">Community Gallery</h1>
          <p className="text-xl text-center mb-12 text-gray-300 max-w-3xl mx-auto">
            Explore custom cards created by the Crisis Unleashed community
          </p>

          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="text"
                  placeholder="Search community cards..."
                  className="pl-9 bg-gray-700 border-gray-600"
                />
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

                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="highest-rated">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="border-gray-600 bg-gray-700">
                  <Filter size={16} className="mr-2" /> More Filters
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="featured">
            <TabsList className="mb-6 bg-gray-900 p-1 rounded-lg">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>

            <TabsContent value="featured">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...heroCards, ...artifactCards, ...crisisCards].slice(0, 8).map((card) => (
                  <GalleryCard key={card.id} card={card} creator="AlexTheDesigner" likes={142} downloads={37} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="popular">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...artifactCards, ...heroCards, ...crisisCards].slice(0, 8).map((card) => (
                  <GalleryCard key={card.id} card={card} creator="CardMaster99" likes={98} downloads={24} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...crisisCards, ...heroCards, ...artifactCards].slice(0, 8).map((card) => (
                  <GalleryCard key={card.id} card={card} creator="NewDesigner" likes={12} downloads={3} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="following">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...heroCards, ...crisisCards].slice(0, 4).map((card) => (
                  <GalleryCard key={card.id} card={card} creator="YourFriend" likes={45} downloads={11} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              asChild
            >
              <Link href="/designer">Create Your Own Card</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GalleryCard({
  card,
  creator,
  likes,
  downloads,
}: { card: any; creator: string; likes: number; downloads: number }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="p-3">
        <CardTemplatePreview card={card} size="md" />
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold truncate">{card.name}</div>
          <div className="text-xs text-gray-400">by {creator}</div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-4">
            <button className="flex items-center text-gray-400 hover:text-pink-500 transition-colors">
              <Heart size={16} className="mr-1" /> {likes}
            </button>
            <button className="flex items-center text-gray-400 hover:text-cyan-500 transition-colors">
              <Download size={16} className="mr-1" /> {downloads}
            </button>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
