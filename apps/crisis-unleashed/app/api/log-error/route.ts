import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Define the structure of an error log
interface ErrorLog {
  message: string
  source: string
  timestamp: string
  stack?: string
  componentName?: string
  additionalInfo?: Record<string, any>
  userId?: string
  sessionId?: string
  url?: string
  userAgent?: string
}

/**
 * Determines whether the provided data conforms to the required structure of an {@link ErrorLog}.
 *
 * @param data - The object to validate.
 * @returns True if {@link data} contains at least the required `message` and `source` string fields; otherwise, false.
 */
function isValidErrorLog(data: any): data is ErrorLog {
  return data && typeof data.message === "string" && typeof data.source === "string"
}

/**
 * Appends an error log entry to a daily JSON file in the designated log directory.
 *
 * If the log directory does not exist, it is created. The function reads existing logs for the current day, appends the new entry, and writes the updated array back to the file.
 *
 * @param errorLog - The error log entry to record.
 */
async function writeErrorToFile(errorLog: ErrorLog): Promise<void> {
  const logDir = process.env.ERROR_LOG_DIR || path.join(process.cwd(), "logs")

  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }

  const date = new Date().toISOString().split("T")[0] // YYYY-MM-DD
  const logFile = path.join(logDir, `errors-${date}.json`)

  let logs: ErrorLog[] = []

  // Read existing logs if file exists
  if (fs.existsSync(logFile)) {
    try {
      const fileContent = fs.readFileSync(logFile, "utf8")
      logs = JSON.parse(fileContent)
    } catch (error) {
      console.error("Error reading log file:", error)
    }
  }

  // Add new log
  logs.push(errorLog)

  // Write updated logs back to file
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2))
}

/**
 * Handles POST requests to log error information sent by clients.
 *
 * Parses and validates the incoming error log, enriches it with request metadata, and writes it to a daily log file if configured. Returns a JSON response indicating success or failure.
 *
 * @returns A JSON response indicating whether the error log was successfully processed.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse the request body
    const data = await request.json()

    // Validate the error log
    if (!isValidErrorLog(data)) {
      return NextResponse.json({ success: false, error: "Invalid error log format" }, { status: 400 })
    }

    // Ensure timestamp exists
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString()
    }

    // Enhance the error log with request data
    const enhancedLog: ErrorLog = {
      ...data,
      url: data.url || request.nextUrl.toString(),
      userAgent: data.userAgent || request.headers.get("user-agent") || "unknown",
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error logged:", enhancedLog)
    }

    // Write to file system if ERROR_LOG_DIR is set
    if (process.env.ERROR_LOG_DIR) {
      await writeErrorToFile(enhancedLog)
    }

    // Return success response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error handling error log:", error)

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

/**
 * Handles GET requests to verify the operational status of the error logging system.
 *
 * @returns A JSON response indicating the system is operational, including the current environment and timestamp.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "operational",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}
