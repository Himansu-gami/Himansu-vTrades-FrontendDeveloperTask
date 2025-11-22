import { NextRequest, NextResponse } from 'next/server'
import { mockDB } from '@/lib/mockDatabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check if user exists
    const user = mockDB.findUserByEmail(email)
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Email not found'
      }, { status: 404 })
    }

    // Generate new OTP
    const otp = mockDB.generateOTP(email)

    console.log(`📧 OTP resent for ${email}: ${otp}`)
    mockDB.debugPrintOTPs()

    return NextResponse.json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        email: email,
        expiresIn: 300, // 5 minutes
        // For testing purposes, include OTP in response (remove in production!)
        otp: otp
      }
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'An error occurred while resending OTP'
    }, { status: 500 })
  }
}
