"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useLoginMutation, useRegisterMutation, useVerifyOtpMutation } from "../actions/auth"

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

  useEffect(() => {
    const storedUser = localStorage.getItem("quickcourt_user")
    if (storedUser) setUser(JSON.parse(storedUser))
    setLoading(false)
  }, [])

  function decodeAccessTokenRole(accessToken) {
    if (!accessToken) return null
    try {
      const [, payload] = accessToken.split('.')
      const json = JSON.parse(atob(payload))
      const role = json?.role
      if (!role) return null
      const roleLower = (role || '').toString().toLowerCase()
      if (roleLower.includes('admin')) return 'admin'
      if (roleLower.includes('owner')) return 'owner'
      if (roleLower.includes('facility')) return 'owner'
      return 'player'
    } catch {
      return null
    }
  }

  const login = async (email, password) => {
    const res = await loginMutation.mutateAsync({ email, password })
    if (res?.data?.user) {
      const u = res.data.user
      setUser(u)
      const accessToken = res?.data?.tokens?.access?.token
      const roleKey = decodeAccessTokenRole(accessToken) || 'player'
      setAuthCookie({ id: u._id, name: u.full_name, email: u.email, role: roleKey })
      return u
    }
    // When email not verified, server responds with success true and message, but no data.user
    return null
  }

  const signup = async (payload) => {
    // payload: { full_name, email, password, role }
    return registerMutation.mutateAsync(payload)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("quickcourt_user")
    clearAuthCookie()
  }

  const verifyOTP = async ({ email, otp }) => {
    const res = await verifyOtpMutation.mutateAsync({ email, otp })
    if (res?.data?.user) {
      const u = res.data.user
      setUser(u)
      const accessToken = res?.data?.tokens?.access?.token
      const roleKey = decodeAccessTokenRole(accessToken) || 'player'
      setAuthCookie({ id: u._id, name: u.full_name, email: u.email, role: roleKey })
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
