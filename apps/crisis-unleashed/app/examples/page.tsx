import SharedNavigation from "@/components/shared-navigation"
import ErrorPageDemo from "./error-page-demo"
import ParallaxDemo from "./parallax-demo"

/**
 * Renders the examples page showcasing custom components with styled layouts.
 *
 * Displays a navigation bar, a heading, a description, and two example sections: a styled error page and a parallax element demo.
 */
export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SharedNavigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">Component Examples</h1>
          <p className="text-xl text-center mb-12 text-gray-300 max-w-3xl mx-auto">
            Explore examples of custom components for Crisis Unleashed
          </p>

          <div className="grid grid-cols-1 gap-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Styled Error Page</h2>
              <ErrorPageDemo />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Parallax Element</h2>
              <div className="relative h-80 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <ParallaxDemo />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
