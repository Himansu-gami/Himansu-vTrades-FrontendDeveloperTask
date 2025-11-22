import { NextRequest, NextResponse } from 'next/server'
import { mockDB } from '@/lib/mockDatabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = body

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Verify OTP
    const isValid = mockDB.verifyOTP(email, otp)
    
    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired OTP'
      }, { status: 400 })
    }

    // Generate reset token
    const resetToken = mockDB.generateResetToken(email)

    console.log(`✅ OTP verified for ${email}, reset token generated`)

    return NextResponse.json({
      success: true,
      data: {
        resetToken,
        email: email,
        expiresIn: 600 // 10 minutes
      },
      message: 'OTP verified successfully'
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'An error occurred during OTP verification'
    }, { status: 500 })
  }
}
