import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

/**
 * Handles a GET request to check the existence and validity of the "crisis-unleashed-logo.png" file in the public directory.
 *
 * Returns a JSON response indicating whether the logo file exists, if its size exceeds 100 bytes, its size in bytes, and its last modification timestamp. If the file is missing, responds with a 404 status. If an error occurs during the check, responds with a 500 status and an error message.
 *
 * @returns A JSON response with logo file status and metadata.
 */
export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public")
    const logoPath = path.join(publicDir, "crisis-unleashed-logo.png")

    const exists = fs.existsSync(logoPath)

    if (!exists) {
      return NextResponse.json({ exists: false, message: "Logo file not found" }, { status: 404 })
    }

    // Get file stats to check if it's a valid image
    const stats = fs.statSync(logoPath)
    const isValidSize = stats.size > 100 // Arbitrary minimum size to check if file isn't empty/corrupted

    return NextResponse.json({
      exists: true,
      isValid: isValidSize,
      size: stats.size,
      lastModified: stats.mtime,
    })
  } catch (error) {
    console.error("Error checking logo:", error)
    return NextResponse.json({ exists: false, error: "Error checking logo" }, { status: 500 })
  }
}
