import { NextRequest, NextResponse } from 'next/server'
import { mockDB } from '@/lib/mockDatabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Find user
    const user = mockDB.findUserByEmail(email)
    
    console.log(`🔍 Sign in attempt for: ${email}`)
    mockDB.debugPrintUsers()
    
    if (!user) {
      console.log(`❌ User not found: ${email}`)
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 })
    }

    // Check password (in real app, use bcrypt.compare)
    console.log(`🔑 Checking password - Stored: ${user.password}, Provided: ${password}`)
    if (user.password !== password) {
      console.log(`❌ Password mismatch for: ${email}`)
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 })
    }

    // Generate token
    const token = `jwt-token-${user.id}-${Date.now()}`

    console.log(`✅ User signed in: ${email}`)

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      message: 'Sign in successful'
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'An error occurred during sign in'
    }, { status: 500 })
  }
}
