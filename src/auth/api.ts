import type { AuthResponse, AuthUser, MfaChallengeResponse, UserRole } from './types'
import { apiRequest } from '../lib/api'

export function signup(payload: {
  email: string
  password: string
  role: UserRole
  name: string
  phone?: string
  preferredOtpChannel?: 'email' | 'sms'
  inactivityTimerDays?: number
}) {
  return apiRequest<MfaChallengeResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function login(payload: { email: string; password: string }) {
  return apiRequest<MfaChallengeResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function verifyLoginMfa(payload: { pendingToken: string; challengeId: string; code: string }) {
  return apiRequest<AuthResponse>('/api/auth/mfa/verify-login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchCurrentUser(token: string) {
  return apiRequest<{ user: AuthUser }>('/api/protected/me', { token })
}
