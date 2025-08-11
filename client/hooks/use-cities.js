import { useQuery } from '@tanstack/react-query'
import { get } from '../services/api-client'
import { endpoints } from '../services/endpoints'

export const useCitiesSearch = (searchQuery, enabled = false) => {
  return useQuery({
    queryKey: ['cities', 'search', searchQuery],
    queryFn: async () => {
      const response = await get(endpoints.city.list, {
        search: searchQuery,
        limit: 50,
        page: 1
      })
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch cities')
      }
      return response.data.results
    },
    enabled: enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
