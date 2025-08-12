"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, del } from "@/services/api-client";
import { queryKeys } from "./query-keys";

// Get available time slots for a venue and sport
export function useTimeSlotsQuery(venueId, sportType, date, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.bookings.timeSlots, venueId, sportType, date],
    queryFn: () =>
      get("/v1/booking/time-slots", {
        venue_id: venueId,
        sport_type: sportType,
        date,
      }),
    enabled: enabled && Boolean(venueId && sportType && date),
  });
}

// Create a new booking
export function useCreateBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingData) => post("/v1/booking", bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.stats });
    },
  });
}

// Get all bookings for user
export function useBookingsQuery(params = {}) {
  return useQuery({
    queryKey: [...queryKeys.bookings.all, params],
    queryFn: () => get("/v1/booking", params),
  });
}

// Get single booking by ID
export function useBookingQuery(bookingId, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.bookings.detail, bookingId],
    queryFn: () => get(`/v1/booking/${bookingId}`),
    enabled: enabled && Boolean(bookingId),
  });
}

// Update booking
export function useUpdateBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => put(`/v1/booking/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.bookings.detail, id],
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.stats });
    },
  });
}

// Cancel booking
export function useCancelBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId) => del(`/v1/booking/${bookingId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.stats });
    },
  });
}

// Get booking statistics
export function useBookingStatsQuery() {
  return useQuery({
    queryKey: queryKeys.bookings.stats,
    queryFn: () => get("/v1/booking/stats/overview"),
  });
}

// Admin users management
export function useAdminUsersQuery(params) {
  return useQuery({
    queryKey: [...queryKeys.admin.users.all, params],
    queryFn: () => get(endpoints.admin.users.list, params),
  });
}

export function useAdminUserHistoryQuery(userId, enabled = false) {
  return useQuery({
    queryKey: [...queryKeys.admin.users.history, userId],
    queryFn: () => get(endpoints.admin.users.history(userId)),
    enabled,
  });
}

export function useBanUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => post(endpoints.admin.users.ban(userId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all });
    },
  });
}

export function useUnbanUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => post(endpoints.admin.users.unban(userId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all });
    },
  });
}

// Admin stats & charts
export function useAdminStatsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: () => get(endpoints.admin.stats),
  });
}

export function useAdminChartsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.charts,
    queryFn: () => get(endpoints.admin.charts),
  });
}
