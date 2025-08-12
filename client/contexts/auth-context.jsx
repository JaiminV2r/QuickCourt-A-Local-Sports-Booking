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

function getAuthCookie() {
  try {
    const cookies = document.cookie.split(';')
    const userCookie = cookies.find(cookie => cookie.trim().startsWith('quickcourt_user='))
    if (userCookie) {
      const value = userCookie.split('=')[1]
      return JSON.parse(decodeURIComponent(value))
    }
  } catch {}
  return null
}

function setAuthCookie(user) {
  try {
    const value = encodeURIComponent(JSON.stringify({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role 
    }))
    // 7 days expiry, secure and httpOnly flags for production
    document.cookie = `quickcourt_user=${value}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`
  } catch {}
}

function clearAuthCookie() {
  document.cookie = "quickcourt_user=; path=/; max-age=0; SameSite=Strict"
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()
  const verifyOtpMutation = useVerifyOtpMutation()
  const logoutMutation = useLogoutMutation()

  useEffect(() => {
    // First try to get user from cookie (for SSR/middleware compatibility)
    let storedUser = getAuthCookie()
    
    // Fallback to localStorage if cookie not found
    if (!storedUser) {
      const localUser = localStorage.getItem("quickcourt_user")
      if (localUser) {
        storedUser = JSON.parse(localUser)
        // Sync to cookie for consistency
        setAuthCookie(storedUser)
      }
    }
    
    if (storedUser) {
      setUser(storedUser)
      // Also sync to localStorage for consistency
      localStorage.setItem("quickcourt_user", JSON.stringify(storedUser))
    }
    setLoading(false)
  }, [])

  function normalizeRoleFromUser(apiUser) {
    const apiRole = apiUser?.role?.role
    if (!apiRole) return null
    return apiRole
  }

  const login = async (email, password) => {
    const res = await loginMutation.mutateAsync({ email, password })
    if (res?.data?.user) {
      const apiUser = res.data.user
      const roleKey = normalizeRoleFromUser(apiUser) || 'player'
      const userForState = { 
        id: apiUser._id,
        name: apiUser.full_name, 
        email: apiUser.email, 
        role: roleKey 
      }
      setUser(userForState)
      setAuthCookie(userForState)
      localStorage.setItem("quickcourt_user", JSON.stringify(userForState))
    }
    // Return full response so callers can handle OTP/not-verified flows and messages
    return res
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
      const userForState = { 
        id: apiUser._id,
        name: apiUser.full_name, 
        email: apiUser.email, 
        role: roleKey 
      }
      setUser(userForState)
      setAuthCookie(userForState)
      localStorage.setItem("quickcourt_user", JSON.stringify(userForState))
    }
    // Return full response to allow callers to inspect success/message
    return res
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
