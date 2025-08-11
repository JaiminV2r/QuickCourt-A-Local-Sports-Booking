'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { get, post } from '../services/api-client'
import { endpoints } from '../services/endpoints'
import { queryKeys } from './query-keys'

export function useFacilitiesQuery(params) {
  return useQuery({
    queryKey: [...queryKeys.facilities.all, params],
    queryFn: () => get(endpoints.facilities.list, params),
  })
}

export function useFacilityQuery(id) {
  return useQuery({
    queryKey: queryKeys.facilities.detail(id),
    queryFn: () => get(endpoints.facilities.byId(id)),
    enabled: Boolean(id),
  })
}

export function useCreateFacilityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => post(endpoints.facilities.list, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.facilities.all })
    },
  })
}


