"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { FocusTrap, ScreenReaderOnly } from "./accessibility-utils"

interface EnhancedModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  className?: string
  overlayClassName?: string
  preventScroll?: boolean
}

export function EnhancedModal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  overlayClassName,
  preventScroll = true
}: EnhancedModalProps) {
  const [mounted, setMounted] = useState(false)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    // Prevent body scroll
    if (preventScroll) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isOpen, preventScroll])

  useEffect(() => {
    if (!closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, closeOnEscape])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleClose = () => {
    onClose()
    // Return focus to the previously focused element
    setTimeout(() => {
      previousActiveElement.current?.focus()
    }, 100)
  }

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] max-h-[95vh]"
  }

  if (!mounted || !isOpen) return null

  const modalContent = (
    <div
      className={cn("modal-overlay", overlayClassName)}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby="modal-content"
    >
      <FocusTrap active={isOpen}>
        <div
          className={cn(
            "modal-content w-full",
            sizeClasses[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
              {title && (
                <h2 
                  id="modal-title"
                  className="text-xl font-semibold text-white responsive-text"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="modal-close-btn"
                  aria-label="Close modal"
                  data-close-modal
                >
                  <svg 
                    className="h-5 w-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div id="modal-content" className="overflow-y-auto max-h-[70vh]">
            {children}
          </div>
        </div>
      </FocusTrap>
    </div>
  )

  return createPortal(modalContent, document.body)
}

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "danger" | "warning"
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default"
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const variantStyles = {
    default: {
      confirmBtn: "btn-primary",
      icon: "text-blue-400"
    },
    danger: {
      confirmBtn: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-all",
      icon: "text-red-400"
    },
    warning: {
      confirmBtn: "bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-all",
      icon: "text-yellow-400"
    }
  }

  return (
    <EnhancedModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      className="text-center"
    >
      <div className="mb-6">
        <div className={cn("mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full", 
          variant === 'danger' ? 'bg-red-600/20' : 
          variant === 'warning' ? 'bg-yellow-600/20' : 
          'bg-blue-600/20'
        )}>
          {variant === 'danger' && (
            <svg className={cn("h-6 w-6", variantStyles[variant].icon)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {variant === 'warning' && (
            <svg className={cn("h-6 w-6", variantStyles[variant].icon)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {variant === 'default' && (
            <svg className={cn("h-6 w-6", variantStyles[variant].icon)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <p className="text-gray-300 responsive-text">{message}</p>
      </div>

      <div className="flex gap-3 justify-center stack-on-mobile">
        <button
          onClick={onClose}
          className="btn-secondary px-6 py-2"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={cn("px-6 py-2 interactive-element", variantStyles[variant].confirmBtn)}
        >
          {confirmText}
        </button>
      </div>
    </EnhancedModal>
  )
}

// Loading Modal Component
export function LoadingModal({
  isOpen,
  message = "Loading...",
  canCancel = false,
  onCancel
}: {
  isOpen: boolean
  message?: string
  canCancel?: boolean
  onCancel?: () => void
}) {
  return (
    <EnhancedModal
      isOpen={isOpen}
      onClose={() => canCancel && onCancel?.()}
      showCloseButton={canCancel}
      closeOnOverlayClick={false}
      closeOnEscape={canCancel}
      size="sm"
      className="text-center"
    >
      <div className="py-8">
        <div className="loading-spinner h-8 w-8 mx-auto mb-4" />
        <p className="text-gray-300 responsive-text">{message}</p>
        {canCancel && onCancel && (
          <button
            onClick={onCancel}
            className="btn-secondary mt-4 px-6 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </EnhancedModal>
  )
}

// Hook for managing modal state
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)
  const toggleModal = () => setIsOpen(prev => !prev)

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  }
}