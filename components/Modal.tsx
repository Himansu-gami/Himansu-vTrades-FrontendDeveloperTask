'use client'

import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  icon?: 'success' | 'error' | 'warning' | 'check'
  buttonText?: string
  otpCode?: string
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  icon = 'success',
  buttonText = 'Okay',
  otpCode
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const iconColors = {
    success: 'bg-[#22C55E]',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    check: 'bg-[#22C55E] border-4 border-blue-500'
  }

  const icons = {
    success: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <polyline points="3 7 12 13 21 7" />
      </svg>
    ),
    error: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    warning: (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    check: (
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative rounded-2xl p-8 max-w-md w-full mx-4 text-center" style={{ backgroundColor: '#1F2129' }}>
        {/* Icon */}
        <div className={`w-32 h-32 ${iconColors[icon]} rounded-full flex items-center justify-center mx-auto mb-6`}>
          {icons[icon]}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {/* OTP Code (if provided) */}
        {otpCode && (
          <div className="mb-6">
            <div className="bg-background-dark border-2 border-primary/30 rounded-xl py-5 px-8 mb-4">
              <p className="text-4xl font-bold text-white tracking-[0.5em] font-mono">
                {otpCode}
              </p>
            </div>
          </div>
        )}

        {/* Message */}
        <p className="text-gray-400 mb-8 max-w-sm mx-auto">{message}</p>

        {/* Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-16 py-3 bg-primary rounded-lg font-sans text-button transition-all duration-300 ease-out active:scale-95"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}
