import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

/**
 * Renders a full-page, styled signup interface for user registration.
 *
 * Displays a registration form with fields for username, email, and password, a terms agreement checkbox, and a submit button. Also provides alternative sign-up options via Google and Discord, and a link for existing users to log in.
 *
 * @remark This component is purely presentational and does not handle form submission, validation, or state management.
 */
export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <img
              src="/crisis-unleashed-logo.png"
              alt="Crisis Unleashed"
              width={60}
              height={60}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Crisis Unleashed
            </h1>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>

          <form>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  className="bg-gray-700 border-gray-600 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-700 border-gray-600 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  className="bg-gray-700 border-gray-600 mt-1"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Password must be at least 8 characters long with a mix of letters, numbers, and symbols.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-cyan-400 hover:text-cyan-300">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                Sign Up
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-400 mb-4">Or sign up with</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="flex-1 border-gray-600 bg-gray-700 hover:bg-gray-600">
                Google
              </Button>
              <Button variant="outline" className="flex-1 border-gray-600 bg-gray-700 hover:bg-gray-600">
                Discord
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
