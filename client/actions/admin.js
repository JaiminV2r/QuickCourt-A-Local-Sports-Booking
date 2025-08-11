'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { get, post, patch, del } from '../services/api-client'
import { endpoints } from '../services/endpoints'
import { queryKeys } from './query-keys'

// Dashboard Actions
export function useAdminDashboardStatsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard.stats,
    queryFn: () => get(endpoints.admin.dashboard.stats),
  })
}

export function useAdminDashboardChartsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard.charts,
    queryFn: () => get(endpoints.admin.dashboard.charts),
  })
}

export function useAdminDashboardActivitiesQuery() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard.activities,
    queryFn: () => get(endpoints.admin.dashboard.activities),
  })
}

// Facility Management Actions
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

export function useAdminFacilityStatsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.facilities.stats,
    queryFn: () => get(endpoints.admin.facilities.stats),
  })
}

export function useApproveFacilityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (facilityId) => post(endpoints.admin.facilities.approve(facilityId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.pending })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.approved })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.stats })
    },
  })
}

export function useRejectFacilityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ facilityId, reason }) => post(endpoints.admin.facilities.reject(facilityId), { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.pending })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.rejected })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.facilities.stats })
    },
  })
}

// Report Management Actions
export function useAdminReportsQuery(params) {
  return useQuery({
    queryKey: [...queryKeys.admin.reports.all, params],
    queryFn: () => get(endpoints.admin.reports.list, params),
  })
}

export function useAdminReportStatsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.reports.stats,
    queryFn: () => get(endpoints.admin.reports.stats),
  })
}

export function useAdminReportByIdQuery(reportId, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.reports.detail(reportId),
    queryFn: () => get(endpoints.admin.reports.byId(reportId)),
    enabled: Boolean(reportId) && enabled,
  })
}

export function useCreateReportMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => post(endpoints.admin.reports.create, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports.stats })
    },
  })
}

export function useUpdateReportStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reportId, status, adminNotes }) => 
      patch(endpoints.admin.reports.updateStatus(reportId), { status, adminNotes }),
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports.detail(reportId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports.stats })
    },
  })
}

export function useResolveReportMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reportId, resolution, adminNotes }) => 
      post(endpoints.admin.reports.resolve(reportId), { resolution, adminNotes }),
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports.detail(reportId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports.stats })
    },
  })
}

// User Management Actions (keeping existing ones for compatibility)
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
