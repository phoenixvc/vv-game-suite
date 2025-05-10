import Link from "next/link"
import { ResponsiveAnimatedLogo } from "@/components/responsive-animated-logo"

export function SharedFooter() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <ResponsiveAnimatedLogo variant="icon-only" size="sm" className="h-8 w-8" />
              <span className="font-bold text-xl">Crisis Unleashed</span>
            </Link>
            <p className="text-slate-400 text-sm">
              Strategic card combat game with faction-based gameplay and immersive world-building.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Game</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cards" className="text-slate-400 hover:text-white transition-colors">
                  Cards
                </Link>
              </li>
              <li>
                <Link href="/factions" className="text-slate-400 hover:text-white transition-colors">
                  Factions
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-slate-400 hover:text-white transition-colors">
                  Learn
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/forum" className="text-slate-400 hover:text-white transition-colors">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/discord" className="text-slate-400 hover:text-white transition-colors">
                  Discord
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-slate-400 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/support" className="text-slate-400 hover:text-white transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-slate-400 hover:text-white transition-colors">
                  Guides
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">© 2025 Crisis Unleashed. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">
              Terms
            </Link>
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">
              Privacy
            </Link>
            <Link href="/cookies" className="text-slate-400 hover:text-white transition-colors text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SharedFooter
