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
    queryFn: async () => {
      try {
        const response = await get(endpoints.admin.users.list, params)
        // Backend returns: { success: true, message: '...', data: { results: [...], page: 1, limit: 10, filters: {...} } }
        if (response.success && response.data) {
          return response.data.results || []
        } else {
          console.error('Unexpected response format:', response)
          return []
        }
      } catch (error) {
        console.error('Error fetching admin users:', error)
        return []
      }
    },
  })
}

export function useAdminUserHistoryQuery(userId, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.users.history(userId),
    queryFn: async () => {
      try {
        const response = await get(endpoints.admin.users.history(userId))
        // Backend returns: { success: true, message: '...', data: { results: [...], page: 1, limit: 10, ... } }
        if (response.success && response.data) {
          return response.data.results || []
        } else {
          console.error('Unexpected response format:', response)
          return []
        }
      } catch (error) {
        console.error('Error fetching user booking history:', error)
        return []
      }
    },
    enabled: Boolean(userId) && enabled,
  })
}

export function useBlockUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId) => post(endpoints.admin.users.block(userId)),
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


