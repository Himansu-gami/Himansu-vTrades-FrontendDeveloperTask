// Mock in-memory database (persists during server runtime)
// This simulates a real database without needing actual database setup

interface User {
  id: string
  email: string
  password: string
  name: string
  role: string
  createdAt: number
}

interface OTPRecord {
  email: string
  otp: string
  expiresAt: number
}

interface ResetToken {
  token: string
  email: string
  expiresAt: number
}

// Global storage that persists across hot reloads
const globalForDB = globalThis as unknown as {
  users?: Map<string, User>
  otps?: Map<string, OTPRecord>
  resetTokens?: Map<string, ResetToken>
}

// In-memory storage (resets when server restarts)
class MockDatabase {
  private users: Map<string, User>
  private otps: Map<string, OTPRecord>
  private resetTokens: Map<string, ResetToken>

  constructor() {
    // Use global storage to persist across hot reloads
    if (!globalForDB.users) {
      globalForDB.users = new Map()
      // Add default test user only on first initialization
      globalForDB.users.set('test@workhive.com', {
        id: '1',
        email: 'test@workhive.com',
        password: 'password123', // In real app, this would be hashed
        name: 'Test User',
        role: 'admin',
        createdAt: Date.now()
      })
    }
    if (!globalForDB.otps) {
      globalForDB.otps = new Map()
    }
    if (!globalForDB.resetTokens) {
      globalForDB.resetTokens = new Map()
    }

    this.users = globalForDB.users
    this.otps = globalForDB.otps
    this.resetTokens = globalForDB.resetTokens
  }

  // User operations
  createUser(email: string, password: string): User {
    const user: User = {
      id: String(this.users.size + 1),
      email,
      password, // In real app, hash this with bcrypt
      name: email.split('@')[0],
      role: 'user',
      createdAt: Date.now()
    }
    this.users.set(email, user)
    return user
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.get(email)
  }

  updateUserPassword(email: string, newPassword: string): boolean {
    const user = this.users.get(email)
    if (user) {
      user.password = newPassword
      this.users.set(email, user)
      return true
    }
    return false
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  // OTP operations
  generateOTP(email: string): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString() // 6-digit OTP
    const otpRecord: OTPRecord = {
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    }
    this.otps.set(email, otpRecord)
    return otp
  }

  verifyOTP(email: string, otp: string): boolean {
    const otpRecord = this.otps.get(email)
    if (!otpRecord) return false
    
    // Check if expired
    if (Date.now() > otpRecord.expiresAt) {
      this.otps.delete(email)
      return false
    }

    // Check if OTP matches
    if (otpRecord.otp === otp) {
      this.otps.delete(email) // Remove OTP after successful verification
      return true
    }

    return false
  }

  // Reset token operations
  generateResetToken(email: string): string {
    const token = `reset-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const resetToken: ResetToken = {
      token,
      email,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    }
    this.resetTokens.set(token, resetToken)
    return token
  }

  verifyResetToken(token: string): string | null {
    const resetToken = this.resetTokens.get(token)
    if (!resetToken) return null

    // Check if expired
    if (Date.now() > resetToken.expiresAt) {
      this.resetTokens.delete(token)
      return null
    }

    return resetToken.email
  }

  deleteResetToken(token: string): void {
    this.resetTokens.delete(token)
  }

  // Debug methods
  debugPrintUsers(): void {
    console.log('=== Mock Database Users ===')
    this.users.forEach((user, email) => {
      console.log(`${email}: ${user.password}`)
    })
  }

  debugPrintOTPs(): void {
    console.log('=== Active OTPs ===')
    this.otps.forEach((otp, email) => {
      console.log(`${email}: ${otp.otp} (expires: ${new Date(otp.expiresAt).toLocaleTimeString()})`)
    })
  }
}

// Export singleton instance
export const mockDB = new MockDatabase()
