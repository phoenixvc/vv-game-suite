"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ResponsiveAnimatedLogo } from "@/components/responsive-animated-logo"
import { GuidedTourButton } from "@/components/onboarding/guided-tour-button"
import { ThemeModeToggle } from "@/components/theme-mode-toggle"
import AccessibilityControls from "@/components/accessibility-controls"
import { SkipToContent, ScreenReaderOnly, useKeyboardNavigation } from "@/components/ui/accessibility-utils"

export function SharedNavigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setOpenDropdown(null)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("keydown", handleEscape)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("keydown", handleEscape)
    }
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
    <>
      <SkipToContent targetId="main-content" />
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-gray-900/95 backdrop-blur-sm shadow-md" : "bg-transparent",
        )}
        role="banner"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 safe-container">
          <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <ResponsiveAnimatedLogo variant="horizontal" size="sm" className="text-white" />
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex space-x-1 flex-1 justify-center"
            role="navigation"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <button
                    className={cn(
                      "px-3 py-2 text-sm rounded-md transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900",
                      pathname === item.href
                        ? "text-white bg-gray-800"
                        : "text-gray-100 hover:text-white hover:bg-gray-800/60",
                    )}
                    onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setOpenDropdown(openDropdown === item.name ? null : item.name)
                      }
                    }}
                    aria-expanded={openDropdown === item.name}
                    aria-haspopup="true"
                  >
                    {item.name}
                    <svg className="ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "px-3 py-2 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900",
                      pathname === item.href
                        ? "text-white bg-gray-800"
                        : "text-gray-100 hover:text-white hover:bg-gray-800/60",
                    )}
                  >
                    {item.name}
                  </Link>
                )}

                {item.dropdown && openDropdown === item.name && (
                  <div className="absolute left-0 mt-1 w-48 origin-top-left rounded-md bg-gray-800 shadow-lg ring-1 ring-gray-600 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {item.dropdown.map((subItem, index) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          role="menuitem"
                          className="block px-4 py-2 text-sm text-gray-100 hover:bg-gray-700 hover:text-white focus:outline-none focus:bg-gray-700 focus:text-white transition-colors"
                          onClick={() => setOpenDropdown(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                              e.preventDefault()
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                              nextElement?.focus()
                            } else if (e.key === 'ArrowUp') {
                              e.preventDefault()
                              const prevElement = e.currentTarget.previousElementSibling as HTMLElement
                              prevElement?.focus()
                            } else if (e.key === 'Escape') {
                              setOpenDropdown(null)
                            }
                          }}
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
          <div className="flex items-center space-x-2 flex-shrink-0">
            <GuidedTourButton />
            <ThemeModeToggle />
            <AccessibilityControls />

            <div className="hidden md:flex items-center space-x-2">
              <Link 
                href="/login" 
                className="nav-link text-sm min-w-[80px] justify-center"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="btn-primary text-sm"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
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
        <div 
          id="mobile-menu" 
          className="md:hidden bg-gray-900 shadow-lg safe-container" 
          role="navigation" 
          aria-label="Mobile navigation"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors",
                    pathname === item.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-100 hover:bg-gray-700 hover:text-white",
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
                        className="block px-3 py-2 rounded-md text-sm text-gray-200 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
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
              <div className="px-3 space-y-2">
                <Link
                  href="/login"
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-100 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary w-full justify-center text-base font-medium"
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
    </>
  )
}

// Add default export
export default SharedNavigation
