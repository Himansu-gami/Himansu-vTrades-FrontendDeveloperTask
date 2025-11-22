import { NextRequest, NextResponse } from 'next/server'
import { mockDB } from '@/lib/mockDatabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code || !code.startsWith('microsoft_auth_')) {
      return NextResponse.json({
        success: false,
        message: 'Invalid authorization code'
      }, { status: 400 })
    }

    // Simulate exchanging auth code for user info (like calling Microsoft's API)
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock Microsoft user data (in real app, this comes from Microsoft's API)
    const microsoftUserData = {
      email: `user${Date.now().toString().slice(-4)}@outlook.com`,
      name: 'Microsoft User',
      picture: 'https://via.placeholder.com/150'
    }

    // Create or get user from mock database
    const user = mockDB.createOAuthUser(
      microsoftUserData.email,
      microsoftUserData.name,
      'microsoft'
    )

    // Generate mock JWT token
    const token = `microsoft-jwt-${user.id}-${Date.now()}`

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          provider: user.provider
        }
      },
      message: 'Microsoft sign in successful'
    }, { status: 200 })

  } catch (error) {
    console.error('Microsoft OAuth error:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred during Microsoft sign in'
    }, { status: 500 })
  }
}
