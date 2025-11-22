import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      data: {
        token: 'mock-microsoft-token-xyz',
        user: {
          id: '4',
          email: 'user@outlook.com',
          name: 'Microsoft User',
          role: 'user',
          provider: 'microsoft'
        }
      },
      message: 'Microsoft sign in successful'
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'An error occurred during Microsoft sign in'
    }, { status: 500 })
  }
}
