'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'
import Input from '@/components/Input'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (value: string) => {
    setEmail(value)
    if (error) {
      setError('')
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email')
      return
    }

    console.log('Password reset requested for:', email)
    setIsSubmitted(true)
    // Handle password reset logic here
  }

  if (isSubmitted) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2">Check Your Email</h2>
          <p className="text-gray-400 mb-8">
            We've sent a password reset link to <span className="text-white">{email}</span>
          </p>
          <Link 
            href="/signin" 
            className="text-primary hover:text-primary-dark inline-flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold mb-2">Forgot Your Password?</h2>
      <p className="text-gray-400 mb-8">
        Don't worry! Enter your email address, and we'll send you a link to reset it.
      </p>

      <form className="space-y-6" autoComplete="off" onSubmit={handleSubmit} noValidate>
        <Input 
          id="email" 
          label="Email Address" 
          type="email" 
          placeholder="Enter your email"
          autoComplete="off"
          value={email}
          onChange={(e) => handleInputChange(e.target.value)}
          error={error}
        />

        <button
          type="submit"
          className="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg font-medium transition-colors"
        >
          Submit
        </button>

        <p className="text-center text-sm text-gray-400">
          Remember your password? <Link href="/signin" className="text-primary hover:text-primary-dark">Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
