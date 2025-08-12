'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { get, post, put, del } from '../services/api-client'
import { endpoints } from '../services/endpoints'
import { queryKeys } from './query-keys'

// Get venues list with filters (public approved venues)
export function useVenuesQuery(params = {}) {
  return useQuery({
    queryKey: [...queryKeys.venues.all, params],
    queryFn: async () => {
      console.log('Fetching venues with params:', params)
      const response = await get(endpoints.venues.list, params)
      console.log('Venues API response:', response)
      return response
    },
    staleTime: 5 * 60 * 1000, // 5 
    retry: 2,
    retryDelay: 1000,
  })
}

// Get single venue by ID
export function useVenueQuery(id) {
  return useQuery({
    queryKey: queryKeys.venues.detail(id),
    queryFn: () => get(endpoints.venues.byId(id)),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Create new venue
export function useCreateVenueMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => post(endpoints.venues.list, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.venues.all })
    },
  })
}

// Update venue
export function useUpdateVenueMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => put(endpoints.venues.byId(id), payload),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.venues.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.venues.detail(id) })
    },
  })
}

// Delete venue
export function useDeleteVenueMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => del(endpoints.venues.byId(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.venues.all })
    },
  })
}
