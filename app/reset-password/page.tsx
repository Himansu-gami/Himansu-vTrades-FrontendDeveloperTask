'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import AuthLayout from '@/components/AuthLayout'
import Input from '@/components/Input'
import Modal from '@/components/Modal'

export default function ResetPassword() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showModal, setShowModal] = useState(false)

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleInputChange = (field: 'password' | 'confirmPassword', value: string) => {
    setFormData({ ...formData, [field]: value })
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors = { password: '', confirmPassword: '' }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please re-enter your new password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)

    if (!newErrors.password && !newErrors.confirmPassword) {
      setIsLoading(true)
      try {
        const { authAPI } = await import('@/lib/api')
        const resetToken = localStorage.getItem('resetToken') || ''
        await authAPI.resetPassword(resetToken, formData.password)
        console.log('Password reset successful')
        localStorage.removeItem('resetToken')
        setShowModal(true)
      } catch (error) {
        const { handleAPIError } = await import('@/lib/api')
        const errorMessage = handleAPIError(error)
        setErrors({ ...newErrors, password: errorMessage })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    router.push('/signin')
  }

  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title="Password Created!"
        message="Your password has been successfully updated. You can now use your new password to log in."
        icon="check"
      />
      <AuthLayout>
        <h2 className="font-sans font-semibold text-heading opacity-100 mb-2">
          Create New Password
        </h2>
        <p className="w-363 max-w-full font-sans text-body opacity-100 text-gray-400 mb-8">
          Choose a strong and secure password to keep your account safe. Make sure it&apos;s easy for you to remember, but hard for others to guess!
        </p>

        <form className="space-y-6" autoComplete="off" onSubmit={handleSubmit} noValidate>
          <Input 
            id="password" 
            label="Password" 
            type="password"
            placeholder="Enter your new password"
            showPasswordToggle
            autoComplete="new-password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
          />
          
          <Input 
            id="confirmPassword" 
            label="Re-enter your new password" 
            type="password"
            placeholder="Confirm your new password"
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
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </AuthLayout>
    </>
  )
}
