import Image from 'next/image'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  imageSrc?: string
}

export default function AuthLayout({ children, imageSrc = '/signin-image.png' }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-background p-8">
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <Image src={imageSrc} alt="Team" fill className="object-cover" />
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

      {/* Right Side - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
