import { NextRequest, NextResponse } from 'next/server'
import { mockDB } from '@/lib/mockDatabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = mockDB.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'Email already exists'
      }, { status: 409 })
    }

    // Create new user
    const user = mockDB.createUser(email, password)
    
    // Generate token
    const token = `jwt-token-${user.id}-${Date.now()}`

    console.log(`New user created: ${email}`)
    mockDB.debugPrintUsers()

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
      message: 'Account created successfully'
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'An error occurred during sign up'
    }, { status: 500 })
  }
}
