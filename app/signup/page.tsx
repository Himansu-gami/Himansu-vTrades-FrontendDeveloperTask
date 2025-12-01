'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'
import Input from '@/components/Input'
import SocialButtons from '@/components/SocialButtons'

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleInputChange = (field: 'email' | 'password' | 'confirmPassword', value: string) => {
    setFormData({ ...formData, [field]: value })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors = { email: '', password: '', confirmPassword: '' }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)

    if (!newErrors.email && !newErrors.password && !newErrors.confirmPassword) {
      setIsLoading(true)
      try {
        const { authAPI } = await import('@/lib/api')
        const response = await authAPI.signUp(formData.email, formData.password)
        console.log('Sign up successful:', response)
        
        // Store token and user info
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('userEmail', response.data.user.email)
        localStorage.setItem('userName', response.data.user.name)
        
        // Redirect to dashboard
        router.push('/dashboard')
      } catch (error) {
        const { handleAPIError } = await import('@/lib/api')
        const errorMessage = handleAPIError(error)
        setErrors({ ...newErrors, email: errorMessage })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <AuthLayout>
      <h2 className="font-sans font-semibold text-heading opacity-100 mb-2">
        Sign Up
      </h2>
      <p className="w-363 max-w-full h-24 font-sans text-body opacity-100 text-gray-400 mb-8">
        Manage your workspace seamlessly. Sign up to continue.
      </p>

      <form className="space-y-6" autoComplete="off" onSubmit={handleSubmit} noValidate>
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
        
        <Input 
          id="confirmPassword" 
          label="Confirm Password" 
          type="password"
          placeholder="Confirm your password"
          showPasswordToggle
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-385 max-w-full h-50 rounded-10 pt-13 px-6 pb-13 opacity-100 bg-primary font-sans text-button transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <SocialButtons />

        <div className="w-385 max-w-full flex justify-center">
          <p className="font-sans text-link font-normal text-center text-gray-400">
            Already have an account?{' '}
            <Link 
              href="/signin" 
              className="font-sans text-link font-semibold text-primary hover:text-primary-dark"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
