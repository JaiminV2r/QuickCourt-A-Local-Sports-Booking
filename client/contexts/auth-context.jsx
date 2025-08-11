"use client"

import { createContext, useContext, useState, useEffect } from "react"

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

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem("quickcourt_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user data based on email
    let userData
    if (email.includes("admin")) {
      userData = {
        id: 1,
        name: "Admin User",
        email,
        role: "admin",
        phone: "+91 9876543210",
      }
    } else if (email.includes("owner")) {
      userData = {
        id: 2,
        name: "Facility Owner",
        email,
        role: "owner",
        phone: "+91 9876543211",
        facilityId: "FAC001",
      }
    } else {
      userData = {
        id: 3,
        name: "John Doe",
        email,
        role: "player",
        phone: "+91 9876543212",
      }
    }

    setUser(userData)
    localStorage.setItem("quickcourt_user", JSON.stringify(userData))
    setAuthCookie(userData)
    return userData
  }

  const signup = async (userData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser = {
      id: Date.now(),
      ...userData,
      role: userData.role || "player",
    }

    setUser(newUser)
    localStorage.setItem("quickcourt_user", JSON.stringify(newUser))
    setAuthCookie(newUser)
    return newUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("quickcourt_user")
    clearAuthCookie()
  }

  const verifyOTP = async (otp) => {
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return otp === "123456" // Mock OTP
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
