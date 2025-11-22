'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'
import Input from '@/components/Input'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

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
    // Redirect to OTP verification page
    window.location.href = `/verify-otp?email=${encodeURIComponent(email)}`
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
