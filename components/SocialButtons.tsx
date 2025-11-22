'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function SocialButtons() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  useEffect(() => {
    // Listen for OAuth messages from popup
    const handleMessage = async (event: MessageEvent) => {
      // Security: verify origin
      if (event.origin !== window.location.origin) {
        console.log('Message from different origin, ignoring:', event.origin)
        return
      }

      console.log('Received message:', event.data)
      const { type, provider, code } = event.data

      if (type === 'oauth-success' && code) {
        console.log(`OAuth success for ${provider}, code:`, code)
        setIsLoading(provider)
        try {
          // Exchange authorization code for token
          console.log(`Calling API: /auth/${provider}`)
          const response = await api.post(`/auth/${provider}`, { code })
          console.log('API response:', response)

          if (response.success && response.data) {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            router.push('/dashboard')
          }
        } catch (error: any) {
          console.error(`${provider} sign in failed:`, error)
          alert(error.message || `${provider} sign in failed`)
        } finally {
          setIsLoading(null)
        }
      } else if (type === 'oauth-cancelled') {
        console.log('OAuth cancelled')
        setIsLoading(null)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [router])

  const openOAuthPopup = (provider: 'google' | 'microsoft') => {
    setIsLoading(provider)

    // Open OAuth consent page in popup
    const width = 500
    const height = 600
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    const popup = window.open(
      `/oauth/${provider}`,
      `${provider}-oauth`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    )

    // Check if popup was blocked
    if (!popup) {
      alert('Popup was blocked. Please allow popups for this site.')
      setIsLoading(null)
      return
    }

    // Monitor popup closure
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup)
        setIsLoading(null)
      }
    }, 500)
  }

  const handleGoogleSignIn = () => {
    openOAuthPopup('google')
  }

  const handleMicrosoftSignIn = () => {
    openOAuthPopup('microsoft')
  }

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dark-lighter"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-gray-400">or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading !== null}
        className="w-full py-3 bg-dark hover:bg-dark-light rounded-lg font-medium transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading === 'google' ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z"
              fill="#EA4335"
            />
          </svg>
        )}
        Sign in with Google
      </button>

      <button
        type="button"
        onClick={handleMicrosoftSignIn}
        disabled={isLoading !== null}
        className="w-full py-3 bg-dark hover:bg-dark-light rounded-lg font-medium transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading === 'microsoft' ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
            <path d="M0 0h10v10H0V0z" fill="#F25022" />
            <path d="M11 0h10v10H11V0z" fill="#7FBA00" />
            <path d="M0 11h10v10H0V11z" fill="#00A4EF" />
            <path d="M11 11h10v10H11V11z" fill="#FFB900" />
          </svg>
        )}
        Sign in with Microsoft
      </button>
    </>
  )
}
