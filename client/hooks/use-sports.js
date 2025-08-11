import { useQuery } from '@tanstack/react-query'
import { get } from '../services/api-client'
import { endpoints } from '../services/endpoints'

export const useSportsStats = () => {
  return useQuery({
    queryKey: ['sports', 'stats'],
    queryFn: async () => {
      const response = await get(endpoints.sports.stats)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch sports stats')
      }
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
