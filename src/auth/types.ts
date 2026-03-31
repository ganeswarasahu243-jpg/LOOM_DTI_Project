export type UserRole = 'user' | 'nominee' | 'admin'

export type AuthUser = {
  id: string
  email: string
  role: UserRole
  name: string
  phone?: string | null
  flaggedAt?: string | null
  flaggedReason?: string | null
  lockedUntil?: string | null
  riskScore?: number
  preferredOtpChannel?: 'email' | 'sms'
  trustedCircleThreshold?: number
  inactivityTimerDays?: number
  mfa?: {
    email: boolean
    totp: boolean
  }
}

export type AuthResponse = {
  token: string
  user: AuthUser
}

export type MfaChallengeResponse = {
  requiresMfa: true
  challengeId: string
  channel: 'email' | 'sms' | 'totp'
  pendingToken: string
  expiresAt: string
  devOtp?: string
}
