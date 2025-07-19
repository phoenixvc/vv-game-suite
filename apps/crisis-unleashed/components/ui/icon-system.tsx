"use client"

import { cn } from "@/lib/utils"

interface IconProps {
  className?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  'aria-hidden'?: boolean
}

const iconSizes = {
  xs: "h-3 w-3",
  sm: "h-4 w-4", 
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8"
}

// Navigation Icons
export function MenuIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function CloseIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export function ChevronDownIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="currentColor" 
      viewBox="0 0 20 20"
      {...props}
    >
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  )
}

// State Icons
export function LoadingIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], "animate-spin", className)} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 7.464" />
    </svg>
  )
}

export function CheckIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function ErrorIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export function WarningIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

export function InfoIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

// Action Icons
export function EditIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

export function DeleteIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

export function CopyIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

export function RefreshIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

// Gaming Specific Icons
export function CardIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-3 3-3-3-12 12c0 1.657 1.343 3 3 3s3-1.343 3-3v-3c0-1.657 1.343-3 3-3h3l3-3z" />
    </svg>
  )
}

export function ShieldIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

export function StarIcon({ className, size = "md", filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill={filled ? "currentColor" : "none"} 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
}

// Social Icons
export function TwitterIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
  )
}

export function DiscordIcon({ className, size = "md", ...props }: IconProps) {
  return (
    <svg 
      className={cn(iconSizes[size], className)} 
      fill="currentColor" 
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  )
}

// Utility component for consistent icon usage
interface StatusIconProps extends IconProps {
  status: "success" | "error" | "warning" | "info" | "loading"
}

export function StatusIcon({ status, className, size = "md", ...props }: StatusIconProps) {
  const statusConfig = {
    success: { Icon: CheckIcon, color: "text-green-400" },
    error: { Icon: ErrorIcon, color: "text-red-400" },
    warning: { Icon: WarningIcon, color: "text-yellow-400" },
    info: { Icon: InfoIcon, color: "text-blue-400" },
    loading: { Icon: LoadingIcon, color: "text-gray-400" }
  }

  const { Icon, color } = statusConfig[status]

  return (
    <Icon 
      className={cn(color, className)} 
      size={size} 
      {...props}
    />
  )
}

// Icon button component for consistent interactive icons
interface IconButtonProps {
  icon: React.ComponentType<IconProps>
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  ariaLabel: string
  className?: string
}

export function IconButton({
  icon: Icon,
  onClick,
  variant = "ghost",
  size = "md",
  disabled = false,
  ariaLabel,
  className
}: IconButtonProps) {
  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3"
  }

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary", 
    ghost: "hover:bg-gray-700 text-gray-300 hover:text-white rounded-md transition-colors"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "interactive-element flex items-center justify-center",
        sizeClasses[size],
        variantClasses[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <Icon size={size} aria-hidden="true" />
    </button>
  )
}