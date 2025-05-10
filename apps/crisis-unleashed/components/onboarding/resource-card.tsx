import type React from "react"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ResourceCardProps {
  title: string
  description: string
  type: "guide" | "video" | "article" | "community"
  icon: React.ReactNode
  action: {
    label: string
    href: string
    download?: boolean
  }
  className?: string
}

export function ResourceCard({ title, description, type, icon, action, className = "" }: ResourceCardProps) {
  return (
    <div
      className={`bg-gray-800/70 border border-gray-700 rounded-lg p-5 hover:border-cyan-600/50 transition-all hover:shadow-md ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="bg-gray-700/70 p-3 rounded-lg text-cyan-400">{icon}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-white">{title}</h3>
            <span
              className={`text-xs px-2 py-1 rounded ${
                type === "guide"
                  ? "bg-blue-900/50 text-blue-300"
                  : type === "video"
                    ? "bg-red-900/50 text-red-300"
                    : type === "article"
                      ? "bg-green-900/50 text-green-300"
                      : "bg-purple-900/50 text-purple-300"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </div>
          <p className="text-gray-300 text-sm mt-2 mb-4">{description}</p>
          <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700" asChild>
            <Link href={action.href} download={action.download} target={action.download ? undefined : "_blank"}>
              {action.download ? <Download className="h-4 w-4 mr-1" /> : <ExternalLink className="h-4 w-4 mr-1" />}
              {action.label}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
