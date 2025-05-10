import { LogoLoading } from "@/components/logo-system/logo-loading"

export default function GalleryLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LogoLoading text="Loading gallery..." loadingType="bounce" faction="celestial-dominion" />
    </div>
  )
}
