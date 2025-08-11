"use client"

import { useMemo, useState } from "react"
import { Search, MapPin, Star, ChevronDown, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { useFacilitiesQuery } from "../../actions/facilities"

export default function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSport, setSelectedSport] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [rating, setRating] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const venuesPerPage = 8

  const sports = ["All Sports", "Badminton", "Tennis", "Football", "Basketball", "Cricket", "Table Tennis"]
  const priceRanges = ["All Prices", "₹0-500", "₹500-1000", "₹1000-1500", "₹1500+"]
  const ratings = ["All Ratings", "4.5+", "4.0+", "3.5+", "3.0+"]

  const apiParams = useMemo(() => {
    const parsedRating =
      rating === "4.5+" ? 4.5 : rating === "4.0+" ? 4.0 : rating === "3.5+" ? 3.5 : rating === "3.0+" ? 3.0 : 0
    return {
      q: searchQuery || undefined,
      sport: selectedSport && selectedSport !== "All Sports" ? selectedSport.toLowerCase() : undefined,
      priceRange: priceRange || undefined,
      rating: parsedRating || undefined,
      page: currentPage,
      limit: venuesPerPage,
    }
  }, [searchQuery, selectedSport, priceRange, rating, currentPage])

  const { data, isLoading } = useFacilitiesQuery(apiParams)
  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ratings.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {isLoading ? "Loading venues..." : `Showing ${items.length} of ${total} venues`}
            </p>
          </div>

          {/* Venues Grid/List */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8"
                : "space-y-4 mb-8"
            }
          >
            {(items).map((venue) => (
              <Link key={venue.id} href={`/venues/${venue.id}`} className="group">
                {viewMode === "grid" ? (
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:scale-[1.02]">
                    <div className="relative">
                       <img
                        src={venue.image || "/placeholder.svg"}
                        alt={venue.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                        {venue.distance}
                      </div>
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            venue.isOpen ? "bg-green-500 text-white" : "bg-red-500 text-white"
                          }`}
                        >
                          {venue.isOpen ? "Open" : "Closed"}
                        </div>
                        {venue.isOpen && (
                          <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Next: {venue.nextSlot}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2">{venue.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{venue.description}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 truncate">{venue.location}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{venue.rating}</span>
                        <span className="text-xs text-gray-500">({venue.reviews})</span>
                      </div>
                       <div className="flex flex-wrap gap-1 mb-3">
                        {venue.sports.slice(0, 2).map((sport, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {sport}
                          </span>
                        ))}
                        {venue.sports.length > 2 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            +{venue.sports.length - 2}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-lg font-bold text-green-600">₹{venue.price}</span>
                          <span className="text-sm text-gray-500">/hr</span>
                        </div>
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium group-hover:bg-blue-700 transition-colors">
                          Book
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative md:w-48 md:h-32 w-full h-48 flex-shrink-0">
                        <img
                          src={venue.image || "/placeholder.svg"}
                          alt={venue.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                          {venue.distance}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{venue.name}</h3>
                          <div className="flex items-center gap-2">
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                venue.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {venue.isOpen ? "Open" : "Closed"}
                            </div>
                            {venue.isOpen && (
                              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                Next: {venue.nextSlot}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3">{venue.description}</p>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{venue.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{venue.rating}</span>
                            <span className="text-xs text-gray-500">({venue.reviews})</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {venue.sports.map((sport, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {sport}
                            </span>
                          ))}
                        </div>
                       <div className="flex flex-wrap gap-2 mb-4">
                          {(venue.amenities || []).slice(0, 4).map((amenity, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                              {amenity}
                            </span>
                          ))}
                          {(venue.amenities || []).length > 4 && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                              +{(venue.amenities || []).length - 4} more
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-2xl font-bold text-green-600">₹{venue.price}</span>
                            <span className="text-sm text-gray-500">/hr starting from</span>
                          </div>
                          <div className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                            Book Now
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {!isLoading && items.length === 0 && (
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
                      className={`px-4 py-2 border rounded-xl transition-colors ${
                        currentPage === pageNumber
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
