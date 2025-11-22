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

  const handleSubmit = (e: FormEvent) => {
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
      console.log('Password reset successful')
      // Handle password reset logic here
      // On success, show modal
      setShowModal(true)
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
      <h2 className="text-3xl font-bold mb-2">Create New Password</h2>
      <p className="text-gray-400 mb-8">
        Choose a strong and secure password to keep your account safe. Make sure it's easy for you to remember, but hard for others to guess!
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
          className="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg font-medium transition-colors"
        >
          Update Password
        </button>
      </form>
    </AuthLayout>
    </>
  )
}
