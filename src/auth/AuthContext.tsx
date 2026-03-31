import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchCurrentUser, login as loginRequest, signup as signupRequest, verifyLoginMfa } from './api'
import type { AuthResponse, AuthUser, MfaChallengeResponse, UserRole } from './types'

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  loading: boolean
  refreshUser: () => Promise<void>
  updateUser: (updater: AuthUser | ((current: AuthUser | null) => AuthUser | null)) => void
  login: (payload: { email: string; password: string }) => Promise<MfaChallengeResponse>
  signup: (payload: {
    email: string
    password: string
    role: UserRole
    name: string
    phone?: string
    preferredOtpChannel?: 'email' | 'sms'
    inactivityTimerDays?: number
  }) => Promise<MfaChallengeResponse>
  verifyOtp: (payload: { pendingToken: string; challengeId: string; code: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const TOKEN_KEY = 'loom.auth.token'
const USER_KEY = 'loom.auth.user'

function persistSession(response: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, response.token)
  localStorage.setItem(USER_KEY, JSON.stringify(response.user))
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  })
  const [loading, setLoading] = useState(true)

  async function refreshUser() {
    if (!token) {
      clearSession()
      setUser(null)
      return
    }

    const response = await fetchCurrentUser(token)
    setUser(response.user)
    localStorage.setItem(USER_KEY, JSON.stringify(response.user))
  }

  function updateUser(updater: AuthUser | ((current: AuthUser | null) => AuthUser | null)) {
    setUser((current) => {
      const nextUser = typeof updater === 'function' ? updater(current) : updater

      if (nextUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
      } else {
        localStorage.removeItem(USER_KEY)
      }

      return nextUser
    })
  }

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetchCurrentUser(token)

        if (!cancelled) {
          updateUser(response.user)
        }
      } catch {
        if (!cancelled) {
          clearSession()
          setToken(null)
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [token])

  async function login(payload: { email: string; password: string }) {
    return loginRequest(payload)
  }

  async function signup(payload: {
    email: string
    password: string
    role: UserRole
    name: string
    phone?: string
    preferredOtpChannel?: 'email' | 'sms'
    inactivityTimerDays?: number
  }) {
    return signupRequest(payload)
  }

  async function verifyOtp(payload: { pendingToken: string; challengeId: string; code: string }) {
    const response = await verifyLoginMfa(payload)
    persistSession(response)
    setToken(response.token)
    setUser(response.user)
  }

  function logout() {
    clearSession()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, refreshUser, updateUser, login, signup, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}
