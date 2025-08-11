"use client"

import Layout from "../../../components/layout"
import ProtectedRoute from "../../../components/protected-route"
import { useState, useMemo } from "react"
import { Plus, Search, Filter, MapPin, Clock, Users, Star, Edit, Eye, MoreVertical } from "lucide-react"
import Link from "next/link"
import { useVenuesQuery } from "../../../actions/venues"

export default function OwnerFacilitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState("grid")
  const facilitiesPerPage = 6

  // API parameters
  const apiParams = useMemo(() => {
    return {
      q: searchQuery || undefined,
      page: currentPage,
      limit: facilitiesPerPage,
      venue_status: statusFilter,
      // Add owner-specific filters if needed
    }
  }, [searchQuery, currentPage, statusFilter])

  // Fetch facilities data using the API
  const { data, isLoading, error } = useVenuesQuery(apiParams)

  // Process API response data
  const facilities = data?.data?.results || []
  const total = data?.total || data?.count || data?.totalCount || 0
  const totalPages = data?.totalPages || data?.pages || Math.ceil(total / facilitiesPerPage) || 1

  // Filter facilities based on status (if needed)
  const filteredFacilities = facilities.filter((facility) => {
    if (statusFilter === "pending") return true
    // You can add status filtering logic here based on your API response structure
    return true
  })

  // Calculate stats from real data
  const totalRevenue = facilities.reduce((sum, facility) => {
    // Adjust this based on your actual data structure
    const revenue = facility.monthlyRevenue || facility.price || 0
    return sum + revenue
  }, 0)
  
  const totalBookings = facilities.reduce((sum, facility) => {
    // Adjust this based on your actual data structure
    const bookings = facility.totalBookings || facility.bookings || 0
    return sum + bookings
  }, 0)
  
  const activeFacilities = facilities.length // Assuming all facilities in the list are active

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Inactive":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(facilitiesPerPage)].map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-gray-200"></div>
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )

  // Error component
  const ErrorState = () => (
    <div className="col-span-full bg-white rounded-2xl shadow-sm border p-12 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load facilities</h3>
      <p className="text-gray-600 mb-6">{error?.message || 'Something went wrong while loading your facilities.'}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
      >
        Try Again
      </button>
    </div>
  )

  return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{isLoading ? "..." : facilities.length}</div>
              <div className="text-sm text-gray-600">Facilities</div>
              <div className="text-xs text-green-600 mt-1">{isLoading ? "..." : `${activeFacilities} Active`}</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-2xl">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">This Month</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {isLoading ? "..." : totalBookings.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Bookings</div>
              <div className="text-xs text-green-600 mt-1">+12% from last month</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">This Month</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {isLoading ? "..." : `₹${totalRevenue.toLocaleString()}`}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xs text-green-600 mt-1">+8% from last month</div>
            </div>
          </div>

           {/* Quick Actions */}
           <div className="my-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/owner/facilities/add"
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Add New Facility</div>
                  <div className="text-sm text-gray-600">Register a new sports facility</div>
                </div>
              </Link>
              <Link
                href="/owner/bookings"
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Manage Bookings</div>
                  <div className="text-sm text-gray-600">View and manage all bookings</div>
                </div>
              </Link>
              <Link
                href="/owner/analytics"
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">View Analytics</div>
                  <div className="text-sm text-gray-600">Track performance and insights</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search facilities by name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && <LoadingSkeleton />}

          {/* Error State */}
          {error && !isLoading && <ErrorState />}

          {/* Facilities Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredFacilities.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl shadow-sm border p-12 text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
                  <p className="text-gray-600 mb-6">No facilities match your search criteria.</p>
                  <Link
                    href="/owner/facilities/add"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    Add Your First Facility
                  </Link>
                </div>
              ) : (
                filteredFacilities.map((facility) => {
                  // Extract data from API response - adjust based on your actual data structure
                  const {
                    _id,
                    venue_name,
                    location,
                    rating,
                    price,
                    city ,
                    sports,
                    image,
                    status = "Active", // Default status
                    totalBookings = 0,
                    monthly_revenue = 0,
                    amenities = [],
                    joinedDate = new Date().toISOString().split('T')[0],
                    lastBooking = null
                  } = facility


                  return (
                    <div
                      key={_id}
                      className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={venue_name || "Facility"}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
                          >
                            {status}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{venue_name || "Unnamed Facility"}</h3>
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{city || ""}</span>
                            </div>
                            {rating && rating.avg > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-sm font-medium">{rating.avg}</span>
                                </div>
                                <span className="text-sm text-gray-500">({totalBookings} bookings)</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Available Sports</h4>
                          <div className="flex flex-wrap gap-2">
                            {(sports || []).map((sport, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {sport}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Amenities</h4>
                          <div className="flex flex-wrap gap-2">
                            {amenities.slice(0, 3).map((amenity, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                {amenity}
                              </span>
                            ))}
                            {amenities.length > 3 && (
                              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                +{amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                          <div>
                            <span className="text-gray-600">Monthly Revenue</span>
                            <div className="font-semibold text-green-600">₹{monthly_revenue.toLocaleString()}</div>
                          </div>
                          {/* <div>
                            <span className="text-gray-600">Operating Hours</span>
                            <div className="font-medium text-gray-900">{operatingHours}</div>
                          </div> */}
                        </div>

                        <div className="flex gap-3">
                          <Link
                            href={`/venues/${_id}`}
                            className="flex items-center gap-2 flex-1 justify-center px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Link>
                          <Link
                            href={`/owner/facilities/add?id=${_id}`}
                            className="flex items-center gap-2 flex-1 justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Facility
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>

              <div className="flex space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNumber = index + 1
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-4 py-2 border rounded-xl transition-colors ${currentPage === pageNumber
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}

         
        </div>
  )
}
