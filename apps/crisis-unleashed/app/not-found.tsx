import ErrorBoundary from "@/components/error-boundary";
import LogoError from "@/components/logo-system/logo-error";

/**
 * Displays a custom 404 error page with graceful error handling.
 *
 * Renders a centered message indicating that the requested page was not found, wrapped in an error boundary to handle unexpected rendering errors.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorBoundary fallback={<div>Something went wrong loading the error page.</div>}>
        <LogoError title="Page Not Found" message="The page you're looking for doesn't exist or has been moved." />
      </ErrorBoundary>
    </div>
  )
}