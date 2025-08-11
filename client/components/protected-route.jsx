"use client"

import { useAuth } from "../contexts/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ROLES } from "../lib/constant"

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/")
      return
    }
    
    if (!loading && user && allowedRoles.length > 0) {
      const hasAccess = allowedRoles.includes(user.role)
      if (!hasAccess) {
        // Redirect to appropriate dashboard based on role
        if (user.role === ROLES.admin) {
          router.replace("/admin")
        } else if (user.role === ROLES.facility_owner) {
          router.replace("/owner")
        } else {
          router.replace("/")
        }
        return
      }
    }
  }, [user, loading, allowedRoles, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 animate-pulse">
            <span className="text-2xl font-bold text-white">QC</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null
  }

  return children
}
