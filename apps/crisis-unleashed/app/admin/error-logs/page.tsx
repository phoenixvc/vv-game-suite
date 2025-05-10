"use client"
import { ErrorMonitor } from "@/components/admin/error-monitor"
import SharedNavigation from "@/components/shared-navigation"
import { ContentErrorBoundary } from "@/components/error-boundaries/content-error-boundary"

export default function ErrorLogsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <SharedNavigation />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Error Logs</h1>

        <ContentErrorBoundary contentName="ErrorMonitor">
          <ErrorMonitor />
        </ContentErrorBoundary>
      </main>
    </div>
  )
}
