"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useLoginMutation, useRegisterMutation, useVerifyOtpMutation, useLogoutMutation } from "../actions/auth"

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

function setAuthCookie(user) {
  try {
    const value = encodeURIComponent(JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }))
    // 7 days expiry
    document.cookie = `quickcourt_user=${value}; path=/; max-age=${7 * 24 * 60 * 60}`
  } catch {}
}

function clearAuthCookie() {
  document.cookie = "quickcourt_user=; path=/; max-age=0"
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()
  const verifyOtpMutation = useVerifyOtpMutation()
  const logoutMutation = useLogoutMutation()

  useEffect(() => {
    const storedUser = localStorage.getItem("quickcourt_user")
    if (storedUser) setUser(JSON.parse(storedUser))
    setLoading(false)
  }, [])

  function normalizeRoleFromUser(apiUser) {
    const apiRole = apiUser?.role
    if (!apiRole) return null
    const base = typeof apiRole === 'object' ? (apiRole?.slug || apiRole?.role || '') : (apiRole || '')
    const s = base.toString().toLowerCase()
    if (s.includes('admin')) return 'admin'
    if (s.includes('owner') || s.includes('facility')) return 'owner'
    return 'player'
  }

  const login = async (email, password) => {
    const res = await loginMutation.mutateAsync({ email, password })
    if (res?.data?.user) {
      const apiUser = res.data.user
      const roleKey = normalizeRoleFromUser(apiUser) || 'player'
      const userForState = { ...apiUser, role: roleKey }
      setUser(userForState)
      setAuthCookie({ id: apiUser._id, name: apiUser.full_name, email: apiUser.email, role: roleKey })
      return userForState
    }
    // When email not verified, server responds with success true and message, but no data.user
    return null
  }

  const signup = async (payload) => {
    // payload: { full_name, email, password, role }
    return registerMutation.mutateAsync(payload)
  }

  const logout = async () => {
    try {
      const stored = localStorage.getItem('quickcourt_auth')
      const parsed = stored ? JSON.parse(stored) : null
      const refreshToken = parsed?.tokens?.refresh?.token
      if (refreshToken) {
        await logoutMutation.mutateAsync({ refresh_token: refreshToken })
      }
    } catch {
      // ignore errors on logout
    } finally {
      setUser(null)
      localStorage.removeItem('quickcourt_user')
      localStorage.removeItem('quickcourt_auth')
      clearAuthCookie()
    }
  }

  const verifyOTP = async ({ email, otp }) => {
    const res = await verifyOtpMutation.mutateAsync({ email, otp })
    if (res?.data?.user) {
      const apiUser = res.data.user
      const roleKey = normalizeRoleFromUser(apiUser) || 'player'
      const userForState = { ...apiUser, role: roleKey }
      setUser(userForState)
      setAuthCookie({ id: apiUser._id, name: apiUser.full_name, email: apiUser.email, role: roleKey })
      return true
    }
    return false
  }

  const value = {
    user,
    login,
    signup,
    logout,
    verifyOTP,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
