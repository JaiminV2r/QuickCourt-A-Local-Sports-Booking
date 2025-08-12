import { useQuery } from '@tanstack/react-query'
import { get } from '../services/api-client'
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

export const useApprovedVenues = ({search = "",page = 1, limit }) => {
  return useQuery({
    queryKey: ['venues', 'approved',page, limit, search],
    queryFn: async () => {
      const response = await get(endpoints.venues.approvedList, {
        limit,
        page: page,
        search: search
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
