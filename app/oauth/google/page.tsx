'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GoogleOAuthPage() {
  const router = useRouter()
  const [isAuthorizing, setIsAuthorizing] = useState(false)

  const handleAuthorize = async () => {
    setIsAuthorizing(true)
    
    // Simulate OAuth authorization delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate authorization code
    const authCode = `google_auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Send message to parent window (the popup opener)
    if (window.opener) {
      window.opener.postMessage({
        type: 'oauth-success',
        provider: 'google',
        code: authCode
      }, window.location.origin)
      window.close()
    }
  }

  const handleCancel = () => {
    if (window.opener) {
      window.opener.postMessage({
        type: 'oauth-cancelled',
        provider: 'google'
      }, window.location.origin)
      window.close()
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-dark rounded-xl p-8 border border-dark-lighter">
        <div className="text-center mb-6">
          <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
            <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
          </svg>
          <h1 className="text-2xl font-bold mb-2">Sign in with Google</h1>
          <p className="text-gray-400">WorkHive wants to access your Google account</p>
        </div>

        <div className="bg-dark-lighter rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-300 mb-2">This will allow WorkHive to:</p>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• View your email address</li>
            <li>• View your basic profile info</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAuthorize}
            disabled={isAuthorizing}
            className="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isAuthorizing ? 'Authorizing...' : 'Continue with Google'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isAuthorizing}
            className="w-full py-3 bg-dark-lighter hover:bg-dark rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          This is a mock OAuth flow for demonstration purposes
        </p>
      </div>
    </div>
  )
}
