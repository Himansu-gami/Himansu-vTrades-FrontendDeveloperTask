'use client'

import { useState, InputHTMLAttributes } from 'react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string
  id: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  showPasswordToggle?: boolean
  error?: string
}

export default function Input({ 
  label, 
  id, 
  type = 'text', 
  showPasswordToggle = false,
  error,
  ...props 
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPasswordToggle && showPassword ? 'text' : type

  return (
    <div>
      <label htmlFor={id} className="block text-sm mb-2">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          id={id}
          name={id}
          data-form-type="other"
          className={`w-full px-4 py-3 bg-dark rounded-lg border border-dark-lighter focus:border-primary focus:outline-none ${
            showPasswordToggle ? 'pr-12' : ''
          } ${error ? 'border-red-500' : ''}`}
          {...props}
        />
        {showPasswordToggle && (
          <button 
            type="button" 
            onClick={(e) => {
              e.preventDefault()
              setShowPassword(!showPassword)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1"
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
