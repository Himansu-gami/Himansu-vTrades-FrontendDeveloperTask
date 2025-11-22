// API base URL - using Next.js API routes
const API_BASE_URL = '/api'

// API client with fetch
export const authAPI = {
  // Sign In
  signIn: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Sign in failed')
    }
    
    return data
  },

  // Sign Up
  signUp: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Sign up failed')
    }
    
    return data
  },

  // Forgot Password
  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP')
    }
    
    return data
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'OTP verification failed')
    }
    
    return data
  },

  // Resend OTP
  resendOTP: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to resend OTP')
    }
    
    return data
  },

  // Reset Password
  resetPassword: async (resetToken: string, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetToken, newPassword })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Password reset failed')
    }
    
    return data
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Google sign in failed')
    }
    
    return data
  },

  // Sign in with Microsoft
  signInWithMicrosoft: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/microsoft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Microsoft sign in failed')
    }
    
    return data
  }
}

// Error handler utility
export const handleAPIError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred. Please try again.'
}
