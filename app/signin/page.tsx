'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'
import Input from '@/components/Input'
import SocialButtons from '@/components/SocialButtons'

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })

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

  const handleSubmit = (e: FormEvent) => {
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
      console.log('Form submitted:', formData)
      // Handle successful submission
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
          <a href="#" className="text-sm text-primary hover:text-primary-dark">Forgot Password?</a>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg font-medium transition-colors"
        >
          Sign In
        </button>

        <SocialButtons />

        <p className="text-center text-sm text-gray-400">
          Don't have an account? <Link href="/signup" className="text-primary hover:text-primary-dark">Sign Up</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
