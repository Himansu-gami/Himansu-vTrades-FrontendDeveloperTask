'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-background p-8">
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <Image src="/signin-image.png" alt="Team" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40">
            <div className="absolute bottom-12 left-12 right-12 text-white">
              <h1 className="text-4xl font-bold mb-6">Welcome to WORKHIVE!</h1>
              <ul className="space-y-2 text-[11px] leading-tight">
                <li>• Employee Management: View detailed profiles, track performance, and manage attendance.</li>
                <li>• Performance Insights: Analyze team goals, progress, and achievements.</li>
                <li>• Attendance & Leaves: Track attendance patterns and manage leave requests effortlessly.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">Sign In</h2>
          <p className="text-gray-400 mb-8">Manage your workspace seamlessly. Sign in to continue.</p>

          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-dark rounded-lg border border-dark-lighter focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-dark rounded-lg border border-dark-lighter focus:border-primary focus:outline-none pr-12"
                />
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault()
                    setShowPassword(!showPassword)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

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
              className="w-full py-3 bg-dark hover:bg-dark-light rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>

            <button
              type="button"
              className="w-full py-3 bg-dark hover:bg-dark-light rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
            >
              <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
                <path d="M0 0h10v10H0V0z" fill="#F25022"/>
                <path d="M11 0h10v10H11V0z" fill="#7FBA00"/>
                <path d="M0 11h10v10H0V11z" fill="#00A4EF"/>
                <path d="M11 11h10v10H11V11z" fill="#FFB900"/>
              </svg>
              Sign in with Microsoft
            </button>

            <p className="text-center text-sm text-gray-400">
              Don't have an account? <a href="#" className="text-primary hover:text-primary-dark">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
