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
        <h2 className="text-3xl font-bold mb-2">Sign In</h2>
      <p className="text-gray-400 mb-8">Manage your workspace seamlessly. Sign in to continue.</p>

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

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-primary hover:text-primary-dark">Forgot Password?</Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <SocialButtons />

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account? <Link href="/signup" className="text-primary hover:text-primary-dark">Sign Up</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
