import { NextResponse } from "next/server"
import { logError } from "@/lib/error-logger"

/**
 * Handles POST requests by deliberately triggering and logging a test server error.
 *
 * Returns a JSON response with a 500 status code and error details, simulating a server-side failure for testing purposes.
 *
 * @returns A JSON response indicating failure and the error message, with HTTP status 500.
 *
 * @remark This endpoint is intended for testing error handling and logging mechanisms; it always triggers a server error.
 */
export async function POST() {
  try {
    // Intentionally throw an error
    throw new Error("Test server error triggered manually")
  } catch (error) {
    if (error instanceof Error) {
      // Log the error
      logError({
        message: error.message,
        source: "server",
        stack: error.stack,
        additionalInfo: { triggered: "manually", test: true },
      })

      // Return error response
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 })
  }
}
