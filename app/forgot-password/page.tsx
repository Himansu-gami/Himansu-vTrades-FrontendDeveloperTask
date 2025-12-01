'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthLayout from '@/components/AuthLayout'
import Input from '@/components/Input'
import Modal from '@/components/Modal'

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpCode, setOtpCode] = useState('')

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

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email')
      return
    }

    setIsLoading(true)
    try {
      const { authAPI } = await import('@/lib/api')
      const response = await authAPI.forgotPassword(email)
      console.log('Password reset requested for:', email)
      
      // Display OTP for testing/demo purposes
      if (response.data.otp) {
        setOtpCode(response.data.otp)
        setShowOtpModal(true)
      }
    } catch (error) {
      const { handleAPIError } = await import('@/lib/api')
      const errorMessage = handleAPIError(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpModalClose = () => {
    setShowOtpModal(false)
    router.push(`/verify-otp?email=${encodeURIComponent(email)}`)
  }

  return (
    <>
      <Modal
        isOpen={showOtpModal}
        onClose={handleOtpModalClose}
        title="OTP Generated!"
        message="This is for testing purposes only. In production, this would be sent to your email."
        icon="success"
        otpCode={otpCode}
      />
      <AuthLayout>
        <h2 className="font-sans font-semibold text-heading opacity-100 mb-2">
          Forgot Your Password?
        </h2>
        <p className="w-363 max-w-full font-sans text-body opacity-100 text-gray-400 mb-8">
          Don&apos;t worry! Enter your email address, and we&apos;ll send you a link to reset it.
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
            disabled={isLoading}
            className="w-385 max-w-full h-50 rounded-10 pt-13 px-6 pb-13 opacity-100 bg-primary font-sans text-button transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Submit'}
          </button>

          <p className="font-sans text-link font-normal text-center text-gray-400">
            Remember your password?{' '}
            <Link 
              href="/signin" 
              className="font-sans text-link font-semibold text-primary hover:text-primary-dark"
            >
              Sign In
            </Link>
          </p>
        </form>
      </AuthLayout>
    </>
  )
}
