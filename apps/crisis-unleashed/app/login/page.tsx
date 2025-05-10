import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

/**
 * Renders the login page interface with email and password fields, alternative login options, and navigation links.
 *
 * Displays a centered, styled login form with fields for email and password, a "Remember me" checkbox, and a submit button. Also provides options to log in with Google or Discord, and links to password recovery and signup pages.
 *
 * @returns The React element representing the login page UI.
 */
export default function LoginPage() {
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
          <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>

          <form>
            <div className="space-y-4">
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
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="bg-gray-700 border-gray-600 mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                Login
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-400 mb-4">Or continue with</p>
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
              Don't have an account?{" "}
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
