'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { get, post, put } from '../services/api-client'
import { endpoints } from '../services/endpoints'
import { queryKeys } from './query-keys'

function computeRoleKey(apiRole) {
  return apiRole?.role
}

function setUserCookie(user) {
  try {
    const cookieValue = {
      id: user._id || user.id,
      name: user.full_name || user.name,
      email: user.email,
      role: user.role,
    }
    const value = encodeURIComponent(JSON.stringify(cookieValue))
    document.cookie = `quickcourt_user=${value}; path=/; max-age=${7 * 24 * 60 * 60}`
  } catch {}
}

export function useMeQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth,
    queryFn: async () => {
      if (typeof window === 'undefined') return null
      const stored = localStorage.getItem('quickcourt_auth')
      return stored ? JSON.parse(stored) : null
    },
    enabled,
  })
}

export function useRolesQuery(options = {}) {
  return useQuery({
    queryKey: ['auth', 'roles'],
    queryFn: async () => {
      const res = await get(endpoints.auth.roles)
      // Expecting { success, data: [{ _id, role, ... }] }
      return Array.isArray(res?.data) ? res.data : []
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

export function useLoginMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => post(endpoints.auth.login, payload),
    onSuccess: (res) => {
      // If user is verified, server returns data.user and tokens
      if (res?.data?.user && res?.data?.tokens) {
        // Normalize user role to simple key: 'admin' | 'owner' | 'player'
        const apiUser = res.data.user
        const normalizedRole = computeRoleKey(apiUser?.role)
        const userForStore = { ...apiUser, role: normalizedRole }
        const auth = { user: userForStore, tokens: res.data.tokens }
        localStorage.setItem('quickcourt_auth', JSON.stringify(auth))
        localStorage.setItem('quickcourt_user', JSON.stringify(userForStore))
        setUserCookie(userForStore)
        qc.invalidateQueries({ queryKey: queryKeys.auth })
      }
    },
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload) => post(endpoints.auth.register, payload),
  })
}

export function useVerifyOtpMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => post(endpoints.auth.verifyOtp, payload),
    onSuccess: (res) => {
      if (res?.data?.user && res?.data?.tokens) {
        const apiUser = res.data.user
        const normalizedRole = computeRoleKey(apiUser?.role)
        const userForStore = { ...apiUser, role: normalizedRole }
        const auth = { user: userForStore, tokens: res.data.tokens }
        localStorage.setItem('quickcourt_auth', JSON.stringify(auth))
        localStorage.setItem('quickcourt_user', JSON.stringify(userForStore))
        setUserCookie(userForStore)
        qc.invalidateQueries({ queryKey: queryKeys.auth })
      }
    },
  })
}

export function useSendOtpMutation() {
  return useMutation({
    mutationFn: (payload) => post(endpoints.auth.sendOtp, payload),
  })
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: (payload) => post(endpoints.auth.logout, payload),
  })
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload) => post(endpoints.auth.forgotPassword, payload),
  })
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload) => put(endpoints.auth.resetPassword, payload),
    onSuccess: (res) => {
      // Handle successful password reset
      if (res?.success) {
        // You can add any additional logic here if needed
        console.log('Password reset successful')
      }
    },
    onError: (error) => {
      // Handle errors - this will be handled by the component using toast
      console.error('Password reset failed:', error)
    }
  })
}

// Admin: mock me endpoint if backend not present
export async function ensureMockMe(user) {
  if (typeof window === 'undefined') return user
  try {
    const stored = localStorage.getItem('quickcourt_user')
    if (!stored && user) {
      localStorage.setItem('quickcourt_user', JSON.stringify(user))
    }
  } catch {}
  return user
}


