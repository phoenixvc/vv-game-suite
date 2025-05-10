import { NextResponse } from "next/server"
import { logError } from "@/lib/error-logger"

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
