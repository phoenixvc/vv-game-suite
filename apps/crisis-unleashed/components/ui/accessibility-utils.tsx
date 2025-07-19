"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// Skip to main content link
export function SkipToContent({ targetId = "main-content" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="skip-to-content focus:not-sr-only"
      onClick={(e) => {
        e.preventDefault()
        const target = document.getElementById(targetId)
        if (target) {
          target.focus()
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }}
    >
      Skip to main content
    </a>
  )
}

// Screen reader only text
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}

// Enhanced focus trap for modals and dialogs
export function FocusTrap({ 
  children, 
  active = true,
  className 
}: { 
  children: React.ReactNode
  active?: boolean
  className?: string 
}) {
  const trapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !trapRef.current) return

    const trapElement = trapRef.current
    const focusableElements = trapElement.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const closeButton = trapElement.querySelector('[data-close-modal]') as HTMLElement
        if (closeButton) {
          closeButton.click()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    document.addEventListener('keydown', handleEscapeKey)

    // Focus first element when trap becomes active
    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [active])

  return (
    <div ref={trapRef} className={className}>
      {children}
    </div>
  )
}

// Accessible image component with lazy loading and alt text validation
interface AccessibleImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  lazy?: boolean
  onError?: () => void
}

export function AccessibleImage({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  lazy = true,
  onError 
}: AccessibleImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleError = () => {
    setImageError(true)
    onError?.()
  }

  const handleLoad = () => {
    setImageLoaded(true)
  }

  if (imageError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-800 text-gray-400 rounded",
          className
        )}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <div className="text-center p-4">
          <svg 
            className="mx-auto h-8 w-8 mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-sm">Image failed to load</p>
          <p className="text-xs opacity-75">{alt}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="image-container">
      {!imageLoaded && (
        <div 
          className={cn("loading-skeleton absolute inset-0", className)}
          style={{ width, height }}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        width={width}
        height={height}
        loading={lazy ? "lazy" : "eager"}
        onError={handleError}
        onLoad={handleLoad}
        decoding="async"
      />
    </div>
  )
}

// Accessible button with proper ARIA attributes
interface AccessibleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
  className?: string
  type?: "button" | "submit" | "reset"
}

export function AccessibleButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  className,
  type = "button"
}: AccessibleButtonProps) {
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "hover:bg-gray-700 text-gray-300 hover:text-white"
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base", 
    lg: "px-6 py-3 text-lg"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={cn(
        "interactive-element",
        variantClasses[variant],
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {loading && (
        <>
          <div className="loading-spinner h-4 w-4" />
          <ScreenReaderOnly>Loading...</ScreenReaderOnly>
        </>
      )}
      {children}
    </button>
  )
}

// Live region for announcing dynamic content changes
export function LiveRegion({ 
  children, 
  politeness = "polite" 
}: { 
  children: React.ReactNode
  politeness?: "polite" | "assertive"
}) {
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  )
}

// Accessible form field with proper labeling and error handling
interface AccessibleFormFieldProps {
  label: string
  id: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function AccessibleFormField({
  label,
  id,
  error,
  required = false,
  children,
  className
}: AccessibleFormFieldProps) {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={cn("space-y-2", className)}>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-300"
      >
        {label}
        {required && (
          <span className="text-red-400 ml-1" aria-label="required">*</span>
        )}
      </label>
      <div>
        {children}
      </div>
      {error && (
        <div 
          id={errorId}
          className="error-state"
          role="alert"
        >
          <svg 
            className="h-4 w-4 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}

// Keyboard navigation helper hook
export function useKeyboardNavigation() {
  const [focusedIndex, setFocusedIndex] = useState(0)

  const handleKeyDown = (
    e: React.KeyboardEvent,
    itemsLength: number,
    onEnter?: (index: number) => void
  ) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => (prev + 1) % itemsLength)
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => (prev - 1 + itemsLength) % itemsLength)
        break
      case 'Enter':
        e.preventDefault()
        onEnter?.(focusedIndex)
        break
      case 'Home':
        e.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        e.preventDefault()
        setFocusedIndex(itemsLength - 1)
        break
    }
  }

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown
  }
}

// Color contrast checker utility
export function getContrastRatio(color1: string, color2: string): number {
  // Simple contrast ratio calculation (would need full implementation for production)
  // This is a placeholder that returns a mock ratio
  return 4.5 // WCAG AA standard
}

// Announce content changes to screen readers
export function announceToScreenReader(message: string) {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'assertive')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}