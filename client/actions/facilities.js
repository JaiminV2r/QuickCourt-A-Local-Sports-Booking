'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { get, post, put } from '../services/api-client'
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

// Admin facilities management
export function useAdminPendingFacilitiesQuery() {
  return useQuery({
    queryKey: queryKeys.admin.facilities.pending,
    queryFn: () => get(endpoints.admin.facilities.pending),
  })
}

export function useAdminApprovedFacilitiesQuery() {
  return useQuery({
    queryKey: queryKeys.admin.facilities.approved,
    queryFn: () => get(endpoints.admin.facilities.approved),
  })
}

export function useAdminRejectedFacilitiesQuery() {
  return useQuery({
    queryKey: queryKeys.admin.facilities.rejected,
    queryFn: () => get(endpoints.admin.facilities.rejected),
  })
}

export function useApproveFacilityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, comment }) => put(endpoints.admin.facilities.approve(id), { comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.pending })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.approved })
    },
  })
}

export function useRejectFacilityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }) => put(endpoints.admin.facilities.reject(id), { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.pending })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.rejected })
    },
  })
}


