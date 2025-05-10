import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

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
