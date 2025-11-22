import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      data: {
        token: 'mock-google-token-xyz',
        user: {
          id: '3',
          email: 'user@gmail.com',
          name: 'Google User',
          role: 'user',
          provider: 'google'
        }
      },
      message: 'Google sign in successful'
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'An error occurred during Google sign in'
    }, { status: 500 })
  }
}
