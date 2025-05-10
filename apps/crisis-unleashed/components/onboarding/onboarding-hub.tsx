"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { GuidedTourButton } from "./guided-tour-button"
import { GlossaryButton } from "./glossary-modal"
import { ExpandableSection } from "./expandable-section"
import { ContextualFAQ } from "./contextual-faq"
import { InteractiveTutorial } from "./interactive-tutorial"
import { ResourceCard } from "./resource-card"
import { GlossaryTooltip } from "./tooltip"
import { FeedbackWidget } from "./feedback-widget"
import { Book, Video, FileText, Users, Download, Play, Lightbulb } from "lucide-react"
import Link from "next/link"

export function OnboardingHub() {
  const [activeTab, setActiveTab] = useState("getting-started")

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400">New to Crisis Unleashed?</h2>
          <p className="text-gray-300">Everything you need to get started with the game</p>
        </div>
        <div className="flex gap-3">
          <GuidedTourButton />
          <GlossaryButton />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-800 p-1 rounded-lg">
          <TabsTrigger
            value="getting-started"
            className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
          >
            Getting Started
          </TabsTrigger>
          <TabsTrigger value="gameplay" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            Gameplay Basics
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            Resources
          </TabsTrigger>
          <TabsTrigger value="community" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">What is Crisis Unleashed?</h3>
              <p className="text-gray-300 mb-4">
                Crisis Unleashed is a strategic card game where you command{" "}
                <GlossaryTooltip term="Hero Card">heroes</GlossaryTooltip>, wield{" "}
                <GlossaryTooltip term="Artifact Card">artifacts</GlossaryTooltip>, and navigate{" "}
                <GlossaryTooltip term="Crisis Card">crises</GlossaryTooltip> to achieve victory. Set in a universe on
                the brink of collapse, you'll lead one of six unique{" "}
                <GlossaryTooltip term="Faction">factions</GlossaryTooltip> in tactical battles that test your strategy
                and adaptability.
              </p>
              <div className="flex gap-3">
                <Button className="bg-cyan-600 hover:bg-cyan-700" asChild>
                  <Link href="/how-to-play">
                    <Play className="h-4 w-4 mr-1" />
                    How to Play
                  </Link>
                </Button>
                <Button variant="outline" className="border-gray-600" asChild>
                  <Link href="/factions">Explore Factions</Link>
                </Button>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">Your First Steps</h3>
              <ul className="space-y-3 text-gray-300 mb-4">
                <li className="flex items-start gap-2">
                  <div className="bg-cyan-900/30 text-cyan-400 rounded-full p-1 mt-0.5">
                    <span className="block h-4 w-4 text-center text-xs font-bold">1</span>
                  </div>
                  <span>
                    Choose a <GlossaryTooltip term="Faction">faction</GlossaryTooltip> that matches your playstyle
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-cyan-900/30 text-cyan-400 rounded-full p-1 mt-0.5">
                    <span className="block h-4 w-4 text-center text-xs font-bold">2</span>
                  </div>
                  <span>Learn the basic card types and how they interact</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-cyan-900/30 text-cyan-400 rounded-full p-1 mt-0.5">
                    <span className="block h-4 w-4 text-center text-xs font-bold">3</span>
                  </div>
                  <span>
                    Understand the <GlossaryTooltip term="Lane">lane system</GlossaryTooltip> and strategic positioning
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-cyan-900/30 text-cyan-400 rounded-full p-1 mt-0.5">
                    <span className="block h-4 w-4 text-center text-xs font-bold">4</span>
                  </div>
                  <span>
                    Build your first deck using the <GlossaryTooltip term="Provision">provision system</GlossaryTooltip>
                  </span>
                </li>
              </ul>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700" asChild>
                <Link href="/designer">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Try the Card Designer
                </Link>
              </Button>
            </div>
          </div>

          <ExpandableSection title="What makes Crisis Unleashed different from other card games?">
            <div className="space-y-4">
              <p className="text-gray-300">
                Crisis Unleashed stands out with its unique combination of strategic depth, true digital ownership, and
                dynamic gameplay. Here's what makes it special:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="text-cyan-400 mt-1">•</div>
                  <span>
                    <strong>True Digital Ownership:</strong> Your cards are{" "}
                    <GlossaryTooltip term="Digital Asset">digital assets</GlossaryTooltip> you truly own, secured by
                    blockchain technology
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-cyan-400 mt-1">•</div>
                  <span>
                    <strong>Dynamic Crisis Events:</strong> Adapt to changing battlefield conditions that force
                    strategic pivots
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-cyan-400 mt-1">•</div>
                  <span>
                    <strong>Lane-Based Strategy:</strong> Position your cards across three lanes for tactical advantage
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-cyan-400 mt-1">•</div>
                  <span>
                    <strong>Dual Resource System:</strong> Manage both{" "}
                    <GlossaryTooltip term="Power">Power</GlossaryTooltip> and{" "}
                    <GlossaryTooltip term="Momentum">Momentum</GlossaryTooltip> for deeper strategic choices
                  </span>
                </li>
              </ul>
              <FeedbackWidget sectionId="what-makes-different" />
            </div>
          </ExpandableSection>

          <ContextualFAQ
            sectionId="getting-started-faq"
            faqs={[
              {
                question: "Do I need to understand blockchain to play?",
                answer: (
                  <p>
                    Not at all! While Crisis Unleashed uses blockchain technology to secure your card ownership, the
                    gameplay itself doesn't require any blockchain knowledge. You can enjoy the game just like any other
                    digital card game, with the added benefit that you truly own your cards.
                  </p>
                ),
              },
              {
                question: "How long does a typical game take?",
                answer: (
                  <p>
                    A typical match lasts between 15-25 minutes. The game is designed to be deep but not excessively
                    long, making it perfect for both quick sessions and extended play.
                  </p>
                ),
              },
              {
                question: "Is the game free to play?",
                answer: (
                  <p>
                    Crisis Unleashed offers a free-to-play option with a rotating selection of cards and limited
                    features. For the full experience, including card ownership and trading, premium packages are
                    available. Early access supporters receive exclusive bonuses and discounts.
                  </p>
                ),
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="gameplay" className="space-y-6">
          <div className="aspect-video bg-gray-800/50 border border-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="text-lg font-semibold mb-2">Gameplay Overview Video</h3>
              <p className="text-gray-400 mb-4">Watch a quick introduction to Crisis Unleashed gameplay</p>
              <Button className="bg-red-600 hover:bg-red-700">
                <Play className="h-4 w-4 mr-1" />
                Watch Video
              </Button>
            </div>
          </div>

          <InteractiveTutorial
            title="Card Types Tutorial"
            steps={[
              {
                title: "Hero Cards",
                content: (
                  <div className="space-y-3">
                    <p>
                      Hero Cards are the backbone of your strategy. Each hero has Health, Attack, and Defense stats,
                      along with unique abilities that can turn the tide of battle.
                    </p>
                    <p>
                      Heroes can be placed in any lane, but their abilities might be more effective in specific
                      positions.
                    </p>
                  </div>
                ),
                interaction: (
                  <div className="flex justify-center">
                    <div className="w-48 h-64 bg-blue-900/30 border border-blue-600/50 rounded-md flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-blue-600/50 mb-2"></div>
                      <div className="text-center">
                        <div className="font-bold text-blue-400">HERO CARD</div>
                        <div className="text-xs text-gray-400 mt-1">Click to inspect</div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: "Artifact Cards",
                content: (
                  <div className="space-y-3">
                    <p>
                      Artifacts provide powerful enhancements to your heroes. They can grant passive bonuses or
                      activated abilities that give you tactical advantages.
                    </p>
                    <p>You can only have one Artifact equipped per Hero, so choose wisely based on your strategy.</p>
                  </div>
                ),
                interaction: (
                  <div className="flex justify-center">
                    <div className="w-48 h-64 bg-purple-900/30 border border-purple-600/50 rounded-md flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-purple-600/50 mb-2"></div>
                      <div className="text-center">
                        <div className="font-bold text-purple-400">ARTIFACT CARD</div>
                        <div className="text-xs text-gray-400 mt-1">Click to inspect</div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: "Crisis Cards",
                content: (
                  <div className="space-y-3">
                    <p>
                      Crisis Cards represent global events that change the rules of the battlefield. All players must
                      adapt their strategies to these changing conditions.
                    </p>
                    <p>
                      Crisis events typically last 2-3 turns before a new event is drawn. Being able to pivot your
                      strategy is key to mastering Crisis Unleashed.
                    </p>
                  </div>
                ),
                interaction: (
                  <div className="flex justify-center">
                    <div className="w-48 h-64 bg-red-900/30 border border-red-600/50 rounded-md flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-red-600/50 mb-2"></div>
                      <div className="text-center">
                        <div className="font-bold text-red-400">CRISIS CARD</div>
                        <div className="text-xs text-gray-400 mt-1">Click to inspect</div>
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExpandableSection title="Understanding the Lane System" defaultOpen={true}>
              <div className="space-y-4">
                <p className="text-gray-300">
                  The battlefield in Crisis Unleashed is divided into three lanes, each with strategic importance:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                    <h4 className="font-semibold text-red-400 mb-1">Front Lane</h4>
                    <p className="text-xs text-gray-300">
                      Ideal for tanks and melee fighters. Cards here protect other lanes and often have higher defense.
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                    <h4 className="font-semibold text-yellow-400 mb-1">Middle Lane</h4>
                    <p className="text-xs text-gray-300">
                      Versatile position for balanced cards. Units here can attack any lane but are more vulnerable.
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                    <h4 className="font-semibold text-blue-400 mb-1">Back Lane</h4>
                    <p className="text-xs text-gray-300">
                      For support units and ranged attackers. Protected but can only be attacked by specific abilities.
                    </p>
                  </div>
                </div>
                <p className="text-gray-300">
                  Strategic positioning is crucial. Place your cards in lanes that maximize their abilities while
                  considering the current crisis event and your opponent's formation.
                </p>
                <FeedbackWidget sectionId="lane-system" />
              </div>
            </ExpandableSection>

            <ExpandableSection title="Resource Management" defaultOpen={true}>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Crisis Unleashed uses two primary resources that you'll need to manage carefully:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                    <h4 className="font-semibold text-yellow-400 mb-1">Power</h4>
                    <p className="text-xs text-gray-300">
                      The primary resource used to deploy cards and activate abilities. Power regenerates each turn and
                      increases over time.
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                    <h4 className="font-semibold text-purple-400 mb-1">Momentum</h4>
                    <p className="text-xs text-gray-300">
                      A special resource earned through combat and combos. Momentum powers each Hero's game-altering
                      Ultimate Moves.
                    </p>
                  </div>
                </div>
                <p className="text-gray-300">
                  Balancing these resources is key to victory. Sometimes it's worth saving Power for a big play next
                  turn, while other situations call for generating Momentum through aggressive actions.
                </p>
                <FeedbackWidget sectionId="resource-management" />
              </div>
            </ExpandableSection>
          </div>

          <ContextualFAQ
            sectionId="gameplay-faq"
            faqs={[
              {
                question: "How do I win a match in Crisis Unleashed?",
                answer: (
                  <p>
                    Victory in Crisis Unleashed is achieved by reducing your opponent's Nexus health to zero. You can
                    damage the Nexus by successfully attacking with your cards when there are no defending cards in the
                    opposing lane, or through special abilities that deal direct damage.
                  </p>
                ),
              },
              {
                question: "What happens when a Crisis card is played?",
                answer: (
                  <p>
                    Crisis cards are drawn automatically at the beginning of specific rounds and affect all players.
                    They change fundamental game rules temporarily, such as boosting certain card types, restricting
                    lane usage, or altering resource generation. Crisis events typically last 2-3 turns before a new
                    event is drawn.
                  </p>
                ),
              },
              {
                question: "Can I mix cards from different factions in my deck?",
                answer: (
                  <p>
                    Yes, you can include cards from different factions in your deck, but there are strategic
                    considerations. Cards from your chosen primary faction will have full effectiveness, while
                    off-faction cards may have reduced power or higher costs. Some cards have synergies with specific
                    factions, so building a focused deck often yields better results.
                  </p>
                ),
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResourceCard
              title="Beginner's Guide"
              description="A comprehensive guide covering all the basics you need to know to get started with Crisis Unleashed."
              type="guide"
              icon={<Book className="h-6 w-6" />}
              action={{
                label: "Download PDF",
                href: "/resources/beginners-guide.pdf",
                download: true,
              }}
            />
            <ResourceCard
              title="Card Type Overview"
              description="Learn about the different card types in Crisis Unleashed and how they interact on the battlefield."
              type="video"
              icon={<Video className="h-6 w-6" />}
              action={{
                label: "Watch Video",
                href: "https://www.youtube.com/watch?v=example",
              }}
            />
            <ResourceCard
              title="Faction Strategy Articles"
              description="In-depth articles exploring the strengths, weaknesses, and strategies for each faction."
              type="article"
              icon={<FileText className="h-6 w-6" />}
              action={{
                label: "Read Articles",
                href: "/resources/faction-strategies",
              }}
            />
            <ResourceCard
              title="Community Discord"
              description="Join our active Discord community to learn from experienced players and share strategies."
              type="community"
              icon={<Users className="h-6 w-6" />}
              action={{
                label: "Join Discord",
                href: "https://discord.gg/crisisunleashed",
              }}
            />
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">Downloadable Resources</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-900/30 p-2 rounded">
                    <Download className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium">Quick Reference Card</div>
                    <div className="text-xs text-gray-400">PDF • 2.4 MB</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-gray-600">
                  Download
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-900/30 p-2 rounded">
                    <Download className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium">Deck Building Guide</div>
                    <div className="text-xs text-gray-400">PDF • 3.8 MB</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-gray-600">
                  Download
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-900/30 p-2 rounded">
                    <Download className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium">Faction Ability Cards</div>
                    <div className="text-xs text-gray-400">PDF • 5.1 MB</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-gray-600">
                  Download
                </Button>
              </div>
            </div>
          </div>

          <ExpandableSection title="Video Tutorials">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/70 border border-gray-700 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  <Play className="h-12 w-12 text-gray-600" />
                </div>
                <div className="p-3">
                  <h4 className="font-medium">Getting Started with Crisis Unleashed</h4>
                  <p className="text-sm text-gray-400">
                    A complete walkthrough of your first game, from setup to victory.
                  </p>
                </div>
              </div>
              <div className="bg-gray-800/70 border border-gray-700 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  <Play className="h-12 w-12 text-gray-600" />
                </div>
                <div className="p-3">
                  <h4 className="font-medium">Advanced Tactics & Combos</h4>
                  <p className="text-sm text-gray-400">
                    Learn powerful card combinations and strategic plays from top players.
                  </p>
                </div>
              </div>
            </div>
          </ExpandableSection>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">Join Our Community</h3>
            <p className="text-gray-300 mb-4">
              Connect with other players, share strategies, participate in tournaments, and stay updated on the latest
              Crisis Unleashed news and events.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Users className="h-4 w-4 mr-2" />
                Join Discord
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <svg
                  className="h-4 w-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
                Follow on Twitter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-400 mb-2">Weekly Tournaments</h4>
              <p className="text-sm text-gray-300 mb-3">
                Compete against other players in our weekly tournaments with prizes for top performers.
              </p>
              <Button variant="outline" size="sm" className="w-full border-gray-600">
                View Schedule
              </Button>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-400 mb-2">Strategy Forums</h4>
              <p className="text-sm text-gray-300 mb-3">
                Discuss deck builds, card synergies, and gameplay tactics with the community.
              </p>
              <Button variant="outline" size="sm" className="w-full border-gray-600">
                Browse Forums
              </Button>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-400 mb-2">Content Creator Program</h4>
              <p className="text-sm text-gray-300 mb-3">
                Create videos, streams, or guides about Crisis Unleashed and join our partner program.
              </p>
              <Button variant="outline" size="sm" className="w-full border-gray-600">
                Learn More
              </Button>
            </div>
          </div>

          <ExpandableSection title="Community Events Calendar">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                <div>
                  <h4 className="font-medium text-cyan-400">Season 1 Championship</h4>
                  <p className="text-sm text-gray-300">The culmination of Season 1 with our top 16 players</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-300">June 15-16, 2023</div>
                  <Button size="sm" className="mt-1 bg-cyan-600 hover:bg-cyan-700">
                    Register
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                <div>
                  <h4 className="font-medium text-cyan-400">Community Card Design Contest</h4>
                  <p className="text-sm text-gray-300">Submit your card designs for a chance to be featured</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-300">Ongoing until July 1</div>
                  <Button size="sm" className="mt-1 bg-cyan-600 hover:bg-cyan-700">
                    Submit Design
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                <div>
                  <h4 className="font-medium text-cyan-400">Beginner's Workshop</h4>
                  <p className="text-sm text-gray-300">Learn the basics from experienced players</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-300">Every Saturday</div>
                  <Button size="sm" className="mt-1 bg-cyan-600 hover:bg-cyan-700">
                    Join Session
                  </Button>
                </div>
              </div>
            </div>
          </ExpandableSection>

          <ContextualFAQ
            sectionId="community-faq"
            faqs={[
              {
                question: "How can I contribute to the game's development?",
                answer: (
                  <p>
                    There are several ways to contribute! You can participate in our beta testing programs, provide
                    feedback through our community forums, join our Discord server to discuss ideas with developers, or
                    even submit card concepts during our design contests. We regularly implement community suggestions
                    and credit contributors.
                  </p>
                ),
              },
              {
                question: "Are there official tournaments with prizes?",
                answer: (
                  <p>
                    Yes! We host weekly tournaments with in-game rewards and monthly championships with larger prize
                    pools including exclusive cards and real-world merchandise. Our seasonal championships feature the
                    biggest prizes and are broadcast live with professional commentary.
                  </p>
                ),
              },
              {
                question: "How can I find other players to practice with?",
                answer: (
                  <p>
                    Our Discord server has dedicated channels for finding practice partners at all skill levels. You can
                    also use the in-game "Looking for Practice" feature to be matched with other players seeking
                    friendly matches. Additionally, our community forums have a "Practice Partners" section where you
                    can arrange scheduled sessions.
                  </p>
                ),
              },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
