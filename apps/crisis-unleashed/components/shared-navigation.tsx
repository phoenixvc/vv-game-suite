"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ResponsiveAnimatedLogo } from "@/components/responsive-animated-logo"
import { GuidedTourButton } from "@/components/onboarding/guided-tour-button"
import { ThemeModeToggle } from "@/components/theme-mode-toggle"
import AccessibilityControls from "@/components/accessibility-controls"

export function SharedNavigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    {
      name: "Cards",
      href: "/cards",
      dropdown: [
        { name: "Browse Cards", href: "/cards" },
        { name: "Card Types", href: "/cards/types" },
        { name: "Collections", href: "/cards/collections" },
      ],
    },
    {
      name: "Factions",
      href: "/factions",
      dropdown: [
        { name: "All Factions", href: "/factions" },
        { name: "Compare", href: "/factions/compare" },
        { name: "Select", href: "/factions/select" },
      ],
    },
    { name: "Card Designer", href: "/designer" },
    { name: "Gallery", href: "/gallery" },
    { name: "Examples", href: "/examples" },
    { name: "Logo System", href: "/logo-showcase" },
    { name: "About", href: "/about" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-gray-900/95 backdrop-blur-sm shadow-md" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <ResponsiveAnimatedLogo variant="horizontal" size="sm" className="text-white" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm rounded-md transition-colors",
                    pathname === item.href
                      ? "text-white bg-gray-800"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/60",
                  )}
                >
                  {item.name}
                </Link>

                {item.dropdown && (
                  <div className="absolute left-0 mt-1 w-48 origin-top-left rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            <GuidedTourButton />
            <ThemeModeToggle />
            <AccessibilityControls />

            <div className="hidden md:flex items-center space-x-2">
              <Link href="/login" className="px-3 py-1.5 text-sm text-gray-300 hover:text-white">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    pathname === item.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>

                {item.dropdown && (
                  <div className="pl-4 space-y-1 mt-1">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-3 py-2 rounded-md text-sm text-gray-400 hover:bg-gray-700 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-3">
                <Link
                  href="/login"
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
              <div className="mt-3 px-3">
                <Link
                  href="/signup"
                  className="block w-full px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// Add default export
export default SharedNavigation
