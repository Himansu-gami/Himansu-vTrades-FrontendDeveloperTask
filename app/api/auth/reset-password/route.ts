import { NextRequest, NextResponse } from 'next/server'
import { mockDB } from '@/lib/mockDatabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resetToken, newPassword } = body

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Verify reset token
    const email = mockDB.verifyResetToken(resetToken)
    
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired reset token'
      }, { status: 401 })
    }

    // Check if new password is same as old password
    const user = mockDB.findUserByEmail(email)
    if (user && user.password === newPassword) {
      return NextResponse.json({
        success: false,
        message: 'New password cannot be the same as your previous password'
      }, { status: 400 })
    }

    // Update password
    const updated = mockDB.updateUserPassword(email, newPassword)
    
    if (!updated) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 })
    }

    // Delete reset token after use
    mockDB.deleteResetToken(resetToken)

    console.log(`Password reset for ${email}`)
    mockDB.debugPrintUsers()

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      data: {
        email: email
      }
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'An error occurred while resetting password'
    }, { status: 500 })
  }
}
