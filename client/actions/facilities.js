'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { get, post, put, del } from '../services/api-client'
import { endpoints } from '../services/endpoints'
import { queryKeys } from './query-keys'

export function useFacilitiesQuery(params) {
  return useQuery({
    queryKey: [...queryKeys.facilities.all, params],
    queryFn: () => get(endpoints.facilities.list, params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useFacilityQuery(id) {
  return useQuery({
    queryKey: queryKeys.facilities.detail(id),
    queryFn: () => get(endpoints.facilities.byId(id)),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCreateFacilityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => post(endpoints.facilities.list, payload),
    onSuccess: (data) => {
      // Invalidate and refetch facilities list
      queryClient.invalidateQueries({ queryKey: queryKeys.facilities.all })
      
      // Add the new facility to the cache
      queryClient.setQueryData(
        queryKeys.facilities.detail(data.id),
        data
      )
    },
    onError: (error) => {
      console.error('Failed to create facility:', error)
    },
  })
}

export function useUpdateFacilityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => put(endpoints.facilities.byId(id), payload),
    onSuccess: (data, variables) => {
      // Update the facility in cache
      queryClient.setQueryData(
        queryKeys.facilities.detail(variables.id),
        data
      )
      
      // Invalidate facilities list to refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.facilities.all })
    },
    onError: (error) => {
      console.error('Failed to update facility:', error)
    },
  })
}

export function useDeleteFacilityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => del(endpoints.facilities.byId(id)),
    onSuccess: (_, variables) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.facilities.detail(variables) })
      
      // Invalidate facilities list
      queryClient.invalidateQueries({ queryKey: queryKeys.facilities.all })
    },
    onError: (error) => {
      console.error('Failed to delete facility:', error)
    },
  })
}

// Admin facilities management with better caching
export function useAdminPendingFacilitiesQuery() {
  return useQuery({
    queryKey: queryKeys.admin.facilities.pending,
    queryFn: () => get(endpoints.admin.facilities.pending),
    staleTime: 2 * 60 * 1000, // 2 minutes for admin data
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}

export function useAdminApprovedFacilitiesQuery() {
  return useQuery({
    queryKey: queryKeys.admin.facilities.approved,
    queryFn: () => get(endpoints.admin.facilities.approved),
    staleTime: 5 * 60 * 1000, // 5 minutes for approved facilities
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function useAdminRejectedFacilitiesQuery() {
  return useQuery({
    queryKey: queryKeys.admin.facilities.rejected,
    queryFn: () => get(endpoints.admin.facilities.rejected),
    staleTime: 5 * 60 * 1000, // 5 minutes for rejected facilities
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function useAdminFacilityStatsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.facilities.stats,
    queryFn: () => get(endpoints.admin.facilities.stats),
    staleTime: 10 * 60 * 1000, // 10 minutes for stats
    gcTime: 15 * 60 * 1000,
  })
}

export function useApproveFacilityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, comment }) => put(endpoints.admin.facilities.approve(id), { comment }),
    onMutate: async ({ id }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.admin.facilities.pending })
      await queryClient.cancelQueries({ queryKey: queryKeys.admin.facilities.approved })
      
      // Snapshot the previous value
      const previousPending = queryClient.getQueryData(queryKeys.admin.facilities.pending)
      const previousApproved = queryClient.getQueryData(queryKeys.admin.facilities.approved)
      
      // Optimistically update the cache
      if (previousPending?.data) {
        const facility = previousPending.data.find(f => f.id === id)
        if (facility) {
          queryClient.setQueryData(queryKeys.admin.facilities.pending, {
            ...previousPending,
            data: previousPending.data.filter(f => f.id !== id)
          })
          
          queryClient.setQueryData(queryKeys.admin.facilities.approved, {
            ...previousApproved,
            data: [...(previousApproved?.data || []), { ...facility, status: 'approved' }]
          })
        }
      }
      
      return { previousPending, previousApproved }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPending) {
        queryClient.setQueryData(queryKeys.admin.facilities.pending, context.previousPending)
      }
      if (context?.previousApproved) {
        queryClient.setQueryData(queryKeys.admin.facilities.approved, context.previousApproved)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.pending })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.approved })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.stats })
    },
  })
}

export function useRejectFacilityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }) => put(endpoints.admin.facilities.reject(id), { reason }),
    onMutate: async ({ id, reason }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.admin.facilities.pending })
      await queryClient.cancelQueries({ queryKey: queryKeys.admin.facilities.rejected })
      
      // Snapshot the previous value
      const previousPending = queryClient.getQueryData(queryKeys.admin.facilities.pending)
      const previousRejected = queryClient.getQueryData(queryKeys.admin.facilities.rejected)
      
      // Optimistically update the cache
      if (previousPending?.data) {
        const facility = previousPending.data.find(f => f.id === id)
        if (facility) {
          queryClient.setQueryData(queryKeys.admin.facilities.pending, {
            ...previousPending,
            data: previousPending.data.filter(f => f.id !== id)
          })
          
          queryClient.setQueryData(queryKeys.admin.facilities.rejected, {
            ...previousRejected,
            data: [...(previousRejected?.data || []), { 
              ...facility, 
              status: 'rejected',
              rejectionReason: reason,
              rejectedDate: new Date().toISOString()
            }]
          })
        }
      }
      
      return { previousPending, previousRejected }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPending) {
        queryClient.setQueryData(queryKeys.admin.facilities.pending, context.previousPending)
      }
      if (context?.previousRejected) {
        queryClient.setQueryData(queryKeys.admin.facilities.rejected, context.previousRejected)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.pending })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.rejected })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.stats })
    },
  })
}

// Bulk operations
export function useBulkApproveFacilitiesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, comment }) => post(endpoints.admin.facilities.bulkApprove, { ids, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.pending })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.approved })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.stats })
    },
  })
}

export function useBulkRejectFacilitiesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, reason }) => post(endpoints.admin.facilities.bulkReject, { ids, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.pending })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.rejected })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.stats })
    },
  })
}


