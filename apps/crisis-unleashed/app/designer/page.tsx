import { CardDesigner } from "@/components/card-designer"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function DesignerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white py-8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/designer-background.png')" }}
      ></div>
      <div className="relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-end mb-4">
            <ThemeSwitcher />
          </div>
          <CardDesigner />
        </div>
      </div>
    </div>
  )
}
