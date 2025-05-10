import { LogoLoading } from "@/components/logo-system/logo-loading"

/**
 * Displays a full-screen loading indicator for card-related content.
 *
 * Renders a centered loading animation with the message "Loading cards..." to indicate that card data is being loaded.
 */
export default function CardsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LogoLoading text="Loading cards..." loadingType="pulse" />
    </div>
  )
}
