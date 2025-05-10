"use client"

import type { LogoSize, LogoVariant } from "@/components/logo-system"; // Correct import
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface LogoErrorProps {
  variant?: LogoVariant
  size?: LogoSize
  className?: string
  message?: string
  showIcon?: boolean
  title?: string
}

export function LogoError({
  variant = "standard",
  size = "md",
  className,
  message = "Logo failed to load",
  showIcon = true,
  title = "Logo not found",
}: LogoErrorProps) {
  return (
<div className={cn("flex flex-col items-center justify-center gap-2", className)}>
  {title && <h3 className="text-gray-700 dark:text-gray-300 text-sm font-medium">{title}</h3>}
  {showIcon && (
    <div className="text-red-500 dark:text-red-400">
      <AlertTriangle size={24} />
    </div>
  )}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-2 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400 font-mono text-xs">LOGO</div>
      </div>
      {message && <p className="text-red-500 dark:text-red-400 text-xs">{message}</p>}
    </div>
  )
}

// Also export as default for backward compatibility
export default LogoError
