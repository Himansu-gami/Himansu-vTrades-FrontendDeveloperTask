'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/signin')
      return
    }

    // In a real app, you would decode the JWT token to get user info
    // For now, we'll get it from localStorage if available
    const userEmail = localStorage.getItem('userEmail') || 'user@workhive.com'
    const userName = localStorage.getItem('userName') || 'User'
    
    setUser({ email: userEmail, name: userName })
  }, [router])

  const handleSignOut = () => {
    // Clear all auth data
    localStorage.removeItem('token')
    localStorage.removeItem('resetToken')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    
    // Redirect to sign in
    router.push('/signin')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background-card border-b border-dark-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="px-6 py-2 bg-dark hover:bg-dark-light rounded-lg transition-colors flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to WORKHIVE! 🎉</h1>
          <p className="text-xl text-gray-400 mb-2">You've successfully signed in</p>
          <p className="text-gray-500">Manage your workspace seamlessly</p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-background-card p-6 rounded-xl border border-dark-lighter">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Employee Management</h3>
            <p className="text-sm text-gray-400">View detailed profiles, track performance, and manage attendance.</p>
          </div>

          <div className="bg-background-card p-6 rounded-xl border border-dark-lighter">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Performance Insights</h3>
            <p className="text-sm text-gray-400">Analyze team goals, progress, and achievements.</p>
          </div>

          <div className="bg-background-card p-6 rounded-xl border border-dark-lighter">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Attendance & Leaves</h3>
            <p className="text-sm text-gray-400">Track attendance patterns and manage leave requests effortlessly.</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
          <p className="text-gray-300">
            🚀 This is a demo dashboard. In a real application, this would show your workspace data, analytics, and management tools.
          </p>
        </div>
      </main>
    </div>
  )
}
