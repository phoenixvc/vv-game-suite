"use client"

import { AnimationErrorBoundary } from "@/components/error-boundaries/animation-error-boundary"
import { CardCollectionErrorBoundary } from "@/components/error-boundaries/card-collection-error-boundary"
import { CardPreviewErrorBoundary } from "@/components/error-boundaries/card-preview-error-boundary"
import { ContentErrorBoundary } from "@/components/error-boundaries/content-error-boundary"
import { FactionThemeErrorBoundary } from "@/components/error-boundaries/faction-theme-error-boundary"
import { ImageLoadingErrorBoundary } from "@/components/error-boundaries/image-loading-error-boundary"
import { ErrorSafeImage } from "@/components/error-safe-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

/**
 * Renders a button that, when clicked, throws an error with a customizable message.
 *
 * @param errorMessage - The error message to use when throwing the error.
 * @param throwOnRender - If true, the error is thrown immediately on initial render.
 *
 * @throws {Error} When the button is clicked or if {@link throwOnRender} is true on mount.
 */
function ErrorThrower({ errorMessage = "Test error", throwOnRender = false }) {
  const [shouldThrow, setShouldThrow] = useState(throwOnRender)

  if (shouldThrow) {
    throw new Error(errorMessage)
  }

  return <Button onClick={() => setShouldThrow(true)}>Trigger Error</Button>
}

/**
 * Renders an animated box with a button that triggers an error when clicked.
 *
 * @throws {Error} When the "Break Animation" button is clicked, throws an "Animation calculation error".
 */
function BrokenAnimation() {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw new Error("Animation calculation error")
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-32 h-32 bg-purple-500 rounded-lg animate-pulse flex items-center justify-center">
        <span className="text-white">Animation</span>
      </div>
      <Button size="sm" onClick={() => setShouldThrow(true)}>
        Break Animation
      </Button>
    </div>
  )
}

/**
 * Renders a mock card preview that throws an error when the "Break Card" button is clicked.
 *
 * @remark Throws an error with the message "Card rendering error" when triggered, intended for testing error boundaries.
 */
function BrokenCardPreview() {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw new Error("Card rendering error")
  }

  const mockCard = {
    id: "test-card",
    name: "Test Card",
    type: "Hero",
    description: "This is a test card",
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-64 h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="font-bold">{mockCard.name}</h3>
          <p className="text-sm">{mockCard.type}</p>
          <p className="mt-4 text-xs">{mockCard.description}</p>
        </div>
      </div>
      <Button size="sm" onClick={() => setShouldThrow(true)}>
        Break Card
      </Button>
    </div>
  )
}

/**
 * Displays an image that can be deliberately broken to simulate a loading error.
 *
 * Renders a valid image by default, and switches to an invalid image source when the "Break Image" button is clicked to trigger an image load failure.
 */
function BrokenImage() {
  const [shouldBreak, setShouldBreak] = useState(false)

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-64 h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        {shouldBreak ? (
          // Invalid image source that will cause an error
          <img src="/this-image-does-not-exist.jpg" alt="Broken Image" className="w-full h-full object-cover" />
        ) : (
          <img src="/test-image.png" alt="Test Image" className="w-full h-full object-cover" />
        )}
      </div>
      <Button size="sm" onClick={() => setShouldBreak(true)}>
        Break Image
      </Button>
    </div>
  )
}

/**
 * Demonstrates various error boundaries in the application using interactive UI examples.
 *
 * Renders a tabbed interface where each tab showcases a different error boundary component, allowing users to trigger and observe error handling for card previews, animations, collections, themes, and images. Also includes a content section wrapped in an error boundary to illustrate graceful error recovery in content areas.
 */
export default function ErrorBoundariesShowcase() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Error Boundaries Showcase</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        This page demonstrates the various error boundaries in the application. Click the buttons to trigger errors and
        see how they're handled.
      </p>

      <Tabs defaultValue="card-preview">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="card-preview">Card Preview</TabsTrigger>
          <TabsTrigger value="animation">Animation</TabsTrigger>
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
        </TabsList>

        <TabsContent value="card-preview">
          <Card>
            <CardHeader>
              <CardTitle>Card Preview Error Boundary</CardTitle>
              <CardDescription>
                Handles errors in card preview components without affecting the rest of the UI.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CardPreviewErrorBoundary cardData={{ id: "test", name: "Test Card", type: "Hero", description: "A test hero card for error boundary demonstration" }}>
                <BrokenCardPreview />
              </CardPreviewErrorBoundary>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 border-t pt-4">
              When a card fails to render, users see a fallback UI with basic card info and a retry option.
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="animation">
          <Card>
            <CardHeader>
              <CardTitle>Animation Error Boundary</CardTitle>
              <CardDescription>Prevents animation errors from crashing the application.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <AnimationErrorBoundary animationName="TestAnimation">
                <BrokenAnimation />
              </AnimationErrorBoundary>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 border-t pt-4">
              When animations fail, they're replaced with a static fallback that allows users to retry.
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="collection">
          <Card>
            <CardHeader>
              <CardTitle>Card Collection Error Boundary</CardTitle>
              <CardDescription>Handles errors in card collections and provides recovery options.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CardCollectionErrorBoundary collectionName="Test Collection">
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="bg-gray-200 dark:bg-gray-700 h-40 rounded"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-40 rounded"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-40 rounded"></div>
                  <div className="col-span-3 flex justify-center mt-4">
                    <ErrorThrower errorMessage="Collection loading error" />
                  </div>
                </div>
              </CardCollectionErrorBoundary>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 border-t pt-4">
              When a collection fails to load, users can reload or reset the cache.
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Faction Theme Error Boundary</CardTitle>
              <CardDescription>Handles errors in faction themes and falls back to default styling.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <FactionThemeErrorBoundary themeName="Test Theme">
                <div className="p-6 bg-purple-100 dark:bg-purple-900 rounded-lg text-center">
                  <h3 className="text-lg font-bold mb-4">Custom Theme Elements</h3>
                  <p className="mb-4">This section uses custom theme styling</p>
                  <ErrorThrower errorMessage="Theme rendering error" />
                </div>
              </FactionThemeErrorBoundary>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 border-t pt-4">
              When a theme fails, it falls back to default styling and allows users to retry.
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle>Image Loading Error Boundary</CardTitle>
              <CardDescription>Handles image loading errors and provides fallbacks.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center space-x-8">
              <div>
                <h3 className="text-center mb-4">Standard Implementation</h3>
                <ImageLoadingErrorBoundary imageSrc="/test-image.png" imageAlt="Test Image" width={200} height={150}>
                  <BrokenImage />
                </ImageLoadingErrorBoundary>
              </div>

              <div>
                <h3 className="text-center mb-4">ErrorSafeImage Component</h3>
                <ErrorSafeImage
                  src={"/this-will-fail.jpg"}
                  alt="This will fail to load"
                  width={200}
                  height={150}
                  fallbackSrc="/generic-placeholder-image.png"
                />
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 border-t pt-4">
              When images fail to load, they're replaced with fallbacks or placeholders.
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Content Error Boundary Example</h2>
        <ContentErrorBoundary contentName="Demo">
          <Card>
            <CardHeader>
              <CardTitle>Content Section</CardTitle>
              <CardDescription>This content is wrapped in a ContentErrorBoundary</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">This is a content section that might contain errors.</p>
              <ErrorThrower errorMessage="Content section error" />
            </CardContent>
          </Card>
        </ContentErrorBoundary>
      </div>
    </div>
  )
}
