import { LogoError } from "@/components/logo-system/logo-error"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LogoError title="Page Not Found" message="The page you're looking for doesn't exist or has been moved." />
    </div>
  )
}
