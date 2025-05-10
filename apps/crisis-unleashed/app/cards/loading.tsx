import { LogoLoading } from "@/components/logo-system/logo-loading"

export default function CardsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LogoLoading text="Loading cards..." loadingType="pulse" />
    </div>
  )
}
