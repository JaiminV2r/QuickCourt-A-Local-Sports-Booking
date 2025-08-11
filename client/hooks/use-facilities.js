import { useState, useMemo, useCallback } from 'react'
import { 
  useAdminPendingFacilitiesQuery, 
  useAdminApprovedFacilitiesQuery, 
  useAdminRejectedFacilitiesQuery 
} from '@/actions/facilities'

export function useFacilitiesManagement() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [selectedFacilities, setSelectedFacilities] = useState(new Set())

  // API Queries
  const { 
    data: pendingData, 
    isLoading: pendingLoading, 
    error: pendingError,
    refetch: refetchPending,
    isFetching: pendingFetching
  } = useAdminPendingFacilitiesQuery()

  const { 
    data: approvedData, 
    isLoading: approvedLoading, 
    error: approvedError,
    refetch: refetchApproved,
    isFetching: approvedFetching
  } = useAdminApprovedFacilitiesQuery()

  const { 
    data: rejectedData, 
    isLoading: rejectedLoading, 
    error: rejectedError,
    refetch: refetchRejected,
    isFetching: rejectedFetching
  } = useAdminRejectedFacilitiesQuery()

  // Get current facilities based on active tab
  const getCurrentFacilities = useCallback(() => {
    switch (activeTab) {
      case "pending":
        return pendingData?.data?.venues || []
      case "approved":
        return approvedData?.data?.venues || []
      case "rejected":
        return rejectedData?.data?.venues || []
      default:
        return []
    }
  }, [activeTab, pendingData, approvedData, rejectedData])

  // Get loading state for current tab
  const getCurrentLoading = useCallback(() => {
    switch (activeTab) {
      case "pending":
        return pendingLoading
      case "approved":
        return approvedLoading
      case "rejected":
        return rejectedLoading
      default:
        return false
    }
  }, [activeTab, pendingLoading, approvedLoading, rejectedLoading])

  // Get fetching state for current tab
  const getCurrentFetching = useCallback(() => {
    switch (activeTab) {
      case "pending":
        return pendingFetching
      case "approved":
        return approvedFetching
      case "rejected":
        return rejectedFetching
      default:
        return false
    }
  }, [activeTab, pendingFetching, approvedFetching, rejectedFetching])

  // Get error for current tab
  const getCurrentError = useCallback(() => {
    switch (activeTab) {
      case "pending":
        return pendingError
      case "approved":
        return approvedError
      case "rejected":
        return rejectedError
      default:
        return null
    }
  }, [activeTab, pendingError, approvedError, rejectedError])

  // Filter and sort facilities
  const filteredAndSortedFacilities = useMemo(() => {
    const facilities = getCurrentFacilities()
    if (!facilities || !Array.isArray(facilities)) return []

    return facilities.filter((facility) => {
      const matchesSearch = 
        facility.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.owner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.ownerEmail?.toLowerCase().includes(searchQuery.toLowerCase())

      if (filterStatus === "all") return matchesSearch
      if (filterStatus === "withImages") return matchesSearch && facility.photos?.length > 0
      if (filterStatus === "withAmenities") return matchesSearch && facility.amenities?.length > 0
      if (filterStatus === "withRevenue") return matchesSearch && (facility.monthlyRevenue || 0) > 0
      return matchesSearch
    }).sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "")
        case "date":
          return new Date(b.submittedDate || b.approvedDate || b.rejectedDate || 0) - 
                 new Date(a.submittedDate || a.approvedDate || a.rejectedDate || 0)
        case "courts":
          return (b.courts || 0) - (a.courts || 0)
        case "revenue":
          return (b.monthlyRevenue || 0) - (a.monthlyRevenue || 0)
        case "rating":
          const ratingA = typeof a?.rating === 'object' ? a?.rating?.avg || 0 : a?.rating || 0
          const ratingB = typeof b?.rating === 'object' ? b?.rating?.avg || 0 : b?.rating || 0
          return ratingB - ratingA
        default:
          return 0
      }
    })
  }, [getCurrentFacilities, searchQuery, filterStatus, sortBy])

  // Stats calculations
  const stats = useMemo(() => {
    const totalPending = pendingData?.data?.venues?.length || 0
    const totalApproved = approvedData?.data?.venues?.length || 0
    const totalRejected = rejectedData?.data?.venues?.length || 0
    const totalFacilities = totalPending + totalApproved + totalRejected

    return {
      totalPending,
      totalApproved,
      totalRejected,
      totalFacilities,
      filteredCount: filteredAndSortedFacilities?.length || 0
    }
  }, [pendingData, approvedData, rejectedData, filteredAndSortedFacilities])

  // Selection management
  const toggleFacilitySelection = useCallback((facilityId) => {
    setSelectedFacilities(prev => {
      const newSet = new Set(prev)
      if (newSet.has(facilityId)) {
        newSet.delete(facilityId)
      } else {
        newSet.add(facilityId)
      }
      return newSet
    })
  }, [])

  const selectAllFacilities = useCallback(() => {
    const currentFacilities = getCurrentFacilities()
    setSelectedFacilities(new Set(currentFacilities.map(f => f.id)))
  }, [getCurrentFacilities])

  const clearSelection = useCallback(() => {
    setSelectedFacilities(new Set())
  }, [])

  // Refresh functions
  const refreshAllData = useCallback(async () => {
    try {
      await Promise.all([
        refetchPending(),
        refetchApproved(),
        refetchRejected()
      ])
      return true
    } catch (error) {
      console.error('Failed to refresh data:', error)
      return false
    }
  }, [refetchPending, refetchApproved, refetchRejected])

  const refreshCurrentTab = useCallback(async () => {
    try {
      switch (activeTab) {
        case "pending":
          await refetchPending()
          break
        case "approved":
          await refetchApproved()
          break
        case "rejected":
          await refetchRejected()
          break
      }
      return true
    } catch (error) {
      console.error('Failed to refresh current tab:', error)
      return false
    }
  }, [activeTab, refetchPending, refetchApproved, refetchRejected])

  return {
    // State
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    selectedFacilities,
    
    // Data
    facilities: filteredAndSortedFacilities,
    stats,
    
    // Loading states
    isLoading: getCurrentLoading(),
    isFetching: getCurrentFetching(),
    error: getCurrentError(),
    
    // Actions
    toggleFacilitySelection,
    selectAllFacilities,
    clearSelection,
    refreshAllData,
    refreshCurrentTab,
    
    // Raw data for mutations
    pendingFacilities: pendingData?.data?.venues || [],
    approvedFacilities: approvedData?.data?.venues || [],
    rejectedFacilities: rejectedData?.data?.venues || [],
  }
}