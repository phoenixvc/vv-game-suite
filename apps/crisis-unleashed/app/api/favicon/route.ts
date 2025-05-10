import { type NextRequest, NextResponse } from "next/server"
import { getFactionColor } from "@/lib/logo-system"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const faction = searchParams.get("faction") || "cybernetic-nexus"
  const size = Number.parseInt(searchParams.get("size") || "32", 10)
  const monochrome = searchParams.get("monochrome") === "true"
  const inverted = searchParams.get("inverted") === "true"

  // Create a canvas to generate the favicon
  const canvas = new OffscreenCanvas(size, size)
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return new NextResponse("Could not get canvas context", { status: 500 })
  }

  // Fill background (white or transparent)
  ctx.fillStyle = "transparent"
  ctx.fillRect(0, 0, size, size)

  // Draw a simple icon based on faction
  ctx.fillStyle = getFactionColor(faction, monochrome, inverted)

  // Center circle as a simple representation
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size * 0.4, 0, Math.PI * 2)
  ctx.fill()

  // Add some faction-specific details
  if (faction === "cybernetic-nexus") {
    // Add circuit lines
    ctx.strokeStyle = inverted ? "#ffffff" : "#333333"
    ctx.lineWidth = Math.max(1, size * 0.05)
    ctx.beginPath()
    ctx.moveTo(size * 0.3, size * 0.5)
    ctx.lineTo(size * 0.7, size * 0.5)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(size * 0.5, size * 0.3)
    ctx.lineTo(size * 0.5, size * 0.7)
    ctx.stroke()
  }

  // Convert canvas to PNG
  const imageData = await canvas.convertToBlob({ type: "image/png" })
  const arrayBuffer = await imageData.arrayBuffer()

  // Return the PNG image
  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
