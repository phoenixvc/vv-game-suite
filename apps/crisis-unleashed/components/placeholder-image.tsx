import Image from "next/image"

interface PlaceholderImageProps {
  width: number
  height: number
  text?: string
  className?: string
}

export function PlaceholderImage({ width, height, text, className = "" }: PlaceholderImageProps) {
  const query = encodeURIComponent(text || "placeholder image")
  const src = `/placeholder.svg?height=${height}&width=${width}&query=${query}`

  return (
    <div
      className={`bg-gray-200 flex items-center justify-center overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={text || "Placeholder image"}
        width={width}
        height={height}
        className="object-cover"
      />
    </div>
  )
}
