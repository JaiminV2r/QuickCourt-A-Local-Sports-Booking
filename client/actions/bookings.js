'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { get, post } from '../services/api-client'
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


