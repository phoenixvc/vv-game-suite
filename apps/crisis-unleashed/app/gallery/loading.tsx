import { LogoLoading } from "@/components/logo-system/logo-loading"

/**
 * Displays a full-screen loading indicator for the gallery section.
 *
 * Renders a centered loading animation with the message "Loading gallery..." to indicate that gallery content is being loaded.
 */
export default function GalleryLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LogoLoading text="Loading gallery..." loadingType="bounce" faction="celestial-dominion" />
    </div>
  )
}
