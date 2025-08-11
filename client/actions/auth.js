'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { get, post } from '../services/api-client'
import { endpoints } from '../services/endpoints'
import { queryKeys } from './query-keys'

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

export function useLoginMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => post(endpoints.auth.login, payload),
    onSuccess: (res) => {
      // If user is verified, server returns data.user and tokens
      if (res?.data?.user && res?.data?.tokens) {
        const auth = { user: res.data.user, tokens: res.data.tokens }
        localStorage.setItem('quickcourt_auth', JSON.stringify(auth))
        localStorage.setItem('quickcourt_user', JSON.stringify(res.data.user))
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
        const auth = { user: res.data.user, tokens: res.data.tokens }
        localStorage.setItem('quickcourt_auth', JSON.stringify(auth))
        localStorage.setItem('quickcourt_user', JSON.stringify(res.data.user))
        qc.invalidateQueries({ queryKey: queryKeys.auth })
      }
    },
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


