import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'
import Input from '@/components/Input'
import SocialButtons from '@/components/SocialButtons'

export default function SignUp() {
  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold mb-2">Sign Up</h2>
      <p className="text-gray-400 mb-8">Manage your workspace seamlessly. Sign in to continue.</p>

      <form className="space-y-6" autoComplete="off">
        <Input 
          id="email" 
          label="Email Address" 
          type="email" 
          placeholder="Enter your email"
          autoComplete="off"
        />

        <Input 
          id="password" 
          label="Password" 
          type="password"
          placeholder="Enter your password"
          showPasswordToggle
          autoComplete="new-password"
        />
        
        <Input 
          id="confirmPassword" 
          label="Confirm Password" 
          type="password"
          placeholder="Confirm your password"
          showPasswordToggle
          autoComplete="new-password"
        />

        <button
          type="submit"
          className="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg font-medium transition-colors"
        >
          Sign Up
        </button>

        <SocialButtons />

        <p className="text-center text-sm text-gray-400">
          Already have an account? <Link href="/signin" className="text-primary hover:text-primary-dark">Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
