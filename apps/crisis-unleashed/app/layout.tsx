import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AccessibilityControls } from "@/components/accessibility-controls"
import SharedNavigation from "@/components/shared-navigation"
import SharedFooter from "@/components/shared-footer"
import { ErrorBoundaryProvider } from "@/contexts/error-boundary-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Crisis Unleashed",
  description: "Strategic card combat game with faction-based gameplay and immersive world-building",
    generator: 'v0.dev'
}

/**
 * Defines the root layout for the application, providing global structure, theming, error boundaries, navigation, footer, and accessibility controls.
 *
 * Wraps all page content with providers and shared UI components to ensure consistent appearance and behavior across the app.
 *
 * @param children - The page content to be rendered within the layout.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ErrorBoundaryProvider>
            <div className="flex flex-col min-h-screen">
              <SharedNavigation />
              <main className="flex-grow">{children}</main>
              <SharedFooter />
            </div>
            <AccessibilityControls />
          </ErrorBoundaryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
