'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MicrosoftOAuthPage() {
  const router = useRouter()
  const [isAuthorizing, setIsAuthorizing] = useState(false)

  const handleAuthorize = async () => {
    setIsAuthorizing(true)
    
    // Simulate OAuth authorization delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate authorization code
    const authCode = `microsoft_auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Send message to parent window (the popup opener)
    if (window.opener) {
      window.opener.postMessage({
        type: 'oauth-success',
        provider: 'microsoft',
        code: authCode
      }, window.location.origin)
      window.close()
    }
  }

  const handleCancel = () => {
    if (window.opener) {
      window.opener.postMessage({
        type: 'oauth-cancelled',
        provider: 'microsoft'
      }, window.location.origin)
      window.close()
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-dark rounded-xl p-8 border border-dark-lighter">
        <div className="text-center mb-6">
          <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 21 21" fill="none">
            <path d="M0 0h10v10H0V0z" fill="#F25022"/>
            <path d="M11 0h10v10H11V0z" fill="#7FBA00"/>
            <path d="M0 11h10v10H0V11z" fill="#00A4EF"/>
            <path d="M11 11h10v10H11V11z" fill="#FFB900"/>
          </svg>
          <h1 className="text-2xl font-bold mb-2">Sign in with Microsoft</h1>
          <p className="text-gray-400">WorkHive wants to access your Microsoft account</p>
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
            {isAuthorizing ? 'Authorizing...' : 'Continue with Microsoft'}
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
