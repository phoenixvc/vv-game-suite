"use client"
import { ErrorMonitor } from "@/components/admin/error-monitor"
import { ContentErrorBoundary } from "@/components/error-boundaries/content-error-boundary"
import SharedNavigation from "@/components/shared-navigation"
import { Container } from "@/components/ui/container"

/**
 * Renders the admin error logs page with navigation, heading, and error monitoring UI.
 *
 * Displays a heading and the {@link ErrorMonitor} component within a {@link ContentErrorBoundary} to handle runtime errors gracefully.
 */
export default function ErrorLogsPage() {
  return (
    <Container>
      <SharedNavigation />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Error Logs</h1>

        <ContentErrorBoundary contentName="Error Logs">
            <ErrorMonitor />
        </ContentErrorBoundary>
      </main>
    </Container>
  )
}