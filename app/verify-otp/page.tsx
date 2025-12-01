'use client'

import { useState, useRef, KeyboardEvent, ClipboardEvent, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'
import Modal from '@/components/Modal'

function VerifyOTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(30)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [newOtpCode, setNewOtpCode] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)
    
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    const otpValue = otp.join('')
    
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsLoading(true)
    try {
      const { authAPI } = await import('@/lib/api')
      const response = await authAPI.verifyOTP(email, otpValue)
      console.log('OTP verified:', response)
      localStorage.setItem('resetToken', response.data.resetToken)
      setShowModal(true)
    } catch (error) {
      const { handleAPIError } = await import('@/lib/api')
      const errorMessage = handleAPIError(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    router.push('/reset-password')
  }

  const handleResend = async () => {
    if (timer === 0) {
      try {
        const { authAPI } = await import('@/lib/api')
        const response = await authAPI.resendOTP(email)
        setTimer(30)
        setOtp(['', '', '', '', '', ''])
        console.log('OTP resent')
        
        if (response.data.otp) {
          setNewOtpCode(response.data.otp)
          setShowOtpModal(true)
        }
      } catch (error) {
        const { handleAPIError } = await import('@/lib/api')
        const errorMessage = handleAPIError(error)
        setError(errorMessage)
      }
    }
  }

  const handleOtpModalClose = () => {
    setShowOtpModal(false)
    inputRefs.current[0]?.focus()
  }

  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title="Link Sent Successfully!"
        message="Check your inbox! We've sent you an email with instructions to reset your password."
        icon="success"
      />
      <Modal
        isOpen={showOtpModal}
        onClose={handleOtpModalClose}
        title="New OTP Generated!"
        message="This is for testing purposes only. In production, this would be sent to your email."
        icon="success"
        otpCode={newOtpCode}
      />
      <AuthLayout>
        <h2 className="font-sans font-semibold text-heading opacity-100 mb-2">
          Enter OTP
        </h2>
        <p className="font-sans text-body opacity-100 text-gray-400 mb-2">
          Enter the OTP that we have sent to your email address
        </p>
        <p className="font-sans text-body opacity-100 text-white mb-8">
          {email}
        </p>

        <Link 
          href="/forgot-password" 
          className="font-sans text-link font-semibold text-primary hover:text-primary-dark block mb-8"
        >
          Change Email Address
        </Link>

        <div>
          <div className="flex gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-14 h-14 text-center text-2xl bg-dark rounded-lg border border-dark-lighter focus:border-primary focus:outline-none"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <div className="mt-10">
            {timer > 0 ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{timer} Sec</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="font-sans text-link font-semibold text-primary hover:text-primary-dark"
              >
                Resend OTP
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-385 max-w-full h-50 rounded-10 pt-13 px-6 pb-13 opacity-100 bg-primary font-sans text-button transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-10"
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </button>
        </div>
      </AuthLayout>
    </>
  )
}

export default function VerifyOTP() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <div className="text-center">
          <h2 className="font-sans font-semibold text-heading mb-2">Loading...</h2>
        </div>
      </AuthLayout>
    }>
      <VerifyOTPContent />
    </Suspense>
  )
}
