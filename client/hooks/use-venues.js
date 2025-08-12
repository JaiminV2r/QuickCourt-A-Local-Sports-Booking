import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { get, getPublic, post, put, del } from '../services/api-client'
import { endpoints } from '../services/endpoints'

export const useVenuesByCity = (cityName, enabled = false) => {
  return useQuery({
    queryKey: ['venues', 'byCity', cityName],
    queryFn: async () => {
      const response = await get(endpoints.venues.list, {
        search: cityName,
        limit: 4,
        page: 1
      })
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch venues')
      }
      return response.data.results
    },
    enabled: enabled && !!cityName,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export const useApprovedVenues = ({search = "",page = 1, limit , sport_type }) => {
  return useQuery({
    queryKey: ['venues', 'approved',page, limit, search,sport_type],
    queryFn: async () => {
      const response = await get(endpoints.venues.approvedList, {
        limit,
        page: page,
        search: search,
        sport_type
      })
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch approved venues')
      }
      return response
    },
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export const useVenueDetails = (venueId) => {
  return useQuery({
    queryKey: ['venue', 'details', venueId],
    queryFn: async () => {
      const response = await getPublic(endpoints.venues.byId(venueId))
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch venue details')
      }
      return response
    },
    enabled: !!venueId,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
