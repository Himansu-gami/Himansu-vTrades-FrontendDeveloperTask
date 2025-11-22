'use client'

import { useState, useRef, KeyboardEvent, ClipboardEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'

export default function VerifyOTP() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(30)
  const [error, setError] = useState('')
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

  const handleSubmit = () => {
    const otpValue = otp.join('')
    
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    console.log('OTP submitted:', otpValue)
    // Verify OTP logic here
    // On success, redirect to reset password page
    router.push('/reset-password')
  }

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      console.log('OTP resent')
    }
  }

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold mb-2">Enter OTP</h2>
      <p className="text-gray-400 mb-2">
        Enter the OTP that we have sent to your email address
      </p>
      <p className="text-white mb-8">{email}</p>

      <Link 
        href="/forgot-password" 
        className="text-primary hover:text-primary-dark text-sm mb-8 block"
      >
        Change Email Address
      </Link>

      <div className="space-y-6">
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

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{timer} Sec</span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg font-medium transition-colors"
        >
          Continue
        </button>

        <p className="text-center text-sm text-gray-400">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={timer > 0}
            className={`${
              timer > 0 
                ? 'text-gray-500 cursor-not-allowed' 
                : 'text-primary hover:text-primary-dark cursor-pointer'
            }`}
          >
            Resend
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}
