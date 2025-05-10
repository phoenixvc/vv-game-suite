"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useErrorTesting } from "@/hooks/use-error-testing"
import { NavigationErrorBoundary } from "@/components/error-boundaries/navigation-error-boundary"
import { FormErrorBoundary } from "@/components/error-boundaries/form-error-boundary"
import { ContentErrorBoundary } from "@/components/error-boundaries/content-error-boundary"
import SharedNavigation from "@/components/shared-navigation"

/**
 * Renders a button that triggers an error simulation when clicked.
 *
 * @param onTrigger - Callback invoked when the button is clicked.
 * @param label - Text displayed on the button.
 */
function ErrorTriggerButton({ onTrigger, label }: { onTrigger: () => void; label: string }) {
  return (
    <Button variant="destructive" onClick={onTrigger} className="w-full">
      {label}
    </Button>
  )
}

/**
 * Demonstrates handling of navigation-related errors using a navigation error boundary.
 *
 * Renders a card UI that allows users to simulate a navigation component error, which is then caught by the {@link NavigationErrorBoundary}.
 */
function NavigationErrorDemo() {
  const { triggerError } = useErrorTesting({ componentName: "NavigationDemo" })

  return (
    <NavigationErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle>Navigation Error</CardTitle>
          <CardDescription>Test how navigation errors are handled</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This will simulate an error in the navigation component.</p>
          <ErrorTriggerButton
            onTrigger={() => triggerError("Navigation component crashed")}
            label="Trigger Navigation Error"
          />
        </CardContent>
      </Card>
    </NavigationErrorBoundary>
  )
}

/**
 * Demonstrates form error boundary handling by simulating a form component error and tracking boundary resets.
 *
 * Renders a card within a {@link FormErrorBoundary} that allows users to trigger a simulated form error and displays the number of times the boundary has been reset.
 */
function FormErrorDemo() {
  const { triggerError } = useErrorTesting({ componentName: "FormDemo" })
  const [resetCount, setResetCount] = useState(0)

  return (
    <FormErrorBoundary formName="DemoForm" onReset={() => setResetCount((prev) => prev + 1)}>
      <Card>
        <CardHeader>
          <CardTitle>Form Error</CardTitle>
          <CardDescription>Test how form errors are handled</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This will simulate an error in a form component. Reset count: {resetCount}</p>
          <ErrorTriggerButton onTrigger={() => triggerError("Form component crashed")} label="Trigger Form Error" />
        </CardContent>
      </Card>
    </FormErrorBoundary>
  )
}

/**
 * Demonstrates error handling for content components using a content-specific error boundary.
 *
 * Renders a card within a {@link ContentErrorBoundary} and provides a button to simulate a content component error.
 */
function ContentErrorDemo() {
  const { triggerError } = useErrorTesting({ componentName: "ContentDemo" })

  return (
    <ContentErrorBoundary contentName="DemoContent">
      <Card>
        <CardHeader>
          <CardTitle>Content Error</CardTitle>
          <CardDescription>Test how content errors are handled</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This will simulate an error in a content component.</p>
          <ErrorTriggerButton
            onTrigger={() => triggerError("Content component crashed")}
            label="Trigger Content Error"
          />
        </CardContent>
      </Card>
    </ContentErrorBoundary>
  )
}

/**
 * Demonstrates triggering a global error outside of component-specific error boundaries.
 *
 * Renders a card with a button that, when clicked, simulates a global error not handled by any local error boundary.
 */
function GlobalErrorDemo() {
  const { triggerError } = useErrorTesting({ componentName: "GlobalDemo" })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Error</CardTitle>
        <CardDescription>Test how global errors are handled</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">This will simulate an error that isn't caught by any component-specific boundary.</p>
        <ErrorTriggerButton onTrigger={() => triggerError("Global error triggered")} label="Trigger Global Error" />
      </CardContent>
    </Card>
  )
}

/**
 * Renders a demonstration page showcasing error boundary handling for navigation, form, content, and global errors using interactive UI components.
 *
 * The page includes tabs to switch between component-specific error boundary demos and a global error demo, each allowing users to trigger and observe error handling behavior.
 */
export default function ErrorBoundariesDemo() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <SharedNavigation />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Error Boundaries Demo</h1>

        <Tabs defaultValue="component">
          <TabsList className="mb-6">
            <TabsTrigger value="component">Component Errors</TabsTrigger>
            <TabsTrigger value="global">Global Error</TabsTrigger>
          </TabsList>

          <TabsContent value="component">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NavigationErrorDemo />
              <FormErrorDemo />
              <ContentErrorDemo />
            </div>
          </TabsContent>

          <TabsContent value="global">
            <GlobalErrorDemo />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
