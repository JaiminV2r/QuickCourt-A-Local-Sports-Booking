"use client"

import { useMemo, useState } from "react"
import { Search, MapPin, Star, ChevronDown, SlidersHorizontal, Clock } from "lucide-react"
import Link from "next/link"
import { useVenuesQuery } from "../../actions/venues"
import { endpoints } from "../../services/endpoints"
import { useApprovedVenues } from "@/hooks/use-venues"
import { useSearchParams } from "next/navigation"

export default function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSport, setSelectedSport] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [rating, setRating] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const venuesPerPage = 8
  const searchParams = useSearchParams()
  const sportFromUrl = (searchParams.get("sport") || "").toLowerCase()

  // const sports = ["All Sports", "Badminton", "Tennis", "Football", "Basketball", "Cricket", "Table Tennis"]
  const priceRanges = ["All Prices", "₹0-500", "₹500-1000", "₹1000-1500", "₹1500+"]
  const ratings = ["All Ratings", "4.5+", "4.0+", "3.5+", "3.0+"]

  const apiParams = useMemo(() => {
    const parsedRating =
      rating === "4.5+" ? 4.5 : rating === "4.0+" ? 4.0 : rating === "3.5+" ? 3.5 : rating === "3.0+" ? 3.0 : 0
    const sportParam =
      selectedSport && selectedSport !== "All Sports"
        ? selectedSport.toLowerCase()
        : (sportFromUrl || undefined)

    return {
      // search: searchQuery || undefined,
      sport_type: sportParam,

      // priceRange: priceRange || undefined,
      // rating: parsedRating || undefined,
      search: searchQuery,
      page: currentPage,
      limit: venuesPerPage,
    }
  }, [searchQuery, selectedSport, priceRange, rating, currentPage])

  const { data, isLoading, error } = useApprovedVenues(apiParams)

  // Handle different possible API response structures
  const items = data?.data?.results || []
  const total = data?.data?.totalResults || 0
  const totalPages = data?.data?.totalPages || 1

  console.log(items, "items...")
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Sports Venues</h1>
          <p className="text-gray-600">Find and book the perfect sports facility for your game</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6 mb-6 md:mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search venues or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {/* View Mode Toggle - Desktop Only */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}
              >
                <div className="w-4 h-4 flex flex-col gap-0.5">
                  <div className="bg-current h-1 rounded-sm"></div>
                  <div className="bg-current h-1 rounded-sm"></div>
                  <div className="bg-current h-1 rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sport Type</label>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sports.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priceRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          )}
        </div>


        {/* Loading Skeleton */}
        {isLoading && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8"
                : "space-y-4 mb-8"
            }
          >
            {[...Array(venuesPerPage)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load venues</h3>
            <p className="text-gray-600 mb-6">{error.message || 'Something went wrong while loading venues.'}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Venues Grid/List */}
        {!isLoading && !error && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8"
                : "space-y-4 mb-8"
            }
          >
            {items?.map((venue) => {
              const { venue_name, location, rating, _id, price, venue_status, city, sports, distance, nextSlot, image } = venue

              // Extract latitude and longitude from location
              const latitude = location?.coordinates?.latitude || "N/A"
              const longitude = location?.coordinates?.longitude || "N/A"
              const locationText = `Latitude: ${latitude}, Longitude: ${longitude}`

              return (
                <Link key={_id} href={`/venues/${_id}`} className="group">
                  {viewMode === "grid" ? (
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:scale-[1.02]">
                      <div className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={venue_name || "Venue"}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                          {city || "Nearby"}
                        </div>
                        <div className="absolute bottom-3 left-3 flex gap-2">
                          <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {venue_status === 'approved' ? 'Available' : 'Pending'}
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2">{venue_name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{rating?.avg}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {(sports || []).map((sport, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {sport}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-lg font-bold text-green-600">₹{price}</span>
                            <span className="text-sm text-gray-500">/hr</span>
                          </div>
                          <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium group-hover:bg-blue-700 transition-colors">
                            Book Now
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative md:w-48 md:h-32 w-full h-48 flex-shrink-0">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={venue_name || "Venue"}
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                            {distance || "Nearby"}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{venue_name}</h3>
                            <div className="flex items-center gap-2">
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium ${rating?.avg >= 4 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }`}
                              >
                                {venue_status === 'approved' ? 'Available' : 'Pending'}
                              </div>
                              {nextSlot && (
                                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Next: {nextSlot}
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{locationText}</p> {/* Displaying coordinates */}
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{locationText}</span> {/* Displaying coordinates */}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{rating?.avg}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {(sports || []).map((sport, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {sport}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-2xl font-bold text-green-600">₹{price}</span>
                              <span className="text-sm text-gray-500">/hr</span>
                            </div>
                            <Link
                              href={`/venues/${_id}`}
                              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Link>
              )
            })}

          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && items.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedSport("")
                setPriceRange("")
                setRating("")
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}


        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
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
    </>
  )
}
