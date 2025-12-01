'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'
import Input from '@/components/Input'
import SocialButtons from '@/components/SocialButtons'

export default function SignIn() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData({ ...formData, [field]: value })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors = { email: '', password: '' }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)

    if (!newErrors.email && !newErrors.password) {
      setIsLoading(true)
      try {
        const { authAPI } = await import('@/lib/api')
        const response = await authAPI.signIn(formData.email, formData.password)
        console.log('Sign in successful:', response)
        
        // Store token and user info
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('userEmail', response.data.user.email)
        localStorage.setItem('userName', response.data.user.name)
        
        // Redirect to dashboard
        router.push('/dashboard')
      } catch (error) {
        const { handleAPIError } = await import('@/lib/api')
        const errorMessage = handleAPIError(error)
        setErrors({ ...newErrors, password: errorMessage })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <AuthLayout>
      <h2 className="font-sans font-semibold text-heading opacity-100 mb-2">
        Sign In
      </h2>
      <p className="w-363 max-w-full h-24 font-sans text-body opacity-100 text-gray-400 mb-8">
        Manage your workspace seamlessly. Sign in to continue.
      </p>

      <form autoComplete="off" onSubmit={handleSubmit} noValidate>
        <div className="mb-6">
          <Input 
            id="email" 
            label="Email Address" 
            type="email" 
            placeholder="Enter your email"
            autoComplete="off"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
          />
        </div>

        <div className="mb-3">
          <Input 
            id="password" 
            label="Password" 
            type="password"
            placeholder="Enter your password"
            showPasswordToggle
            autoComplete="new-password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
          />
        </div>

        <div className="w-385 max-w-full flex items-center justify-between opacity-100 mb-10">
          <label className="flex items-center font-sans font-normal text-sm cursor-pointer">
            <input type="checkbox" className="mr-2" />
            <span>Remember me</span>
          </label>
          <Link 
            href="/forgot-password" 
            className="font-sans font-normal text-sm whitespace-nowrap text-primary hover:text-primary-dark"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-385 max-w-full h-50 rounded-10 pt-13 px-6 pb-13 opacity-100 mb-6 bg-primary font-sans text-button transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <SocialButtons />

        <div className="w-385 max-w-full flex justify-center">
          <p className="font-sans text-link font-normal text-center text-gray-400">
            Don&apos;t have an account?{' '}
            <Link 
              href="/signup" 
              className="font-sans text-link font-semibold text-primary hover:text-primary-dark"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
