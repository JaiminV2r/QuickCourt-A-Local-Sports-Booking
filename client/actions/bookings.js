'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { get, post, del } from '../services/api-client'
import { endpoints } from '../services/endpoints'
import { queryKeys } from './query-keys'

export function useBookingsQuery(params) {
  return useQuery({
    queryKey: [...queryKeys.bookings.all, params],
    queryFn: () => get(endpoints.bookings.list, params),
  })
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => post(endpoints.bookings.create, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all })
    },
  })
}

export function useCancelBookingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bookingId) => del(endpoints.bookings.byId(bookingId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all })
    },
  })
}

// Admin users management
export function useAdminUsersQuery(params) {
  return useQuery({
    queryKey: [...queryKeys.admin.users.all, params],
    queryFn: () => get(endpoints.admin.users.list, params),
  })
}

export function useAdminUserHistoryQuery(userId, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.users.history(userId),
    queryFn: () => get(endpoints.admin.users.history(userId)),
    enabled: Boolean(userId) && enabled,
  })
}

export function useBanUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId) => post(endpoints.admin.users.ban(userId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all })
    },
  })
}

export function useUnbanUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId) => post(endpoints.admin.users.unban(userId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all })
    },
  })
}

// Admin stats & charts
export function useAdminStatsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: () => get(endpoints.admin.stats),
  })
}

export function useAdminChartsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.charts,
    queryFn: () => get(endpoints.admin.charts),
  })
}


